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
use Illuminate\Support\Arr;
use Carbon\Carbon;
use Illuminate\Support\Facades\DB;
use Inertia\Inertia;

class AdminMasterPagesController extends Controller
{
    public function loginPage()
    {
        return Inertia::render('Master/MASTER_LoginPage');
    }
    public function dashboardPage()
    {
        return Inertia::render('Master/MASTER_DashboardPage', [
            'unit' => fn() => [
                'count' => Unit::count(),
                'lastUpdate' => Unit::latest('updated_at')->value('updated_at')
            ],
            'golongan' => fn() => [
                'count' => Golongan::count(),
                'lastUpdate' => Golongan::latest('updated_at')->value('updated_at')
            ],
            'marhalah' => fn() => [
                'count' => Marhalah::count(),
                'lastUpdate' => Marhalah::latest('updated_at')->value('updated_at')
            ],
            'admin' => fn() => [
                'count' => Admin::count(),
                'lastUpdate' => Admin::latest('updated_at')->value('updated_at')
            ],
            'pegawai' => fn() => [
                'count' => Pegawai::count(),
                'lastUpdate' => Pegawai::latest('updated_at')->value('updated_at')
            ],
            'statusPegawai' => fn() => [
                'count' => StatusPegawai::count(),
                'lastUpdate' => StatusPegawai::latest('updated_at')->value('updated_at')
            ],
            'rekapPegawai' => fn() => [
                'count' => RekapPegawai::where('terverifikasi', '=', false)->count(),
                'lastUpdate' => RekapPegawai::latest('updated_at')->value('updated_at')
            ],
            'periodeRekap' => fn() => [
                'count' => PeriodeRekap::count(),
                'lastUpdate' => PeriodeRekap::latest('updated_at')->value('updated_at')
            ]
        ]);
    }
    public function unitIndexPage(Request $request)
    {
        $viewList = [10,25,50,100];
        $viewPerPage = $request->query('view');

        if (!is_numeric($viewPerPage) || intval($viewPerPage) <= 0 || !Arr::has($viewList, $viewPerPage)) {
            $viewPerPage = 10;
        } else {
            $viewPerPage = intval($viewPerPage);
        }

        $query = Unit::select('id', 'nama', 'keterangan', 'created_at')
            ->with(['admin' => function ($query) {
                $query->select('id', 'username', 'unit_id');
            }]);

        $units = $query->paginate($viewPerPage)->withQueryString();

        return Inertia::render('Master/MASTER_UnitIndexPage', [
            'pagination' => fn() => $units,
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

            return Inertia::render('Master/MASTER_UnitDetailsPage', [
                'unit' => fn() => $unit->only(['id', 'nama', 'keterangan', 'created_at'])
            ]);
        } catch (QueryException $exception) {
            abort(500);
        }
    }
    public function golonganIndexPage(Request $request)
    {
        $viewList = [10,25,50,100];
        $viewPerPage = $request->query('view');

        if (!is_numeric($viewPerPage) || intval($viewPerPage) <= 0 || !Arr::has($viewList, $viewPerPage)) {
            $viewPerPage = 10;
        } else {
            $viewPerPage = intval($viewPerPage);
        }

        $query = Golongan::select('id', 'nama', 'keterangan', 'created_at')->orderBy('nama', 'asc');

        $golongans = $query->paginate($viewPerPage)->withQueryString();

        return Inertia::render('Master/MASTER_GolonganIndexPage', [
            'pagination' => fn() => $golongans,
        ]);
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

            return Inertia::render('Master/MASTER_GolonganDetailsPage', [
                'golongan' => fn() => $golongan->only(['id', 'nama', 'keterangan', 'created_at'])
            ]);
        } catch (QueryException $exception) {
            abort(500);
        }
    }
    public function marhalahIndexPage(Request $request)
    {
        $viewList = [10,25,50,100];
        $viewPerPage = $request->query('view');

        if (!is_numeric($viewPerPage) || intval($viewPerPage) <= 0 || !Arr::has($viewList, $viewPerPage)) {
            $viewPerPage = 10;
        } else {
            $viewPerPage = intval($viewPerPage);
        }

        $query = Marhalah::select('id', 'nama', 'keterangan', 'created_at');

        $marhalahs = $query->paginate($viewPerPage)->withQueryString();

        return Inertia::render('Master/MASTER_MarhalahIndexPage', [
            'pagination' => fn() => $marhalahs,
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

            return Inertia::render('Master/MASTER_MarhalahDetailsPage', [
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

            return Inertia::render('Master/MASTER_StatusPegawaiDetailsPage', [
                'statusPegawai' => $status->only(['id', 'nama', 'keterangan', 'created_at'])
            ]);
        } catch (QueryException $exception) {
            abort(500);
        }
    }
    public function adminIndexPage(Request $request)
    {
        $viewList = [10,25,50,100];
        $viewPerPage = $request->query('view');

        if (!is_numeric($viewPerPage) || intval($viewPerPage) <= 0 || !Arr::has($viewList, $viewPerPage)) {
            $viewPerPage = 10;
        } else {
            $viewPerPage = intval($viewPerPage);
        }

        $query = Admin::select('id', 'nama', 'username', 'unit_id', 'created_at')
            ->with('unit:id,nama')
            ->orderByRaw('unit_id IS NULL ASC')
            ->orderBy('nama', 'asc');
        $admins = $query->paginate($viewPerPage)->withQueryString();

        return Inertia::render('Master/MASTER_AdminIndexPage', [
            'pagination' => fn() => $admins,
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

            return Inertia::render('Master/MASTER_AdminDetailsPage', [
                'admin' => fn() => $admin,
                'units' => fn() => Unit::select('id', 'nama')->get()
            ]);
        } catch (QueryException $exception) {
            abort(500);
        }
    }
    public function pegawaiIndexPage(Request $request)
    {
        $viewList = [10,25,50,100];
        $viewPerPage = $request->query('view');

        if (!is_numeric($viewPerPage) || intval($viewPerPage) <= 0 || !Arr::has($viewList, $viewPerPage)) {
            $viewPerPage = 10;
        } else {
            $viewPerPage = intval($viewPerPage);
        }

        $query = Pegawai::select([
            'id',
            'nip',
            'nama',
            'jenis_kelamin',
            'tanggal_promosi',
            'unit_id',
            'status_pegawai_id',
            'marhalah_id',
            'golongan_id',
            'created_at',
            DB::raw('DATEDIFF(CURDATE(), tanggal_promosi) as lama_promosi'),
        ])->with([
            'unit:id,nama',
            'status_pegawai:id,nama',
            'marhalah:id,nama',
            'golongan:id,nama',
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

        $pegawais = $query->paginate($viewPerPage)->withQueryString();

        return Inertia::render('Master/MASTER_PegawaiIndexPage', [
            'pagination' => fn() => $pegawais,
            'golongans' => fn() => Golongan::select('id', 'nama')->get(),
            'marhalahs' => fn() => Marhalah::select('id', 'nama')->get(),
            'statusPegawais' => fn() => StatusPegawai::select('id', 'nama')->get(),
            'units' => fn() => Unit::select('id', 'nama')->get(),
        ]);
    }
    public function pegawaiCreatePage()
    {
        return Inertia::render('Master/MASTER_PegawaiCreatePage', [
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
            $pegawai = Pegawai::select('*', DB::raw('DATEDIFF(CURDATE(), tanggal_promosi) as lama_promosi'))
                ->find($idParam);
            if (!$pegawai) {
                abort(404);
            }

            $pegawai->makeHidden(['password', 'updated_at']);

            return Inertia::render('Master/MASTER_PegawaiDetailsPage', [
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

    public function statusPegawaiIndexPage(Request $request)
    {
        $viewList = [10,25,50,100];
        $viewPerPage = $request->query('view');

        if (!is_numeric($viewPerPage) || intval($viewPerPage) <= 0 || !Arr::has($viewList, $viewPerPage)) {
            $viewPerPage = 10;
        } else {
            $viewPerPage = intval($viewPerPage);
        }

        $query = StatusPegawai::select('id', 'nama', 'keterangan', 'created_at');

        $statusPegawai = $query->paginate($viewPerPage)->withQueryString();

        return Inertia::render('Master/MASTER_StatusPegawaiIndexPage', [
            'pagination' => fn() => $statusPegawai,
        ]);
    }

    public function rekapPegawaiIndexPage(Request $request)
    {
        $viewList = [10,25,50,100];
        $viewPerPage = $request->query('view');

        if (!is_numeric($viewPerPage) || intval($viewPerPage) <= 0 || !Arr::has($viewList, $viewPerPage)) {
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

        return Inertia::render('Master/MASTER_RekapPegawaiIndexPage', [
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
            return Inertia::render('Master/MASTER_RekapPegawaiCreatePage', [
                'units' => Unit::select('id', 'nama')->get(),
                'golongans' => fn() => Golongan::select('id', 'nama')->get(),
                'marhalahs' => fn() => Marhalah::select('id', 'nama')->get(),
                'statusPegawais' => fn() => StatusPegawai::select('id', 'nama')->get()
            ]);
        } catch (QueryException $exception) {
            abort(500);
        }
    }
    public function rekapPegawaiDetailsPage(Request $request)
    {
        $idParam = $request->query->get('q');
        if (!$idParam) {
            abort(404);
        }

        try {
            $rekapPegawai = RekapPegawai::find($idParam)->with([
                'golongan:id,nama',
                'unit:id,nama',
                'periode_rekap:id,nama',
                'status_pegawai:id,nama',
                'marhalah:id,nama',
                'pegawai:id,nama',
            ])->first();
            if (!$rekapPegawai) {
                abort(404);
            }
            $rekapPegawai->makeHidden(['created_at', 'updated_at']);
            return Inertia::render('Master/MASTER_RekapPegawaiDetailsPage', [
                'rekap' => $rekapPegawai
            ]);
        } catch (QueryException $exception) {
            abort(500);
        }
    }

    public function periodeRekapIndexPage(Request $request)
    {
        $viewList = [10,25,50,100];
        $viewPerPage = $request->query('view');

        if (!is_numeric($viewPerPage) || intval($viewPerPage) <= 0 || !Arr::has($viewList, $viewPerPage)) {
            $viewPerPage = 10;
        } else {
            $viewPerPage = intval($viewPerPage);
        }

        $query = PeriodeRekap::select('id', 'nama', 'keterangan', 'awal', 'akhir', 'jenis', 'status')
            ->orderBy('akhir', 'desc')
            ->orderBy('awal', 'asc');

        $periodeRekaps = $query->paginate($viewPerPage)->withQueryString();

        return Inertia::render('Master/MASTER_PeriodeRekapIndexPage', [
            'pagination' => fn() => $periodeRekaps,
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
            return Inertia::render('Master/MASTER_PeriodeRekapDetailsPage', [
                'periode' => $periode
            ]);
        } catch (QueryException $exception) {
            abort(500);
        }
    }
}
