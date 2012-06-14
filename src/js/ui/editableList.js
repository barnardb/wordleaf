function uiEditableList($elements, emptyHtml, events) {
    log.trace(arguments);

    var values;

    function getElementThatWillReceiveTheFocus(callback) {
        setTimeout(function () {
            callback(document.activeElement);
        }, 0);
    }

    function consumeNextIfMissingContent(evt) {
        log.trace(arguments);
        var $target = $(evt.target);
        if (!$target.val().trim()) {
            var $next = $target.next();
            getElementThatWillReceiveTheFocus(function (focused) {
                var shouldStealFocus = focused === $next[0];
                $target.val($next.val());
                $elements = $elements.not($next);
                $next.remove();
                shouldStealFocus && $target.focus().select();
            }, 0);
        }
    }

    function handleInput(evt) {
        log.trace(arguments);
        var $target = $(evt.target),
            index = _.indexOf($elements, evt.target),
            oldValue = values[index],
            value = $target.val().trim();

        values[index] = value;
        considerAddingOrRemoveEmptyNextElement($target, value);
        events.input(value, oldValue, index);
    }

    function considerAddingOrRemoveEmptyNextElement($target, value) {
        log.trace(arguments);
        var $next = $target.next();
        if (!value) {
            if ($next.length && !$next.val()) {
                $elements = $elements.not($next);
                $next.remove();
            }
        } else {
            if(!$next.length) {
                $next = $(emptyHtml);
                $next.on('input', handleInput);
                $next.on('change', consumeNextIfMissingContent);
                $elements = $elements.add($next);
                $target.after($next);
            };
        }
    }

    values = _.compact(_.map($elements, function (e) { return e.value.trim() }));

    $elements.on('input', handleInput);
    $elements.on('change', consumeNextIfMissingContent);

    return {
        get values() {
            return _.compact(_.map($elements, function (e) { return e.value.trim() }));
        },
        get firstElement() {
            return $elements[0];
        }
    };
}
