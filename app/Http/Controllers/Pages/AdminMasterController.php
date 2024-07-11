<?php

namespace App\Http\Controllers\Pages;

use App\Http\Controllers\Controller;
use App\Models\Admin;
use App\Models\Golongan;
use App\Models\Kader;
use App\Models\Pegawai;
use App\Models\Unit;
use Illuminate\Database\QueryException;
use Illuminate\Http\Request;
use Inertia\Inertia;

class AdminMasterController extends Controller
{
    public function loginPage()
    {
        return Inertia::render('Admin/MasterLoginPage');
    }
    public function unitIndexPage()
    {
        return Inertia::render('Admin/Master/UnitIndexPage', [
            'units' => fn() => Unit::select('id', 'nama', 'created_at')
                ->with(['admin' => function($query) {
                    $query->select('id', 'username', 'unit_id');
                }])->get(),
            'adminCount' => fn() => Admin::whereNotNull('unit_id')->count(),
            'admins' => Inertia::lazy(fn() => Admin::select('id', 'nama')->get())
        ]);
    }
    public function unitDetailsPage(Request $request)
    {
        $idParam = $request->query->get('q');
        if (!$idParam) {
            abort(404);
        }

        try {
            $unit = Unit::find($idParam);
            if (!$unit) {
                abort(404);
            }

            return Inertia::render('Admin/Master/UnitDetailsPage', [
                'unit' => $unit->only(['id', 'nama', 'keterangan', 'created_at'])
            ]);
        } catch (QueryException $exception) {
            abort(500);
        }
    }
    public function golonganIndexPage()
    {
        return Inertia::render('Admin/Master/GolonganIndexPage', [
            'golongans' => fn() => Golongan::select('id', 'nama', 'keterangan', 'created_at')->get(),
        ]);
    }
    public function kaderIndexPage()
    {
        return Inertia::render('Admin/Master/KaderIndexPage', [
            'kaders' => fn() => Kader::select('id', 'nama', 'keterangan', 'created_at')->get(),
        ]);
    }
    public function adminIndexPage()
    {
        return Inertia::render('Admin/Master/AdminIndexPage', [
            'admins' => fn() => Admin::select('id', 'nama', 'username', 'unit_id', 'created_at')->with('unit')->whereNotNull('unit_id')->get(),
            'units' => fn() => Unit::select('id', 'nama', 'is_master as isMaster')->get(),
        ]);
    }
    public function adminDetailsPage(Request $request)
    {
        $idParam = $request->query->get('q');
        if (!$idParam) {
            abort(404);
        }

        try {
            $admin = Admin::where('id', '=', $idParam)->with('unit')->first();
            if (!$admin) {
                abort(404);
            }

            return Inertia::render('Admin/Master/AdminDetailsPage', [
                'admin' => $admin->only(['id', 'nama', 'username', 'created_at', 'unit'])
            ]);
        } catch (QueryException $exception) {
            abort(500);
        }
    }
    public function pegawaiIndexPage(Request $request)
    {
        return Inertia::render('Admin/Master/PegawaiIndexPage', [
            'pegawais' => fn() => Pegawai::select('id', 'nama', 'username', 'unit_id as unitId', 'created_at')->with('unit')->get(),
        ]);
    }
    public function pegawaiCreatePage()
    {
        return Inertia::render('Admin/Master/PegawaiCreatePage');
    }
}
