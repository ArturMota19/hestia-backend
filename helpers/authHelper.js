const jwt = require("jsonwebtoken");

module.exports = {
  auth: (req, res, next) => {
    const token = req.headers.authorization?.split(" ")[1];
    if (!token) {
      return res.status(401).json({ message: "Access denied. No token provided." });
    }

    try {
      const decoded = jwt.verify(token, process.env.JWT_SECRET);

      // Check if the token is still valid based on expiration
      if (decoded.exp * 1000 < Date.now()) {
        return res.status(401).json({ message: "Token has expired." });
      }

      req.users = decoded;
      next();
    } catch (err) {
      res.status(401).json({ message: "Invalid token." });
    }
  }
};
