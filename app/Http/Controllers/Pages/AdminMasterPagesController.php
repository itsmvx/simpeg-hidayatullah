<?php

namespace App\Http\Controllers\Pages;

use App\Http\Controllers\Controller;
use App\Models\Admin;
use App\Models\Golongan;
use App\Models\Marhalah;
use App\Models\Pegawai;
use App\Models\PeriodeRekap;
use App\Models\RekapPegawai;
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
                'unit' => fn() => $unit->only(['id', 'nama', 'keterangan', 'created_at'])
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
                'marhalah' => fn() => $marhalah->only(['id', 'nama', 'keterangan', 'created_at'])
            ]);
        } catch (QueryException $exception) {
            abort(500);
        }
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
                'golongan' => fn() => $golongan->only(['id', 'nama', 'keterangan', 'created_at'])
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
    public function adminDetailsPage(Request $request)
    {
        $idParam = $request->query->get('q');
        if (!$idParam) {
            abort(404);
        }

        try {
            $admin = Admin::select('id', 'nama', 'username', 'unit_id', 'created_at')
                ->where('id', '=', $idParam)
                ->first();
            if (!$admin) {
                abort(404);
            }

            return Inertia::render('Admin/MASTER_AdminDetailsPage', [
                'admin' => fn() => $admin,
                'units' => fn() => Unit::select('id', 'nama')->get()
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
    public function pegawaiDetailsPage(Request $request)
    {
        $idParam = $request->query->get('q');
        if (!$idParam) {
            abort(404);
        }

        try {
            $pegawai = Pegawai::find($idParam);
            if (!$pegawai) {
                abort(404);
            }

            $pegawai->makeHidden(['password', 'updated_at']);

            return Inertia::render('Admin/MASTER_PegawaiDetailsPage', [
                'pegawai' => fn() => $pegawai,
                'golongans' => fn () => Golongan::select('id', 'nama')->get(),
                'marhalahs' => fn () => Marhalah::select('id', 'nama')->get(),
                'statusPegawais' => fn () => StatusPegawai::select('id', 'nama')->get(),
                'units' => fn () => Unit::select('id', 'nama')->get(),
            ]);
        } catch (QueryException $exception) {
            abort(500);
        }
    }

    public function statusPegawaiIndexPage()
    {
        return Inertia::render('Admin/MASTER_StatusPegawaiIndexPage', [
            'statusPegawais' => fn () => StatusPegawai::select('id', 'nama', 'keterangan', 'created_at')->get()
        ]);
    }

    public function rekapPegawaiIndexPage(Request $request)
    {
        $viewPerPage = $request->query('view');

        if (!is_numeric($viewPerPage) || intval($viewPerPage) <= 0) {
            $viewPerPage = 10;
        } else {
            $viewPerPage = intval($viewPerPage);
        }

        $query = RekapPegawai::select([
            'id',
            'amanah',
            'unit_id',
            'pegawai_id',
            'status_pegawai_id',
            'marhalah_id',
            'golongan_id',
            'periode_rekap_id',
            'created_at',
        ])->with([
            'unit:id,nama',
            'pegawai:id,nama,jenis_kelamin',
            'status_pegawai:id,nama',
            'marhalah:id,nama',
            'golongan:id,nama',
            'periode_rekap:id,nama',
        ]);

        if ($request->has('filter')) {
            $filters = json_decode(base64_decode($request->query('filter')), true);

            if (!empty($filters['marhalah'])) {
                $query->whereHas('marhalah', function ($q) use ($filters) {
                    $q->whereIn('nama', $filters['marhalah']);
                });
            }
            if (!empty($filters['golongan'])) {
                $query->whereHas('golongan', function ($q) use ($filters) {
                    $q->whereIn('nama', $filters['golongan']);
                });
            }
            if (!empty($filters['statusPegawai'])) {
                $query->whereHas('status_pegawai', function ($q) use ($filters) {
                    $q->whereIn('nama', $filters['statusPegawai']);
                });
            }
            if (!empty($filters['jenisKelamin'])) {
                $query->whereHas('pegawai', function ($q) use ($filters) {
                    $q->whereIn('jenis_kelamin', $filters['jenisKelamin']);
                });
            }
            if (!empty($filters['unit'])) {
                $query->whereHas('unit', function ($q) use ($filters) {
                    $q->whereIn('nama', $filters['unit']);
                });
            }
        }

        $rekaps = $query->paginate($viewPerPage)->withQueryString();

        return Inertia::render('Admin/MASTER_RekapPegawaiIndexPage', [
            'pagination' => fn() => $rekaps,
            'golongans' => fn() => Golongan::select('id', 'nama')->get(),
            'marhalahs' => fn() => Marhalah::select('id', 'nama')->get(),
            'statusPegawais' => fn() => StatusPegawai::select('id', 'nama')->get(),
            'units' => fn() => Unit::select('id', 'nama')->get(),
            'unverifiedCount' => RekapPegawai::where('terverifikasi', '=', false)->count(),
        ]);
    }


    public function rekapPegawaiCreatePage()
    {
        try {
            return Inertia::render('Admin/MASTER_RekapPegawaiCreatePage', [
                'units' => Unit::select('id', 'nama')->get(),
                'periodes' => PeriodeRekap::select('id', 'nama')->where('status', '=', true)->get(),
            ]);
        } catch (QueryException $exception) {
            abort(500);
        }
    }

    public function periodeRekapIndexPage()
    {
        return Inertia::render('Admin/MASTER_PeriodeRekapIndexPage', [
            'periodes' => fn() => PeriodeRekap::select('id', 'nama', 'keterangan', 'awal', 'akhir', 'jenis', 'status')->get(),
            'opensCount' => fn() => PeriodeRekap::where('status', '=', true)->count()
        ]);
    }
    public function periodeRekapDetailsPage(Request $request)
    {
        $idParam = $request->query->get('q');
        if (!$idParam) {
            abort(404);
        }

        try {
            $periode = PeriodeRekap::find($idParam);
            if (!$periode) {
                abort(404);
            }
            $periode->makeHidden(['created_at', 'updated_at']);
            return Inertia::render('Admin/MASTER_PeriodeRekapDetailsPage', [
                'periode' => $periode
            ]);
        } catch (QueryException $exception) {
            abort(500);
        }
    }
}
