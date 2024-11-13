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
        // alert(`Login successful! Welcome, ${data.user}`);
        window.location.href = "/index-login.html"; // Przekierowanie na stronę główną po zalogowaniu
      })
      .catch((error) => {
        // Obsługujemy błąd
        console.error("Error:", error.message);
        alert(`Login failed: ${error.message}`);
      });
  });
});
