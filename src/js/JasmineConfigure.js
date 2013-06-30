(function (jasmine) {
    jasmine.configure = function () {

        // Setup sandbox
        var fixtures = jasmine.getFixtures();
        fixtures.set(fixtures.sandbox());

        // Mock time
        jasmine.Clock.useMock();

    };
})(jasmine);