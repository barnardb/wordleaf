var log = (function () {

    function getLineSignatureWebKit(depth) {
        try { throw Error('') } catch(err) {
            var caller_line = err.stack.split("\n")[3+depth];
            var fields = /\s+at (.+) \((.+):(\d+)\)/.exec(caller_line);
            return fields[2] + ' ' + fields[1];
        }
    }

    function getLineSignatureGecko(depth) {
        try { throw Error('') } catch(err) {
            var caller_line = err.stack.split("\n")[1+depth];
            var fields = /(.*)\((.*)\)@(.+)/.exec(caller_line);
            return fields[3] + ' ' + fields[1];
        }
    }

    var getLineSignature = navigator.userAgent.indexOf('WebKit') >= 0 ? getLineSignatureWebKit : getLineSignatureGecko;

    function debug() {
        console.debug.apply(console, ['DEBUG ' + getLineSignature(1)].concat(Array.prototype.slice.call(arguments)));
    }

    function debugEquality(rhsRep, rhs, lhsRep, lhs) {
        debug('(' + rhsRep + ' == ' + lhsRep + ') → (' + inspect(rhs) + ' == ' + lhs + ') → ' + (rhs == lhs));
    }

    function trace() {
        console.debug('TRACE ' + getLineSignature(1));
    }

    return {
        debug: debug,
        debugEquality: debugEquality,
        trace: trace
    };
})();
