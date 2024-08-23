<?php

namespace App\Http\Controllers\Pages;

use App\Http\Controllers\Controller;
use App\Models\Golongan;
use App\Models\Marhalah;
use App\Models\Pegawai;
use App\Models\RekapPegawai;
use App\Models\StatusPegawai;
use App\Models\Unit;
use Illuminate\Database\QueryException;
use Illuminate\Http\Request;
use Illuminate\Support\Arr;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\DB;
use Inertia\Inertia;

class AdminUnitPagesController extends Controller
{
    public function dashboardPage()
    {
        $admin = Auth::guard('admin')->user();
        if (!$admin || !$admin->unit_id) {
            abort(403);
        }

        return Inertia::render('Admin/ADMIN_DashboardPage', [
            'pegawai' => fn() => [
                'count' => Pegawai::where('unit_id', '=', $admin->unit_id)->count(),
                'lastUpdate' => Pegawai::where('unit_id', '=', $admin->unit_id)->latest('updated_at')->value('updated_at')
            ],
            'rekapPegawai' => fn() => [
                'count' => RekapPegawai::where('terverifikasi', '=', false)
                    ->where('unit_id', '=', $admin->unit_id)
                    ->count(),
                'lastUpdate' => RekapPegawai::where('unit_id', '=', $admin->unit_id)->latest('updated_at')->value('updated_at')
            ],
        ]);
    }
    public function pegawaiIndexPage(Request $request)
    {
        $authUser = Auth::guard('admin')->user();
        if (!$authUser || !$authUser->unit_id) {
            abort(403);
        }
        $unitId = $authUser->unit_id;

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
            'status_pegawai_id',
            'marhalah_id',
            'golongan_id',
            'created_at',
            DB::raw('DATEDIFF(CURDATE(), tanggal_promosi) as lama_promosi'),
        ])->with([
            'status_pegawai:id,nama',
            'marhalah:id,nama',
            'golongan:id,nama',
        ])->where('unit_id', '=', $unitId);

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

        return Inertia::render('Admin/ADMIN_PegawaiIndexPage', [
            'pagination' => fn() => $pegawais,
            'golongans' => fn() => Golongan::select('id', 'nama')->get(),
            'marhalahs' => fn() => Marhalah::select('id', 'nama')->get(),
            'statusPegawais' => fn() => StatusPegawai::select('id', 'nama')->get(),
            'units' => fn() => Unit::select('id', 'nama')->get(),
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
                ->with([
                    'status_pegawai:id,nama',
                    'marhalah:id,nama',
                    'golongan:id,nama',
                    'unit:id,nama',
                ])
                ->find($idParam);
            if (!$pegawai) {
                abort(404);
            }

            $pegawai->makeHidden(['password', 'updated_at', 'status_pegawai_id', 'marhalah_id', 'golongan_id', 'unit_id']);

            return Inertia::render('Admin/ADMIN_PegawaiDetailsPage', [
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
}
