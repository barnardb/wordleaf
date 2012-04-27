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

var openDeck = function (name, callback) {
    var db;

    var getTransactionalStore = function (withWrite) {
        var mode = withWrite ? IDBTransaction.READ_WRITE : IDBTransaction.READ_ONLY;
        return db.transaction(['Cards'], mode).objectStore('Cards');
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

    var request = indexedDB.open(name, 1);
    request.onupgradeneeded = function (evt) {
        evt.target.result.createObjectStore('Cards', { autoIncrement: true });
    };
    request.onsuccess = function (evt) {
        db = evt.target.result;
        if (db.objectStoreNames.contains('Cards')) {  //if(db.version) {
            callback(deck);
        } else {
            //var r = db.setVersion('1');
            //r.onsuccess = function() {
                //console.log('success');
                callback(deck);
            //};
        }
    };
    request.onerror = function () {
        console.error('Error trying to open db');
    };
};
