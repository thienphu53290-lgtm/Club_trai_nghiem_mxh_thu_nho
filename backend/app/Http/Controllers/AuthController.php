<?php

namespace App\Http\Controllers;

use App\Models\User;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Facades\Validator;

class AuthController extends Controller
{
    public function register(Request $request)
    {
        $validator = Validator::make($request->all(), [
            'ho_ten' => 'required|string|max:100',
            'email' => 'required|string|email|max:100|unique:nguoi_dung,email',
            'password' => 'required|string|min:6',
        ], [
            'ho_ten.required' => 'Vui lòng nhập họ và tên',
            'email.required' => 'Vui lòng nhập email',
            'email.unique' => 'Email này đã được sử dụng trong hệ thống',
            'password.min' => 'Mật khẩu phải có ít nhất 6 ký tự',
        ]);

        if ($validator->fails()) {
            return response()->json([
                'status' => false,
                'message' => 'Dữ liệu không hợp lệ',
                'errors' => $validator->errors()
            ], 422);
        }

        $user = User::create([
            'vai_tro_id' => 1,
            'ho_ten' => $request->ho_ten,
            'ten_hien_thi' => $request->ho_ten,
            'email' => $request->email,
            'mat_khau' => Hash::make($request->password),
            'trang_thai' => 1,
            'lan_cuoi_dang_nhap' => now(),
        ]);

        $token = $user->createToken('auth_token', ['*'], now()->addDays(7))->plainTextToken;

        return response()->json([
            'status' => true,
            'message' => 'Đăng ký tài khoản thành công!',
            'access_token' => $token,
            'token_type' => 'Bearer',
            'expires_in' => '7 ngày',
            'user' => $user->load('vaiTro'),
        ], 201);
    }

    public function login(Request $request)
    {
        $validator = Validator::make($request->all(), [
            'email' => 'required|string|email',
            'password' => 'required|string',
        ], [
            'email.required' => 'Vui lòng nhập email đăng nhập',
            'password.required' => 'Vui lòng nhập mật khẩu',
        ]);

        if ($validator->fails()) {
            return response()->json([
                'status' => false,
                'message' => 'Vui lòng điền đủ email và mật khẩu',
                'errors' => $validator->errors()
            ], 422);
        }

        $user = User::where('email', $request->email)->first();

        if (!$user || !Hash::check($request->password, $user->mat_khau)) {
            return response()->json([
                'status' => false,
                'message' => 'Email hoặc mật khẩu không chính xác!',
            ], 401);
        }

        if ($user->trang_thai == 0) {
            return response()->json([
                'status' => false,
                'message' => 'Tài khoản của bạn đã bị tạm khóa.',
            ], 403);
        }

        $user->lan_cuoi_dang_nhap = now();
        $user->save();

        $user->tokens()->delete();
        $token = $user->createToken('auth_token', ['*'], now()->addDays(7))->plainTextToken;

        return response()->json([
            'status' => true,
            'message' => 'Đăng nhập thành công vào Club Trải Nghiệm!',
            'access_token' => $token,
            'token_type' => 'Bearer',
            'expires_in' => '7 ngày',
            'user' => $user->load('vaiTro'),
        ], 200);
    }

    public function logout(Request $request)
    {
        if ($request->user()) {
            $request->user()->currentAccessToken()->delete();
        }

        return response()->json([
            'status' => true,
            'message' => 'Đã đăng xuất và hủy Token thành công!',
        ]);
    }

    public function me(Request $request)
    {
        return response()->json([
            'status' => true,
            'user' => $request->user()->load('vaiTro'),
        ]);
    }
}
