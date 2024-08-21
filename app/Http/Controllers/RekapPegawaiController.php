<?php

namespace App\Http\Controllers;

use App\Models\PeriodeRekap;
use App\Models\RekapPegawai;
use Illuminate\Database\QueryException;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Response;
use Illuminate\Support\Facades\Validator;
use Illuminate\Support\Str;

class RekapPegawaiController extends Controller
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
        $validation = Validator::make($request->only([
            'pegawai_id',
            'unit_id',
            'golongan_id',
            'status_pegawai_id',
            'marhalah_id',
            'periode_rekap_id',
            'amanah',
            'organisasi',
            'gaji',
            'skill_manajerial',
            'skill_leadership',
            'raport_profesi',
            'kedisiplinan',
            'ketuntasan_kerja',
            'catatan_negatif',
            'prestasi',
        ]), [
            'pegawai_id' => 'required|uuid|exists:pegawai,id',
            'unit_id' => 'required|uuid|exists:unit,id',
            'golongan_id' => 'required|uuid|exists:golongan,id',
            'status_pegawai_id' => 'required|uuid|exists:status_pegawai,id',
            'marhalah_id' => 'required|uuid|exists:marhalah,id',
            'periode_rekap_id' => 'required|uuid|exists:periode_rekap,id',
            'amanah' => 'required|string|max:255',
            'organisasi' => 'nullable|string|max:255',
            'gaji' => 'required|integer|min:0',
            'skill_manajerial' => 'nullable|string|max:255',
            'skill_leadership' => 'nullable|string|max:255',
            'raport_profesi' => 'required|string|max:255',
            'kedisiplinan' => 'required|string|max:255',
            'ketuntasan_kerja' => 'required|string|max:255',
            'catatan_negatif' => 'nullable|string',
            'prestasi' => 'nullable|string',
        ], [
            'pegawai_id.required' => 'Pegawai tidak boleh kosong',
            'pegawai_id.exists' => 'Pegawai tidak ditemukan',
            'unit_id.required' => 'Unit tidak boleh kosong',
            'unit_id.exists' => 'Unit tidak ditemukan',
            'golongan_id.required' => 'Golongan tidak boleh kosong',
            'golongan_id.exists' => 'Golongan tidak ditemukan',
            'status_pegawai_id.required' => 'Status pegawai tidak boleh kosong',
            'status_pegawai_id.exists' => 'Status pegawai tidak ditemukan',
            'marhalah_id.required' => 'Marhalah tidak boleh kosong',
            'marhalah_id.exists' => 'Marhalah tidak ditemukan',
            'periode_rekap_id.required' => 'Periode rekap tidak boleh kosong',
            'periode_rekap_id.exists' => 'Periode rekap tidak ditemukan',
            'amanah.required' => 'Amanah tidak boleh kosong',
            'amanah.max' => 'Amanah tidak boleh lebih dari 255 karakter',
            'organisasi.required' => 'Organisasi tidak boleh kosong',
            'organisasi.max' => 'Organisasi tidak boleh lebih dari 255 karakter',
            'gaji.required' => 'Gaji tidak boleh kosong',
            'gaji.integer' => 'Gaji harus berupa angka',
            'gaji.min' => 'Gaji tidak boleh kurang dari 0',
            'skill_manajerial.string' => 'format Skill manajerial tidak valid',
            'skill_manajerial.max' => 'Skill manajerial tidak boleh lebih dari 255 karakter',
            'skill_leadership.string' => 'format Skill leadership tidak valid',
            'skill_leadership.max' => 'Skill leadership tidak boleh lebih dari 255 karakter',
            'raport_profesi.required' => 'Raport profesi tidak boleh kosong',
            'raport_profesi.max' => 'Raport profesi tidak boleh lebih dari 255 karakter',
            'kedisiplinan.required' => 'Kedisiplinan tidak boleh kosong',
            'kedisiplinan.max' => 'Kedisiplinan tidak boleh lebih dari 255 karakter',
            'ketuntasan_kerja.required' => 'Ketuntasan kerja tidak boleh kosong',
            'ketuntasan_kerja.max' => 'Ketuntasan kerja tidak boleh lebih dari 255 karakter',
        ]);

        if ($validation->fails()) {
            return Response::json([
                'message' => $validation->errors()->first(),
            ], 422);
        }

        $validated = $validation->validated();

        try {
            RekapPegawai::create($validated);

            return Response::json([
                'message' => 'Rekap Pegawai berhasil dibuat!',
            ], 201);
        } catch (QueryException $exception) {
            return Response::json([
//                'message' => 'Server gagal memproses permintaan',
                'message' => $exception->getMessage()
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
    public function show(RekapPegawai $rekapPegawai)
    {
        //
    }

    /**
     * Show the form for editing the specified resource.
     */
    public function edit(RekapPegawai $rekapPegawai)
    {
        //
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(Request $request, RekapPegawai $rekapPegawai)
    {
        //
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(Request $request)
    {
        $validation = Validator::make($request->only('id'), [
            'id' => 'required|string'
        ], [
            'id.required' => 'Rekap Pegawai tidak boleh kosong!'
        ]);
        if ($validation->fails()) {
            return Response::json([
                'message' => $validation->errors()->first(),
            ], 422);
        }
        $validated = $validation->validated();

        try {
            $rekapPegawai = RekapPegawai::find($validated['id']);
            if (!$rekapPegawai) {
                return Response::json([
                    'message' => 'Rekap Pegawai tidak ditemukan!'
                ], 404);
            }
            if ($rekapPegawai->delete()) {
                return Response::json([
                    'message' => 'Rekap Pegawai berhasil dihapus!'
                ]);
            } else {
                return Response::json([
                    'message' => 'Rekap Pegawai gagal dihapus!'
                ], 500);
            }
        } catch (QueryException $exception) {
            return Response::json([
                'message' => 'Server gagal memproses permintaan',
            ], 500);
        }
    }
}
