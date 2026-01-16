document.addEventListener("DOMContentLoaded", () => {
    const container = document.getElementById("schede-container");
    const btn = document.getElementById("crea-scheda");
    const input = document.getElementById("nome-scheda");

    if (!container || !btn || !input) return;

    function renderSchede() {
        container.innerHTML = "";
        const data = loadData();

        if (!data.schede || data.schede.length === 0) {
            container.innerHTML = `
                <div class="text-muted text-center">
                    Nessuna scheda creata
                </div>`;
            return;
        }

        data.schede.forEach(scheda => {
            const card = document.createElement("div");
            card.className = "card shadow-sm mb-2";
            card.style.cursor = "pointer";

            card.addEventListener("click", () => {
                window.location.href = `/scheda/${scheda.id}/`;
            });

            const cardBody = document.createElement("div");
            cardBody.className =
                "card-body d-flex justify-content-between align-items-center";

            const title = document.createElement("span");
            title.className = "fw-medium";
            title.textContent = scheda.nome;

            const btnGroup = document.createElement("div");
            btnGroup.className = "btn-group";

            const editBtn = document.createElement("button");
            editBtn.className = "btn btn-outline-secondary btn-sm";
            editBtn.textContent = "✏️";
            editBtn.addEventListener("click", (e) => {
                console.log("CLICK EDIT ANDROID", scheda.id);
                e.stopPropagation();
                rinominaScheda(scheda.id);
            });

            const deleteBtn = document.createElement("button");
            deleteBtn.className = "btn btn-outline-danger btn-sm";
            deleteBtn.textContent = "🗑";
            deleteBtn.addEventListener("click", (e) => {
                e.stopPropagation();
                eliminaScheda(scheda.id);
            });

            btnGroup.appendChild(editBtn);
            btnGroup.appendChild(deleteBtn);

            cardBody.appendChild(title);
            cardBody.appendChild(btnGroup);
            card.appendChild(cardBody);
            container.appendChild(card);
        });
    }

    btn.addEventListener("click", () => {
        const nome = input.value.trim();
        if (!nome) return;

        const data = loadData();

        data.schede.push({
            id: Date.now().toString(),
            nome: nome,
            test: []
        });

        saveData(data);
        input.value = "";
        renderSchede();
    });

    // FUNZIONI GLOBALI (richiamate dai listener)
    window.rinominaScheda = function (id) {
        console.log("SCHEDE.JS CARICATO - VERSIONE ANDROID");

        const data = loadData();
        const scheda = data.schede.find(s => s.id === id);
        if (!scheda) return;

        const nuovoNome = prompt("Rinomina scheda:", scheda.nome);
        if (nuovoNome) {
            scheda.nome = nuovoNome;
            saveData(data);
            renderSchede();
        }
    };

    window.eliminaScheda = function (id) {
        if (!confirm("Eliminare questa scheda?")) return;

        const data = loadData();
        data.schede = data.schede.filter(s => s.id !== id);
        saveData(data);
        renderSchede();
    };

    renderSchede();
});
