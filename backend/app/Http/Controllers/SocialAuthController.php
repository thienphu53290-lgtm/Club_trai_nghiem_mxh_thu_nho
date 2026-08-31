<?php

namespace App\Http\Controllers;

use App\Models\User;
use Illuminate\Http\Request;
use Laravel\Socialite\Facades\Socialite;
use Illuminate\Support\Str;

class SocialAuthController extends Controller
{
    /**
     * Redirect the user to the provider authentication page.
     */
    public function redirect($provider)
    {
        return Socialite::driver($provider)->stateless()->redirect();
    }

    /**
     * Obtain the user information from the provider.
     */
    public function callback($provider)
    {
        try {
            $socialUser = Socialite::driver($provider)->stateless()->user();
            
            // Check if user already exists
            $user = User::where('email', $socialUser->getEmail())->first();
            $isNew = false;
            
            if ($user) {
                // Link provider if not linked yet
                if (!$user->provider_id) {
                    $user->provider = $provider;
                    $user->provider_id = $socialUser->getId();
                    $user->save();
                }
            } else {
                // Create new user
                $user = User::create([
                    'ho_ten' => $socialUser->getName() ?? 'User ' . Str::random(5),
                    'email' => $socialUser->getEmail(),
                    'mat_khau' => null, // No password
                    'anh_dai_dien' => $socialUser->getAvatar(),
                    'provider' => $provider,
                    'provider_id' => $socialUser->getId(),
                    'vai_tro_id' => 1,
                    'cap_bac_id' => 1,
                    'cap_bac' => 'Đồng Tiên Phong',
                    'diem_trai_nghiem' => 100,
                    'trang_thai' => 1,
                ]);
                $isNew = true;
            }

            // Create Sanctum Token
            $token = $user->createToken('auth_token')->plainTextToken;

            // Load extra relationship info
            $user->load('vaiTro', 'capBacInfo');
            $user->is_onboarded = ($user->gioi_tinh !== null && $user->ngay_sinh !== null);

            // Redirect back to Frontend with Token
            $frontendUrl = env('FRONTEND_URL', 'http://localhost:5173');
            $authData = base64_encode(json_encode([
                'status' => true,
                'access_token' => $token,
                'user' => $user,
                'isNew' => $isNew
            ]));

            return redirect()->to("{$frontendUrl}/auth/callback?data={$authData}");

        } catch (\Exception $e) {
            \Log::error("Social Login Error ({$provider}): " . $e->getMessage());
            $frontendUrl = env('FRONTEND_URL', 'http://localhost:5173');
            return redirect()->to("{$frontendUrl}/auth/callback?error=1");
        }
    }
}
