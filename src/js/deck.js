function openDeck(database, name, callback) {
    log.trace(arguments);

    function getCardCount(callback) {
        database.performWithStore(name, 'count', callback);
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
            database.performWithStore(name, 'openCursor', function(cursor) {
                if(cursor && cursor.value) {
                    callback(createCard(deck, cursor.value));
                    cursor.continue();
                }
            });
        },
        getRandomCard: function (callback) {
            log.trace();
            getCardCount(function (count, store) {
                idbUtils.perform(store.get(~~(Math.random() * count) + 1), function(data) { callback(createCard(deck, data)) });
            });
        },
        save: function (card) {
            database.getTransactionalStore(name, true).put(card);
        }
    };

    callback(deck);
};
