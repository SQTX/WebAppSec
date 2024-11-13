function usersSignIn(
  server,
  bcrypt,
  jwt,
  users,
  ACCESS_TOKEN_SECRET,
  REFRESH_TOKEN_SECRET
) {
  server.post("/users/signin", async (req, res) => {
    const user = users.find((user) => user.login === req.body.login);
    if (!user) {
      return res.status(400).json({ message: "Cannot find user" });
    }

    console.log("UserLog:", user.login);
    console.log("UserTok:", ACCESS_TOKEN_SECRET);
    console.log("RefTok:", REFRESH_TOKEN_SECRET);

    // Tworzenie tokena z danymi użytkownika
    const accessToken = jwt.sign(
      { login: user.login }, // Możesz dodać inne informacje, np. id użytkownika
      ACCESS_TOKEN_SECRET,
      { expiresIn: "15s" } // Czas wygaśniecia tokena
    );

    // Tworzenie tokena z danymi użytkownika
    const refreshToken = jwt.sign(
      { login: user.login }, // Możesz dodać inne informacje, np. id użytkownika
      REFRESH_TOKEN_SECRET,
      { expiresIn: "7d" } // Dłuższy czas wygaśniecia tokena
    );

    console.log("Generate JWT:", accessToken);
    console.log("Generate refJWT:", refreshToken);

    try {
      if (await bcrypt.compare(req.body.password, user.password)) {
        console.log("Login successful");

        res
          .status(200)
          .json({ accessToken: accessToken, refreshToken: refreshToken });
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
