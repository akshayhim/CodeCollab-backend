"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports["default"] = void 0;
var _express = require("express");
var _authMiddleware = _interopRequireDefault(require("./middleware/authMiddleware.mjs"));
var _userController = require("./controllers/userController.mjs");
function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { "default": obj }; }
// Import the required modules using ESM syntax

// Import your route handlers (controllers) here using ESM syntax

// Create a new Router instance using ESM syntax
var router = (0, _express.Router)();

// Define your routes using ESM syntax

router.post("/register", _userController.registerUser); // User registration route
router.post("/login", _userController.authenticateUser); // User login route

router.use(_authMiddleware["default"]);
router.use(function (err, req, res, next) {
  // Handle errors and send appropriate responses
  res.status(err.status || 500).json({
    error: err.message || "Internal Server Error"
  });
});

// Export the Router instance using ESM syntax
var _default = exports["default"] = router;