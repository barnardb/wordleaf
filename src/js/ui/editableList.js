function uiEditableList($elements, emptyHtml) {
    log.trace(arguments)

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

    function considerAddingOrRemoveEmptyNextElement(evt) {
        log.trace(arguments);
        var $target = $(evt.target);
        var $next = $target.next();
        if (!$target.val().trim()) {
            if ($next.length && !$next.val()) {
                $elements = $elements.not($next);
                $next.remove();
            }
        } else {
            if(!$next.length) {
                $next = $('<input type="text" class="acceptableInput"/>');
                $next.on('input', considerAddingOrRemoveEmptyNextElement);
                $next.on('change', consumeNextIfMissingContent);
                $elements = $elements.add($next);
                $target.after($next);
            };
        }
    }

    $elements.on('input', considerAddingOrRemoveEmptyNextElement);
    $elements.on('change', consumeNextIfMissingContent);

    return {
        get values() {
            return _.compact(_.map($elements, function (e) { return e.value.trim() }));
        }
    };
}
