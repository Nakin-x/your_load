document.addEventListener("DOMContentLoaded", () => {
    const overlay = document.getElementById("onboarding-overlay");
    const mainContent = document.getElementById("main-content");
    const nicknameInput = document.getElementById("nickname-input");
    const saveBtn = document.getElementById("save-nickname");

    // Genera user_id se non esiste (può essere sulla home prima del test)
    let userId = localStorage.getItem("user_id");
    if (!userId) {
        userId = crypto.randomUUID();
        localStorage.setItem("user_id", userId);
    }

    // Sincronizza utente col server e controlla se ha già un nickname
    fetch("/api/user/sync/", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ user_id: userId })
    })
    .then(res => res.json())
    .then(data => {
        if (data.nickname) {
            // Ha già un nickname: salva in locale e mostra la home
            localStorage.setItem("nickname", data.nickname);
            overlay.style.display = "none";
            mainContent.style.display = "";
        } else {
            // Controlla localStorage come fallback
            const localNickname = localStorage.getItem("nickname");
            if (localNickname) {
                overlay.style.display = "none";
                mainContent.style.display = "";
            } else {
                overlay.style.display = "block";
                mainContent.style.display = "none";
            }
        }
    })
    .catch(() => {
        // Offline: usa solo localStorage
        const localNickname = localStorage.getItem("nickname");
        overlay.style.display = localNickname ? "none" : "block";
        mainContent.style.display = localNickname ? "" : "none";
    });

    saveBtn.addEventListener("click", () => {
        const nickname = nicknameInput.value.trim();
        if (!nickname) {
            alert("Inserisci un nickname");
            return;
        }

        localStorage.setItem("nickname", nickname);

        fetch("/api/user/nickname/", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ user_id: userId, nickname: nickname })
        })
        .then(res => res.json())
        .then(data => console.log("Nickname salvato:", data))
        .catch(err => console.error("Errore:", err));

        overlay.style.display = "none";
        mainContent.style.display = "";
    });
});