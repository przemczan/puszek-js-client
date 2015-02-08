(function(window, $) {
    window.Puszek.connector.Socket = function (_config) {

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
            var packet = false;
            try {
                packet = JSON.parse(_message.data);
            } catch (e) {}

            if (packet) {
                $self.trigger('pre.packet', [packet]);
                $self.trigger('packet', [packet]);
                $self.trigger('post.packet', [packet]);
            }
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
                Puszek.connector.Request.TYPE_MESSAGE_MARK_AS_READ,
                Puszek.connector.Request.MessageIdList.create().ids(messageIds).get()
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
                Puszek.connector.Request.create()
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
