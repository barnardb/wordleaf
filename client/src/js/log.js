var log = (function () {

    function getLineSignatureWebKit(depth) {
        try { throw Error('') } catch(err) {
            var caller_line = err.stack.split("\n")[3+depth];
            var fields = /\s+at (?:(.+) \()?(.+):(\d+)\)?/.exec(caller_line);
            return fields[2] + ' ' + (fields[1] || '(anon)');
        }
    }

    function getLineSignatureGecko(depth) {
        try { throw Error('') } catch(err) {
            var caller_line = err.stack.split("\n")[1+depth];
            var fields = /([^()]*)(?:\(([^)]*)\))?@(.+)/.exec(caller_line);
            return fields[3] + ' ' + (fields[1] || '(anon)');
        }
    }

    var getLineSignature = navigator.userAgent.indexOf('WebKit') >= 0 ? getLineSignatureWebKit : getLineSignatureGecko;

    function error() {
        console.error.apply(console, ['ERROR ' + getLineSignature(1)].concat(Array.prototype.slice.call(arguments)));
    }

    function warn() {
        console.warn.apply(console, ['WARN ' + getLineSignature(1)].concat(Array.prototype.slice.call(arguments)));
    }

    function info() {
        console.info.apply(console, ['INFO ' + getLineSignature(1)].concat(Array.prototype.slice.call(arguments)));
    }

    function debug() {
        console.debug.apply(console, ['DEBUG ' + getLineSignature(1)].concat(Array.prototype.slice.call(arguments)));
    }

    function debugEquality(rhsRep, rhs, lhsRep, lhs) {
        debug('(' + rhsRep + ' == ' + lhsRep + ') → (' + JSON.stringify(rhs) + ' == ' + JSON.stringify(lhs) + ') → ' + (rhs == lhs));
    }

    function trace(callerArguments) {
        var lineItems = ['TRACE ' + getLineSignature(1)]
        callerArguments && (lineItems = lineItems.concat(Array.prototype.slice.call(callerArguments)))
        console.debug.apply(console, lineItems)
    }

    var levels = [error, warn, info, debug, trace];
    function nullLogger() {}

    return {
        error: error,
        warn: warn,
        info: info,
        debug: debug,
        debugEquality: debugEquality,
        trace: trace,
        set level(level) {
            var enabled = true;
            levels.forEach(function (l) {
                log[l.name] = enabled ? l : nullLogger;
                enabled && (enabled = l.name != level.toLowerCase());
            });
        }
    };
})();
