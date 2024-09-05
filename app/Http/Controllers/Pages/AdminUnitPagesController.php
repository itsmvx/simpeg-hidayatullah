<?php

namespace App\Http\Controllers\Pages;

use App\Http\Controllers\Controller;
use App\Models\Golongan;
use App\Models\Marhalah;
use App\Models\Pegawai;
use App\Models\PengajuanPromosi;
use App\Models\PeriodeRekap;
use App\Models\RekapPegawai;
use App\Models\StatusPegawai;
use App\Models\Unit;
use Carbon\Carbon;
use Illuminate\Contracts\Auth\Authenticatable;
use Illuminate\Database\QueryException;
use Illuminate\Http\Request;
use Illuminate\Support\Arr;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\DB;
use Inertia\Inertia;

class AdminUnitPagesController extends Controller
{
    private ?Authenticatable $authUser;
    private $unitId;

    public function __construct()
    {
        $this->authUser = Auth::guard('admin')->user();

        if (!$this->authUser || !$this->authUser->unit_id) {
            abort(403);
        }

        $this->unitId = $this->authUser->unit_id;
    }
    public function dashboardPage()
    {

        return Inertia::render('Admin/ADMIN_DashboardPage', [
            'pegawai' => fn() => [
                'count' => Pegawai::where('unit_id', '=', $this->unitId)->count(),
                'lastUpdate' => Pegawai::where('unit_id', '=', $this->unitId)->latest('updated_at')->value('updated_at')
            ],
            'rekapPegawai' => fn() => [
                'count' => RekapPegawai::where('terverifikasi', '=', false)
                    ->where('unit_id', '=', $this->unitId)
                    ->count(),
                'lastUpdate' => RekapPegawai::where('unit_id', '=', $this->unitId)->latest('updated_at')->value('updated_at')
            ],
            'pengajuanPromosi' => fn() => [
                'count' => PengajuanPromosi::where('status_pengajuan', '=', 'menunggu')
                    ->where('unit_id', '=', $this->unitId)
                    ->count(),
                'lastUpdate' => PengajuanPromosi::where('unit_id', '=', $this->unitId)->latest('updated_at')->value('updated_at')
            ]
        ]);
    }
    public function pegawaiIndexPage(Request $request)
    {
        $viewList = ["25", "50", "100", "150"];
        $viewPerPage = $request->query('view');

        if (!Arr::has($viewList, $viewPerPage)) {
            $viewPerPage = 25;
        } else {
            $viewPerPage = intval($viewPerPage);
        }

        $query = Pegawai::select([
            'id',
            'nip',
            'nama',
            'jenis_kelamin',
            'tanggal_promosi',
            'tanggal_marhalah',
            'status_pegawai_id',
            'marhalah_id',
            'golongan_id',
            'created_at',
        ])->with([
            'status_pegawai:id,nama',
            'marhalah:id,nama',
            'golongan:id,nama',
        ])->where('unit_id', '=', $this->unitId);

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
                $query->whereIn('jenis_kelamin', $filters['jenisKelamin']);
            }
            if (!empty($filters['unit'])) {
                $query->whereHas('unit', function ($q) use ($filters) {
                    $q->whereIn('nama', $filters['unit']);
                });
            }
        }

        $search = $request->query('search');
        if ($search) {
            $query->where('nama', 'like', '%' . $search . '%');
        }

        $pegawais = $query->paginate($viewPerPage)->withQueryString();

        return Inertia::render('Admin/ADMIN_PegawaiIndexPage', [
            'pagination' => fn() => $pegawais,
            'golongans' => fn() => Golongan::select('id', 'nama')->get(),
            'marhalahs' => fn() => Marhalah::select('id', 'nama')->get(),
            'statusPegawais' => fn() => StatusPegawai::select('id', 'nama')->get(),
            'currDate' => fn() => Carbon::now('Asia/Jakarta')->toDateString()
        ]);
    }

    public function pegawaiDetailsPage(Request $request)
    {
        $idParam = $request->query->get('q');
        if (!$idParam) {
            abort(404);
        }

        try {
            $pegawai = Pegawai::with([
                'golongan:id,nama',
                'marhalah:id,nama',
                'status_pegawai:id,nama',
                'unit:id,nama',
            ])
                ->find($idParam);
            if (!$pegawai) {
                abort(404);
            }

            $pegawai->makeHidden(['password', 'updated_at']);

            return Inertia::render('Admin/ADMIN_PegawaiDetailsPage', [
                'pegawai' => fn() => $pegawai,
                'golongans' => fn () => Golongan::select('id', 'nama')->get(),
                'marhalahs' => fn () => Marhalah::select('id', 'nama')->get(),
                'statusPegawais' => fn () => StatusPegawai::select('id', 'nama')->get(),
                'units' => fn () => Unit::select('id', 'nama')->get(),
                'currDate' => fn() => Carbon::now('Asia/Jakarta')->toDateString()
            ]);
        } catch (QueryException $exception) {
            abort(500);
        }
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
            'terverifikasi',
            'pegawai_id',
            'status_pegawai_id',
            'marhalah_id',
            'golongan_id',
            'periode_rekap_id',
            'created_at',
        ])->with([
            'pegawai:id,nama,jenis_kelamin',
            'status_pegawai:id,nama',
            'marhalah:id,nama',
            'golongan:id,nama',
            'periode_rekap:id,nama',
        ])->where('unit_id', '=', $this->unitId);

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

        return Inertia::render('Admin/ADMIN_RekapPegawaiIndexPage', [
            'pagination' => fn() => $rekaps,
            'golongans' => fn() => Golongan::select('id', 'nama')->get(),
            'marhalahs' => fn() => Marhalah::select('id', 'nama')->get(),
            'statusPegawais' => fn() => StatusPegawai::select('id', 'nama')->get(),
            'unverifiedCount' => RekapPegawai::where('terverifikasi', '=', false)->count(),
        ]);
    }
    public function rekapPegawaiCreatePage()
    {
        try {
            return Inertia::render('Admin/ADMIN_RekapPegawaiCreatePage', [
                'periodes' => fn() => PeriodeRekap::select('id', 'nama', 'awal', 'akhir')->where('status', '=', true)->get()
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
            $rekapPegawai = RekapPegawai::with([
                'golongan:id,nama',
                'unit:id,nama',
                'periode_rekap:id,nama',
                'status_pegawai:id,nama',
                'marhalah:id,nama',
                'pegawai:id,nama',
            ])->find($idParam);
            if (!$rekapPegawai) {
                abort(404);
            }
            $rekapPegawai->makeHidden(['created_at', 'updated_at']);
            return Inertia::render('Admin/ADMIN_RekapPegawaiDetailsPage', [
                'rekap' => $rekapPegawai
            ]);
        } catch (QueryException $exception) {
            abort(500);
        }
    }
    public function pengajuanPromosiIndexPage(Request $request)
    {
        $viewList = ["25", "50", "100", "150"];
        $viewPerPage = $request->query('view');

        if (!Arr::has($viewList, $viewPerPage)) {
            $viewPerPage = 25;
        } else {
            $viewPerPage = intval($viewPerPage);
        }

        $query = PengajuanPromosi::select([
            'id',
            'nama',
            'jenis',
            'pegawai_id',
            'unit_id',
            'admin_id',
            'admin_penyetuju_id',
            'asal_type',
            'asal_id',
            'akhir_type',
            'akhir_id',
            'created_at',
            'status_pengajuan'
        ])->with([
            'pegawai:id,nama',
            'unit:id,nama',
            'admin:id,nama',
            'admin_penyetuju:id,nama',
            'asal:id,nama',
            'akhir:id,nama',
        ])->where('unit_id', '=', $this->unitId);

        $search = $request->query('search');
        if ($search) {
            $query->whereHas('pegawai', function ($q) use ($search) {
                $q->where('nama', 'like', '%' . $search . '%');
            });
        }

        $pengajuanPromosis = $query->paginate($viewPerPage)->withQueryString();

        return Inertia::render('Admin/ADMIN_PengajuanPromosiIndexPage', [
            'pagination' => fn() => $pengajuanPromosis,
        ]);
    }
    public function pengajuanPromosiCreatePage()
    {
        $admin = Auth::guard('admin')->user();
        if (!$admin) {
            abort(403);
        } else if (!$admin->unit_id) {
            abort(403);
        }
        try {
            return Inertia::render('Admin/ADMIN_PengajuanPromosiCreatePage', [
                'admin' => [
                    'id' => $admin->id,
                    'unit_id' => $admin->unit_id
                ],
                'pegawais' => fn() => Pegawai::select('id', 'nama', 'golongan_id', 'marhalah_id', 'status_pegawai_id')
                    ->with(['golongan:id,nama', 'marhalah:id,nama', 'status_pegawai:id,nama'])
                    ->where('unit_id', '=', $this->unitId)
                    ->get()
                    ->makeHidden(['golongan_id', 'marhalah_id', 'status_pegawai_id']),
                'golongans' => fn() => Golongan::select('id', 'nama')->get(),
                'marhalahs' => fn() => Marhalah::select('id', 'nama')->get(),
                'statusPegawais' => fn() => StatusPegawai::select('id', 'nama')->get(),
            ]);
        } catch (QueryException $exception) {
            abort(500);
        }
    }
    public function pengajuanPromosiDetailsPage(Request $request)
    {
        $idParam = $request->query->get('q');
        if (!$idParam) {
            abort(404);
        }

        try {
            $pengajuanPromosi = PengajuanPromosi::select([
                'id',
                'nama',
                'jenis',
                'pegawai_id',
                'admin_id',
                'admin_penyetuju_id',
                'asal_type',
                'asal_id',
                'akhir_type',
                'akhir_id',
                'created_at',
                'status_pengajuan'
            ])->with([
                'pegawai:id,nama',
                'admin:id,nama',
                'admin_penyetuju:id,nama',
                'asal:id,nama',
                'akhir:id,nama',
            ])->find($idParam);

            if (!$pengajuanPromosi) {
                abort(404);
            }

            return Inertia::render('Admin/ADMIN_PengajuanPromosiDetailsPage', [
                'pengajuanPromosi' => $pengajuanPromosi
            ]);
        } catch (QueryException $exception) {
            abort(500);
        }
    }
}
