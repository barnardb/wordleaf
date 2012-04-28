if('indexedDB' in window) {
} else if('webkitIndexedDB' in window) {
    indexedDB = webkitIndexedDB;
    IDBTransaction = webkitIDBTransaction;
} else if('mozIndexedDB' in window) {
    indexedDB = mozIndexedDB;
}

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
        log.debug('upgrade needed', evt);
        upgradeCallback(evt.target.result);
    };
    request.onsuccess = function (evt) {
        database = evt.target.result;
        if (database.version == version) {
            openCallback(database);
        } else {
            log.warn('Expected database version', version, 'but got undefined! You must be using WebKit, with an outtaded indexDB implemation. Using setVersion workaround.')
            perform(database.setVersion(version), function () {
                upgradeCallback(database);
                openCallback(database);
            });
        }
    };
    request.onerror = function () {
        console.error('Error trying to open database');
    };
};
