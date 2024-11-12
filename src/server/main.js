const path = require("path");
const express = require("express");

const usersSignIn = require("./routes/sign-in");
const usersSignUp = require("./routes/sign-up");

const sideUrl = "http://localhost";
const port = 3000;
const server = express();

// Konfiguracja Webpacka
const webpack = require("webpack");
const configWP = require("../../webpack.config");
const compiler = webpack(configWP);

const webpackDevMiddleware = require("webpack-dev-middleware")(compiler, {
  publicPath: configWP.output.publicPath, // Upewnij się, że jest ustawiona ścieżka publicPath
});

const webpackHotMiddleware = require("webpack-hot-middleware")(compiler); // Auto-refresh

// Ustawienia ścieżki do plików statycznych
const staticPath = path.join(__dirname, "../../public");
server.use(express.static(staticPath)); // Użycie ścieżki statycznej

// Middleware JSON
server.use(express.json()); // Użyj poprawnie express.json()

// Middleware Webpacka
server.use(webpackDevMiddleware);
server.use(webpackHotMiddleware);

// Uruchomienie serwera
server.listen(port, () => {
  console.log(`Serwer nasłuchuje na ${sideUrl}:${port}`);
});

usersSignIn(server);
usersSignUp(server);
