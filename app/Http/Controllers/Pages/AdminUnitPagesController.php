<?php

namespace App\Http\Controllers\Pages;

use App\Http\Controllers\Controller;
use App\Models\Pegawai;
use App\Models\Unit;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\DB;
use Inertia\Inertia;

class AdminUnitPagesController extends Controller
{
    public function loginPage()
    {
        return Inertia::render('Admin/AdminUnit/ADMIN_AdminLoginPage', [
            'units' => Unit::select('id', 'nama', 'keterangan')->get()
        ]);
    }
    public function dashboardPage($unitId)
    {
        $authAdmin = Auth::guard('admin')->user();
        if ($authAdmin && $unitId == $authAdmin->unit_id) {
            return Inertia::render('Admin/AdminUnit/AdminDashboardPage', [
                'pegawais' => Pegawai::where('unit_id', $unitId)->get(),
            ]);
        }
        abort(403);
    }
    public function pegawaiIndexPage()
    {
        return Inertia::render('Admin/AdminUnit/Pegawai/Index', [
            'pegawais' => fn () => DB::table('pegawai')
                ->select(
                    'pegawai.id',
                    'pegawai.nip',
                    'pegawai.nama',
                    'pegawai.unit_id',
                    'pegawai.status_pegawai_id as statusPegawaiId',
                    'pegawai.created_at',
                    'unit.nama as unit_nama',
                    'status_pegawai.nama as statusPegawai_nama'
                )
                ->leftJoin('unit', 'pegawai.unit_id', '=', 'unit.id')
                ->leftJoin('status_pegawai', 'pegawai.status_pegawai_id', '=', 'status_pegawai.id')
                ->get()
        ]);
    }
}
