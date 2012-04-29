var idbUtils = (function () {

    var indexedDB = window.indexedDB || window.webkitIndexedDB || window.mozIndexedDB || window.msIndexedDB;
    var IDBTransaction = window.IDBTransaction || window.webkitIDBTransaction || window.msIDBTransaction;

    function perform(request, callback) {
        request.onsuccess = function(evt) {
            callback(evt.target.result);
        };
        request.onfailure = function(evt) {
            console.error.invoke(console, arguments);
            throw evt;
        };
    };

    function openDatabase(name, version, upgradeCallback, openCallback) {
        log.trace();
        var request = indexedDB.open(name, version);
        request.onupgradeneeded = function (evt) {
            log.info('Upgrade needed', evt);
            upgradeCallback(evt.target.result);
        };
        request.onsuccess = function (evt) {
            var database = evt.target.result;
            if (database.version == version) {
                openCallback(wrapDatabase(database));
            } else {
                log.warn('Expected database version', version, 'but got undefined! You must be using WebKit, with an outtaded indexDB implemation. Using setVersion workaround.')
                perform(database.setVersion(version), function () {
                    upgradeCallback(database);
                    openCallback(wrapDatabase(database));
                });
            }
        };
        request.onerror = function () {
            console.error('Error trying to open database');
        };
    };

    return {
        openDatabase: openDatabase,
        perform: perform
    };
})();

function wrapDatabase(database) {

    function getTransactionalStore(name, writable) {
        log.trace(arguments);
        var mode = writable ? IDBTransaction.READ_WRITE : IDBTransaction.READ_ONLY;
        return database.transaction([name], mode).objectStore(name);
    }

    function performWithStore(name, action, callback) {
        var store = getTransactionalStore(name);
        idbUtils.perform(store[action](), function (result) {
            callback(result, store);
        });
    };

    return {
        getTransactionalStore: getTransactionalStore,
        performWithStore: performWithStore,
        get objectStoreNames() { return database.objectStoreNames }
    };
}

