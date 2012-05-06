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

    function getRandomCard(callback) {
        log.trace();
        getCardCount(function (count, index) {
            if(count) {
                var firstHit = true;
                idbUtils.perform(index.openCursor(data.id), function(cursor) {
                    if(firstHit) {
                        var toMove = ~~(Math.random() * count);
                        if(toMove) {
                            cursor.advance(toMove);
                            firstHit = false;
                            return;
                        }
                    }
                    callback(new Card(deck, cursor.value))
                })
            } else {
                callback();
            }
        });
    }

    return deck = {
        forEachCard: forEachCard,
        getNextCard: getRandomCard,
        get id() { return data.id },
        get name() { return data.name },
        database: database
    };
};
