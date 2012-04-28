function listScreen($screen) {
    log.trace(arguments)

    var $addLink = $screen.find('a.add'),
        $wordCount = $screen.find('.wordCount');
        $template = $screen.find('.listedword.template');

    log.debug('$addLink', $addLink);
    log.debug('$template', $template);

    function addCardToList(card) {
        log.trace(arguments)
        $node = $template.clone().removeClass('template')
        _.each($node.children(), function (field) { $(field).text(card[field.className]) })
        $node.insertBefore($template)
    }

    function updateList() {
        log.trace();
        $screen.find('.listedword').not($template).remove()
        deck.getSize(function (size) {
            $wordCount.text(size)
        })
        deck.forEachCard(addCardToList)
    }

    return {
        ondisplay: updateList
    };
}
