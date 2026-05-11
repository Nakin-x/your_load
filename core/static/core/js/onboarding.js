document.addEventListener("DOMContentLoaded", () => {
    const overlay = document.getElementById("onboarding-overlay");
    const mainContent = document.getElementById("main-content");
    const nicknameInput = document.getElementById("nickname-input");
    const saveBtn = document.getElementById("save-nickname");

    // Controlla se abbiamo già un nickname
    const existingNickname = localStorage.getItem("nickname");

    if (existingNickname) {
        // Nascondi overlay e mostra contenuto
        overlay.style.display = "none";
        mainContent.style.display = "";
    } else {
        // Mostra overlay e nascondi contenuto
        overlay.style.display = "block";
        mainContent.style.display = "none";
    }

    // Salva il nickname
    saveBtn.addEventListener("click", () => {
        const nickname = nicknameInput.value.trim();
        if (!nickname) {
            alert("Inserisci un nickname");
            return;
        }

        // Salva in localStorage
        localStorage.setItem("nickname", nickname);

        // Invia al server per associare al user_id
        const userId = localStorage.getItem("user_id");
        if (userId) {
            fetch("/api/user/nickname/", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ user_id: userId, nickname: nickname })
            })
            .then(res => res.json())
            .then(data => console.log("Nickname salvato sul server:", data))
            .catch(err => console.error("Errore salvataggio nickname:", err));
        }

        // Mostra la schermata principale
        overlay.style.display = "none";
        mainContent.style.display = "";
    });
});