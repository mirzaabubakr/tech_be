var express = require("express");
var router = express.Router();
const db = require("../models");
const File = db.sequelize.models.File;
const isAuth = require("../middleware/middleware");
const multer = require("multer");
const path = require("path");
const fs = require("fs");

// Set up storage for uploaded files
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, "uploads/");
  },
  filename: function (req, file, cb) {
    cb(
      null,
      file.fieldname + "-" + Date.now() + path.extname(file.originalname)
    );
  },
});

const upload = multer({ storage: storage });

router.get("/get/:userID", async (req, res) => {
  try {
    const UserID = req.params.userID;
    const files = await File.findAll({ where: { UserID: UserID } });
    return res.status(200).json({
      status: "success",
      data: {
        statusCode: 200,
        result: files,
      },
    });
  } catch (error) {
    console.log(error);
    return res.status(500).json({ status: "error", result: error });
  }
});

// Define a function to handle file renaming and database operation
async function handleFileUpload(file, publicFilePath, userId, req, res) {
  try {
    await fs.promises.rename(file.path, publicFilePath);

    const publicLink = `${req.protocol}://${req.get("host")}/${file.filename}`;
    console.log(file.filename, userId);
    const newFile = await File.create({
      filename: file.filename,
      shareable: true,
      UserId: userId,
      link: publicLink,
    });

    res.send(`File uploaded successfully. Public link: ${publicLink}`);
  } catch (error) {
    console.error(error);
    return res
      .status(500)
      .send("Error uploading file and creating file entry in the database.");
  }
}

router.post("/upload/:userId", isAuth, upload.single("file"), (req, res) => {
  const file = req.file;
  const userId = req.params.userId;

  if (!file) {
    return res.status(400).send("No file uploaded.");
  }

  // Assuming the public folder is where we store publicly accessible files
  const publicFilePath = path.join(__dirname, "../public", file.filename);

  // Call the function to handle file upload and database operation
  handleFileUpload(file, publicFilePath, userId, req, res);
});

module.exports = router;
