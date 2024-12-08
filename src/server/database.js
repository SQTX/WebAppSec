const mysql = require("mysql2");

// Konfiguracja połączenia
const dbConfig = {
  host: "localhost", // Adres hosta (dla lokalnego serwera to 'localhost')
  user: "root", // Nazwa użytkownika MySQL (np. 'root')
  password: "SqsitIseefireTX", // Hasło użytkownika
  database: "coffee_store_users", // Nazwa bazy danych, do której chcesz się połączyć
  port: 3306, // Domyślny port MySQL
};

// Tworzenie połączenia
const connection = mysql.createConnection(dbConfig);

// Próba połączenia z bazą danych
connection.connect((err) => {
  if (err) {
    console.error("Błąd podczas łączenia z bazą danych:", err.message);
    return;
  }
  console.log("Połączono z bazą danych MySQL!");
});

// Zamknięcie połączenia (przykład - w aplikacji powinno być w odpowiednim momencie)
process.on("SIGINT", () => {
  connection.end((err) => {
    if (err) {
      console.error("Błąd podczas zamykania połączenia:", err.message);
    } else {
      console.log("Połączenie z bazą danych zostało zamknięte.");
    }
    process.exit();
  });
});
