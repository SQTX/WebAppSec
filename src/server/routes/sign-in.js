function usersSignIn(server) {
  let users = [];


  server.get("/users", (req, res) => {
    console.log("Otrzymano żądanie GET /users");
    res.send("Daniel Skura");
  });


  server.post("/users/signin", (req, res) => {
    const user = { login: req.body.login, password: req.body.password };
    users.push(user);
    console.log("Login:", user.login);
    console.log("Password:", user.password);
    console.log("Users list:", users);
    res.status(201).send();
  });
}

module.exports =  usersSignIn;