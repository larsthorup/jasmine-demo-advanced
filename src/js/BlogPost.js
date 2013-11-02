(function (window) {

    window.BlogPost = function (options) {
        this.options = options;
        this.createdOn = new Date();
        // Note: simulate a DOM element leak
        // $('<div id="overlay"></div>').appendTo('body');
    };
    window.BlogPost.prototype.age = function () {
        var now = new Date();
        return now.getTime() - this.createdOn.getTime();
    };

})(window);