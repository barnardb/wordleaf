function uiList($scope, name) {
    log.trace(arguments)

    var $classified = $scope.find('.' + name),
        $count = $classified.filter('.count'),
        $list = $classified.filter('.list'),
        $template = $list.children('.template'),
        count;

    log.debug('$classified', $classified);
    log.debug('$count', $count);
    log.debug('$list', $list);
    log.debug('$template', $template);

    function addToList(item) {
        $node = $template.clone().removeClass('template')
        _.each($node.children(), function (field) { $(field).html(item[field.className]) })
        $node.insertBefore($template)
        count += 1
    }

    function update(iterator) {
        log.trace(arguments)
        $list.children().not($template).remove()
        count = 0;
        $count.text('…')
        iterator(addToList)
        $count.text(count);
    }

    return {
        update: update
    };
}
