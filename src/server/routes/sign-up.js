function usersSignUp(server, bcrypt, users) {
  // TODO: Dodać walidacjędację odebranych danych (lib-joi)
  server.post("/users/signup", async (req, res) => {
    try {
      const salt = await bcrypt.genSalt();
      const hashedPassword = await bcrypt.hash(req.body.password, salt);
      console.log("Salt:", salt);
      console.log("HashPass:", hashedPassword);
      const user = {
        name: req.body.name,
        login: req.body.login,
        email: req.body.email,
        password: hashedPassword,
      };
      users.push(user);
      console.log("Name:", user.name);
      console.log("Login:", user.login);
      console.log("Email:", user.email);
      console.log("Password:", user.password);
      console.log("Users list:", users);
      res.status(201).json({message: "Account was created"});
    } catch {
      res.status(500).json({message: "Server error"});
    }
  });
}

module.exports =  usersSignUp;