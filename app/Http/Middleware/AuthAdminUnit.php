<?php

namespace App\Http\Middleware;

use Closure;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Route;
use Symfony\Component\HttpFoundation\Response;

class AuthAdminUnit
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
            if ($request->route()->getName() === 'admin.login') {
                return $next($request);
            } else {
                return redirect()->route('admin.login');
            }
        }

        if (is_null(Auth::guard('admin')->user()->unit_id)) {
            Auth::guard('admin')->logout();
            $request->session()->invalidate();
            $request->session()->regenerateToken();
            if (!$request->route()->getName() == 'admin.login') {
                return $next($request);
            } else {
                return redirect()->route('admin.login');

            }
        } else {
            $admin = Auth::guard('admin')->user();
            return redirect("/unit/{$admin->unit_id}/admin");
        }
    }
}
