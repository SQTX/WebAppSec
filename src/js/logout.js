const logoutBtn = document.getElementById("logoutBtn");

logoutBtn.addEventListener("click", () => {
  // Pobieramy accessToken z localStorage (jeśli jest)
  const accessToken = localStorage.getItem("accessToken");

  console.log("LogOutToken: ", accessToken);

  // Przygotowujemy fetch do /users/logout
  fetch("/users/logout", {
    method: "POST", // Zwykle logout to POST, ale zależy od implementacji
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${accessToken}`, // Przekazujemy token w nagłówku
    },
  })
    .then((response) => {
      if (!response.ok) {
        return response.json().then((error) => {
          throw new Error(error.message || "Logout failed");
        });
      }
      return response.json(); // Parsowanie odpowiedzi w przypadku sukcesu
    })
    .then((data) => {
      // console.log("Data:", data.message);
      // Usuwamy tokeny z localStorage
      localStorage.removeItem("accessToken");
      localStorage.removeItem("refreshToken");

      // Przekierowanie na stronę logowania
      window.location.href = "/";
    })
    .catch((error) => {
      console.error("Error during logout:", error.message);
      // alert("Logout failed: " + error.message);

      localStorage.removeItem("accessToken");
      localStorage.removeItem("refreshToken");
      window.location.href = "/";
    });
});
