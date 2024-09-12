<?php

namespace App\Http\Controllers\Pages;

use App\Http\Controllers\Controller;
use App\Models\Golongan;
use App\Models\Marhalah;
use App\Models\Pegawai;
use App\Models\PeriodeRekap;
use App\Models\RekapPegawai;
use App\Models\StatusPegawai;
use App\Models\Unit;
use Illuminate\Contracts\Auth\Authenticatable;
use Illuminate\Database\QueryException;
use Illuminate\Http\Request;
use Illuminate\Support\Arr;
use Illuminate\Support\Carbon;
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
            'data' => fn() => [
                'rekapPegawai' => fn() => RekapPegawai::where('pegawai_id', '=', $this->pegawaiId)
                    ->where('terverifikasi', true)
                    ->count(),
                'unit' => Auth::guard('pegawai')->user()->unit->nama ?? '-',
                'amanah' => Auth::guard('pegawai')->user()->amanah ?? '-',
                'currDateTime' => Carbon::now()->toDateTimeString()
            ]
        ]);
    }
    public function profilePage()
    {
        try {
            $pegawai = Pegawai::with([
                'golongan:id,nama',
                'marhalah:id,nama',
                'status_pegawai:id,nama',
                'unit:id,nama',
            ])
                ->find($this->pegawaiId);
            if (!$pegawai) {
                abort(404);
            }

            $pegawai->makeHidden(['password', 'updated_at']);

            return Inertia::render('Pegawai/PEGAWAI_ProfilePage', [
                'pegawai' => fn() => $pegawai,
                'currDate' => fn() => Carbon::now('Asia/Jakarta')->toDateString()
            ]);
        } catch (QueryException $exception) {
            abort(500);
        }
    }
    public function rekapPegawaiIndexPage(Request $request)
    {
        $viewList = ["25", "50", "100", "150"];
        $viewPerPage = $request->query('view');

        if (!Arr::has($viewList, $viewPerPage)) {
            $viewPerPage = 25;
        } else {
            $viewPerPage = intval($viewPerPage);
        }

        $query = RekapPegawai::select([
            'id',
            'amanah',
            'pegawai_id',
            'status_pegawai_id',
            'marhalah_id',
            'golongan_id',
            'periode_rekap_id',
            'unit_id',
        ])->with([
            'pegawai:id,nama,jenis_kelamin',
            'status_pegawai:id,nama',
            'marhalah:id,nama',
            'golongan:id,nama',
            'periode_rekap:id,nama',
            'unit:id,nama'
        ])->where('pegawai_id', '=', $this->pegawaiId);

        $rekaps = $query->paginate($viewPerPage)->withQueryString();

        return Inertia::render('Pegawai/PEGAWAI_RekapPegawaiIndex', [
            'pagination' => fn() => $rekaps,
        ]);
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
            return Inertia::render('Pegawai/PEGAWAI_RekapPegawaiDetailsPage', [
                'rekap' => $rekapPegawai
            ]);
        } catch (QueryException $exception) {
            abort(500);
        }
    }
}
