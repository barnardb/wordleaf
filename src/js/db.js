if('indexedDB' in window) {
} else if('webkitIndexedDB' in window) {
    indexedDB = webkitIndexedDB;
    IDBTransaction = webkitIDBTransaction;
} else if('mozIndexedDB' in window) {
    indexedDB = mozIndexedDB;
}

var perform = function (request, callback) {
    request.onsuccess = function(evt) {
        callback(evt.target.result);
    };
    request.onfailure = function(evt) {
        console.error.invoke(console, arguments);
        throw evt;
    };
};

var openDatabase = function(name, version, upgradeCallback, openCallback) {
    var request = indexedDB.open(name, version);
    request.onupgradeneeded = function (evt) {
        upgradeCallback(evt.target.result);
    };
    request.onsuccess = function (evt) {
        database = evt.target.result;
        if (database.version == version) {
            openCallback(database);
        } else {
            console.log('new creation event missing, setting version');
            perform(database.setVersion(version), function () {
                console.log('success');
                upgradeCallback(database);
                openCallback(database);
            });
        }
    };
    request.onerror = function () {
        console.error('Error trying to open database');
    };
};

var openDeck = function (name, callback) {
    var database;

    var getTransactionalStore = function (withWrite) {
        var mode = withWrite ? IDBTransaction.READ_WRITE : IDBTransaction.READ_ONLY;
        return database.transaction(['Cards'], mode).objectStore('Cards');
    };

    var performTransaction = function (action, callback) {
        var store = getTransactionalStore();
        perform(store[action](), function (result) {
            callback(result, store);
        });
    };

    var getCardCount = function (callback) {
        performTransaction('count', callback);
    };

    var deck = {
        getSize: function (callback) {
            getCardCount(function (count) {
                callback(count);
            });
        },
        forEachCard: function (callback) {
            performTransaction('openCursor', function(cursor) {
                if(cursor && cursor.value) {
                    callback(cursor.value);
                    cursor.continue();
                }
            });
        },
        getRandomCard: function (callback) {
            getCardCount(function (count, store) {
                perform(store.get(~~(Math.random() * count) + 1), callback);
            });
        },
        save: function (card) {
            getTransactionalStore(true).put(card);
        }
    };

    openDatabase(name, 1, function(database) {
        database.createObjectStore('Cards', { autoIncrement: true });
    }, function(db) {
        database = db;
        callback(deck);
    });
};
