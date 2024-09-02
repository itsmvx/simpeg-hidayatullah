<?php

namespace App\Http\Controllers\Pages;

use App\Http\Controllers\Controller;
use App\Models\Golongan;
use App\Models\Marhalah;
use App\Models\Pegawai;
use App\Models\PeriodeRekap;
use App\Models\RekapPegawai;
use App\Models\StatusPegawai;
use Illuminate\Contracts\Auth\Authenticatable;
use Illuminate\Database\QueryException;
use Illuminate\Http\Request;
use Illuminate\Support\Arr;
use Illuminate\Support\Facades\Auth;
use Inertia\Inertia;

class PegawaiPagesController extends Controller
{
    private ?Authenticatable $authUser;
    private $pegawaiId;

    public function __construct()
    {
        $this->authUser = Auth::guard('pegawai')->user();

        if (!$this->authUser) {
            abort(403);
        }

        $this->pegawaiId = $this->authUser->id;
    }
    public function dashboardPage()
    {

        return Inertia::render('Pegawai/PEGAWAI_DashboardPage', [
            'unit' => fn() => Pegawai::select('unit_id')->where('id', '=', $this->pegawaiId)->with('unit:id,nama')->first()->makeHidden('unit_id'),
            'rekapPegawai' => fn() => [
                'count' => RekapPegawai::where('terverifikasi', '=', false)
                    ->where('pegawai_id', '=', $this->pegawaiId)
                    ->count(),
                'lastUpdate' => RekapPegawai::where('pegawai_id', '=', $this->pegawaiId)->latest('updated_at')->value('updated_at')
            ],
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
        ])->where('unit_id', '=', $this->pegawaiId);

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
            return Inertia::render('Admin/ADMIN_RekapPegawaiDetailsPage', [
                'rekap' => $rekapPegawai
            ]);
        } catch (QueryException $exception) {
            abort(500);
        }
    }
}
