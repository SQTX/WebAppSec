document.addEventListener("DOMContentLoaded", function () {
  const exampleBtn = document.getElementById("navbarUserNameLogin");

  exampleBtn.addEventListener("click", () => {
    console.log("Próba otworzenia profilu.");
    authTest();
    //     // // Pobieramy accessToken z localStorage
    //     // const accessToken = localStorage.getItem("accessToken");
    //     // console.log("Token:", accessToken);

    //     // fetch("/authtest", {
    //     //   method: "GET",
    //     //   headers: {
    //     //     "Content-Type": "application/json",
    //     //     Authorization: `Bearer ${accessToken}`, // Dodajemy token do nagłówka Authorization
    //     //   },
    //     // })
    //     //   .then((response) => {
    //     //     if (!response.ok) {
    //     //       if (response.status === 403) {
    //     //         // Token wygasł, spróbuj odświeżyć za pomocą refreshToken
    //     //         console.log("Access token expired. Trying to refresh...");
    //     //         return refreshAccessToken();
    //     //       } else {
    //     //         // Inny błąd, obsłuż go
    //     //         return response.json().then((error) => {
    //     //           throw new Error(error.message || "Unauthorized access");
    //     //         });
    //     //       }
    //     //     }
    //     //     return response.json(); // Parsujemy odpowiedź JSON w przypadku sukcesu
    //     //   })
    //     //   .then((data) => {
    //     //     console.log("Authenticated user data:", data[0].login);
    //     //     alert(`Profil użytkownika - ${data[0].login}`);
    //     //     // Możesz teraz wyświetlić dane użytkownika lub obsłużyć odpowiedź serwera
    //     //   })
    //     //   .catch((error) => {
    //     //     console.error("Error:", error.message);
    //     //     alert(`Authorization failed: ${error.message}`);
    //     //     window.location.href = "/";
    //     //   });
    //   });
    // });

    // function authTest() {
    //   // Pobieramy accessToken z localStorage
    //   const accessToken = localStorage.getItem("accessToken");
    //   console.log("Token:", accessToken);

    //   fetch("/authtest", {
    //     method: "GET",
    //     headers: {
    //       "Content-Type": "application/json",
    //       Authorization: `Bearer ${accessToken}`, // Dodajemy token do nagłówka Authorization
    //     },
    //   })
    //     .then((response) => {
    //       if (!response.ok) {
    //         if (response.status === 403) {
    //           // Token wygasł, spróbuj odświeżyć za pomocą refreshToken
    //           console.log("Access token expired. Trying to refresh...");
    //           return refreshAccessToken();
    //         } else {
    //           // Inny błąd, obsłuż go
    //           return response.json().then((error) => {
    //             throw new Error(error.message || "Unauthorized access");
    //           });
    //         }
    //       }
    //       return response.json(); // Parsujemy odpowiedź JSON w przypadku sukcesu
    //     })
    //     .then((data) => {
    //       console.log("Authenticated user data:", data[0].login);
    //       alert(`Profil użytkownika - ${data[0].login}`);
    //       // Możesz teraz wyświetlić dane użytkownika lub obsłużyć odpowiedź serwera
    //     })
    //     .catch((error) => {
    //       console.error("Error:", error.message);
    //       alert(`Authorization failed: ${error.message}`);
    //       window.location.href = "/";
    //     });
    // }

    // function refreshAccessToken() {
    //   console.log("Pruba refresha kurwa");

    //   const refreshToken = localStorage.getItem("refreshToken");
    //   console.log("RefToken:", refreshToken);

    //   if (!refreshToken) {
    //     console.error("Refresh token is missing.");
    //     alert("Refresh token is missing. Please log in again.");
    //     window.location.href = "/sign-in.html";
    //     return;
    //   }

    //   // Wysłanie żądania na endpoint /token w celu uzyskania nowego accessToken
    //   fetch("/token", {
    //     method: "POST",
    //     headers: {
    //       "Content-Type": "application/json",
    //     },
    //     body: JSON.stringify({ refreshToken }),
    //   })
    //     .then((response) => {
    //       if (!response.ok) {
    //         throw new Error("Failed to refresh access token");
    //       }
    //       return response.json();
    //     })
    //     .then((data) => {
    //       // Zapisz nowy accessToken w localStorage
    //       const newAccessToken = data.accessToken;
    //       localStorage.setItem("accessToken", newAccessToken);
    //       console.log("NewAccessToken:", newAccessToken);

    //       // Ponownie wyślij żądanie z nowym accessToken
    //       console.log("Access token refreshed. Retrying original request...");
    //       authTest(); // Wywołaj oryginalne żądanie
    //     })
    //     .catch((error) => {
    //       console.error("Error refreshing token:", error.message);
    //       alert("Failed to refresh access token. Please log in again.");
    //       window.location.href = "/sign-in.html";
  });
});
// }

function authTest() {
  // Pobieramy accessToken z localStorage
  const accessToken = localStorage.getItem("accessToken");
  console.log("Token:", accessToken);

  if (!accessToken) {
    alert("Access token is missing. Please log in again.");
    window.location.href = "/sign-in.html"; // Przekierowanie do strony logowania
    return;
  }

  fetch("/authtest", {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${accessToken}`, // Dodajemy token do nagłówka Authorization
    },
  })
    .then((response) => {
      if (!response.ok) {
        if (response.status === 403 || response.status === 401) {
          // Token wygasł, spróbuj odświeżyć za pomocą refreshToken
          console.log("Access token expired. Trying to refresh...");
          return refreshAccessToken();
        } else {
          // Inny błąd, obsłuż go
          return response.json().then((error) => {
            throw new Error(error.message || "Unauthorized access");
          });
        }
      }
      return response.json(); // Parsujemy odpowiedź JSON w przypadku sukcesu
    })
    .then((data) => {
      if (!data || data.length === 0) {
        throw new Error("No user data returned.");
      }
      console.log("Authenticated user data:", data[0].login);
      alert(`Profil użytkownika - ${data[0].login}`);
    })
    .catch((error) => {
      console.error("Error:", error.message);
      // alert(`Authorization failed: ${error.message}`);
      // window.location.href = "/";
    });
}

function refreshAccessToken() {
  console.log("Próba odświeżenia tokena");

  const refreshToken = localStorage.getItem("refreshToken");
  console.log("Refresh token:", refreshToken);

  if (!refreshToken) {
    console.error("Refresh token is missing.");
    alert("Refresh token is missing. Please log in again.");
    window.location.href = "/sign-in.html"; // Przekierowanie do strony logowania
    return;
  }

  // Wysłanie żądania na endpoint /token w celu uzyskania nowego accessToken
  fetch("/token", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ refreshToken }),
  })
    .then((response) => {
      if (!response.ok) {
        throw new Error("Failed to refresh access token");
      }
      return response.json();
    })
    .then((data) => {
      if (!data || !data.accessToken) {
        throw new Error("New access token not returned.");
      }
      // Zapisz nowy accessToken w localStorage
      const newAccessToken = data.accessToken;
      localStorage.setItem("accessToken", newAccessToken);
      console.log("NewAccessToken:", newAccessToken);

      // Ponownie wyślij żądanie z nowym accessToken
      console.log("Access token refreshed. Retrying original request...");
      authTest(); // Wywołaj oryginalne żądanie
    })
    .catch((error) => {
      console.error("Error refreshing token:", error.message);
      alert("Failed to refresh access token. Please log in again.");
      window.location.href = "/sign-in.html"; // Przekierowanie do strony logowania
    });
}
