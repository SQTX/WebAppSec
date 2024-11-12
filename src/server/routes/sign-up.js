function usersSignUp(server) {
  let users = [];

  server.post("/users/signup", (req, res) => {
    const user = {
      name: req.body.name,
      login: req.body.login,
      email: req.body.email,
      password: req.body.password,
    };
    users.push(user);
    console.log("Name:", user.name);
    console.log("Login:", user.login);
    console.log("Email:", user.email);
    console.log("Password:", user.password);
    console.log("Users list:", users);
    res.status(201).send();
  });
}

module.exports =  usersSignUp;