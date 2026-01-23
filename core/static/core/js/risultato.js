document.addEventListener("DOMContentLoaded", () => {
    const container = document.getElementById("risultato-container");

    const data = loadData();
    const scheda = data.schede.find(s => s.id === SCHEDA_ID);

    if (!scheda) {
        container.innerHTML = "<p class='text-danger'>Scheda non trovata</p>";
        return;
    }

    const test = scheda.test[TEST_INDEX];

    if (!test) {
        container.innerHTML = "<p class='text-danger'>Test non trovato</p>";
        return;
    }

    renderRisultato(test);
});

function renderRisultato(test) {
    const container = document.getElementById("risultato-container");

    let html = `
        <div class="card mb-3">
            <div class="card-body text-center">
                <h5 class="mb-1">Workload Totale</h5>
                <div class="fs-3 fw-semibold">
                    ${test.totaleWorkload.toFixed(1)}
                </div>
            </div>
        </div>

        <div class="card mb-3">
            <div class="card-body">
                <h6 class="mb-3">Dettaglio per dimensione</h6>
                <ul class="list-group list-group-flush">
    `;

    Object.keys(test.percentuali).forEach(key => {
        html += `
            <li class="list-group-item d-flex justify-content-between align-items-center">
                <span>${key}</span>
                <span class="fw-medium">
                    ${test.percentuali[key].toFixed(1)} %
                </span>
            </li>
        `;
    });

    html += `
                </ul>
            </div>
        </div>

        <div class="card">
            <div class="card-body">
                <h6 class="mb-3 text-center">Distribuzione del carico</h6>
                <canvas id="radarChart" height="260"></canvas>
            </div>
        </div>
    `;

    container.innerHTML = html;

    // per ora NON disegniamo il grafico
    // lo colleghiamo nel prossimo step
}
