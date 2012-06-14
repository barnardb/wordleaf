function createApp() {
    var screenNames = ['top', 'drill', 'deck', 'edit', 'import', 'export'],
        screens,
        activeUser,
        activeDeck,
        $screens = $('.screen');

    var screens = {};

    function displayScreen(name) {
        log.trace(arguments);
        var $screen = $screens.filter('.' + name)
        $screen.show().find('input:first, textarea:first').focus()
        $screens.not($screen).hide()
        var screen = screens[name];
        screen.ondisplay && screen.ondisplay.apply(screen, Array.prototype.slice.call(arguments, 1));
    }

    function initialiseScreen(name) {
        var $screen = $screens.filter('.' + name);
        var screen = eval(name + 'Screen($screen)');
        _.each($screen.find('nav a'), function (link) {
            log.debug('mapping click on', link, 'to display screen', link.className);
            $(link).click(function () {
                displayScreen(link.className);
            })
        })
        screens[name] = screen;
    }

    log.level = 'INFO';
    screenNames.forEach(initialiseScreen);
    openUserDatabase('dev', function (user) {
        activeUser = user;
        app.displayScreen(screenNames[0])
    });

    return {
        displayScreen: displayScreen,
        get activeDeck() { return activeDeck },
        set activeDeck(deck) { activeDeck = deck },
        get activeUser() { return activeUser }
    };
}
