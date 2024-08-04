<?php

namespace App\Http\Controllers\Pages;

use App\Http\Controllers\Controller;
use App\Models\Admin;
use App\Models\Golongan;
use App\Models\Marhalah;
use App\Models\Pegawai;
use App\Models\StatusPegawai;
use App\Models\Unit;
use Illuminate\Database\QueryException;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Inertia\Inertia;

class AdminMasterPagesController extends Controller
{
    public function loginPage()
    {
        return Inertia::render('Admin/MASTER_LoginPage');
    }
    public function dashboardPage()
    {
        return Inertia::render('Admin/Master/HomePage');
    }
    public function unitIndexPage()
    {
        return Inertia::render('Admin/MASTER_UnitIndexPage', [
            'units' => fn () => Unit::select('id', 'nama', 'keterangan', 'created_at')
                ->with(['admin' => function ($query) {
                    $query->select('id', 'username', 'unit_id');
                }])->get(),
            'adminCount' => fn () => Admin::whereNotNull('unit_id')->count(),
            'admins' => Inertia::lazy(fn () => Admin::select('id', 'nama')->get())
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

            return Inertia::render('Admin/MASTER_UnitDetailsPage', [
                'unit' => $unit->only(['id', 'nama', 'keterangan', 'created_at'])
            ]);
        } catch (QueryException $exception) {
            abort(500);
        }
    }
    public function golonganIndexPage()
    {
        return Inertia::render('Admin/MASTER_GolonganIndexPage', [
            'golongans' => fn () => Golongan::select('id', 'nama', 'keterangan', 'created_at')->orderBy('nama', 'asc')->get(),
        ]);
    }
    public function marhalahIndexPage()
    {
        return Inertia::render('Admin/MASTER_MarhalahIndexPage', [
            'marhalahs' => fn () => Marhalah::select('id', 'nama', 'keterangan', 'created_at')->get(),
        ]);
    }
    public function marhalahDetailsPage(Request $request)
    {
        $idParam = $request->query->get('q');
        if (!$idParam) {
            abort(404);
        }

        try {
            $marhalah = Marhalah::find($idParam);
            if (!$marhalah) {
                abort(404);
            }

            return Inertia::render('Admin/MASTER_MarhalahDetailsPage', [
                'marhalah' => $marhalah->only(['id', 'nama', 'keterangan', 'created_at'])
            ]);
        } catch (QueryException $exception) {
            abort(500);
        }
    }
    public function adminIndexPage()
    {
        return Inertia::render('Admin/MASTER_AdminIndexPage', [
            'admins' => fn () => Admin::select('id', 'nama', 'username', 'unit_id', 'created_at')->with('unit')->whereNotNull('unit_id')->get(),
            'units' => fn () => Unit::select('id', 'nama')->get(),
        ]);
    }
    public function statusPegawaiDetailsPage(Request $request)
    {
        $idParam = $request->query->get('q');
        if (!$idParam) {
            abort(404);
        }

        try {
            $status = StatusPegawai::find($idParam);
            if (!$status) {
                abort(404);
            }

            return Inertia::render('Admin/MASTER_StatusPegawaiDetailsPage', [
                'status' => $status->only(['id', 'nama', 'keterangan', 'created_at'])
            ]);
        } catch (QueryException $exception) {
            abort(500);
        }
    }
    public function golonganDetailsPage(Request $request)
    {
        $idParam = $request->query->get('q');
        if (!$idParam) {
            abort(404);
        }

        try {
            $golongan = Golongan::find($idParam);
            if (!$golongan) {
                abort(404);
            }

            return Inertia::render('Admin/MASTER_GolonganDetailsPage', [
                'golongan' => $golongan->only(['id', 'nama', 'keterangan', 'created_at'])
            ]);
        } catch (QueryException $exception) {
            abort(500);
        }
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

            return Inertia::render('Admin/MASTER_AdminDetailsPage', [
                'admin' => $admin->only(['id', 'nama', 'username', 'created_at', 'unit'])
            ]);
        } catch (QueryException $exception) {
            abort(500);
        }
    }
    public function pegawaiIndexPage(Request $request)
    {
        return Inertia::render('Admin/MASTER_PegawaiIndexPage', [
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
    public function pegawaiCreatePage()
    {
        return Inertia::render('Admin/MASTER_PegawaiCreatePage', [
            'golongans' => fn () => Golongan::select('id', 'nama')->get(),
            'marhalahs' => fn () => Marhalah::select('id', 'nama')->get(),
            'statusPegawais' => fn () => StatusPegawai::select('id', 'nama')->get(),
            'units' => fn () => Unit::select('id', 'nama')->get(),
        ]);
    }

    public function statusPegawaiIndexPage()
    {
        return Inertia::render('Admin/MASTER_StatusPegawaiIndexPage', [
            'statusPegawais' => fn () => StatusPegawai::select('id', 'nama', 'keterangan', 'created_at')->get()
        ]);
    }
}
