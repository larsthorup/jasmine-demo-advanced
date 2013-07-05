(function (window) {

    window.PromptForm = can.Control({
    },
    {
        init: function () {
            var inputElement = $('input', this.element);
            this.input = new window.AutoComplete(inputElement, {
                listUrl: this.options.listUrl
            });
            this.input.focus();
        }
    });

})(window);