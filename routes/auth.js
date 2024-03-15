var express = require("express");
var router = express.Router();
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
require("dotenv").config();
const db = require("../models");
const User = db.sequelize.models.User;

// Post for registered users to be able to login
router.post("/login", async (req, res, next) => {
  const { email, password } = req.body;
  console.log(email, password);
  try {
    const user = await User.findOne({ where: { email } });
    if (!user) {
      return res.status(404).json({
        status: "fail",
        data: {
          statusCode: 404,
          result: "User Not Found",
        },
      });
    }

    const result = await bcrypt.compare(
      password,
      user.encryptedPassword.toString()
    );
    if (result) {
      const { salt, encryptedPassword, ...userData } = user.dataValues;
      const secretKey = process.env.TOKEN_SECRET;
      const token = jwt.sign({ id: user.id }, secretKey, { expiresIn: "1h" });
      res.status(200).json({
        status: "success",
        token,
        data: userData,
      });
    } else {
      res.status(403).json({
        status: "fail",
        data: {
          statusCode: 403,
          result: "Passwords do not match",
        },
      });
    }
  } catch (error) {
    res.status(500).json({
      status: "error",
      data: {
        statusCode: 500,
        result: "Internal Server Error",
      },
    });
  }
});

// Post for users to signup
router.post("/signup", async (req, res, next) => {
  try {
    const { name, email, password } = req.body;

    if (!name || !email || !password) {
      return res.status(400).json({
        status: "fail",
        data: {
          statusCode: 400,
          result: "Some missing field",
        },
      });
    }

    // Check if email is in a valid format
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      return res.status(400).json({
        status: "fail",
        data: {
          statusCode: 400,
          result: "Invalid email format",
        },
      });
    }

    const existingUser = await User.findOne({ where: { email } });
    if (existingUser) {
      return res.status(409).json({
        status: "fail",
        data: {
          statusCode: 409,
          result: "Email already in use",
        },
      });
    }

    const saltRounds = 10;
    const hashedPassword = await bcrypt.hash(password, saltRounds);

    const newUser = await User.create({
      name,
      email,
      encryptedPassword: hashedPassword,
      salt: saltRounds,
    });

    res.status(201).json({
      status: "success",
      data: {
        statusCode: 201,
        result: "User registered successfully",
      },
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({
      status: "error",
      data: {
        statusCode: 500,
        result: "Internal Server Error",
      },
    });
  }
});

module.exports = router;
