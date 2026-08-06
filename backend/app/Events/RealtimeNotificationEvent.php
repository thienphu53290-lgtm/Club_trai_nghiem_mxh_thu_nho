<?php

namespace App\Events;

use Illuminate\Broadcasting\Channel;
use Illuminate\Broadcasting\InteractsWithSockets;
use Illuminate\Broadcasting\PresenceChannel;
use Illuminate\Broadcasting\PrivateChannel;
use Illuminate\Contracts\Broadcasting\ShouldBroadcastNow;
use Illuminate\Foundation\Events\Dispatchable;
use Illuminate\Queue\SerializesModels;

class RealtimeNotificationEvent implements ShouldBroadcastNow
{
    use Dispatchable, InteractsWithSockets, SerializesModels;

    public function __construct(
        public string $type,
        public string $title,
        public string $message,
        public array $data = []
    ) {}

    public function broadcastOn(): array
    {
        return [
            new Channel('club-live'),
        ];
    }

    public function broadcastAs(): string
    {
        return 'live-event';
    }
}
