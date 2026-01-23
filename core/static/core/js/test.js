/* =======================
   DEFINIZIONI
======================= */

const DIMENSIONI = [
    {
        key: "Richiesta Mentale",
        domanda: "Quanto dispendioso è stato il compito da un punto di vista mentale?"
    },
    {
        key: "Richiesta Fisica",
        domanda: "Quanto dispendioso è stato il compito da un punto di vista fisico?"
    },
    {
        key: "Richiesta Temporale",
        domanda: "Quanto hai percepito pressanti le richieste temporali del compito?"
    },
    {
        key: "Prestazione",
        domanda: "Quanto bravo sei stato a fare il compito che ti è stato richiesto?"
    },
    {
        key: "Sforzo",
        domanda: "Quanto duramente ti sei dovuto impegnare per svolgere il compito?"
    },
    {
        key: "Frustrazione",
        domanda: "Quanto sei stato insicuro, scoraggiato, irritato, stressato e infastidito?"
    }
];

/* =======================
   STATO
======================= */

let step = 0;
let coppie = [];
let risposteCoppie = [];
let valutazioni = {};

/* =======================
   UTILITIES
======================= */

function generaCoppie() {
    const result = [];
    for (let i = 0; i < DIMENSIONI.length; i++) {
        for (let j = i + 1; j < DIMENSIONI.length; j++) {
            result.push([DIMENSIONI[i].key, DIMENSIONI[j].key]);
        }
    }
    return result;
}

function shuffle(array) {
    for (let i = array.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [array[i], array[j]] = [array[j], array[i]];
    }
    return array;
}

/* =======================
   FASE 1 — VALUTAZIONE 0–20
======================= */

function renderValutazione() {
    const container = document.getElementById("test-container");
    const dim = DIMENSIONI[step];

    let buttons = "";
    for (let i = 0; i <= 20; i++) {
        buttons += `
            <button class="slot-btn btn btn-outline-primary fw-semibold"
                    data-value="${i}">
                ${i}
            </button>
        `;
    }


    container.innerHTML = `
    <p class="text-center fs-6 mt-4">${dim.domanda}</p>

    <div class="slot-grid mt-4">
        ${buttons}
    </div>

    <div class="d-flex justify-content-between mt-2 px-1 slot-labels">
        <span>Molto bassa</span>
        <span>Molto alta</span>
    </div>

    <p class="text-center text-muted mt-3">
        ${step + 1} / ${DIMENSIONI.length}
    </p>
`;


    document.querySelectorAll(".slot-btn").forEach(btn => {
        btn.onclick = () => {
            valutazioni[dim.key] = parseInt(btn.dataset.value);
            step++;

            if (step < DIMENSIONI.length) {
                renderValutazione();
            } else {
                step = 0;
                renderCoppia();
            }
        };
    });
}

/* =======================
   FASE 2 — CONFRONTI
======================= */

function renderCoppia() {
    const container = document.getElementById("test-container");
    const [a, b] = coppie[step];

    container.innerHTML = `
        <p class="text-center fw-semibold">
            Quale influisce di più sul carico di lavoro?
        </p>

        <button class="btn btn-outline-primary w-100 mb-2" id="btn-a">${a}</button>
        <button class="btn btn-outline-primary w-100" id="btn-b">${b}</button>

        <p class="text-center text-muted mt-3">
            ${step + 1} / ${coppie.length}
        </p>
    `;

    document.getElementById("btn-a").onclick = () => scegli(a);
    document.getElementById("btn-b").onclick = () => scegli(b);
    renderRadarChart(test);
}


function renderRadarChart(test) {
    const ctx = document.getElementById("radarChart").getContext("2d");

    const labels = Object.keys(test.percentuali);
    const dataValues = labels.map(k => test.percentuali[k]);

    new Chart(ctx, {
        type: "radar",
        data: {
            labels: labels,
            datasets: [{
                label: "Distribuzione Workload (%)",
                data: dataValues,
                fill: true,
                backgroundColor: "rgba(13, 110, 253, 0.2)",
                borderColor: "rgba(13, 110, 253, 1)",
                pointBackgroundColor: "rgba(13, 110, 253, 1)"
            }]
        },
        options: {
            responsive: true,
            scales: {
                r: {
                    beginAtZero: true,
                    ticks: {
                        display: false
                    }
                }
            },
            plugins: {
                legend: {
                    display: false
                }
            }
        }
    });
}


function scegli(valore) {
    risposteCoppie.push(valore);
    step++;

    if (step < coppie.length) {
        renderCoppia();
    } else {
        calcolaRisultatoFinale();
    }
    

}

/* =======================
   CALCOLO RISULTATI
======================= */

function calcolaConteggi() {
    const conteggi = {};
    DIMENSIONI.forEach(d => conteggi[d.key] = 0);
    risposteCoppie.forEach(r => conteggi[r]++);
    return conteggi;
}

function calcolaRisultatoFinale() {
    const conteggi = calcolaConteggi();
    const singleWorkload = {};
    const percentuali = {};
    let totaleWorkload = 0;

    DIMENSIONI.forEach(d => {
        const v = valutazioni[d.key];   // 0–20
        const vas = v * 5;              // VAS%
        const c = conteggi[d.key];      // frequenza coppie
        const sw = vas * c;

        singleWorkload[d.key] = sw;
        totaleWorkload += sw;
    });

    DIMENSIONI.forEach(d => {
        percentuali[d.key] =
            totaleWorkload > 0
                ? (singleWorkload[d.key] * 100) / totaleWorkload
                : 0;
    });

    salvaTest({
        valutazioni,
        conteggi,
        singleWorkload,
        percentuali,
        totaleWorkload
    });
}

/* =======================
   SALVATAGGIO
======================= */

function salvaTest(risultati) {
    const data = loadData();
    const scheda = data.schede.find(s => s.id === SCHEDA_ID);

    scheda.test.push({
        nome: "Test " + (scheda.test.length + 1),
        data: new Date().toLocaleDateString(),
        ...risultati
    });

    saveData(data);

    const index = scheda.test.length - 1;
    window.location.href = `/scheda/${SCHEDA_ID}/risultato/${index}/`;
}

/* =======================
   AVVIO
======================= */

document.addEventListener("DOMContentLoaded", () => {
    coppie = shuffle(generaCoppie());
    step = 0;
    renderValutazione();
});
