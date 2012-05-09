function Card(deck, data) {
    log.trace(arguments);

    function isValidResponse(response) {
        return _.include(utils.array(data.backExpected), response.trim());
    }

    function calculateNewDelay(now, isCorrect) {
        var lastSeen = data.lastAnswered || data.created,
            actualDelay = now - lastSeen,
            normalisedDelay = Math.sqrt(actualDelay / data.scheduledDelay) * data.scheduledDelay;

        log.debug('lastSeen', lastSeen);
        log.debug('timeUtils.formatDuration(data.scheduledDelay)', timeUtils.formatDuration(data.scheduledDelay));
        log.debug('timeUtils.formatDuration(actualDelay)', timeUtils.formatDuration(actualDelay));
        log.debug('timeUtils.formatDuration(normalisedDelay)', timeUtils.formatDuration(normalisedDelay));

        if(isCorrect) {
            return 2 * normalisedDelay;
        } else {
            return Math.min(normalisedDelay / 2, data.scheduledDelay);
        }
    }

    function evaluateResponse(response, callback) {
        log.trace();
        var now = Date.now();
        var isCorrect = isValidResponse(response);
        (data.responses || (data.responses = [])).push({
            time: now,
            prompt: data.front,
            response: response,
            expected: data.backExpected,
            interpretation: isCorrect
        })

        var oldDelay = data.scheduledDelay;
        data.scheduledDelay = Math.max(calculateNewDelay(now, isCorrect), 30 * 1000);
        log.info('Delay scaled by a factor of ' + (data.scheduledDelay / oldDelay) + ' from ' + timeUtils.formatDuration(oldDelay) + ' to ' + timeUtils.formatDuration(data.scheduledDelay));

        data.lastAnswered = now;
        data.nextScheduledFor = now + data.scheduledDelay;

        save()
        callback(isCorrect, data.back)
    }

    function save() {
        log.trace(arguments);
        log.debug('data', data);
        idbUtils.perform(deck.database.getTransactionalStore('Cards', true).put(data), function(id) {
            data.id = id;
        });
    }

    data.deck = deck.id;
    data.frontExpected = utils.deArray(data.frontExpected);
    data.backExpected = utils.deArray(data.backExpected);
    if(!data.created) {
        data.created = Date.now();
        data.scheduledDelay = 60 * 60 * 1000;
        data.nextScheduledFor = data.created + data.scheduledDelay;
    }

    return {
        get back() { return data.back },
        get backExpected() { return data.backExpected },
        get created() { return data.created },
        get data() { return data },
        get front() { return data.front },
        get frontExpected() { return data.frontExpected },
        get nextScheduledFor() { return data.nextScheduledFor },
        evaluateResponse: evaluateResponse,
        isValidResponse: isValidResponse,
        save: save
    };
}
