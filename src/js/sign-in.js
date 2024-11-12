document.addEventListener("DOMContentLoaded", function () {
  const signInBtn = document.getElementById("sign-in-btn");
  const signInLogin = document.getElementById("sign-in-login");
  const signInPass = document.getElementById("sign-in-pass");

  console.log("Mirek Skura");

  signInBtn.addEventListener("click", () => {
    console.log("Chuj");
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
      .then((response) => response.json()) // Odbieramy i parsujemy odpowiedź
      .then((data) => console.log(data)) // Wyświetlamy dane w konsoli
      .catch((error) => console.error("Error:", error)); // Obsługa błędów
  });
});
