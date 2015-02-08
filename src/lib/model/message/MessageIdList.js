(function(window, $) {

    window.Puszek.model.message.MessageIdList = {
        create: function() {
            return new MessageIdList();
        }
    };

    function MessageIdList() {

        /**
         * Empty response object
         * @type {*}
         * @private
         */
        var self = this,
            data = [];

        /**
         * Sets response data
         * @param _ids
         * @returns {*}
         */
        this.ids = function (_ids) {
            data = _ids;

            return self;
        };

        /**
         *
         * @param _id
         * @returns {*}
         */
        this.push = function (_id) {
            data.push(_id);

            return self;
        };

        /**
         *
         * @returns {Array}
         */
        this.get = function() {
            return data;
        };
    }
})(window, jQuery);
