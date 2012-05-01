function deckScreen($screen) {
    log.trace(arguments)

    var $deckName = $screen.find('.deck.name'),
        template = _.template('<li><%= front %></li>'),
        wordList = uiList($screen, 'word', template);

    function ondisplay() {
        $deckName.text(app.activeDeck.name)
        wordList.update(app.activeDeck.forEachCard)
    }

    return {
        ondisplay: ondisplay
    };
}
