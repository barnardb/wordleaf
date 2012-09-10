function exportScreen($screen) {
    log.trace(arguments)

    var $deckName = $screen.find('.deck.name'),
        $data = $screen.find('#exportData');

    function ondisplay() {
        $deckName.text(app.activeDeck.name);
        var data = _.extend({}, app.activeDeck);
        var cardData = data.cards = [];
        log.debug('before cards', data);
        app.activeDeck.forEachCard(function (card) {
            cardData.push(card.data);
        }, function () {
            log.debug('after cards', data);
            $data.text(JSON.stringify(data, null, 4));
        });
    }

    return {
        ondisplay: ondisplay
    };
}
