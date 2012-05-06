function Deck(data, database) {
    log.trace(arguments);

    var deck;

    function forEachCard(callback) {
        log.trace(arguments);
        idbUtils.perform(database.getTransactionalStore('Cards').index('deck').openCursor(data.id), function(cursor) {
            if(cursor && cursor.value) {
                callback(new Card(deck, cursor.value));
                cursor.continue();
            }
        });
    }

    function getCardCount(callback) {
        log.trace(arguments);
        var store = database.getTransactionalStore('Cards'),
            index = store.index('deck');
        idbUtils.perform(index.count(data.id), function (count) {
            callback(count, index);
        })
    };

    function getNextCard(callback) {
        log.trace(arguments);
        var store = database.getTransactionalStore('Cards'),
            index = store.index('deck_nextScheduledFor');
        idbUtils.perform(index.get(IDBKeyRange.bound([data.id], [data.id, Date.now()])), function (value) {
            callback(value ? new Card(deck, value) : value);
        });
    }

    return deck = {
        forEachCard: forEachCard,
        getNextCard: getNextCard,
        get id() { return data.id },
        get name() { return data.name },
        database: database
    };
};
