function createCard(data) {
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
        var isCorrect = isValidResponse(response)
        data.responses || (data.responses = [])
        data.responses.push({
        //(data.responses || (data.responses = [])).push({
            time: new Date().getTime(),
            prompt: front,
            response: response,
            expected: getExpectedResponse(),
            interpretation: isCorrect
        })
        deck.save(data)
        callback(isCorrect, back)
    }

    return {
        front: front,
        back: back,
        evaluateResponse: evaluateResponse,
        isValidResponse: isValidResponse,
    };
}
