import Echo from 'laravel-echo';
import Pusher from 'pusher-js';

window.Pusher = Pusher;
// Pusher.logToConsole = true;

const broadcasterType = import.meta.env.VITE_BROADCASTER || 'reverb';

let echoConfig = {};

if (broadcasterType === 'pusher') {
    // Cấu hình khi chạy Production (Vercel) dùng Pusher
    echoConfig = {
        broadcaster: 'pusher',
        key: import.meta.env.VITE_PUSHER_APP_KEY,
        cluster: import.meta.env.VITE_PUSHER_APP_CLUSTER || 'ap1',
        forceTLS: true,
    };
} else {
    // Cấu hình khi chạy Local dùng Reverb
    echoConfig = {
        broadcaster: 'reverb',
        key: import.meta.env.VITE_REVERB_APP_KEY || 'bplyzjmshuyyjb61plf8',
        wsHost: import.meta.env.VITE_REVERB_HOST || 'localhost',
        wsPort: import.meta.env.VITE_REVERB_PORT || 8080,
        wssPort: import.meta.env.VITE_REVERB_PORT || 8080,
        forceTLS: import.meta.env.VITE_REVERB_SCHEME === 'https',
        enabledTransports: ['ws', 'wss'],
    };
}

const echo = new Echo(echoConfig);

export default echo;
