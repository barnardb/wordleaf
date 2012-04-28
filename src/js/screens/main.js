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
        log.debugEquality('$response.val()', $response.val(), 'activeCard.back', activeCard.back);
        if ($response.val() == activeCard.back) {
            $response.parent()[0].removeEventListener('submit', processReinforcement)
            $card.removeClass('correct incorrect')
            showNextCard()
        } else {
            $card.removeClass('correct').addClass('incorrect')
        }
        $response.val('')
    }

    function processFirstResponse(evt) {
        log.trace();
        evt.preventDefault()
        result = {
            time: new Date().getTime(),
            prompt: activeCard.front,
            expected: activeCard.back,
            response: $response.val(),
            interpretation: $response.val() == activeCard.back
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
            $card.text(card.front)
            $response.parent('form')[0].addEventListener('submit', processFirstResponse)
            $response.focus()
        })
    }

    function ondisplay() {
        log.trace(arguments);
        activeCard || showNextCard()
    }

    return {
        ondisplay: ondisplay,
        navigation: {
            list: $listLink
        }
    };
}
