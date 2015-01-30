(function(window) {

    window.Puszek = window.Puszek || {};

})(window);

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

(function(window, $) {

    window.Puszek.SocketRequest.MessageIdList = {
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

(function(window, $) {
    window.Puszek.Socket = function (_config) {

        var $self = $(this), // jquery version of this
            self = this, // this ;)
            socket, // WebSocket instance
            settings = {
                address: 'ws://localhost:5001',
                serverProtocol: null,
                autoReconnectRetries: 1000,
                autoReconnectDelay: 5000
            },
            reconnectTries = settings.autoReconnectRetries;

        /**
         * Configure
         */
        this.configure = function(_config) {
            settings = $.extend(true, settings, _config);

            return self;
        };

        /**
         * Returns configuration object
         */
        this.getConfiguration = function() {
            return settings;
        };

        /**
         * Socket connection opened
         */
        function onOpen() {
            reconnectTries = settings.autoReconnectRetries;
            $self.trigger('open');
        }

        /**
         * Socket connection opened
         */
        function onClose() {
            if (socket && settings.autoReconnectRetries > 0) {
                if (reconnectTries--) {
                    setTimeout(
                        function() {
                            self.reconnect();
                        },
                        settings.autoReconnectDelay
                    );
                } else {
                    reconnectTries = settings.autoReconnectRetries;
                }
            }
            $self.trigger('close');
        }

        /**
         * Socket connection opened
         */
        function onError() {
            $self.trigger('error');
        }

        /**
         * Message received callback
         * @param _message
         */
        function onMessage(_message) {
            try {
                var packet = JSON.parse(_message.data);
                $self.trigger('pre.packet', [packet]);
                $self.trigger('packet', [packet]);
                $self.trigger('post.packet', [packet]);
            } catch (e) {}
        }

        /**
         * Initialize socket
         */
        function initializeSocket() {
            socket = new WebSocket(settings.address);
            socket.onerror = onError;
            socket.onopen = onOpen;
            socket.onclose = onClose;
            socket.onmessage = onMessage;
        }

        /**
         * socket connect
         * @param url
         */
        this.connect = function (url) {
            settings.address = url || settings.address;

            initializeSocket();

            return self;
        };

        /**
         * socket disconnect
         */
        this.disconnect = function () {
            if (socket) {
                var oldSocket = socket;
                socket = false;
                oldSocket.close();
                oldSocket = null;
            }

            return self;
        };

        /**
         * socket reconnect
         */
        this.reconnect = function () {
            self.disconnect();
            self.connect();

            return self;
        };

        /**
         * socket connection status
         */
        this.isConnected = function () {
            return socket && socket.readyState == 1;
        };

        /**
         * Send data
         * @param data
         */
        this.send = function (data) {
            if (socket && socket.readyState == 1) {
                socket.send(data);
            }

            return self;
        };

        /**
         *
         * @param messageIds
         */
        this.markAsRead = function(messageIds) {
            self.send(
                Puszek.SocketRequest.TYPE_MESSAGE_MARK_AS_READ,
                Puszek.SocketRequest.MessageIdList.create().ids(messageIds).get()
            );

            return self;
        };

        /**
         *
         */
        this.on = function() {
            $self.on.apply($self, arguments);

            return self;
        };

        /**
         *
         */
        this.off = function() {
            $self.off.apply($self, arguments);

            return self;
        };

        /**
         *
         * @param _type
         * @param _data
         */
        this.send = function(_type, _data) {
            if (socket) {
                Puszek.SocketRequest.create()
                    .type(_type)
                    .data(_data)
                    .send(socket);
            }

            return self;
        };

        if (typeof _config == 'object') {
            this.configure(_config);
        }
    };
})(window, jQuery);
