(function(window, $) {
    window.Puszek.utils.MessageChannel = function(_socket, _config) {

        var $self = $(this);

        /**
         * Current messages list
         * @type {Object}
         */
        var messages = [];

        /**
         *
         * @type {Object}
         */
        var settings = {};

        /**
         * @type {Puszek.Socket}
         */
        var socket;

        /**
         *
         * @param _id
         * @returns {number}
         */
        function getMessageIndexById(_id) {
            return getMessageIndexBy('_id', _id);
        }

        /**
         *
         * @param field
         * @param value
         * @returns {number}
         */
        function getMessageIndexBy(field, value) {
            var index = -1;
            angular.forEach(messages, function (message, key) {
                if (message[field] == value) {
                    index = key;
                }
            });

            return index;
        }

        /**
         * Got message!
         * @asynchronous
         * @param event
         * @param _packet
         */
        function onPacket(event, _packet) {
            try {
                var accepted = settings.filter(_packet);
                if (accepted === undefined || accepted === true) {
                    $self.trigger('packet', [_packet]);

                    if (getMessageIndexById(_packet.data._id) < 0) {
                        messages.push(_packet.data);
                    }
                }
            } catch (error) {
                $self.trigger('error', [error]);
            }
        }

        /**
         * Oops! an arror occured!
         * Clear messages before reconnect, because we will receive them all again after reconnection (or not).
         * @asynchronous
         */
        function onClose() {
            messages.length = 0;
            $self.trigger('close');
        }

        /**
         *
         */
        function onOpen() {
            $self.trigger('open');
        }

        /**
         * Public methods
         */

        /**
         *
         * @returns {*}
         */
        this.getSocket = function () {
            return socket;
        };

        /**
         *
         * @returns {Object}
         */
        this.getMessages = function () {
            return messages;
        };

        /**
         *
         * @param messageIds
         */
        this.markAsRead = function (messageIds) {
            socket.markAsRead(messageIds);
            var index;
            angular.forEach(messageIds, function (id) {
                index = getMessageIndexById(id);
                if (index >= 0) {
                    messages.splice(index, 1);
                }
            });
        };

        /**
         *
         */
        this.markAsReadAll = function () {
            var messageIds = [];
            angular.forEach(messages, function (message) {
                messageIds.push(message._id);
            });
            socket.markAsRead(messageIds);
            messages.length = 0;
        };

        /**
         */
        this.on = function() {
            $self.on.apply($self, arguments);
        };

        /**
         */
        this.off = function() {
            $self.off.apply($self, arguments);
        };

        /**
         * Configure
         */
        this.configure = function(_config) {
            if ($.isFunction(_config)) {
                _config = { filter: _config };
            }
            if (typeof _config !== 'object') {
                throw "Puszek MessageChannel: configuration must be an object";
            }
            if (!$.isFunction(_config.filter)) {
                _config.filter = function() {};
            }
            settings = $.extend({}, settings, _config);

            return self;
        };

        this.configure(_socket, _config);

        if (_socket.constructor === Puszek.connector.Socket) {
            socket = _socket;
        } else if (typeof _socket === 'object') {
            socket = new Puszek.connector.Socket(_socket);
        } else {
            throw "Puszek MessageChannel: socket option must be an Puszek.Socket object, or a plain object with socket configuration.";
        }

        socket.on('packet', onPacket);
        socket.on('close', onClose);
        socket.on('open', onOpen);

        this.connect = socket.connect;
        this.disconnect = socket.disconnect;
        this.isConnected = socket.isConnected;
    };
})(window, jQuery);
