(function (jasmine, window) {
    jasmine.GlobalDate = window.Date;
    jasmine.configure = function () {
        var spec = jasmine.getEnv().currentSpec;

        // Setup sandbox
        var fixtures = jasmine.getFixtures();
        fixtures.set(fixtures.sandbox());

        // Mock time
        jasmine.Clock.useMock();
        jasmine.Clock.reset();
        var MockDate = function () {
            var now = jasmine.Clock.defaultFakeTimer.nowMillis;
            return new jasmine.GlobalDate(now);
        };
        MockDate.prototype = jasmine.GlobalDate.prototype;
        window.Date = MockDate;
        spec.after(function () {
            window.Date = jasmine.GlobalDate;
        });

        // Custom matcher
        spec.addMatchers({
            toHaveControlOfType: function (expected) {
                var actual = this.actual.controls(expected);
                return actual.length > 0;
            }
        });

    };
})(jasmine, window);