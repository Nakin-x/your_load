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
        testo: "Quanto l’attività ha richiesto concentrazione mentale?"
    },
    {
        key: "Richiesta Fisica",
        testo: "Quanto l’attività è stata fisicamente impegnativa?"
    },
    {
        key: "Richiesta Temporale",
        testo: "Quanto hai percepito pressanti le richieste temporali?"
    },
    {
        key: "Prestazione",
        testo: "Quanto ritieni di aver svolto bene il compito?"
    },
    {
        key: "Sforzo",
        testo: "Quanto sforzo hai dovuto investire?"
    },
    {
        key: "Frustrazione",
        testo: "Quanto ti sei sentito stressato o frustrato?"
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

function renderSlider() {
    const container = document.getElementById("test-container");
    document.getElementById("btn-next").classList.remove("d-none");

    const domanda = DOMANDE_SLIDER[step];

    container.innerHTML = `
        <p class="text-center fw-semibold">${domanda.key}</p>
        <p class="text-center text-muted">${domanda.testo}</p>

        <input id="slider" type="range" class="form-range mt-4"
               min="0" max="100" value="50">

        <p class="text-center fs-5 fw-semibold mt-2">
            <span id="val">50</span>
        </p>
    `;

    const slider = document.getElementById("slider");
    const val = document.getElementById("val");

    slider.oninput = () => val.textContent = slider.value;
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
    coppie = generaCoppie();
    fase = "slider";
    step = 0;

    document.getElementById("btn-next").onclick = () => {
        if (fase === "slider") {
            nextSlider();
        }
    };

    renderSlider();
});
