document.addEventListener("DOMContentLoaded", () => {
    const container = document.getElementById("risultato-container");
    const data = loadData();
    const scheda = data.schede.find(s => s.id === SCHEDA_ID);
    const test = scheda.test[TEST_INDEX];

    let html = `
      <div class="card shadow-sm mb-3">
        <div class="card-body text-center">
          <h5>Overall</h5>
          <div class="display-5 fw-semibold">
            ${test.overall.toFixed(2)}
          </div>
        </div>
      </div>
    `;

    html += `<ul class="list-group">`;

    Object.keys(test.valutazioni).forEach(k => {
        html += `
          <li class="list-group-item d-flex justify-content-between">
            <span>${k}</span>
            <span>${test.valutazioni[k]}</span>
          </li>`;
    });

    html += `</ul>`;
    container.innerHTML = html;
});
