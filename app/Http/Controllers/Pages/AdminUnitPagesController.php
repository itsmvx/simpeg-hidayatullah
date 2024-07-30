<?php

namespace App\Http\Controllers\Pages;

use App\Http\Controllers\Controller;
use App\Models\Pegawai;
use App\Models\Unit;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Inertia\Inertia;

class AdminUnitPagesController extends Controller
{
    public function loginPage()
    {
        return Inertia::render('Admin/ADMIN_AdminLoginPage', [
            'units' => Unit::select('id', 'nama', 'keterangan')->get()
        ]);
    }
    public function dashboardPage($unitId)
    {
        $authAdmin = Auth::guard('admin')->user();
        if ($authAdmin && $unitId == $authAdmin->unit_id) {
            return Inertia::render('Admin/AdminDashboardPage', [
                'pegawais' => Pegawai::where('unit_id', $unitId)->get(),
            ]);
        }
        abort(403);
    }
}
