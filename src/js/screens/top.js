function topScreen($screen) {
    log.trace(arguments);

    var template = _.template('<li><%= name %></li>'),
        deckList = uiList($screen, 'deck', template, { click: selectDeck });

    function selectDeck(deck) {
        app.activateDeck(deck.name, function () {
            app.displayScreen('flash')
        })
    }

    function ondisplay() {
        log.trace(arguments);
        deckList.update(app.currentUser.forEachDeck)
    }

    return {
        ondisplay: ondisplay
    };
}
