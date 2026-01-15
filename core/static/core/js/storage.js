const STORAGE_KEY = "yourload_data";

function loadData() {
    return JSON.parse(localStorage.getItem(STORAGE_KEY)) || { schede: [] };
}

function saveData(data) {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
}
