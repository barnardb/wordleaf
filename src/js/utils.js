var utils = {
    array: function (arrayOrValue) {
        return _.isUndefined(arrayOrValue) ? [] : _.isArray(arrayOrValue) ? arrayOrValue : [arrayOrValue];
    },

    deArray: function (potentialArray) {
        return !_.isArray(potentialArray) || potentialArray.length > 1 ? potentialArray : potentialArray.length ? potentialArray[0] : undefined;
    }
};
