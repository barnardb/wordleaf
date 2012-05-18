function uiList($scope, name, template, events) {
    log.trace(arguments)

    var $classified = $scope.find('.' + name),
        $count = $classified.filter('.count'),
        $list = $classified.filter('.list'),
        count;

    log.debug('$classified', $classified);
    log.debug('$count', $count);
    log.debug('$list', $list);

    function addToList(item) {
        log.trace(arguments);
        $node = $(template(item));
        events && _.each(events, function(handler, name) {
            $node[name](function() { handler(item) });
        });
        $list.append($node);
        count += 1;
    }

    function update(iterator) {
        log.trace(arguments)
        $list.hide();
        $list.children().remove()
        count = 0
        iterator(addToList, function () {
            $count.text(count);
            $list.show();
        });
    }

    return {
        update: update
    };
}
