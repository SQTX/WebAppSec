function userLogout(server, jwt, ACCESS_TOKEN_SECRET) {
  server.post("/users/logout", (req, res) => {
    // Pobieramy accessToken z nagłówka
    const token =
      req.headers["authorization"] &&
      req.headers["authorization"].split(" ")[1];

    if (!token) {
      return res.status(401).json({ message: "Access token is required" });
    }

    // Weryfikacja accessToken
    jwt.verify(token, ACCESS_TOKEN_SECRET, async (err, decoded) => {
      if (err) {
        return res.status(403).json({ message: "Invalid or expired token" });
      }

      // Jeśli token jest poprawny, dekodujemy go, aby uzyskać login lub ID użytkownika
      // const userLogin = decoded.login; // Zakładamy, że w tokenie jest pole "login"

      try {
        // Znajdujemy użytkownika w bazie danych
        

        // if (!user) {
        //   return res.status(404).json({ message: "User not found" });
        // }

        // Usuwamy refreshToken z bazy danych


        // console.log("User logged out:", userLogin);

        // Zwracamy odpowiedź potwierdzającą wylogowanie
        res.status(200).json({ message: "Logged out successfully" });
      } catch (error) {
        console.error("Error during logout:", error);
        res.status(500).json({ message: "Server error during logout" });
      }
    });
  });
}

module.exports = userLogout;
