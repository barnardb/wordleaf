function listScreen($screen) {
    log.trace(arguments)

    var wordList = uiList($screen, 'word');

    return {
        ondisplay: function() { wordList.update(app.activeDeck.forEachCard) }
    };
}
