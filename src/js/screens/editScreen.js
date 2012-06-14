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
        return html ? htmlUtils.extractText(html.split('\n')[0]).replace(/\([^()]*\)/g, ' ').replace(/\s+/g, ' ').trim() : undefined;
    }

    function displayUpdater($display) {
        return function updateDisplay(newValue, oldValue, index) {
            log.trace(arguments);

            log.debug('$display', $display);

            var oldDisplay = $display.val(),
                alternatives = oldDisplay.split(' / ');

            log.debug('alternatives', alternatives);

            if (oldValue) {
                if (newValue) {
                    if(extractAcceptableResponse(alternatives[index]) == oldValue)
                        alternatives[index] = alternatives[index].replace(oldValue, newValue);
                } else {
                    alternatives.splice(index, 1);
                }
            } else {
                alternatives.splice(index, alternatives[index] ? 0 : 1, newValue);
            }

            var newDisplay = alternatives.join(' / ');
            newDisplay == oldDisplay || $display.val(newDisplay);
        }
    }

    function considerNewCardRequest(evt) {
        log.trace(arguments);
        evt.preventDefault();
        var $inputs = $screen.find('textarea')
                .add(frontAcceptableList.firstElement)
                .add(backAcceptableList.firstElement),
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
            app.displayScreen('drill');
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

        function acceptableList(side) {
            var $side = $screen.find('.side.' + side);
            return uiEditableList(
                    $side.find('.acceptableInput'),
                    '<input type="text" class="acceptableInput"/>',
                    { input: displayUpdater($side.find('.display textarea')) });
        }
        frontAcceptableList = acceptableList('front');
        backAcceptableList = acceptableList('back');

        $screen.find('#frontAcceptableInput').focus();
    }

    function deleteCard() {
        log.trace(arguments);
        log.debug('deleting', activeCard);
        activeCard.remove(function () {
            app.displayScreen('deck');
        });
    };

    $form.submit(considerNewCardRequest);
    $deleteButton.click(deleteCard);

    return {
        ondisplay: ondisplay
    };
}
