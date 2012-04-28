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

function openDeck(name, callback) {
    log.trace();
    var database;

    function getTransactionalStore(withWrite) {
        var mode = withWrite ? IDBTransaction.READ_WRITE : IDBTransaction.READ_ONLY;
        return database.transaction(['Cards'], mode).objectStore('Cards');
    };

    function performTransaction(action, callback) {
        var store = getTransactionalStore();
        perform(store[action](), function (result) {
            callback(result, store);
        });
    };

    function getCardCount(callback) {
        performTransaction('count', callback);
    };

    var deck = {
        getSize: function (callback) {
            log.trace();
            getCardCount(function (count) {
                callback(count);
            });
        },
        forEachCard: function (callback) {
            log.trace();
            performTransaction('openCursor', function(cursor) {
                if(cursor && cursor.value) {
                    callback(cursor.value);
                    cursor.continue();
                }
            });
        },
        getRandomCard: function (callback) {
            log.trace();
            getCardCount(function (count, store) {
                perform(store.get(~~(Math.random() * count) + 1), callback);
            });
        },
        save: function (card) {
            getTransactionalStore(true).put(card);
        }
    };

    function updateDatabase(database) {
        log.trace(arguments)
        log.info('Initialising database', database.name)
        database.createObjectStore('Cards', { autoIncrement: true });
    }

    function onOpen(db) {
        log.trace(arguments);
        database = db;
        callback(deck);
    };

    openDatabase(name, 1, updateDatabase, onOpen);
};
