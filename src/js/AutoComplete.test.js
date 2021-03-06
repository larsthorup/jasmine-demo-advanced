describe('AutoComplete', function () {
    var autoComplete;

    beforeEach(function () {
        jasmine.configure();
        $('<input id="name" />').appendTo('#sandbox');
    });

    describe('when constructed with an explicit list', function () {

        beforeEach(function () {
            autoComplete = new AutoComplete('#name', {
                list: ['lars', 'matt', 'mike', 'nick', 'kin'],
                hideDelay: 500
            });
        });

        it('should associate the control with the element', function () {
            expect($('#name').controls(AutoComplete)[0] instanceof window.AutoComplete).toBeTruthy();
            expect($('#name')).toHaveControlOfType(window.AutoComplete);
            expect($('#name')).not.toHaveControlOfType(window.BlogPost);
        });

        it('should add class auto-complete', function () {
            expect($('#name')).toHaveClass('auto-complete');
        });

        describe('getMatch', function () {
            var match;

            describe('when called with an empty string', function () {
                beforeEach(function () {
                    match = autoComplete.getMatch('');
                });
                it('should return null', function () {
                    expect(match).toBeNull();
                });
            });

            describe('when called with a non-unique prefix', function () {
                beforeEach(function () {
                    match = autoComplete.getMatch('m');
                });
                it('should return null', function () {
                    expect(match).toBeNull();
                });
            });

            describe('when called with a unique prefix', function () {
                beforeEach(function () {
                    match = autoComplete.getMatch('mi');
                });
                it('should return the match', function () {
                    expect(match).toBe('mike');
                });
            });

        });

        describe('when a key is pressed that generates a match', function () {
            var keypressEvent;

            beforeEach(function () {
                spyOn(autoComplete, 'getMatch').andReturn('monique');
                keypressEvent = spyOnEvent('#name', 'keypress');
                $('#name').trigger($.Event('keypress', {charCode: 109})); // Note: 'm'
            });

            it('should invoke the getMatch function', function () {
                expect(autoComplete.getMatch).toHaveBeenCalledWith('m');
            });

            it('should cancel the key event', function () {
                expect(keypressEvent).toHaveBeenPrevented();
            });

            it('should replace the value of the input field with the match', function () {
                expect($('#name')).toHaveValue('monique');
            });

        });

        describe('when a key is pressed that does not generate a match', function () {
            var keypressEvent;

            beforeEach(function () {
                spyOn(autoComplete, 'getMatch').andReturn(null);
                keypressEvent = spyOnEvent('#name', 'keypress');
                $('#name').trigger($.Event('keypress', {charCode: 109})); // Note: 'm'
            });

            it('should not cancel the key event', function () {
                expect(keypressEvent).not.toHaveBeenPrevented();
            });
            it('should not change the value of the input field', function () {
                expect($('#name')).toHaveValue(''); // Note: keypress event has not changed the value yet
            });
        });

        describe('openPopup', function () {
            var popup;
            beforeEach(function () {
                spyOn(window, 'open').andCallFake(function () {
                    popup = {
                        focus: jasmine.createSpy()
                    };
                    return popup;
                });
                autoComplete.openPopup('zealake.com');
            });
            it('sets the right attributes', function () {
                expect(window.open).toHaveBeenCalledWith('zealake.com', '_blank', 'resizable');
            });
            it('receives focus', function () {
                expect(popup.focus).toHaveBeenCalledWith();
            });
        });

        describe('focus', function () {
            beforeEach(function () {
                spyOn($.fn, 'focus').andReturn();
                autoComplete.focus();
            });
            it('should focus its element', function () {
                expect($.fn.focus).toHaveBeenCalledWith();
                expect($.fn.focus.mostRecentCall.object).toBe('#name');
            });
        });

        describe('delayHide', function () {
            beforeEach(function () {
                autoComplete.delayHide();
            });
            it('should initially stay visible', function () {
                expect($('#name')).toBeVisible();
                expect($('#name').is(':visible')).toBeTruthy();
            });
            describe('after a delay', function () {
                beforeEach(function () {
                    jasmine.Clock.tick(500);
                });
                it('should be invisible', function () {
                    expect($('#name')).not.toBeVisible();
                    expect($('#name').is(':visible')).toBeFalsy();
                });
            });
        });

    });


    describe('when constructed with an ajax url', function () {

        can.each([

            {response: {list: ['rachel', 'lakshmi']}, expected: ['rachel', 'lakshmi']},
            {response: 500, expected: []}

        ], function (scenario) {

            describe('when the ajax response is ' + JSON.stringify(scenario.response), function () {
                beforeEach(function () {
                    can.fixture('/getNames', function (original, respondWith) {
                        respondWith(scenario.response);
                    });
                    autoComplete = new AutoComplete('#name', {
                        listUrl: '/getNames'
                    });
                    jasmine.Clock.tick(can.fixture.delay);
                });

                it('should use ' + JSON.stringify(scenario.expected) + ' as the list of names', function () {
                    expect(autoComplete.options.list).toEqual(scenario.expected);
                });
            });

        });

    });

});