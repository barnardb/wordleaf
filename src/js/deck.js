function Deck(data, database) {
    log.trace(arguments);

    var deck,
        cardEditTemplate = _.template('' +
                '<div class="side">' +
                '    <label for="front"><h3>Front</h3></label>' +
                '    <div class="display">' +
                '        <textarea id="front"><%= data.front || "" %></textarea>' +
                '    </div>' +
                '    <div class="acceptableInputs">' +
                '        <label for="frontAcceptableInput">Accepts</label>' +
                '        <input type="text" id="frontAcceptableInput" class="acceptableInput" value="<%= data.frontExpected || "" %>"/>' +
                '   </div>' +
                '</div>' +
                '<div class="side">' +
                '    <label for="back"><h3>Back</h3></label>' +
                '    <div class="display">' +
                '        <textarea id="back"><%= data.back || "" %></textarea>' +
                '    </div>' +
                '    <div class="acceptableInputs">' +
                '        <label for="backAcceptableInput">Accepts</label>' +
                '        <input type="text" id="backAcceptableInput" class="acceptableInput" value="<%= data.backExpected || "" %>"/>' +
                '    </div>' +
                '</div>' +
                '<button class="create">Save</button>',
                null,
                { variable: 'data' });

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
        database: database,
        cardEditTemplate: cardEditTemplate
    };
};
