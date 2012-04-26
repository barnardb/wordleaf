if('indexedDB' in window) {
} else if('webkitIndexedDB' in window) {
    indexedDB = webkitIndexedDB;
    IDBTransaction = webkitIDBTransaction;
} else if('mozIndexedDB' in window) {
    indexedDB = mozIndexedDB;
}

var openDeck = function (name, callback) {
    var db;

    var getCardCount = function (callback) {
        var t = db.transaction(['Cards']);
        var store = t.objectStore('Cards');
        var countRequest = store.count();
        countRequest.onsuccess = function(evt) {
            callback(evt.target.result, store);
        };
        countRequest.onfailure = function(evt) {
            throw evt;
        }
    };

    var deck = {
        getSize: function (callback) {
            getCardCount(function (count) {
                callback(count);
            });
        },
        forEachCard: function (callback) {
            var t = db.transaction(['Cards']);
            var store = t.objectStore('Cards');
            var cursor = store.openCursor();
            cursor.onsuccess = function(evt) {
                if(cursor.result)
                    cursor = cursor.result;
                if(cursor && cursor.value) {
                    callback(cursor.value);
                    cursor.continue();
                }
            };
        },
        getRandomCard: function (callback) {
            getCardCount(function (count, store) {
                var index = ~~(Math.random() * count) + 1;
                var r = store.get(index);
                r.onsuccess = function (evt) { callback(evt.target.result) };
            });
        },
        save: function (card) {
            var t = db.transaction(['Cards'], IDBTransaction.READ_WRITE);
            var store = t.objectStore('Cards');
            store.put(card);
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
