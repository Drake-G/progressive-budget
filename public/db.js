let db;
let budgetTracker;

const request = indexedDB.open('BudgetDB', budgetTracker || 1);

// I need to go back through and add the proper comments back in 

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

request.onsuccess = function (e) {
    console.log('success');
    db = e.target.result;

    if (navigator.onLine) {
      console.log('Backend online! 🗄️');
      checkDatabase();
    }
  };

function checkDatabase() {
    let transaction = db.transaction(['BudgetStore'], 'readwrite');
    const store = transaction.objectStore('BudgetStore');
    const getAll = store.getAll();

    getAll.onsuccess = function () {

      if (getAll.result.length > 0) {
        fetch('/api/transaction/bulk', {
          method: 'POST',
          body: JSON.stringify(getAll.result),
          headers: {
            Accept: 'application/json, text/plain, */*',
            'Content-Type': 'application/json',
          },
        })
          .then((response) => response.json())
          .then((res) => {
            if (res.length !== 0) {
              transaction = db.transaction(['BudgetStore'], 'readwrite');

              const currentStore = transaction.objectStore('BudgetStore');
              currentStore.clear();
              console.log('Clearing store 🧹');
            }
          });
      }
    };
}

const saveRecord = (record) => {
    console.log('Save record invoked');
    const transaction = db.transaction(['BudgetStore'], 'readwrite');
    const store = transaction.objectStore('BudgetStore');
    store.add(record);
  };

