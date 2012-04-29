function createUser(database) {
    log.trace(arguments)

    function openDeck(name, callback) {
        window.openDeck(database, name, callback)
    }

    function forEachDeck(callback) {
        _.each(database.objectStoreNames, function (name) {
            callback({ name: name });
        })
    }

    return {
        forEachDeck: forEachDeck,
        openDeck: openDeck
    };
}

function openUserDatabase(name, callback) {
    log.trace(arguments)

    function updateDatabase(database) {
        log.trace(arguments)
        log.info('Initialising database', database.name)
        database.createObjectStore('Cards', {
            keyPath: 'id',
            autoIncrement: true
        });
    }

    function onOpen(database) {
        log.trace(arguments)
        callback(createUser(database));
    };

    idbUtils.openDatabase(name, 1, updateDatabase, onOpen);
}
