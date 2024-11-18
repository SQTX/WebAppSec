document.addEventListener("DOMContentLoaded", function () {
  const signInBtn = document.getElementById("sign-in-btn");
  const signInLogin = document.getElementById("sign-in-login");
  const signInPass = document.getElementById("sign-in-pass");

  signInBtn.addEventListener("click", () => {
    const loginInput = signInLogin.value;
    console.log(loginInput);
    signInLogin.value = "";
    const passwordInput = signInPass.value;
    console.log(passwordInput);
    signInPass.value = "";

    fetch("/users/signin", {
      method: "POST", // Metoda HTTP
      headers: {
        "Content-Type": "application/json", // Nagłówek określający typ danych
      },
      body: JSON.stringify({
        login: loginInput,
        password: passwordInput,
      }), // Konwertujemy dane do formatu JSON
    })
      .then((response) => {
        if (!response.ok) {
          // Jeżeli status HTTP nie wskazuje sukcesu, przechwytujemy błąd
          return response.json().then((error) => {
            throw new Error(error.message);
          });
        }
        return response.json(); // Parsujemy odpowiedź JSON w przypadku sukcesu
      })
      .then((data) => {
        // Obsługujemy odpowiedź z serwera
        console.log("Login success:", data);
        console.log("Access:", data.accessToken);
        console.log("Refresh:", data.refreshToken);

        // Zapisujemy token JWT w localStorage
        localStorage.setItem("accessToken", data.accessToken);
        // (Alternatywnie) Zapisujemy accessToken jako ciastko z atrybutami bezpieczeństwa
        // document.cookie = `accessToken=${data.accessToken}; Path=/; Max-Age=900; Secure; HttpOnly; SameSite=Strict`;
        // Zapisujemy refresh token w localStorage
        localStorage.setItem("refreshToken", data.refreshToken);

        // Przekierowanie na stronę główną po zalogowaniu
        window.location.href = "/index-login.html";
      })
      .catch((error) => {
        // Obsługujemy błąd
        console.error("Error:", error.message);
        alert(`Login failed: ${error.message}`);
      });
  });
});
