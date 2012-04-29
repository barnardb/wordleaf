function flashScreen ($screen) {
    var $card = $screen.find('.flashcard'),
        $response = $screen.find('.response'),
        $listLink = $screen.find('a.list'),
        activeCard;

    log.debug('$screen', $screen)
    log.debug('$listLink', $listLink);

    function giveFeedback(isCorrect, feedback) {
        log.trace();
        $card.addClass(isCorrect ? 'correct' : 'incorrect');
        $card.html(feedback)
        $response.val('')
    };

    function processReinforcement(evt) {
        log.trace();
        evt.preventDefault()
        if (activeCard.isValidResponse($response.val())) {
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
        activeCard.evaluateResponse($response.val(), function (isCorrect, feedback) {
            giveFeedback(isCorrect, feedback)
            $response.parent()[0].removeEventListener('submit', processFirstResponse);
            $response.parent()[0].addEventListener('submit', processReinforcement);
        })
    };

    function showNextCard() {
        log.trace();
        app.activeDeck.getRandomCard(function (card) {
            activeCard = card
            $card.html(card.front)
            $response.parent('form')[0].addEventListener('submit', processFirstResponse)
            $response.focus()
        })
    }

    function ondisplay() {
        log.trace(arguments);
        activeCard || showNextCard()
    }

    return {
        ondisplay: ondisplay
    };
}
