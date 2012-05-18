function topScreen($screen) {
    log.trace(arguments);

    var $deckName = $screen.find('#deckName');
        template = _.template('<li><%= name %></li>'),
        deckList = uiList($screen, 'deck', template, { click: selectDeck });

    log.debug('$deckName', $deckName);

    function selectDeck(deck) {
        log.trace(arguments);
        app.activeDeck = deck
        app.displayScreen('drill')
    }

    function ondisplay() {
        log.trace(arguments);
        deckList.update(app.activeUser.forEachDeck)
    }

    function createDeck(evt) {
        log.trace(arguments);
        evt.preventDefault();
        app.activeUser.createDeck({ name: $deckName.val() }, function(deck) {
            app.activeDeck = deck
            app.displayScreen('deck')
        })
    }

    var $createButton = $screen.find('button.create'),
        $form = $createButton.parent('form');

    log.debug('$createButton', $createButton);
    log.debug('$form', $form);

    $form.submit(createDeck);

    return {
        ondisplay: ondisplay
    };
}
