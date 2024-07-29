const JWT_SEC = require("./config");
const jwt = require("jsonwebtoken");

const authMiddleware = (req, res, next) => {
  const authHeader = req.headers.authorization;
  console.log(typeof authHeader);
  if (!authHeader || !authHeader.startsWith("Bearer ")) {
    return res.status(403).json({
      msg: "Error in middleware",
    });
  }
  const token = authHeader.split(" ")[1];

  try {
    console.log(JWT_SEC);
    const decoded = jwt.verify(token, JWT_SEC);
    if (decoded.userId) {
      req.userId = decoded.userId;
      next();
    } else {
      return res.status(403).json({
        msg: "Something went wrong ",
      });
    }
  } catch (err) {
    return res.status(403).json({
      msg: "Error thrown",
    });
  }
};

module.exports = {
  authMiddleware,
};

