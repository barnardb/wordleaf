function Deck(data, database) {
    log.trace(arguments);

    var deck,
        cardEditTemplate = _.template('' +
                '<% _.each({ front: "Front", back: "Back" }, function(title, side) { %>' +
                '    <div class="<%= side %> side">' +
                '        <label for="<%= side %>"><h3><%= title %></h3></label>' +
                '        <div class="acceptableInputs">' +
                '            <label for="<%= side %>AcceptableInput">Accepts</label>' +
                '            <% _.each(utils.array(data[side + "Expected"]).concat([""]), function (expected, index) { %>' +
                '                <input type="text" <% index || print(\'id="<%= side %>AcceptableInput"\') %> class="acceptableInput" value="<%= expected %>"/>' +
                '            <% }) %>' +
                '        </div>' +
                '        <div class="display">' +
                '            <textarea id="<%= side %>"><%= data[side] || "" %></textarea>' +
                '        </div>' +
                '    </div>' +
                '<% }) %>' +
                '<button class="create">Save</button>',
                null,
                { variable: 'data' });

    function forEachCard(cardCallback, completionCallback) {
        log.trace(arguments);
        idbUtils.perform(database.getTransactionalStore('Cards').index('deck').openCursor(data.id), function(cursor) {
            if(cursor && cursor.value) {
                cardCallback(new Card(deck, cursor.value));
                cursor.continue();
            } else {
                completionCallback();
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
