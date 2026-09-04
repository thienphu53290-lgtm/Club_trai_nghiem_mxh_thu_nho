<?php

namespace App\Services;

use Illuminate\Support\Facades\Http;
use Illuminate\Support\Facades\Log;

class GeminiAIService
{
    protected $apiKey;
    protected $baseUrl = 'https://generativelanguage.googleapis.com/v1beta/models/gemini-3.6-flash:generateContent';

    public function __construct()
    {
        $this->apiKey = config('services.gemini.key');
    }

    /**
     * Check if the given text is toxic or spam.
     *
     * @param string $text
     * @return bool
     */
    public function checkToxicity(string $text): bool
    {
        if (empty($this->apiKey)) {
            Log::warning('Gemini API Key is not set.');
            return false; // Fail open if no API key
        }

        $prompt = "Bạn là một hệ thống kiểm duyệt nội dung mạng xã hội. Hãy phân tích bình luận sau đây và trả lời xem nó có chứa nội dung độc hại, chửi thề, thô tục, phân biệt chủng tộc, hoặc spam không. Chỉ trả lời định dạng JSON với 2 trường: 'is_toxic' (true hoặc false) và 'reason' (lý do ngắn gọn). Không giải thích thêm. Bình luận: \"{$text}\"";

        try {
            // Thêm cơ chế tự động thử lại (Retry) tối đa 3 lần, mỗi lần cách nhau 1 giây (1000ms) nếu Google báo bận (Lỗi 5xx)
            $response = Http::retry(3, 1000)->withHeaders([
                'Content-Type' => 'application/json',
            ])->post($this->baseUrl . '?key=' . $this->apiKey, [
                'contents' => [
                    [
                        'parts' => [
                            ['text' => $prompt]
                        ]
                    ]
                ],
                'generationConfig' => [
                    'temperature' => 0.1,
                    'responseMimeType' => 'application/json',
                ]
            ]);

            if ($response->successful()) {
                $data = $response->json();
                if (isset($data['candidates'][0]['content']['parts'][0]['text'])) {
                    $resultText = $data['candidates'][0]['content']['parts'][0]['text'];
                    $result = json_decode($resultText, true);
                    
                    if (isset($result['is_toxic']) && $result['is_toxic'] === true) {
                        Log::info('AI Moderation flagged text: ' . $text . ' | Reason: ' . ($result['reason'] ?? 'None'));
                        return true;
                    }
                }
            } else {
                Log::error('Gemini API Error: ' . $response->body());
            }
        } catch (\Exception $e) {
            Log::error('Gemini AIService Exception: ' . $e->getMessage());
        }

        return false;
    }
    public function askChatbot(string $message): string
    {
        if (empty($this->apiKey)) {
            Log::warning('Gemini API Key is not set.');
            return "Xin lỗi, hệ thống AI hiện không khả dụng (thiếu API Key).";
        }

        $prompt = "Bạn là trợ lý ảo thân thiện, vui tính và chuyên nghiệp của mạng xã hội PIVO. Hãy trả lời câu hỏi sau của người dùng một cách ngắn gọn, súc tích (dưới 3 câu nếu có thể), dễ hiểu và lịch sự. Câu hỏi: \"{$message}\"";

        try {
            $response = Http::retry(3, 1000)->withHeaders([
                'Content-Type' => 'application/json',
            ])->post($this->baseUrl . '?key=' . $this->apiKey, [
                'contents' => [
                    [
                        'parts' => [
                            ['text' => $prompt]
                        ]
                    ]
                ],
                'generationConfig' => [
                    'temperature' => 0.7,
                ]
            ]);

            if ($response->successful()) {
                $data = $response->json();
                if (isset($data['candidates'][0]['content']['parts'][0]['text'])) {
                    return trim($data['candidates'][0]['content']['parts'][0]['text']);
                }
            } else {
                Log::error('Gemini API Error: ' . $response->body());
            }
        } catch (\Exception $e) {
            Log::error('Gemini AIService askChatbot Exception: ' . $e->getMessage());
        }

        return "Xin lỗi, mình đang gặp chút trục trặc khi kết nối với máy chủ AI. Bạn hãy thử lại sau nhé!";
    }
}
