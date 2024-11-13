function userLogout(server) {
  server.get("/users/logout", (req, res) => {
    console.log("Wylogowano");
    res.send("Wylogowano");
  });
}

module.exports = userLogout;
