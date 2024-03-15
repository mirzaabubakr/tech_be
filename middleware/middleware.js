const jwt = require("jsonwebtoken");

// Middleware function to determine if the API endpoint request is from an authenticated user
function isAuth(req, res, next) {
  const isBearedToken = req.headers?.authorization?.includes("Bearer");

  if (!isBearedToken) {
    return res
      .status(401)
      .json({ error: "Unauthorized: Not valid Beared token provided" });
  }

  const token = req.headers.authorization.split(" ")[1];

  if (!token) {
    return res.status(401).json({ error: "Unauthorized: No token provided" });
  }

  const secretKey = process.env.TOKEN_SECRET;
  jwt.verify(token, secretKey, (err, decoded) => {
    if (err) {
      return res.status(401).json({ error: "Unauthorized: Invalid token" });
    }

    req.user = decoded;
    next();
  });
}

module.exports = isAuth;
