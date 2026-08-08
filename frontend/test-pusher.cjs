const Pusher = require('pusher-js');

const pusher = new Pusher('c3cbb0e38e7080046de1', {
  cluster: 'ap1',
  forceTLS: true
});

const channel = pusher.subscribe('club-live');
console.log("Subscribed to club-live");

channel.bind('live-event', function(data) {
  console.log('Received live-event:', data);
});

channel.bind('pusher:subscription_succeeded', function() {
    console.log('Successfully connected to Pusher!');
});

channel.bind('pusher:subscription_error', function(status) {
    console.log('Error connecting to Pusher:', status);
});
