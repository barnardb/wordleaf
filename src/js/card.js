function Card(deck, data) {
    log.trace(arguments);

    function isValidResponse(response) {
        log.debugEquality('response.trim()', response.trim(), 'data.backExpected', data.backExpected)
        return response.trim() == data.backExpected
    }

    function calculateNewDelay(now, isCorrect) {
        var lastSeen = data.lastAnswered || data.created,
            normalisedDelay = Math.sqrt(now - lastSeen / data.scheduledDelay);

        log.debug('lastSeen', lastSeen);
        log.debug('now - lastSeen', now - lastSeen);
        log.debug('data.scheduledDelay', data.scheduledDelay);
        log.debug('normalisedDelay', normalisedDelay);

        if(isCorrect) {
            return data.scheduledDelay + normalisedDelay;
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

        data.scheduledDelay = Math.max(calculateNewDelay(now, isCorrect), 30 * 1000);
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
    if(!data.created) {
        data.created = Date.now();
        data.scheduledDelay = 2 * 60 * 1000;
        data.nextScheduledFor = data.created + data.scheduledDelay;
    }
    console.debug('data.nextScheduledFor', data.nextScheduledFor);

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
