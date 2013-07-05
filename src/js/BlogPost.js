(function (window) {

    window.BlogPost = function (options) {
        this.options = options;
        this.createdOn = new Date();
    };
    window.BlogPost.prototype.age = function () {
        var now = new Date();
        return now.getTime() - this.createdOn.getTime();
    };

})(window);