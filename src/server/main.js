const ACCESS_TOKEN_SECRET =
  "5e6cc96353daa632eb71ce86cd96d266158ed9086ecdbac6948d02d63478a7656da7042153b2f3ff46bed0c967f63f8cfe0ad19dd64493790b91e0bd5c700875";
const REFRESH_TOKEN_SECRET =
  "d760f0032b06bbae094e091439f6eb06eac8fa26b9c8295dfdb8ec32c918c44c4791eb75d3a631e61ec1e590a5aa581a562591a005b80f13d2516f06e25ccb63";

const path = require("path");
const express = require("express");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const mysql = require("mysql2");

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

// function authenticationToken(req, res, next) {
//   // Poprawny sposób pobrania nagłówka "authorization"
//   const authHeader = req.headers["authorization"];
//   const token = authHeader && authHeader.split(" ")[1];

//   if (token == null) return res.sendStatus(401); // Brak tokenu = 401 Unauthorized

//   jwt.verify(token, ACCESS_TOKEN_SECRET, (err, user) => {
//     if (err) return res.sendStatus(403); // Nieprawidłowy token = 403 Forbidden
//     req.user = user; // Przypisanie użytkownika do żądania
//     next(); // Przejście do następnej funkcji
//   });
// }

// const jwt = require("jsonwebtoken");
// const mysql = require("mysql2");

// Funkcja do autoryzacji tokenu
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
  const getSecretQuery = `SELECT access_token_secret FROM clients WHERE id = ?`;

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

// Funkcja do wyciągania ID użytkownika z tokenu
function getUserIdFromToken(token) {
  try {
    // Podziel token na trzy części
    const parts = token.split(".");

    if (parts.length !== 3) {
      throw new Error("Nieprawidłowy token JWT");
    }

    // Zdekoduj drugą część (payload), która jest zakodowana w Base64
    const payloadBase64 = parts[1];
    const decodedPayload = Buffer.from(payloadBase64, "base64").toString(
      "utf8"
    );

    // Parsuj JSON
    const parsedPayload = JSON.parse(decodedPayload);

    // Zakładając, że ID użytkownika jest zapisane w polu 'id'
    return parsedPayload && parsedPayload.id ? parsedPayload.id : null;
  } catch (error) {
    console.error("Błąd dekodowania tokenu JWT:", error.message);
    return null; // Zwróć null, jeśli wystąpi błąd
  }
}

module.exports = authenticationToken;

// Trasa zabezpieczona
server.get("/authtest", authenticationToken, (req, res) => {
  console.log("Profile activate by:", req.user.login);

  // res.send(users.filter((user) => user.login === req.user.login));
  // res.send(req.user.login);
  res.status(200).json({ login: req.user.login });
  // res.json(users.filter((user) => user.login === req.user.login));
});

function getUserIdFromToken(token) {
  try {
    // Podziel token na trzy części
    const parts = token.split(".");

    if (parts.length !== 3) {
      throw new Error("Nieprawidłowy token JWT");
    }

    // Zdekoduj drugą część (payload), która jest zakodowana w Base64
    const payloadBase64 = parts[1];

    // Zdekoduj Base64 do formatu JSON
    const decodedPayload = Buffer.from(payloadBase64, "base64").toString(
      "utf8"
    );

    // Parsuj JSON
    const parsedPayload = JSON.parse(decodedPayload);

    // Zakładając, że ID użytkownika jest zapisane w polu 'id'
    if (parsedPayload && parsedPayload.id) {
      return parsedPayload.id;
    } else {
      throw new Error("Nie znaleziono ID użytkownika w tokenie");
    }
  } catch (error) {
    console.error("Błąd dekodowania tokenu JWT:", error.message);
    return null; // Zwróć null, jeśli wystąpi błąd
  }
}

// // Tworzenie połączenia
// const connection = mysql.createConnection(dbConfig);

// // Próba połączenia z bazą danych
// connection.connect((err) => {
//   if (err) {
//     console.error("Błąd podczas łączenia z bazą danych:", err.message);
//     return;
//   }
//   console.log("Połączono z bazą danych MySQL!");
// });

// // Zamknięcie połączenia (przykład - w aplikacji powinno być w odpowiednim momencie)
// process.on("SIGINT", () => {
//   connection.end((err) => {
//     if (err) {
//       console.error("Błąd podczas zamykania połączenia:", err.message);
//     } else {
//       console.log("Połączenie z bazą danych zostało zamknięte.");
//     }
//     process.exit();
//   });
// });

// connection.query("SELECT * FROM clients", (err, results) => {
//   if (err) {
//     console.error("Błąd w zapytaniu:", err.message);
//     return;
//   }
//   console.log("Wyniki zapytania:", results);
// });
