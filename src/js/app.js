function createApp() {
    var screenNames = ['top', 'flash', 'list', 'add'],
        screens,
        currentUser,
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

    function activateDeck(name, callback) {
        log.trace(arguments)
        currentUser.openDeck('Cards', function (deck) {
            callback(activeDeck = deck)
        })
    }

    screenNames.forEach(initialiseScreen);
    openUserDatabase('dev', function (user) {
        currentUser = user;
        app.displayScreen(screenNames[0])
    });

    return {
        displayScreen: displayScreen,
        activateDeck: activateDeck,
        get currentUser() { return currentUser },
        get activeDeck() { return activeDeck }
    };
}
