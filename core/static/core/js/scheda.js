document.addEventListener("DOMContentLoaded", () => {
    const titolo = document.getElementById("nome-scheda");
    const lista = document.getElementById("storico-test");
    const btn = document.getElementById("nuovo-test");

    btn.addEventListener("click", () => {
        window.location.href = `/scheda/${SCHEDA_ID}/test/`;
    });

    const data = loadData();
    const scheda = data.schede.find(s => s.id === SCHEDA_ID);

    if (!scheda) {
        titolo.textContent = "Scheda non trovata";
        return;
    }

    titolo.textContent = scheda.nome;

    function renderStorico() {
        lista.innerHTML = "";

        if (!scheda.test || scheda.test.length === 0) {
            lista.innerHTML = `
                <li class="list-group-item text-muted">
                    Nessun test effettuato
                </li>`;
            return;
        }

        scheda.test.forEach((t, index) => {
            const li = document.createElement("li");
            li.className = "list-group-item d-flex justify-content-between align-items-center";

            li.innerHTML = `
                <div>
                    <div class="fw-medium">${t.nome || "Test"}</div>
                    <small class="text-muted">
                        Overall: ${Number.isFinite(t.overall) ? t.overall.toFixed(2) : "N/D"}
                    </small>
                </div>
                <div class="btn-group">
                    <button class="btn btn-outline-secondary btn-sm"
                        onclick="rinominaTest(${index})">✏️</button>
                    <button class="btn btn-outline-danger btn-sm"
                        onclick="eliminaTest(${index})">🗑</button>
                </div>
            `;

            lista.appendChild(li);
        });
    }

    window.rinominaTest = function (index) {
        const nuovoNome = prompt(
            "Rinomina test:",
            scheda.test[index].nome || "Test"
        );

        if (nuovoNome) {
            scheda.test[index].nome = nuovoNome;
            saveData(data);
            renderStorico();
        }
    };

    window.eliminaTest = function (index) {
        if (!confirm("Eliminare questo test?")) return;

        scheda.test.splice(index, 1);
        saveData(data);
        renderStorico();
    };

    // ✅ QUESTA ERA LA RIGA MANCANTE
    renderStorico();
});
