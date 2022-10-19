var http = require("http");
const express = require("express");
const app = express();
const port = 3000;
app.use((req, res, next) => {
  console.log("In the middleware!");
  next();
});
app.use((req, res, next) => {
  console.log("In another middleware!");
  res.send("<h1>Hello from express</h1>");
});
const server = http.createServer(app);

console.log("Server running at http://127.0.0.1:3000/");
server.listen(3000);
