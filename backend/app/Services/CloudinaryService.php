<?php

namespace App\Services;

use Illuminate\Support\Facades\Http;
use Illuminate\Http\UploadedFile;

class CloudinaryService
{
    public static function upload(UploadedFile $file, string $subFolder = 'posts'): string
    {
        $cloudName = env('CLOUDINARY_CLOUD_NAME') ?: config('services.cloudinary.cloud_name');
        $apiKey = env('CLOUDINARY_API_KEY') ?: config('services.cloudinary.api_key');
        $apiSecret = env('CLOUDINARY_API_SECRET') ?: config('services.cloudinary.api_secret');
        $uploadPreset = env('CLOUDINARY_UPLOAD_PRESET') ?: config('services.cloudinary.upload_preset');

        $folder = 'pivo/' . $subFolder;

        if ($cloudName && ($uploadPreset || ($apiKey && $apiSecret))) {
            $url = "https://api.cloudinary.com/v1_1/{$cloudName}/image/upload";
            $data = ['folder' => $folder];

            if ($uploadPreset) {
                $data['upload_preset'] = $uploadPreset;
            } else {
                $timestamp = (string) time();
                $data['timestamp'] = $timestamp;
                $data['api_key'] = $apiKey;
                $stringToSign = "folder={$folder}&timestamp={$timestamp}{$apiSecret}";
                $data['signature'] = sha1($stringToSign);
            }

            try {
                $response = Http::attach(
                    'file',
                    file_get_contents($file->getRealPath()),
                    $file->getClientOriginalName()
                )->post($url, $data);

                if ($response->successful()) {
                    $json = $response->json();
                    if (isset($json['secure_url'])) {
                        return $json['secure_url'];
                    }
                }
            } catch (\Exception $e) {
            }
        }

        $filename = 'img_' . time() . '_' . uniqid() . '.' . $file->getClientOriginalExtension();
        $file->move(public_path('uploads/' . $subFolder), $filename);
        return url('/uploads/' . $subFolder . '/' . $filename);
    }

    public static function deleteByUrl(?string $url): void
    {
        if (empty($url)) {
            return;
        }

        if (!str_contains($url, 'cloudinary.com')) {
            $localPath = str_replace(url('/'), public_path(), $url);
            if (file_exists($localPath) && is_file($localPath)) {
                @unlink($localPath);
            }
            return;
        }

        $parts = explode('/upload/', $url);
        if (count($parts) < 2) {
            return;
        }

        $pathAfterUpload = $parts[1];
        $pathWithoutVersion = preg_replace('/^v\d+\//', '', $pathAfterUpload);
        $publicId = preg_replace('/\.[^.]+$/', '', $pathWithoutVersion);

        if (empty($publicId)) {
            return;
        }

        $cloudName = env('CLOUDINARY_CLOUD_NAME') ?: config('services.cloudinary.cloud_name');
        $apiKey = env('CLOUDINARY_API_KEY') ?: config('services.cloudinary.api_key');
        $apiSecret = env('CLOUDINARY_API_SECRET') ?: config('services.cloudinary.api_secret');

        if ($cloudName && $apiKey && $apiSecret) {
            $timestamp = (string) time();
            $stringToSign = "public_id={$publicId}&timestamp={$timestamp}{$apiSecret}";
            $signature = sha1($stringToSign);

            try {
                Http::post("https://api.cloudinary.com/v1_1/{$cloudName}/image/destroy", [
                    'public_id' => $publicId,
                    'timestamp' => $timestamp,
                    'api_key' => $apiKey,
                    'signature' => $signature,
                ]);
            } catch (\Exception $e) {
            }
        }
    }
}
