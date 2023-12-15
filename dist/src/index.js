"use strict";

var _express = _interopRequireDefault(require("express"));
var _http = _interopRequireDefault(require("http"));
var _socket = require("socket.io");
var _cors = _interopRequireDefault(require("cors"));
var _routes = _interopRequireDefault(require("../routes.mjs"));
function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { "default": obj }; }
function _toConsumableArray(arr) { return _arrayWithoutHoles(arr) || _iterableToArray(arr) || _unsupportedIterableToArray(arr) || _nonIterableSpread(); }
function _nonIterableSpread() { throw new TypeError("Invalid attempt to spread non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method."); }
function _unsupportedIterableToArray(o, minLen) { if (!o) return; if (typeof o === "string") return _arrayLikeToArray(o, minLen); var n = Object.prototype.toString.call(o).slice(8, -1); if (n === "Object" && o.constructor) n = o.constructor.name; if (n === "Map" || n === "Set") return Array.from(o); if (n === "Arguments" || /^(?:Ui|I)nt(?:8|16|32)(?:Clamped)?Array$/.test(n)) return _arrayLikeToArray(o, minLen); }
function _iterableToArray(iter) { if (typeof Symbol !== "undefined" && iter[Symbol.iterator] != null || iter["@@iterator"] != null) return Array.from(iter); }
function _arrayWithoutHoles(arr) { if (Array.isArray(arr)) return _arrayLikeToArray(arr); }
function _arrayLikeToArray(arr, len) { if (len == null || len > arr.length) len = arr.length; for (var i = 0, arr2 = new Array(len); i < len; i++) arr2[i] = arr[i]; return arr2; }
var app = (0, _express["default"])();
var server = _http["default"].createServer(app);
var io = new _socket.Server(server);
var userSocketMap = {};
function getAllConnectedClients(roomId) {
  return Array.from(io.sockets.adapter.rooms.get(roomId) || []).map(function (socketId) {
    return {
      socketId: socketId,
      username: userSocketMap[socketId]
    };
  });
}
io.on("connection", function (socket) {
  console.log("User connected", socket.id);
  socket.on("join", function (_ref) {
    var roomId = _ref.roomId,
      username = _ref.username;
    // console.log("test");
    userSocketMap[socket.id] = username;
    socket.join(roomId);
    var clients = getAllConnectedClients(roomId);
    clients.forEach(function (_ref2) {
      var socketId = _ref2.socketId;
      io.to(socketId).emit("joined", {
        clients: clients,
        username: username,
        socketId: socket.id
      });
    });
  });
  socket.on("code-change", function (_ref3) {
    var roomId = _ref3.roomId,
      code = _ref3.code;
    socket["in"](roomId).emit("code-change", {
      code: code
    });
  });
  socket.on("sync-code", function (_ref4) {
    var socketId = _ref4.socketId,
      code = _ref4.code;
    io.to(socketId).emit("code-change", {
      code: code
    });
  });
  socket.on("disconnecting", function () {
    var rooms = _toConsumableArray(socket.rooms);
    rooms.forEach(function (roomId) {
      socket["in"](roomId).emit("disconnected", {
        socketId: socket.id,
        username: userSocketMap[socket.id]
      });
    });
    delete userSocketMap[socket.id];
    socket.leave();
  });
});
var PORT = process.env.PORT || 5000;
server.listen(PORT, function () {
  console.log("Server is running on port ".concat(PORT));
});
app.use(_express["default"].json());
app.use((0, _cors["default"])());
app.use("/api", _routes["default"]);