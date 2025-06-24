// server.js
const http = require("http");

const port = process.env.PORT || 8080;

const server = http.createServer((req, res) => {
  res.statusCode = 200;
  res.setHeader("Content-Type", "text/plain");
  res.end("Hello from TrekCanada basic Node.js server!\n");
});

server.listen(port, () => {
  console.log(`Server running at http://localhost:${port}/`);
});
