document.addEventListener("DOMContentLoaded", function () {
  const signUpBtn = document.getElementById("sign-up-btn");
  const signUpName = document.getElementById("sign-up-name");
  const signUpLogin = document.getElementById("sign-up-login");
  const signUpEmail = document.getElementById("sign-up-email");
  const signUpPass = document.getElementById("sign-up-pass");
  const signUpRepPass = document.getElementById("sign-up-reppass");
  const signUpAcceptBox = document.getElementById("accept-rules");

  signUpBtn.addEventListener("click", () => {
    let signUpStatus = {
      password: false,
      rules: false,
    };

    // --- User name --------------------------------
    const nameInput = signUpName.value;
    console.log(nameInput);

    // --- Login ------------------------------------
    const loginInput = signUpLogin.value;
    console.log(loginInput);

    // --- Mail -------------------------------------
    const emailInput = signUpEmail.value;
    console.log(emailInput);

    // --- Passwords --------------------------------
    const passwordInput = signUpPass.value;
    console.log(passwordInput);
    const repPasswordInput = signUpRepPass.value;
    console.log(repPasswordInput);

    if (passwordInput !== repPasswordInput) {
      // Reset values:
      signUpPass.value = "";
      signUpRepPass.value = "";
      // Red border:
      signUpPass.style.borderColor = "red";
      signUpRepPass.style.borderColor = "red";
      // Alert:
      alert("Podane hasła są niepoprawne!");
    } else {
      signUpStatus.password = true;
    }

    // --- Rules checkbox ---------------------------
    const rulesBox = signUpAcceptBox.checked;
    console.log(rulesBox);

    if (rulesBox !== true) {
      // Red border:
      signUpAcceptBox.style.borderColor = "red";
      // Alert:
      alert("Zaakceptowanie regulaminu jest wymagane");
    } else {
      signUpStatus.rules = true;
    }

    // Send data to server:
    if (signUpStatus.password === true && signUpStatus.rules === true) {
      fetch("/users/signup", {
        method: "POST", // Metoda HTTP
        headers: {
          "Content-Type": "application/json", // Nagłówek określający typ danych
        },
        body: JSON.stringify({
          name: nameInput,
          login: loginInput,
          email: emailInput,
          password: passwordInput,
        }), // Konwertujemy dane do formatu JSON
      })
        .then((response) => {
          if (!response.ok) {
            // Jeśli odpowiedź nie jest sukcesem (status 2xx), przetwarzamy ją jako błąd
            return response.json().then((errorData) => {
              // Rzucamy błąd z treścią odpowiedzi, aby trafił do bloku catch
              throw new Error(errorData.message || "Unknown error");
            });
          }
          return response.json(); // Jeśli sukces, parsujemy odpowiedź JSON
        })
        .then((data) => {
          // Sukces rejestracji
          console.log("Rejestracja udana:", data);
          alert("Konto zostało utworzone pomyślnie!");
          // Opcjonalnie: przekierowanie na stronę logowania lub główną
          window.location.href = "/sign-in.html"; // Na przykład przekierowanie na stronę logowania
        })
        .catch((error) => {
          // Obsługa błędu
          console.error("Error:", error.message);
          alert(`Rejestracja nieudana: ${error.message}`);
        });
    }
  });
});
