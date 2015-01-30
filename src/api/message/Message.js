(function(window, $) {

    window.Puszek.SocketRequest.Message = {
        create: function() {
            return new Message();
        }
    };

    function Message() {

        /**
         * @type {Message}
         */
        var self = this,
            data = {
                message: null,
                sender: null,
                receivers: []
            };

        /**
         * Sets message
         * @param _message
         * @returns {Message}
         */
        this.message = function (_message) {
            data.message = _message;

            return self;
        };

        /**
         * Sets sender name
         * @param _sender
         * @returns {Message}
         */
        this.sender = function (_sender) {
            data.sender = _sender;

            return self;
        };

        /**
         * Sets receivers list
         * @param _receivers
         * @returns {Message}
         */
        this.receivers = function (_receivers) {
            if ($.isArray(_receivers)) {
                data.receivers = _receivers;
            } else {
                throw 'Message receivers have to be an array';
            }

            return self;
        };

        /**
         *
         * @returns {Object}
         */
        this.get = function() {
            return data;
        };
    }
})(window, jQuery);
