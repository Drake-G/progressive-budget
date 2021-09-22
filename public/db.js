let db;
let budgetTracker;

const request = indexedDB.open('BudgetDB', budgetTracker || 1);

request.onupgradeneeded = function (e) {
    const { oldVersion } = e;
    const newVersion = e.newVersion || db.version;
    db = e.target.result;

    if (db.objectStoreNames.length === 0) {
        db.createObjectStore('BudgetStore', {autoIncrement: true})
    }
};

request.onerror = function (e) {
    console.log(`Error: ${e.target.errorCode}`)
}