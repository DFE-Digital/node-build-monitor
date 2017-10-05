require.config({
    paths: {
        io: '/socket.io/socket.io',
        ko: 'libs/knockout-3.2.0',
        moment: 'libs/moment.min',
        countdown: 'libs/countdown.min',
        cookies: 'libs/cookies.min'
    }
});

define(['ko', 'knockoutExtensions', 'BuildMonitorServer', 'AppViewModel'], function (ko, knockoutExtensions, BuildMonitorServer, AppViewModel) {
    knockoutExtensions.register();

    var app = new AppViewModel();

    $(window).focus(function(e) {
        app.setHasUnreadBuilds(false);
    });

    $(window).mousemove(function(e) {
        app.setHasUnreadBuilds(false);
    });

    $(function() {
        ko.applyBindings(app);

        var buildMonitorServer = new BuildMonitorServer();

        buildMonitorServer.onConnected = function() {
            app.setIsConnected(true);
        };

        buildMonitorServer.onDisconnected = function() {
            app.setIsConnected(false);
        };

        buildMonitorServer.onBuildsLoaded = function (builds) {
            app.loadBuilds(builds);
            app.setIsLoading(false);
        };

        buildMonitorServer.onBuildsChanged = function (changes) {
            app.updateCurrentBuildsWithChanges(changes);
            app.setIsLoading(false);
        };

        buildMonitorServer.onVersionChanged = function () {
            window.location.reload(true);
        };

        buildMonitorServer.onSettingsLoaded = function (settings) {
            app.version(settings.version);
        };

        buildMonitorServer.connect();

        setInterval(app.updateBuildTimes, 1000);
    });
});




bubbly({
  colorStart: "#949094", // default is blue-ish
  colorStop: "#444244",// default is blue-ish
  compose: "lighter", // default is "lighter"
  shadowColor: "#cfc9cf", // default is #fff,
  bubbles: 30
});
