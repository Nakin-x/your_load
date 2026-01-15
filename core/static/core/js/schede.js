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
            card.className = "card shadow-sm";
            card.style.cursor = "pointer";

            card.onclick = () => {
                window.location.href = `/scheda/${scheda.id}/`;
            };

            card.innerHTML = `
                <div class="card-body d-flex justify-content-between align-items-center">
                    <span class="fw-medium">${scheda.nome}</span>
                    <div class="btn-group">
                        <button class="btn btn-outline-secondary btn-sm"
                            onclick="event.stopPropagation(); rinominaScheda('${scheda.id}')">
                            ✏️
                        </button>
                        <button class="btn btn-outline-danger btn-sm"
                            onclick="event.stopPropagation(); eliminaScheda('${scheda.id}')">
                            🗑
                        </button>
                    </div>
                </div>
            `;

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

    // 🔽 FUNZIONI GLOBALI (OBBLIGATORIE)
    window.rinominaScheda = function (id) {
        const data = loadData();
        const scheda = data.schede.find(s => s.id === id);
        if (!scheda) return;

        const nuovoNome = prompt("Nuovo nome scheda:", scheda.nome);
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

    // ✅ QUESTA ERA LA CHIAMATA MANCANTE
    renderSchede();
});
