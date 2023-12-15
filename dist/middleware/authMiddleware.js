"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports["default"] = void 0;
require("dotenv/config");
var _jsonwebtoken = _interopRequireDefault(require("jsonwebtoken"));
function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { "default": obj }; }
// authMiddleware.js

var JWT_SECRET_KEY = process.env.JWT_SECRET_KEY;
function authenticateToken(req, res, next) {
  var token = req.cookies.token;
  if (!token) return res.status(401).send("Access Denied");
  _jsonwebtoken["default"].verify(token, JWT_SECRET_KEY, function (err, user) {
    if (err) return res.status(403).send("Invalid Token");
    req.user = user;
    next();
  });
}
var _default = exports["default"] = authenticateToken;