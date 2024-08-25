<?php

namespace App\Http\Middleware;

use Closure;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Symfony\Component\HttpFoundation\Response;

class NoAuth
{
    /**
     * Handle an incoming request.
     *
     * @param  \Illuminate\Http\Request  $request
     * @param  \Closure(\Illuminate\Http\Request): (\Symfony\Component\HttpFoundation\Response)  $next
     * @return \Symfony\Component\HttpFoundation\Response
     */
    public function handle(Request $request, Closure $next): Response
    {
        if (Auth::guard('admin')->check()) {
            $admin = Auth::guard('admin')->user();

            if ($request->isMethod('post') && $request->routeIs('auth.admin')) {
                return response()->json(['message' => 'Sudah terautentikasi sebagai Admin'], 403);
            }

            if (is_null($admin->unit_id)) {
                return redirect()->route('master.dashboard');
            } else {
                return redirect()->route('admin.dashboard');
            }
        }

        if (Auth::guard('pegawai')->check()) {

            if ($request->isMethod('post') && $request->routeIs('auth.pegawai')) {
                return response()->json(['message' => 'Sudah terautentikasi sebagai Pegawai'], 403);
            }

            return redirect()->route('pegawai.dashboard');
        }

        return $next($request);
    }
}
