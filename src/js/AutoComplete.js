(function (window) {

    window.AutoComplete = can.Control({
    },
    {
        init: function () {
            var self = this;
            this.element.addClass('auto-complete');
            if(this.options.listUrl) {
                var loading = can.ajax({
                    method: 'get',
                    url: this.options.listUrl,
                    dataType: 'json'
                });
                loading.done(function (result) {
                    self.options.list = result.list;
                });
                loading.fail(function () {
                    self.options.list = [];
                });
            }
        },

        'keypress': function (element, event) {
            var pattern = this.element.val() + String.fromCharCode(event.charCode);
            var match = this.match(pattern);
            if(match) {
                event.preventDefault();
                this.element.val(match);
            }
        },

        match: function (pattern) {
            var matches = [];
            can.each(this.options.list, function (key) {
                console.log(key);
                if (key.indexOf(pattern) === 0) {
                    matches.push(key);
                }
            });
            if (matches.length === 1) {
                return matches[0];
            } else {
                return null;
            }
        }
    });

})(window);