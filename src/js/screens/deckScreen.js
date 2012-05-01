function deckScreen($screen) {
    log.trace(arguments)
    var template = _.template('<li><%= front %></li>'),
        wordList = uiList($screen, 'word', template);

    return {
        ondisplay: function() { wordList.update(app.activeDeck.forEachCard) }
    };
}
