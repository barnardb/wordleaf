function Card(deck, data) {
    log.trace(arguments);

    var front = data.front,
        back = data.back;

    function getExpectedResponse() {
        return back.split('\n')[0].replace(/\<[^>]+\>/g, ' ').replace(/\s+/g, ' ').trim();
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
            prompt: front,
            response: response,
            expected: getExpectedResponse(),
            interpretation: isCorrect
        })
        save()
        callback(isCorrect, back)
    }

    function save() {
        deck.database.getTransactionalStore('Cards', true).put(data);
    }

    data.deck = deck.id

    return {
        back: back,
        front: front,
        evaluateResponse: evaluateResponse,
        isValidResponse: isValidResponse,
        save: save
    };
}
