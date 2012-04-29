function uiList($scope, name, template) {
    log.trace(arguments)

    var $classified = $scope.find('.' + name),
        $count = $classified.filter('.count'),
        $list = $classified.filter('.list'),
        count;

    log.debug('$classified', $classified);
    log.debug('$count', $count);
    log.debug('$list', $list);

    function addToList(item) {
        $list.append(template(item))
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
