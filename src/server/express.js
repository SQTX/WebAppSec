const path = require("path");
const express = require("express");
const server = express();
const port = 3000;


// app.get("/", (req, res) => {
//   res.send("Hello World!");
// });


// Connect webpack with node.js:
const webpack = require("webpack");
const configWP = require("../../webpack.config");
const { config } = require("process");
const compiler = webpack(configWP);

const webpackDevMiddleware = require("webpack-dev-middleware")(
  compiler,
  config.devServer
);
const webpackHotMiddleware = require("webpack-hot-middleware")(compiler);   // Auto refresh

const staticPath = path.join(__dirname, "../../public"); // Set static path to frontend files
// server.use(express.static(staticPath)); // Use it

server.use(webpackHotMiddleware);
server.use(webpackDevMiddleware);

server.listen(port, () => {
  console.log(`Example app listening at http://localhost:${port}`);
});
