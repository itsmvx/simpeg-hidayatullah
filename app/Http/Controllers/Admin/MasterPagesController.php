<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\Admin;
use App\Models\Golongan;
use App\Models\Kader;
use App\Models\Unit;
use Illuminate\Support\Facades\Request;
use Inertia\Inertia;

class MasterPagesController extends Controller
{
    public function manageUnitPage(Request $request)
    {
        return Inertia::render('Admin/Master/ManageUnitPage', [
            'units' => fn() => Unit::select('id', 'nama', 'created_at')
                ->with(['admin' => function($query) {
                    $query->select('id', 'username', 'unit_id');
                }])->get(),
            'adminCount' => fn() => Admin::count(),
            'admins' => Inertia::lazy(fn() => Admin::select('id', 'nama')->get())
        ]);
    }
    public function manageGolonganPage(Request $request)
    {
        return Inertia::render('Admin/Master/ManageGolonganPage', [
            'golongans' => fn() => Golongan::select('id', 'nama', 'keterangan', 'created_at')->get(),
        ]);
    }
    public function manageKaderPage(Request $request)
    {
        return Inertia::render('Admin/Master/ManageKaderPage', [
            'kaders' => fn() => Kader::select('id', 'nama', 'keterangan', 'created_at')->get(),
        ]);
    }
    public function manageAdminPage(Request $request)
    {
        return Inertia::render('Admin/Master/ManageAdminPage', [
            'admins' => fn() => Admin::select('id', 'nama', 'username', 'unit_id', 'created_at')->with('unit')->get(),
            'units' => fn() => Unit::select('id', 'nama', 'is_master as isMaster')->get(),
        ]);
    }
}
