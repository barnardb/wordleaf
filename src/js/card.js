function Card(deck, data) {
    log.trace(arguments);

    function getExpectedResponse() {
        return data.back.split('\n')[0].replace(/\<[^>]+\>/g, ' ').replace(/\s+/g, ' ').trim();
    }

    function isValidResponse(response) {
        log.debugEquality('response.trim()', response.trim(), 'getExpectedResponse()', getExpectedResponse());
        return response.trim() == getExpectedResponse();
    }

    function evaluateResponse(response, callback) {
        log.trace();
        var isCorrect = isValidResponse(response);
        (data.responses || (data.responses = [])).push({
            time: new Date().getTime(),
            prompt: data.front,
            response: response,
            expected: getExpectedResponse(),
            interpretation: isCorrect
        })
        save()
        callback(isCorrect, data.back)
    }

    function save() {
        deck.database.getTransactionalStore('Cards', true).put(data);
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
