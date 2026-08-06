import Echo from 'laravel-echo';
import Pusher from 'pusher-js';

window.Pusher = Pusher;
Pusher.logToConsole = true;

const echo = new Echo({
    broadcaster: 'reverb',
    key: import.meta.env.VITE_REVERB_APP_KEY || 'bplyzjmshuyyjb61plf8',
    wsHost: import.meta.env.VITE_REVERB_HOST || 'localhost',
    wsPort: import.meta.env.VITE_REVERB_PORT || 8080,
    wssPort: import.meta.env.VITE_REVERB_PORT || 8080,
    forceTLS: false,
    enabledTransports: ['ws', 'wss'],
    cluster: 'mt1',
});

export default echo;
