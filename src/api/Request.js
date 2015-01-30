(function(window, $) {

    window.Puszek.SocketRequest = {
        TYPE_MESSAGE_MARK_AS_READ: 'message_mark_as_read',

        create: function() {
            return new WebSocketRequest();
        }
    };

    /**
     * Next packet index
     * @type {number}
     */
    var index = 0;

    /**
     * General request
     * @constructor
     */
    function WebSocketRequest() {

        /**
         * Empty response object
         * @type {*}
         * @private
         */
        var self = this,
            packetData = {
                id: ++index,
                type: null,
                data: null
            };

        /**
         * Sets response data
         * @param _data
         * @returns {*}
         */
        this.data = function (_data) {
            packetData.data = _data;

            return self;
        };



        /**
         * Sets response type
         * @returns {*}
         */
        this.type = function (_type) {
            packetData.type = _type;

            return self;
        };

        /**
         * @returns {*}
         */
        this.send = function (_socket) {
            _socket.send(JSON.stringify(packetData));

            return self;
        };
    }
})(window, jQuery);
