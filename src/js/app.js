var app = (function app() {
    var screenNames = ['main', 'list', 'add'],
        screens,
        $screens = $('.screen');

    var screens = {};

    function displayScreen(name) {
        log.trace()
        var $screen = $screens.filter('.' + name)
        $screen.show().find('input:first').focus()
        $screens.not($screen).hide()
        var screen = screens[name];
        screen.ondisplay && screen.ondisplay();
    }

    function initialiseScreen(name) {
        var $screen = $screens.filter('.' + name);
        var screen = eval(name + 'Screen($screen)');
        _.each($screen.find('a'), function (link) {
            log.debug('mapping click on', link, 'to display screen', link.className);
            $(link).click(function () {
                displayScreen(link.className);
            })
        })
        screens[name] = screen;
    }

    screenNames.forEach(initialiseScreen);

    return {
        displayScreen: displayScreen
    };
})()
