function drillScreen ($screen) {
    var $card = $screen.find('.flashcard'),
        $response = $screen.find('.response'),
        $editLink = $screen.find('a.edit'),
        activeCard;

    log.debug('$screen', $screen)

    function giveFeedback(isCorrect, feedback) {
        $card.addClass(isCorrect ? 'correct' : 'incorrect');
        $card.html(feedback)
        $response.val('')
    };

    function processReinforcement(evt) {
        evt.preventDefault();
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
        log.trace(evt);
        evt.preventDefault()
        activeCard.evaluateResponse($response.val(), function (isCorrect, feedback) {
            giveFeedback(isCorrect, feedback)
            $response.parent()[0].removeEventListener('submit', processFirstResponse);
            $response.parent()[0].addEventListener('submit', processReinforcement);
        })
    };

    function showNextCard() {
        log.trace(arguments);
        log.debug('app.activeDeck', app.activeDeck)
        app.activeDeck.getNextCard(function (card) {
            activeCard = card
            if(!card) {
                app.displayScreen('deck');
                return;
            }
            $card.html(card.front)
            $response.parent('form')[0].addEventListener('submit', processFirstResponse)
            $response.focus()
        })
    }

    function ondisplay() {
        log.trace(arguments);
        if(activeCard) {
            if($card.hasClass('correct') || $card.hasClass('incorrect'))
                $card.html(activeCard.back);
            else
                $card.html(activeCard.front);
        } else {
            showNextCard()
        }
    }

    $editLink.click(function () { app.displayScreen('edit', activeCard) });

    return {
        ondisplay: ondisplay
    };
}
