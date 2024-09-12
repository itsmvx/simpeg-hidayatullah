<?php

namespace App\Http\Controllers;

use App\Models\PeriodeRekap;
use App\Models\RekapPegawai;
use Illuminate\Database\QueryException;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Response;
use Illuminate\Support\Facades\Validator;

class PeriodeRekapController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index()
    {
        //
    }

    /**
     * Show the form for creating a new resource.
     */
    public function create(Request $request)
    {
        $validation = Validator::make($request->only(['nama', 'keterangan', 'awal', 'akhir', 'jenis', 'status']), [
            'nama' => 'required|string',
            'keterangan' => 'required|string',
            'awal' => 'required|date',
            'akhir' => 'required|date',
            'jenis' => 'required|in:mingguan,bulanan,semesteran,tahunan',
            'status' => 'nullable|boolean'
        ], [
            'nama.required' => 'Nama tidak boleh kosong',
            'keterangan.required' => 'Keterangan tidak boleh kosong',
            'awal.required' => 'Awal periode tidak boleh kosong le',
            'akhir.required' => 'Akhir periode tidak boleh kosong',
            'jenis.required' => 'Jenis periode tidak boleh kosong',
            'jenis.in' => 'Jenis periode tidak valid',
        ]);

        if ($validation->fails()) {
            return response()->json([
                'message' => $validation->errors()->first()
            ], 422);
        }

        try {
            PeriodeRekap::create([
                'nama' => $request->nama,
                'keterangan' => $request->keterangan,
                'awal' => $request->awal,
                'akhir' => $request->akhir,
                'jenis' => $request->jenis,
                'status' => $request->status ?? false,
            ]);

            return response()->json([
                'message' => 'Periode rekap berhasil dibuat',
            ], 201);

        } catch (QueryException $exception) {
            if ($exception->errorInfo[1] == 1062) {
                return Response::json([
                    'message' => 'Periode rekap dengan nama tersebut sudah ada.'
                ], 422);
            }

            return Response::json([
                'message' => 'Terjadi kesalahan saat membuat periode rekap.'
            ], 500);
        }
    }


    /**
     * Store a newly created resource in storage.
     */
    public function store(Request $request)
    {
        //
    }

    /**
     * Display the specified resource.
     */
    public function show(PeriodeRekap $periodeRekap)
    {
        //
    }

    /**
     * Show the form for editing the specified resource.
     */
    public function edit(PeriodeRekap $periodeRekap)
    {
        //
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(Request $request)
    {
        $validation = Validator::make($request->only(['id', 'nama', 'keterangan', 'awal', 'akhir', 'jenis', 'status']), [
            'id' => 'required',
            'nama' => 'required|string',
            'keterangan' => 'required|string',
            'awal' => 'required|date',
            'akhir' => 'required|date',
            'jenis' => 'required|in:mingguan,bulanan,semesteran,tahunan',
            'status' => 'nullable|boolean'
        ], [
            'id.required' => 'Format periode tidak valid',
            'nama.required' => 'Nama tidak boleh kosong',
            'keterangan.required' => 'Keterangan tidak boleh kosong',
            'awal.required' => 'Awal masa periode tidak boleh kosong le',
            'akhir.required' => 'Akhir masa periode tidak boleh kosong',
            'jenis.required' => 'Jenis periode tidak boleh kosong',
            'jenis.in' => 'Jenis periode tidak valid',
            'status.boolean' => 'Status periode tidak valid',
        ]);
        if ($validation->fails()) {
            return Response::json([
                'message' => $validation->errors()->first()
            ], 422);
        }

        $periode = PeriodeRekap::find($request->get('id'));
        if (!$periode) {
            return Response::json([
                'message' => 'Periode rekap tidak ditemukan.'
            ], 404);
        }
        $periode->update([
            'nama' => $request->get('nama'),
            'keterangan' => $request->get('keterangan'),
            'awal' => $request->get('awal'),
            'akhir' => $request->get('akhir'),
            'jenis' => $request->get('jenis'),
            'status' => $request->get('status'),
        ]);

    }
    public function updateStatus(Request $request)
    {
        try {
            $validation = Validator::make($request->only(['id', 'status']), [
                'id' => 'required|exists:periode_rekap,id',
                'status' => 'required|boolean'
            ], [
                'id.required' => 'Id periode tidak boleh kosong',
                'id.exists' => 'Id periode tidak ditemukan',
                'status.required' => 'Status periode tidak boleh kosongs',
                'status.boolean' => 'Dibuka periode tidak valid',
            ]);
            if ($validation->fails()) {
                return Response::json([
                    'message' => $validation->errors()->first()
                ], 422);
            }
            PeriodeRekap::where('id', '=', ($request->get('id')))->update([
                'status' => $request->get('status')
            ]);
            return Response::json([
                'message' => 'Status periode rekap berhasil diubah'
            ], 201);
        } catch (QueryException $exception) {
            return Response::json([
                'message' => 'Server gagal memproses permintaan'
            ], 500);
        }
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(Request $request)
    {
        $validation = Validator::make($request->only('id'), [
            'id' => 'required|string'
        ], [
            'id.required' => 'Format Periode Rekap tidak valid'
        ]);
        if ($validation->fails()) {
            return Response::json([
                'message' => $validation->errors()->first(),
            ], 400);
        }
        $validated = $validation->validated();

        try {
            $periodeRekap = PeriodeRekap::find($validated['id']);
            if (!$periodeRekap) {
                return Response::json([
                    'message' => 'Periode Rekap tidak ditemukan!'
                ], 404);
            }
            if ($periodeRekap->delete()) {
                return Response::json([
                    'message' => 'Periode Rekap berhasil dihapus!'
                ]);
            } else {
                return Response::json([
                    'message' => 'Periode Rekap gagal dihapus!'
                ], 500);
            }
        } catch (QueryException $exception) {
            return Response::json([
                'message' => 'Server gagal memproses permintaan',
            ], 500);
        }
    }

    public function periodesToRekap(Request $request)
    {
        $validation = Validator::make($request->only('pegawai_id'), [
            'pegawai_id' => 'required|uuid|exists:pegawai,id',
        ], [
            'pegawai_id.required' => 'Pegawai tidak boleh kosong',
            'pegawai_id.uuid' => 'Pegawai ID tidak valid',
            'pegawai_id.exists' => 'Pegawai ID tidak ditemukan!'
        ]);

        if ($validation->fails()) {
            return Response::json([
                'message' => $validation->errors()->first()
            ], 422);
        }

        $pegawaiId = $request->get('pegawai_id');
        $periodes = PeriodeRekap::where('status', true)
            ->select('id', 'nama', 'awal', 'akhir')
            ->get()
            ->map(function ($periode) use ($pegawaiId) {
                $periode->available = !RekapPegawai::where('pegawai_id', $pegawaiId)
                    ->where('periode_rekap_id', $periode->id)
                    ->exists();
                return $periode;
            });

        return Response::json([
            'message' => 'Berhasil mengambil data',
            'data' => $periodes
        ]);
    }

}
