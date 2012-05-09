var timeUtils = {
    formatDuration: function (duration) {
        var seconds = Math.round(duration / 1000);
        var minutes = ~~(seconds / 60);
        duration = seconds - 60 * minutes + 's';
        if(!minutes)
            return duration;
        var hours = ~~(minutes / 60);
        duration = minutes - 60 * hours + 'm ' + duration;
        if(!hours)
            return duration;
        var days = ~~(hours / 24);
        duration = hours - 24 * days + 'h ' + duration;
        if(!days)
            return duration;
        var weeks = ~~(days / 7);
        duration = days - 7 * weeks + 'd ' + duration;
        if(!weeks)
            return duration;
        duration = weeks + 'w ' + duration;
        return duration;
    }
}
