describe('BlogPost', function () {
    var post;
    beforeEach(function () {
        jasmine.configure();
        post = new window.BlogPost({title: 'better testing'});
    });

    describe('age', function () {

        beforeEach(function () {
            jasmine.Clock.tick(42000);
        });

        it('compute age correctly', function () {
            expect(post.age()).toBe(42000);
        });
    });
});