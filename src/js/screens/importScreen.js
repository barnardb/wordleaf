function importScreen($screen) {
    log.trace(arguments);

    var $importButton = $screen.find('button.import'),
        $importData = $screen.find('#importData');

    log.debug('$importButton', $importButton);
    log.debug('$importData', $importData);

    function importData() {
        $importData.val().split('\n').forEach(function (line) {
            line = line.trim()
            if(!line)
                return;
            var fields = line.split('\t');
            if(fields.length != 2) {
                log.error("Expected 2 fields but got", fields.length, "from line", line, fields);
                return;
            }
            new Card(app.activeDeck, {
                front: fields[0].trim(),
                frontExpected: htmlUtils.extractText(fields[0]),
                back: fields[1].trim(),
                backExpected: htmlUtils.extractText(fields[1]),
                nextScheduledFor: Time.now()
            }).save()
        })
        app.displayScreen('deck');
    }

    $importButton.click(importData);

    return {}
}
