function deckScreen($screen) {
    log.trace(arguments)

    var $deckName = $screen.find('.deck.name'),
        template = _.template('<li><a href="#"><%= front %> (<%= new Date(nextScheduledFor) %>)</a></li>'),
        wordList = uiList($screen, 'word', template, {click: function(item) {app.displayScreen('edit', item)}});

    function ondisplay() {
        $deckName.text(app.activeDeck.name)
        wordList.update(app.activeDeck.forEachCard)
    }

    return {
        ondisplay: ondisplay
    };
}
