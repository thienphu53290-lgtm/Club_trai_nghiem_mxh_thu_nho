<?php

namespace App\Jobs;

use Illuminate\Contracts\Queue\ShouldQueue;
use Illuminate\Foundation\Queue\Queueable;
use Illuminate\Support\Facades\DB;
use App\Services\GeminiAIService;
use App\Events\RealtimeNotificationEvent;
use Illuminate\Support\Facades\Log;

class CheckToxicityJob implements ShouldQueue
{
    use Queueable;

    public string $type;
    public int $itemId;
    public string $textToCheck;
    public int $userId;

    /**
     * Create a new job instance.
     */
    public function __construct(string $type, int $itemId, string $textToCheck, int $userId)
    {
        $this->type = $type;
        $this->itemId = $itemId;
        $this->textToCheck = $textToCheck;
        $this->userId = $userId;
    }

    /**
     * Execute the job.
     */
    public function handle(GeminiAIService $aiService): void
    {
        Log::info("Job CheckToxicityJob running for {$this->type} ID: {$this->itemId}");
        
        $isToxic = $aiService->checkToxicity($this->textToCheck);

        if ($isToxic) {
            Log::info("Toxicity detected for {$this->type} ID: {$this->itemId}. Hiding content.");
            
            if ($this->type === 'post') {
                // Ẩn bài viết
                DB::table('bai_viet')->where('id', $this->itemId)->update(['trang_thai' => 0]);
                
                // Gửi thông báo xoá bài viết cho những người đang xem (để UI ẩn đi)
                try {
                    RealtimeNotificationEvent::dispatch(
                        'delete_post',
                        'Bài viết vi phạm',
                        'Bài viết đã bị gỡ do vi phạm tiêu chuẩn cộng đồng.',
                        ['post_id' => $this->itemId, 'user_id' => $this->userId]
                    );
                } catch (\Throwable $e) {
                    Log::error('Broadcast error in CheckToxicityJob: ' . $e->getMessage());
                }
            } elseif ($this->type === 'comment') {
                // Ẩn bình luận
                DB::table('binh_luan')->where('id', $this->itemId)->update(['trang_thai' => 0]);
            }
        } else {
            Log::info("Content passed AI moderation for {$this->type} ID: {$this->itemId}");
        }
    }
}
