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



//USER

let userId = localStorage.getItem("user_id");

if (!userId) {
    userId = crypto.randomUUID();
    localStorage.setItem("user_id", userId);
}


fetch("/api/user/sync/", {
    method: "POST",
    headers: {
        "Content-Type": "application/json"
    },
    body: JSON.stringify({
        user_id: userId
    })
});

/* =======================
   FASE 1 — VALUTAZIONE 0–20
======================= */

function renderValutazione() {
    const container = document.getElementById("test-container");
    const dim = DIMENSIONI[step];

    let scaleDots = "";

    for (let i = 0; i <= 20; i++) {
        scaleDots += `
            <div class="scale-dot" data-value="${i}"></div>
        `;
    }

    container.innerHTML = `
        <p class="text-center fs-6 mt-4">${dim.domanda}</p>

        <div class="d-flex justify-content-between small text-muted mt-3">
            <span>Molto bassa</span>
            <span>Molto alta</span>
        </div>

        <div class="scale-wrapper mt-2">
            ${scaleDots}
        </div>

        <div class="text-center mt-3">
            <span id="selected-value" class="fw-semibold fs-5"></span>
        </div>

        <div class="d-flex justify-content-between align-items-center mt-3">
            ${step > 0 ? '<button class="btn btn-outline-secondary btn-sm" id="btn-back">Indietro</button>' : '<div></div>'}
            <small class="text-muted">
                ${step + 1} / ${DIMENSIONI.length}
            </small>
        </div>
    `;

    const selected = valutazioni[dim.key];

    // ✅ RIPRISTINO VALORE SE GIÀ SELEZIONATO
    if (selected != null) {
        document.getElementById("selected-value").textContent = selected;

        document.querySelectorAll(".scale-dot").forEach(d => {
            if (parseInt(d.dataset.value) <= selected) {
                d.classList.add("active");
            }
        });
    }

    // ✅ CLICK DOTS
    document.querySelectorAll(".scale-dot").forEach(dot => {
        
                dot.onclick = () => {

                    const rawValue = parseInt(dot.dataset.value);
                    let value = rawValue;

                    if (dim.key === "Prestazione") {
                        value = 20 - rawValue;
                    }

                    // reset
                    document.querySelectorAll(".scale-dot")
                        .forEach(d => d.classList.remove("active"));

                    // attiva fino al valore scelto

                        document.querySelectorAll(".scale-dot")
                            .forEach(d => {
                                if (parseInt(d.dataset.value) <= rawValue) {
                                    d.classList.add("active");
                                }
                            });

                    document.getElementById("selected-value").textContent = value;

                    valutazioni[dim.key] = value;
                    step++;

                    if (step < DIMENSIONI.length) {
                        renderValutazione();
                    } else {
                        step = 0;
                        renderCoppia();
                    }
                };
            });
    // ✅ BOTTONE INDIETRO
    if (step > 0) {
        document.getElementById("btn-back").onclick = () => {
            step--;
            renderValutazione();
        };
    }
}
/* =======================
   FASE 2 — CONFRONTI
======================= */

function renderCoppia() {
    const container = document.getElementById("test-container");
    const [a, b] = coppie[step];

    const selected = risposteCoppie[step];

    container.innerHTML = `
        <p class="text-center fw-semibold">
            Quale influisce di più sul carico di lavoro?
        </p>

        <button class="btn w-100 mb-2 ${selected === a ? 'btn-primary' : 'btn-outline-primary'}" id="btn-a">
            ${a}
        </button>

        <button class="btn w-100 ${selected === b ? 'btn-primary' : 'btn-outline-primary'}" id="btn-b">
            ${b}
        </button>

        <div class="d-flex justify-content-between align-items-center mt-3">
            ${step > 0 ? '<button class="btn btn-outline-secondary btn-sm" id="btn-back">Indietro</button>' : '<div></div>'}
            <small class="text-muted">
                ${step + 1} / ${coppie.length}
            </small>
        </div>
    `;

    // ✅ SELEZIONE
    document.getElementById("btn-a").onclick = () => scegli(a);
    document.getElementById("btn-b").onclick = () => scegli(b);

    // ✅ BACK
    if (step > 0) {
        document.getElementById("btn-back").onclick = () => {
            step--;

            // 🔴 fondamentale: rimuovi ultima risposta
            risposteCoppie.pop();

            renderCoppia();
        };
    }
}

function scegli(valore) {
    risposteCoppie[step] = valore; // 🔴 invece di push
    step++;

    if (step < coppie.length) {
        renderCoppia();
    } else {
        calcolaRisultatoFinale();
    }
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
        const v = valutazioni[d.key] ?? 0;   // 0–20
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

    const overall = totaleWorkload / 15;
    


    salvaTest({
        valutazioni,
        conteggi,
        singleWorkload,
        percentuali,
        totaleWorkload,
        overall
    });
}

/* =======================
   SALVATAGGIO
======================= */

function salvaTest(risultati) {
    // Usa i dati dall'oggetto 'risultati' passato da calcolaRisultatoFinale
    const payload = {
        user_id: localStorage.getItem("user_id"),
        scheda_id: SCHEDA_ID,
        valutazioni: risultati.valutazioni,
        conteggi: risultati.conteggi,
        percentuali: risultati.percentuali,
        totaleWorkload: risultati.totaleWorkload,
        overall: risultati.overall
    };

    // Salva subito in localStorage (continua a funzionare offline)
    const localData = loadData();
    const scheda = localData.schede.find(s => s.id === SCHEDA_ID);
    scheda.test.push({
        nome: "Test " + (scheda.test.length + 1),
        data: new Date().toLocaleDateString(),
        ...risultati
    });
    saveData(localData);

    const index = scheda.test.length - 1;

    // Chiamata server (non bloccante)
    fetch("/api/test/", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload)
    })
    .then(res => res.json())
    .then(response => {
        console.log("Salvato su server:", response);
        window.location.href = `/scheda/${SCHEDA_ID}/risultato/${index}/`;
    })
    .catch(err => {
        console.error("Errore server:", err);
        // Ricarica comunque la pagina del risultato (dati salvati in locale)
        window.location.href = `/scheda/${SCHEDA_ID}/risultato/${index}/`;
    });
}
//API  SAVE



/* =======================
   AVVIO
======================= */

document.addEventListener("DOMContentLoaded", () => {
    coppie = shuffle(generaCoppie());
    step = 0;
    renderValutazione();
});
