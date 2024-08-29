<?php

namespace App\Http\Controllers;

use App\Models\Admin;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Facades\Response;
use Illuminate\Support\Facades\Validator;
use Illuminate\Validation\ValidationException;
use Inertia\Inertia;

class AuthController extends Controller
{
    /**
     * Handle the incoming request.
     */
    public function __invoke(Request $request)
    {
        //
    }

    public function loginPage(Request $request)
    {
        return Inertia::render('LoginPage');
    }
    public function authAdmin(Request $request)
    {
        $validation = Validator::make($request->only(['username', 'password']), [
            'username' => 'required|string',
            'password' => 'required|string'
        ], [
            'username.required' => 'Username tidak boleh kosong',
            'password.required' => 'Password tidak boleh kosong',
            'username.string' => 'Format username tidak valid',
            'password.string' => 'Format password tidak valid'
        ]);

        if ($validation->fails()) {
            return Response::json([
                'message' => $validation->errors()->first()
            ], 422);
        }

        if (Auth::guard('admin')->attempt($request->only('username', 'password'))) {
            $admin = Auth::guard('admin')->user();

            $unit = $admin->unit;

            return Response::json([
                'message' => 'Login berhasil',
                'data' => [
                    'id' => $admin->id,
                    'nama' => $admin->nama,
                    'username' => $admin->username,
                    'unit' => $unit ? [
                        'id' => $unit->id,
                        'nama' => $unit->nama,
                    ] : null,
                    'role' => 'admin'
                ]
            ]);
        } else {
            return Response::json([
                'message' => 'Username atau password salah'
            ], 401);
        }
    }

    /**
     * @throws ValidationException
     */

    public function authPegawai(Request $request): JsonResponse
    {
        $validation = Validator::make($request->only(['username', 'password']), [
            'username' => 'required|string',
            'password' => 'required|string'
        ], [
            'username.required' => 'Username tidak boleh kosong',
            'password.required' => 'Password tidak boleh kosong',
            'username.string' => 'Format username tidak valid',
            'password.string' => 'Format password tidak valid'
        ]);

        if ($validation->fails()) {
            return Response::json([
                'message' => $validation->errors()->first()
            ], 422);
        }

        if (Auth::guard('pegawai')->attempt($request->only('username', 'password'))) {
            $pegawai = Auth::guard('pegawai')->user();

            $unit = $pegawai->unit;

            return Response::json([
                'message' => 'Login berhasil',
                'data' => [
                    'id' => $pegawai->id,
                    'nama' => $pegawai->nama,
                    'username' => $pegawai->username,
                    'unit' => $unit ? [
                        'id' => $unit->id,
                        'nama' => $unit->nama,
                    ] : null,
                    'role' => 'pegawai'
                ]
            ]);
        } else {
            return Response::json([
                'message' => 'Username atau password salah'
            ], 401);
        }
    }
    public function getUser()
    {
        return Response::json([
            'user' => Auth::user()
        ]);
    }
    public function logout(Request $request): JsonResponse
    {
        Auth::logout();
        $request->session()->invalidate();
        $request->session()->regenerateToken();

        return Response::json([
            'message' => 'Logout berhasil!',
        ]);
    }
}
