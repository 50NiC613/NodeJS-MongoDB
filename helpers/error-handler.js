function errorHandler(err, req, res, next) {
  if (err.name === "UnauthorizedError") {
    return res.status(401).json({ message: err.message });
  }
  if (err.name === "ValidationError") {
    return res.status(400).json({ message: err.message });
  }
  if (err.name === "MongoError") {
    return res.status(500).json({ message: err.message });
  }
  // si no es ninguno de los anteriores
  return res.status(500).json({ message: "Internal server error" });
}
module.exports = errorHandler;
