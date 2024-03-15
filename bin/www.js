const http = require("http");
const app = require("../app");

const port = process.env.SERVER_PORT || 5001;
const server = http.createServer(app);

server.listen(port, onListening);
server.on("error", onError);

function onListening() {
  console.log(`Server is running on port ${port}`);
}

function onError(error) {
  if (error.syscall !== "listen") {
    throw error;
  }

  const bind = typeof port === "string" ? `Pipe ${port}` : `Port ${port}`;

  // handle specific listen errors with friendly messages
  switch (error.code) {
    case "EACCES":
      console.error(`${bind} requires elevated privileges`);
      process.exit(1);
      break;
    case "EADDRINUSE":
      console.error(`${bind} is already in use`);
      process.exit(1);
      break;
    default:
      throw error;
  }
}
