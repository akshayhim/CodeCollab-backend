// authMiddleware.js
import jwt from "jsonwebtoken";
const JWT_SECRET_KEY =
  "3ea4de9d416737468696bcb61b518f8f59ba98fc925c7369b61c0974e5fceb69";

function authenticateToken(req, res, next) {
  const token = req.header("Authorization");
  if (!token) return res.status(401).send("Access Denied");

  jwt.verify(token, JWT_SECRET_KEY, (err, user) => {
    if (err) return res.status(403).send("Invalid Token");
    req.user = user;
    next();
  });
}

export default authenticateToken;
