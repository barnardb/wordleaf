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
        $node = $(template(item))
        events && _.each(events, function(handler, name) {
            $node[name](function() { handler(item) });
        })
        $list.append($node)
        $count.text(count += 1);
    }

    function update(iterator) {
        log.trace(arguments)
        $list.children().remove()
        $count.text(count = 0)
        iterator(addToList)
    }

    return {
        update: update
    };
}
