function addScreen($screen) {
    log.trace(arguments)

    var $form = $screen.find('form'),
        $feedback = $screen.find('.feedback'),
        $cardFaces,
        $inputs,
        $front,
        $frontAcceptable,
        $back,
        $backAcceptable;

    log.debug('$inputs', $inputs);
    log.debug('$front', $front);
    log.debug('$back', $back);
    log.debug('$form', $form);

    function extractAcceptableResponse(html) {
        return htmlUtils.extractText(html.split('\n')[0]);
    }

    function updateAcceptableAnswers(evt) {
        log.trace(arguments)

        var $face = $(this),
            $acceptable = $face.closest('.side').find('.acceptableInput');

        log.debug('$face', $face);
        log.debug('$acceptable', $acceptable);

        var calculatedAcceptable = extractAcceptableResponse($face.val());
        $acceptable.val(calculatedAcceptable);
    }

    function considerNewCardRequest(evt) {
        log.trace(arguments)
        evt.preventDefault()
        firstBlankInput = _.find($inputs, function (i) { return !i.value })
        if (firstBlankInput) {
            $(firstBlankInput).focus()
            return
        }
        var card = new Card(app.activeDeck, {
            front: $front.val(),
            frontExpected: $frontAcceptable.val(),
            back: $back.val(),
            backExpected: $backAcceptable.val()
        })
        card.save();
        $feedback.text('Created ' + card.front);
        $inputs.val('');
        $inputs.first().focus();
    };

    function ondisplay() {
        log.trace(arguments);
        $feedback.text('');

        $form.html(app.activeDeck.cardEditTemplate());

        $cardFaces = $screen.find('.side textarea', $screen);
        $inputs = $screen.find('input').add($cardFaces);
        $front = $cardFaces.filter('#front');
        $frontAcceptable = $inputs.filter('#frontAcceptableInput');
        $back = $cardFaces.filter('#back');
        $backAcceptable = $inputs.filter('#backAcceptableInput');

        $cardFaces.on('input', updateAcceptableAnswers)
    }

    $form.submit(considerNewCardRequest);

    return {
        ondisplay: ondisplay
    };
}
