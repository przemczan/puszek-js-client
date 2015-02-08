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
            self.markAllAsRead = messageChannel.markAllAsRead;
            self.markAsRead = messageChannel.markAsRead;
        }
    }]);