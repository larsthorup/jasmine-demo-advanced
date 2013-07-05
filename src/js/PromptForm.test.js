describe('PromptForm', function () {
    var form;

    beforeEach(function () {
        jasmine.configure();
        $('<div id="form"><input id="name" /></div>').appendTo('#sandbox');
    });

    describe('when constructed', function () {

        beforeEach(function () {
            spyOn(window, 'AutoComplete').andCallFake(function () {
                this.focus = jasmine.createSpy();
            });
            form = new window.PromptForm('#form', {
                listUrl: '/someUrl'
            });
        });

        it('should construct an autoComplete object', function () {
            expect(window.AutoComplete.callCount).toBe(1);
            var args = window.AutoComplete.mostRecentCall.args;
            expect(args[0]).toBe('#name');
            expect(args[1]).toEqual({listUrl: '/someUrl'});
        });

        it('should focus the input element', function () {
            var object = window.AutoComplete.mostRecentCall.object;
            expect(object.focus).toHaveBeenCalledWith();
        });
    });
});