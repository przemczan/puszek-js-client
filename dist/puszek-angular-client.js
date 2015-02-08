angular.module('przemczan.puszek', []);

angular.module('przemczan.puszek')
    .factory('PrzemczanPuszekMessageChannel', ['$rootScope', function PrzemczanPuszekMessageChannelFactory($rootScope) {

        return {
            /**
             * @param {PrzemczanPuszekSocketFactory.PrzemczanPuszekSocket} _socket
             * @param {Object} _config
             * @returns {PrzemczanPuszekMessageChannelFactory.PrzemczanPuszekMessageChannel}
             */
            create: function(_socket, _config) {
                return new PrzemczanPuszekMessageChannel(_socket, _config);
            }
        };

        function PrzemczanPuszekMessageChannel(_socket, _config) {

            /**
             * @type {PrzemczanPuszekMessageChannelFactory.PrzemczanPuszekMessageChannel}
             */
            var self = this;

            /**
             * @type {*|jQuery|HTMLElement}
             */
            var $self = $(self);

            /**
             * @type {Window.Puszek.utils.MessageChannel}
             */
            var messageChannel = new Puszek.utils.MessageChannel(_socket.$socket, _config);

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

            function angularizeEvent($event) {
                $self.trigger($event, [].slice.apply(arguments, [1]));
                $rootScope.$apply();
            }

            messageChannel.on('open close packet error', angularizeEvent);

            self.getMessages = messageChannel.getMessages;
            self.isConnected = messageChannel.isConnected;
        }
    }]);
angular.module('przemczan.puszek')
    .factory('PrzemczanPuszekSocket', ['$rootScope', function PrzemczanPuszekSocketFactory($rootScope) {

        return {
            create: function(_config) {
                return new PrzemczanPuszekSocket(_config);
            }
        };

        function PrzemczanPuszekSocket(_config) {

            /**
             *
             * @type {PrzemczanPuszekSocketFactory.PrzemczanPuszekSocket}
             */
            var self = this;

            /**
             *
             * @type {*|jQuery|HTMLElement}
             */
            var $self = $(self);

            /**
             * Puszek Socket
             * @type {Window.Puszek.connector.Socket}
             */
            self.$socket = new Puszek.connector.Socket(_config);

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

            function angularizeEvent($event) {
                $self.trigger($event, [].slice.apply(arguments, [1]));
                $rootScope.$apply();
            }

            self.$socket.on('open close error pre.packet packet post.packet', angularizeEvent);

            self.connect = self.$socket.connect;
            self.disconnect = self.$socket.disconnect;
            self.isConnected = self.$socket.isConnected;
        }
    }]);