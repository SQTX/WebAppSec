const mysql = require("mysql2");

function userLogout(server, jwt, dbConfig) {
  const connection = mysql.createConnection(dbConfig);

  server.post("/cart", (req, res) => {});
}

module.exports = userLogout;
