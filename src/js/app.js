function createApp() {
    var screenNames = ['flash', 'list', 'add'],
        screens,
        activeDeck,
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
    openUserDatabase('dev', function (user) {
        log.debug('user database is open')
        user.openDeck('Cards', function (deck) {
            log.debug('deck is open')
            activeDeck = deck
            app.displayScreen(screenNames[0])
        })
    });

    return {
        displayScreen: displayScreen,
        get activeDeck() { return activeDeck }
    };
}
