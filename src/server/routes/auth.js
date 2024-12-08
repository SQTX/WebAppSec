const jwt = require("jsonwebtoken");
const mysql = require("mysql2");

// const dbConfig = {
//   host: "localhost", // Adres hosta (dla lokalnego serwera to 'localhost')
//   user: "root", // Nazwa użytkownika MySQL (np. 'root')
//   password: "sqtx7177", // Hasło użytkownika
//   database: "CoffeeShop", // Nazwa bazy danych, do której chcesz się połączyć
//   port: 3306, // Domyślny port MySQL
// };

// // Funkcja do autoryzacji tokenu
// function authenticationToken(req, res, next) {
//   // Poprawny sposób pobrania nagłówka "authorization"
//   const authHeader = req.headers["authorization"];
//   const token = authHeader && authHeader.split(" ")[1];

//   if (!token) {
//     return res.sendStatus(401); // Brak tokenu = 401 Unauthorized
//   }

//   // Funkcja do dekodowania i wyciągania ID użytkownika z tokenu
//   const userId = getUserIdFromToken(token);
//   if (!userId) {
//     return res.sendStatus(403); // Jeśli nie udało się uzyskać ID użytkownika
//   }

//   // Tworzymy połączenie z bazą danych
//   const connection = mysql.createConnection(dbConfig);

//   // Pobieramy ACCESS_TOKEN_SECRET z bazy danych na podstawie userId
//   const getSecretQuery = `SELECT access_token_secret FROM clients WHERE client_id = ?`;

//   connection.query(getSecretQuery, [userId], (err, results) => {
//     if (err) {
//       console.error("Błąd bazy danych:", err.message);
//       return res.sendStatus(500); // Błąd serwera
//     }

//     if (results.length === 0) {
//       return res.sendStatus(404); // Nie znaleziono użytkownika
//     }

//     const accessTokenSecret = results[0].access_token_secret;

//     // Weryfikacja tokenu z odpowiednim SECRET
//     jwt.verify(token, accessTokenSecret, (err, user) => {
//       if (err) {
//         return res.sendStatus(403); // Nieprawidłowy lub wygasły token = 403 Forbidden
//       }

//       req.user = user; // Przypisanie użytkownika do żądania
//       next(); // Przejście do następnej funkcji middleware
//     });
//   });
// }

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

module.exports = getUserIdFromToken;
