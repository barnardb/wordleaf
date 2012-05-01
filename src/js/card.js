function Card(deck, data) {
    log.trace(arguments);

    function isValidResponse(response) {
        log.debugEquality('response.trim()', response.trim(), 'data.backExpected', data.backExpected)
        return response.trim() == data.backExpected
    }

    function evaluateResponse(response, callback) {
        log.trace();
        var isCorrect = isValidResponse(response);
        (data.responses || (data.responses = [])).push({
            time: new Date().getTime(),
            prompt: data.front,
            response: response,
            expected: data.backExpected,
            interpretation: isCorrect
        })
        save()
        callback(isCorrect, data.back)
    }

    function save() {
        idbUtils.perform(deck.database.getTransactionalStore('Cards', true).put(data), function(id) {
            data.id = id;
        });
    }

    data.deck = deck.id

    return {
        get back() { return data.back },
        get front() { return data.front },
        evaluateResponse: evaluateResponse,
        isValidResponse: isValidResponse,
        save: save
    };
}
