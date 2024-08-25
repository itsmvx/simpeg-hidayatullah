<?php

namespace App\Http\Middleware;

use Closure;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Route;
use Symfony\Component\HttpFoundation\Response;

class AuthAdmin
{
    /**
     * Handle an incoming request.
     *
     * @param  \Closure(\Illuminate\Http\Request): (\Symfony\Component\HttpFoundation\Response)  $next
     */
    public function handle(Request $request, Closure $next)
    {
        if (!Route::has($request->route()->getName())) {
            abort(404);
        }

        if (!Auth::guard('admin')->check()) {
            return redirect()->route('auth.login');
        }

        if (Auth::guard('pegawai')->check()) {
            Auth::guard('pegawai')->logout();
            $request->session()->invalidate();
            $request->session()->regenerateToken();
        }

        $user = Auth::guard('admin')->user();

        if (!is_null($user->unit_id)) {
            if ($request->routeIs('master.*')) {
                Auth::guard('admin')->logout();
                $request->session()->invalidate();
                $request->session()->regenerateToken();
                return redirect()->route('auth.login');
            }

            if ($request->routeIs('admin.create') || $request->routeIs('admin.update') || $request->routeIs('admin.delete') || $request->routeIs('admin.reset')) {
                abort(403, 'Unauthorized');
            }

            return $next($request);
        }

        if (is_null($user->unit_id)) {
            if ($request->routeIs('master.*') || $request->routeIs('admin.create') || $request->routeIs('admin.update') || $request->routeIs('admin.delete') || $request->routeIs('admin.reset')) {
                return $next($request);
            }

            Auth::guard('admin')->logout();
            $request->session()->invalidate();
            $request->session()->regenerateToken();
            return redirect()->route('auth.login');
        }

        abort(403, 'Unauthorized');
    }
}
