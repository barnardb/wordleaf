function mainScreen ($screen) {
    var $card = $screen.find('.flashcard'),
        $response = $screen.find('.response'),
        $listLink = $screen.find('a.list'),
        activeCard;

    log.debug('$screen', $screen)
    log.debug('$listLink', $listLink);

    function recordResponse(card, response) {
        log.trace();
        (card.responses || (card.responses = [])).push(response)
        deck.save(card)
    };

    function giveFeedback(result) {
        log.trace();
        $card.addClass(result.interpretation ? 'correct' : 'incorrect');
        $card.text(result.expected)
    };

    function processReinforcement(evt) {
        log.trace();
        evt.preventDefault()
        log.debugEquality('$response.val()', $response.val(), 'activeCard.en', activeCard.en);
        if ($response.val() == activeCard.en) {
            $response.parent()[0].removeEventListener('submit', processReinforcement)
            $card.removeClass('correct incorrect')
            showNextCard()
        } else {
            $card.removeClass('correct').addClass('incorrect')
        }
        $response.val('')
    };

    function processFirstResponse(evt) {
        log.trace();
        evt.preventDefault()
        result = {
            time: new Date().getTime(),
            prompt: activeCard.de,
            expected: activeCard.en,
            response: $response.val(),
            interpretation: $response.val() == activeCard.en
        }
        recordResponse(activeCard, result)
        giveFeedback(result)
        $response.val('')
        $response.parent()[0].removeEventListener('submit', processFirstResponse);
        $response.parent()[0].addEventListener('submit', processReinforcement);
    };

    function showNextCard() {
        log.trace();
        deck.getRandomCard(function (card) {
            activeCard = card
            $card.text(card.prompt)
            $response.parent('form')[0].addEventListener('submit', processFirstResponse)
            $response.focus()
        })
    }

    return {
        showNextCard: showNextCard,
        navigation: {
            list: $listLink
        }
    };
}
