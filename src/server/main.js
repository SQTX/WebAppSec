const ACCESS_TOKEN_SECRET =
  "5e6cc96353daa632eb71ce86cd96d266158ed9086ecdbac6948d02d63478a7656da7042153b2f3ff46bed0c967f63f8cfe0ad19dd64493790b91e0bd5c700875";
const REFRESH_TOKEN_SECRET =
  "d760f0032b06bbae094e091439f6eb06eac8fa26b9c8295dfdb8ec32c918c44c4791eb75d3a631e61ec1e590a5aa581a562591a005b80f13d2516f06e25ccb63";

const path = require("path");
const express = require("express");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const mysql = require("mysql2");

const getUserIdFromToken = require("./routes/auth.js");

// Konfiguracja połączenia
const dbConfig = {
  host: "localhost", // Adres hosta (dla lokalnego serwera to 'localhost')
  user: "root", // Nazwa użytkownika MySQL (np. 'root')
  password: "sqtx7177", // Hasło użytkownika
  database: "CoffeeShop", // Nazwa bazy danych, do której chcesz się połączyć
  port: 3306, // Domyślny port MySQL
};

const usersSignIn = require("./routes/sign-in");
const usersSignUp = require("./routes/sign-up");
const userLogout = require("./routes/logout");
const rulesFile = require("./routes/rules-file");

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

usersSignUp(server, bcrypt, dbConfig);
usersSignIn(server, bcrypt, jwt, dbConfig);

userLogout(server, jwt, dbConfig);

rulesFile(server, path);

// --------------------------------------------------------------
// Refresh token:
// --------------------------------------------------------------
server.post("/token", (req, res) => {
  const { refreshToken } = req.body; // Pobieramy refreshToken z żądania

  // Jeśli brak refreshToken w ciele żądania
  if (!refreshToken) {
    return res.status(400).json({ message: "Refresh token is required." });
  }

  // Sprawdzamy, czy refreshToken znajduje się w bazie danych lub w pamięci serwera
  // if (!refreshTokens.includes(refreshToken)) {
  //   return res.status(403).json({ message: "Invalid refresh token." });
  // }

  // Sprawdzamy ważność refreshToken
  jwt.verify(refreshToken, REFRESH_TOKEN_SECRET, (err, user) => {
    if (err) {
      return res
        .status(403)
        .json({ message: "Invalid or expired refresh token." });
    }

    // Jeśli refreshToken jest prawidłowy, generujemy nowy accessToken
    const newAccessToken = jwt.sign(
      { login: user.login },
      ACCESS_TOKEN_SECRET,
      {
        expiresIn: "15s", // Nowy accessToken ma wygasnąć po 15 minutach
      }
    );

    // Zwracamy nowy accessToken
    return res.json({ accessToken: newAccessToken });
  });
});

// --------------------------------------------------------------
// Main Auth function:
// --------------------------------------------------------------
// // // Funkcja do autoryzacji tokenu
function authenticationToken(req, res, next) {
  // Poprawny sposób pobrania nagłówka "authorization"
  const authHeader = req.headers["authorization"];
  const token = authHeader && authHeader.split(" ")[1];

  if (!token) {
    return res.sendStatus(401); // Brak tokenu = 401 Unauthorized
  }

  // Funkcja do dekodowania i wyciągania ID użytkownika z tokenu
  const userId = getUserIdFromToken(token);
  if (!userId) {
    return res.sendStatus(403); // Jeśli nie udało się uzyskać ID użytkownika
  }

  // Tworzymy połączenie z bazą danych
  const connection = mysql.createConnection(dbConfig);

  // Pobieramy ACCESS_TOKEN_SECRET z bazy danych na podstawie userId
  const getSecretQuery = `SELECT access_token_secret FROM clients WHERE client_id = ?`;

  connection.query(getSecretQuery, [userId], (err, results) => {
    if (err) {
      console.error("Błąd bazy danych:", err.message);
      return res.sendStatus(500); // Błąd serwera
    }

    if (results.length === 0) {
      return res.sendStatus(404); // Nie znaleziono użytkownika
    }

    const accessTokenSecret = results[0].access_token_secret;

    // Weryfikacja tokenu z odpowiednim SECRET
    jwt.verify(token, accessTokenSecret, (err, user) => {
      if (err) {
        return res.sendStatus(403); // Nieprawidłowy lub wygasły token = 403 Forbidden
      }

      req.user = user; // Przypisanie użytkownika do żądania
      next(); // Przejście do następnej funkcji middleware
    });
  });
}

module.exports = authenticationToken;

// --------------------------------------------------------------
// Cart Functions:
// --------------------------------------------------------------
const {
  getNumberOfProducts,
  addItemToCart,
  getCartData,
} = require("./routes/cart");

getNumberOfProducts(server, mysql, dbConfig);
addItemToCart(server, mysql, dbConfig);
getCartData(server, mysql, dbConfig);
