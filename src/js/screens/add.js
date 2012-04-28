function addScreen($screen) {
    log.trace(arguments)

    var $inputs = $screen.find('input');
        $front = $inputs.filter('#front'),
        $back = $inputs.filter('#back'),
        $addForm = $back.parent('form'),
        $doneLink = $screen.find('.done');

    log.debug('$inputs', $inputs);
    log.debug('$front', $front);
    log.debug('$back', $back);
    log.debug('$addForm', $addForm);

    function considerNewCardRequest(evt) {
        log.trace(arguments)
        evt.preventDefault()
        firstBlankInput = _.find($inputs, function (i) { return !i.value })
        if (firstBlankInput) {
            $(firstBlankInput).focus()
            return
        }
        deck.save(createCard($front.val(), $back.val()));
        $inputs.val('');
        $inputs.first().focus();
    };

    $addForm.submit(considerNewCardRequest);

    return {
        navigation: {
            main: $doneLink
        }
    };
}
