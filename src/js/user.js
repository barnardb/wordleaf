function User(database) {
    log.trace(arguments)

    function forEachDeck(callback) {
        log.trace(arguments);
        database.forEachValueInStore('Decks', function(data) {
            callback(new Deck(data, database));
        });
    }

    function openDeck(name, callback) {
        Deck.getFromDatabase(database, name, callback);
    }

    function createDeck(data, callback) {
        log.trace(arguments);
        idbUtils.perform(database.getTransactionalStore('Decks', true).add(data), function (id) {
            data.id = id;
            callback(new Deck(data, database));
        })
    }

    return {
        forEachDeck: forEachDeck,
        openDeck: openDeck,
        createDeck: createDeck
    };
}

function openUserDatabase(name, callback) {
    log.trace(arguments)

    function updateDatabase(database) {
        log.trace(arguments)
        log.info('Initialising database for user', database.name)

        var autoIncrementedId = {
            keyPath: 'id',
            autoIncrement: true
        };

        database.createObjectStore('Decks', autoIncrementedId);

        var cards = database.createObjectStore('Cards', autoIncrementedId);
        cards.createIndex('deck', 'deck')
        cards.createIndex('deck_nextScheduledFor', ['deck', 'nextScheduledFor']);
    }

    function onOpen(database) {
        log.trace(arguments)
        callback(new User(database));
    };

    idbUtils.openDatabase(name, 1, updateDatabase, onOpen);
}
