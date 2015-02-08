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