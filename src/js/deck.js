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
                    callback(createCard(cursor.value));
                    cursor.continue();
                }
            });
        },
        getRandomCard: function (callback) {
            log.trace();
            getCardCount(function (count, store) {
                perform(store.get(~~(Math.random() * count) + 1), function(data) { callback(createCard(data)) });
            });
        },
        save: function (card) {
            getTransactionalStore(true).put(card);
        }
    };

    function updateDatabase(database) {
        log.trace(arguments)
        log.info('Initialising database', database.name)
        database.createObjectStore('Cards', {
            keyPath: 'id',
            autoIncrement: true
        });
    }

    function onOpen(db) {
        log.trace(arguments);
        database = db;
        callback(deck);
    };

    openDatabase(name, 1, updateDatabase, onOpen);
};
