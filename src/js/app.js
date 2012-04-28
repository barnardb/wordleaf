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
        if(screen.navigation) {
            log.debug('processing navigation for', name);
            log.debug('screen.navigation', screen.navigation);
            for(var navigableScreen in screen.navigation) {
                log.debug('mapping click on', screen.navigation[navigableScreen], 'to display screen', navigableScreen);
                screen.navigation[navigableScreen].click(function () {
                    displayScreen(navigableScreen);
                })
            }
        }
        screens[name] = screen;
    }

    screenNames.forEach(initialiseScreen);

    return {
        displayScreen: displayScreen
    };
})()
