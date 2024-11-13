function usersSignIn(server, bcrypt, users) {
  server.post("/users/signin", async (req, res) => {
    const user = users.find((user) => (user.login === req.body.login));
    if (!user) {
      return res.status(400).json({message: "Cannot find user"});
    }

    try {
      if (await bcrypt.compare(req.body.password, user.password)) {
        console.log("Success");
        res.status(200).json({ message: "Success", user: user.login });
      } else {
        console.log("Not allowed");
        res.status(403).json({ message: "Not allowed" });
      }
    } catch {
      res.status(500).json({ message: "Server error" });
    }
  });
}

module.exports = usersSignIn;
