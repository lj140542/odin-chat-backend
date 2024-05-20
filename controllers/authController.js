const asyncHandler = require("express-async-handler");

exports.test = asyncHandler(async (req, res, next) => {
  res.json({ bonjour: "hello world" });
});