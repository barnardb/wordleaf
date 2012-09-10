function importScreen($screen) {
    log.trace(arguments);

    var $importButton = $screen.find('button.import'),
        $importData = $screen.find('#importData'),
        $feedback = $screen.find('.feedback');

    log.debug('$importButton', $importButton);
    log.debug('$importData', $importData);

    function convertToCardDataObjects(text) {
        try {
            return JSON.parse(text).cards;
        } catch (e) {
            return parseLineData(text);
        }
    };

    function importData() {
        log.trace(arguments);
        try {
            var cardDataList = convertToCardDataObjects($importData.val());
            importCardData(cardDataList);
        } catch (e) {
            $feedback.text(_.map(e, function (item) {
                return 'Error for card at position ' + (item.key + 1) + ': ' + item.error;
            }).join('\n'));
            return;
        }
        app.displayScreen('deck');
    }

    function importCardData(cardDataList) {
        var cards = mapWithCollectiveErrors(cardDataList, function(cardData) {
            return new Card(app.activeDeck, cardData);
        });
        _.invoke(cards, 'save');
    }

    function mapWithCollectiveErrors(obj, func) {
        var errors = [];
        var results = _.map(obj, function (val, key) {
            try {
                return func.apply(this, arguments);
            } catch(e) {
                errors.push({
                    key: key,
                    error: e
                });
            }
        });
        if (errors.length)
            throw errors;
        return results;
    }

    function parseLineData(data) {
        function extractExpected(field) {
            var expected = _.invoke(htmlUtils.extractText(field).split('/'), 'trim');
            if (!expected)
                throw 'Expected field to contain at least one extractable expected response';
            return expected;
        };
        return mapWithCollectiveErrors(_.compact(_.invoke(data.split('\n'), 'trim')), function (line) {
            var fields = line.split('\t');
            if (fields.length != 2) {
                throw 'Expected 2 tab-separated fields but got ' + fields.length + ' from line ' + line + ': ' + fields;
            }
            return {
                front: fields[0].trim(),
                frontExpected: extractExpected(fields[0]),
                back: fields[1].trim(),
                backExpected: extractExpected(fields[1]),
                nextScheduledFor: Date.now()
            };
        });
    }

    $importButton.click(importData);

    return {}
}
