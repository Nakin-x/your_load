/* =======================
   DEFINIZIONI
======================= */

const DIMENSIONI = [
    "Richiesta Mentale",
    "Richiesta Fisica",
    "Richiesta Temporale",
    "Prestazione",
    "Sforzo",
    "Frustrazione"
];

const DOMANDE_SLIDER = [
    {
        key: "Richiesta Mentale",
        testo: "Quanto dispendioso è stato il compito da un punto di vista mentale?"
    },
    {
        key: "Richiesta Fisica",
        testo: "Quanto dispendioso è stato il compito da un punto di vista fisico?"
    },
    {
        key: "Richiesta Temporale",
        testo: "Quanto hai percepito pressanti le richieste temporali del compito?"
    },
    {
        key: "Prestazione",
        testo: "Quanto bravo sei stato a fare il compito che ti è stato richiesto?"
    },
    {
        key: "Sforzo",
        testo: "Quanto duramente ti sei dovuto impegnare per svolgere il compito?"
    },
    {
        key: "Frustrazione",
        testo: "Quanto sei stato insicuro, scoraggiato, irritato, stressato e infastidito?"
    }
];

/* =======================
   STATO
======================= */

let fase = "slider"; // slider | confronti
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
            result.push([DIMENSIONI[i], DIMENSIONI[j]]);
        }
    }
    return result;
}

/* =======================
   FASE 1 — SLIDER
======================= */
function renderValutazione() {
    const container = document.getElementById("test-container");
    const btnNext = document.getElementById("btn-next");

    btnNext.classList.add("d-none");

    const dim = DIMENSIONI[step];

    let buttons = "";
    for (let i = 0; i <= 20; i++) {
        buttons += `
            <button class="btn btn-outline-primary m-1 slot-btn"
                    data-value="${i}">
                ${i}
            </button>
        `;
    }

    container.innerHTML = `
        <p class="text-center fs-6 mt-4">${dim}</p>
        <div class="d-flex flex-wrap justify-content-center mt-3">
            ${buttons}
        </div>
    `;

    document.querySelectorAll(".slot-btn").forEach(btn => {
        btn.onclick = () => {
            valutazioni[DIMENSIONI[step]] = parseInt(btn.dataset.value);
            step++;

            if (step < DIMENSIONI.length) {
                renderValutazione();
            } else {
                calcolaRisultatoFinale();
            }
        };
    });
}

function nextSlider() {
    const slider = document.getElementById("slider");
    const domanda = DOMANDE_SLIDER[step];

    valutazioni[domanda.key] = parseInt(slider.value);

    step++;

    if (step < DOMANDE_SLIDER.length) {
        renderSlider();
    } else {
        // passa ai confronti
        fase = "confronti";
        step = 0;
        document.getElementById("btn-next").classList.add("d-none");
        renderCoppia();
    }
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

function shuffle(array) {
    for (let i = array.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [array[i], array[j]] = [array[j], array[i]];
    }
    return array;
}


/* =======================
   CALCOLO & SALVATAGGIO
======================= */

function calcolaPesi() {
    const pesi = {};
    DIMENSIONI.forEach(d => pesi[d] = 0);
    risposteCoppie.forEach(r => pesi[r]++);
    return pesi;
}

function calcolaRisultatoFinale() {
    const pesi = calcolaPesi();
    let totale = 0;

    DIMENSIONI.forEach(d => {
        const valore = valutazioni[d] ?? 0; // ← PROTEZIONE
        totale += pesi[d] * valore;
    });

    const overall = totale / 15;
    salvaTest(pesi, overall);
}


function salvaTest(pesi, overall) {
    const data = loadData();
    const scheda = data.schede.find(s => s.id === SCHEDA_ID);

    scheda.test.push({
        nome: "Test " + (scheda.test.length + 1),
        data: new Date().toLocaleDateString(),
        pesi,
        valutazioni,
        overall
    });

    saveData(data);
    const testIndex = scheda.test.length - 1;

    window.location.href =
    `/scheda/${SCHEDA_ID}/risultato/${testIndex}/`;

}

/* =======================
   AVVIO
======================= */

    
document.addEventListener("DOMContentLoaded", () => {
    coppie = shuffle(generaCoppie());
    fase = 1;
    step = 0;

    renderValutazione();
});


