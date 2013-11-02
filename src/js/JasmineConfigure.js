(function (jasmine, window) {
    jasmine.GlobalDate = window.Date;
    jasmine.configure = function () {
        var spec = jasmine.getEnv().currentSpec;

        // Setup sandbox
        var fixtures = jasmine.getFixtures();
        fixtures.set(fixtures.sandbox());

        // Element leak detection
        spec.after(function () {
            var leaks = $('body').children(':not(#HTMLReporter)');
            expect(leaks).not.toExist();
            leaks.remove();
        });

        // Heap logging
        // Note: only works with Chrome started with --enable-memory-info --js-flags="--expose-gc"
        if (window.performance) {
            if (window.gc) { window.gc(); }
            spec.heapSizeBefore = window.performance.memory.usedJSHeapSize;
            spec.after(function () {
                if(window.gc) { window.gc(); }
                spec.heapSizeAfter = window.performance.memory.usedJSHeapSize;
                console.log(spec.heapSizeAfter - spec.heapSizeBefore, spec.getFullName());
            });
        }

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