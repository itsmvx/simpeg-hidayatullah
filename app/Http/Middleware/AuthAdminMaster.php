<?php

namespace App\Http\Middleware;

use Closure;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Route;
use Symfony\Component\HttpFoundation\Response;

class AuthAdminMaster
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
            if ($request->route()->getName() === 'master.login') {
                return $next($request);
            } else {
                return redirect()->route('master.login');
            }
        }

        if (is_null(Auth::guard('admin')->user()->unit_id)) {
            if ($request->route()->getName() === 'master.login') {
                return redirect()->route('master.manage-unit');
            } else {
                return $next($request);
            }
        } else {
            $admin = Auth::guard('admin')->user();
            return redirect("/unit/{$admin->unit_id}/admin");
        }
    }
}
