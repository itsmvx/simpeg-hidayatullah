<?php

namespace App\Http\Middleware;

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Inertia\Middleware;

class HandleInertiaRequests extends Middleware
{
    /**
     * The root template that is loaded on the first page visit.
     *
     * @var string
     */
    protected $rootView = 'app';

    /**
     * Determine the current asset version.
     */
    public function version(Request $request): string|null
    {
        return parent::version($request);
    }

    /**
     * Define the props that are shared by default.
     *
     * @return array<string, mixed>
     */
    public function share(Request $request): array
    {
        return [
            ...parent::share($request),
            'auth' => [
                'admin' => Auth::guard('admin')->check() ? [
                    'id' => Auth::guard('admin')->user()->id,
                    'nama' => Auth::guard('admin')->user()->nama,
                    'username' => Auth::guard('admin')->user()->username,
                    'unit_id' => Auth::guard('admin')->user()->unit_id,
                ] : null,
                'pegawai' => Auth::guard('pegawai')->check() ? [
                    'id' => Auth::guard('pegawai')->id,
                    'nama' => Auth::guard('pegawai')->user()->nama,
                    'username' => Auth::guard('pegawai')->user()->username,
                    'unit_id' => Auth::guard('pegawai')->user()->unit_id,
                ] : null
            ],
            'flash' => [
                'success' => fn () => $request->session()->get('success'),
                'error' => fn () => $request->session()->get('error'),
            ],
        ];
    }
}
