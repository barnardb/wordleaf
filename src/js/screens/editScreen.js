function editScreen($screen) {
    log.trace(arguments)

    var $form = $screen.find('form'),
        $feedback = $screen.find('.feedback'),
        $deleteButton = $screen.find('button.delete'),
        $front,
        $back,
        activeCard,
        frontAcceptableList,
        backAcceptableList;

    function extractAcceptableResponse(html) {
        return htmlUtils.extractText(html.split('\n')[0]).replace(/\([^()]*\)/g, ' ').replace(/\s+/g, ' ').trim();
    }

    function updateAcceptableAnswers(evt) {
        log.trace(arguments)

        var $face = $(this),
            $acceptable = $face.closest('.side').find('.acceptableInput:first');

        log.debug('$face', $face);
        log.debug('$acceptable', $acceptable);

        var calculatedAcceptable = extractAcceptableResponse($face.val());
        $acceptable.val(calculatedAcceptable);
        $acceptable.trigger('input');
    }

    function considerNewCardRequest(evt) {
        log.trace(arguments);
        evt.preventDefault();
        var $inputs = $screen.find('textarea')
                .add(frontAcceptableList.significantInputs)
                .add(backAcceptableList.significantInputs),
            firstBlankInput = _.find($inputs, function (i) { return !i.value })
        if (firstBlankInput) {
            $(firstBlankInput).focus()
            return
        }
        var data = {
            front: $front.val(),
            frontExpected: frontAcceptableList.values,
            back: $back.val(),
            backExpected: backAcceptableList.values
        };
        console.debug('data', data);
        if (activeCard.created) {
            _.extend(activeCard.data, data);
            activeCard.save();
            app.displayScreen('flash');
        } else {
            activeCard = new Card(app.activeDeck, data);
            activeCard.save();
            ondisplay();
        }
    };

    function ondisplay(card) {
        log.trace(arguments);
        $feedback.text('');

        activeCard = card || {};
        log.debug('activeCard', activeCard);
        $form.html(app.activeDeck.cardEditTemplate(activeCard));
        card ? $deleteButton.show() : $deleteButton.hide();

        $front = $form.find('#front');
        $back = $form.find('#back');
        $front.add($back).on('input', updateAcceptableAnswers);

        frontAcceptableList = uiEditableList($screen.find('.front .acceptableInput'), '<input type="text" class="acceptableInput"/>');
        backAcceptableList = uiEditableList($screen.find('.back .acceptableInput'), '<input type="text" class="acceptableInput"/>');
    }

    function deleteCard() {
        log.trace(arguments);
        log.debug('deleting', activeCard);
        activeCard.remove(function () {
            app.displayScreen('flash');
        });
    };

    $form.submit(considerNewCardRequest);
    $deleteButton.click(deleteCard);

    return {
        ondisplay: ondisplay
    };
}
