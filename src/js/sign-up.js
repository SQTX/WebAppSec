document.addEventListener("DOMContentLoaded", function () {
  const signUpBtn = document.getElementById("sign-up-btn");
  const signUpName = document.getElementById("sign-up-name");
  const signUpLogin = document.getElementById("sign-up-login");
  const signUpEmail = document.getElementById("sign-up-email");
  const signUpPass = document.getElementById("sign-up-pass");
  const signUpRepPass = document.getElementById("sign-up-reppass");
  const signUpAcceptBox = document.getElementById("accept-rules");

  console.log("Danielek Skura");

  signUpBtn.addEventListener("click", () => {
    let signUpOk = false;
    let signUpStatus = {
      login: false,
      email: false,
      password: false,
      rules: false,
    };

    // --- User name ------------
    const nameInput = signUpName.value;
    console.log(nameInput);


    // --- Login ------------
    const loginInput = signUpLogin.value;
    console.log(loginInput);

    // TODO: Sprawdzenie czy login jest zajęty
    signUpStatus.login = true;

    // --- Mail ------------
    const emailInput = signUpEmail.value;
    console.log(emailInput);

    // TODO: Sprawdzenie czy mail jest w DB
    signUpStatus.email = true;

    // --- Passwords ------------
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
    }else {
      signUpStatus.password = true;
    }

    // --- Rules checkbox ------------
    const rulesBox = signUpAcceptBox.checked;
    console.log(rulesBox);

    if (rulesBox !== true) {
      // Red border:
      signUpAcceptBox.style.borderColor = "red";
      // Alert:
      alert("Zaakceptowanie regulaminu jest wymagane");
    }else {
      signUpStatus.rules = true;
    }

    if (
      signUpStatus.login === true &&
      signUpStatus.email === true &&
      signUpStatus.password === true &&
      signUpStatus.rules === true
    ) {
      signUpOk = true;
    }

    if (signUpOk) {
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
      }).then((response) => response.json()) // Odbieramy i parsujemy odpowiedź
        .then((data) => console.log(data)) // Wyświetlamy dane w konsoli
        .catch((error) => console.error("Error:", error)); // Obsługa błędów
    }
  });
});
