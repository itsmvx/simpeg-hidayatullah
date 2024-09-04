<?php

namespace App\Http\Controllers;

use App\Models\PeriodeRekap;
use App\Models\RekapPegawai;
use Illuminate\Database\QueryException;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Response;
use Illuminate\Support\Facades\Validator;
use Illuminate\Support\Str;
use Illuminate\Validation\ValidationException;

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
            'pembinaan',
            'terverifikasi',
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
            'pembinaan' => 'nullable|string',
            'terverifikasi' => 'nullable|boolean'
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
     * @throws ValidationException
     */
    public function update(Request $request)
    {
        $validation = Validator::make($request->all(), [
            'id' => 'required|uuid|exists:rekap_pegawai,id',
            'pegawai_id' => 'required|uuid|exists:pegawai,id',
            'unit_id' => 'nullable|uuid|exists:unit,id',
            'golongan_id' => 'nullable|uuid|exists:golongan,id',
            'status_pegawai_id' => 'nullable|uuid|exists:status_pegawai,id',
            'marhalah_id' => 'nullable|uuid|exists:marhalah,id',
            'periode_rekap_id' => 'required|uuid|exists:periode_rekap,id',
            'amanah' => 'required|string|max:255',
            'organisasi' => 'nullable|string|max:255',
            'gaji' => 'required|integer',
            'skill_manajerial' => 'nullable|string|max:255',
            'skill_leadership' => 'nullable|string|max:255',
            'raport_profesi' => 'required|string|max:255',
            'kedisiplinan' => 'required|string|max:255',
            'ketuntasan_kerja' => 'required|string|max:255',
            'catatan_negatif' => 'nullable|string|max:255',
            'prestasi' => 'nullable|string|max:255',
            'pembinaan' => 'nullable|string|max:255',
            'terverifikasi' => 'required|boolean',
        ], [
            'id.required' => 'Informasi Rekap tidak boleh kosong.',
            'id.uuid' => 'Format Informasi Rekap tidak valid.',
            'id.exists' => 'Rekap tidak ditemukan',
            'pegawai_id.required' => 'Pegawai tidak boleh kosong.',
            'pegawai_id.uuid' => 'Format Pegawai ID tidak valid.',
            'pegawai_id.exists' => 'Pegawai tidak ditemukan',
            'unit_id.uuid' => 'Format Unit ID tidak valid.',
            'unit_id.exists' => 'Unit tidak ditemukan',
            'golongan_id.uuid' => 'Format Golongan ID tidak valid.',
            'golongan_id.exists' => 'Golongan tidak ditemukan',
            'status_pegawai_id.uuid' => 'Format Status Pegawai ID tidak valid.',
            'status_pegawai_id.exists' => 'Status Pegawai tidak ditemukan',
            'marhalah_id.uuid' => 'Format Marhalah ID tidak valid.',
            'marhalah_id.exists' => 'Marhalah tidak ditemukan',
            'periode_rekap_id.required' => 'Periode rekap tidak boleh kosong.',
            'periode_rekap_id.uuid' => 'Format Periode Rekap ID tidak valid.',
            'periode_rekap_id.exists' => 'Periode rekap tidak ditemukan',
            'amanah.required' => 'Amanah tidak boleh kosong.',
            'amanah.string' => 'Amanah harus berupa teks.',
            'amanah.max' => 'Amanah maksimal 255 karakter.',
            'organisasi.string' => 'Organisasi harus berupa teks.',
            'organisasi.max' => 'Organisasi maksimal 255 karakter.',
            'gaji.required' => 'Gaji tidak boleh kosong.',
            'gaji.integer' => 'Gaji harus berupa angka.',
            'skill_manajerial.string' => 'Skill manajerial harus berupa teks.',
            'skill_manajerial.max' => 'Skill manajerial maksimal 255 karakter.',
            'skill_leadership.string' => 'Skill leadership harus berupa teks.',
            'skill_leadership.max' => 'Skill leadership maksimal 255 karakter.',
            'raport_profesi.required' => 'Raport profesi tidak boleh kosong.',
            'raport_profesi.string' => 'Raport profesi harus berupa teks.',
            'raport_profesi.max' => 'Raport profesi maksimal 255 karakter.',
            'kedisiplinan.required' => 'Kedisiplinan tidak boleh kosong.',
            'kedisiplinan.string' => 'Kedisiplinan harus berupa teks.',
            'kedisiplinan.max' => 'Kedisiplinan maksimal 255 karakter.',
            'ketuntasan_kerja.required' => 'Ketuntasan kerja tidak boleh kosong.',
            'ketuntasan_kerja.string' => 'Ketuntasan kerja harus berupa teks.',
            'ketuntasan_kerja.max' => 'Ketuntasan kerja maksimal 255 karakter.',
            'catatan_negatif.string' => 'Catatan negatif harus berupa teks.',
            'catatan_negatif.max' => 'Catatan negatif maksimal 255 karakter.',
            'prestasi.string' => 'Prestasi harus berupa teks.',
            'prestasi.max' => 'Prestasi maksimal 255 karakter.',
            'pembinaan.string' => 'Pembinaan harus berupa teks.',
            'pembinaan.max' => 'Pembinaan maksimal 255 karakter.',
            'terverifikasi.required' => 'Status verifikasi tidak boleh kosong.',
            'terverifikasi.boolean' => 'Status verifikasi harus berupa nilai true atau false.',
        ]);

        if ($validation->fails()) {
            return Response::json([
                'message' => $validation->errors()->first()
            ], 400);
        }

        $validated = $validation->validated();

        try {
            $rekapPegawai = RekapPegawai::findOrFail($validated['id']);

            $rekapPegawai->update($validated);

            return Response::json([
                'message' => 'Data rekap pegawai berhasil diperbarui',
            ]);
        } catch (QueryException $exception) {
            return Response::json([
                'message' => 'Server gagal memproses permintaan'
            ], 500);
        }
    }
    public function updateByAdmin(Request $request)
    {
        $validation = Validator::make($request->all(), [
            'id' => 'required|uuid|exists:rekap_pegawai,id',
            'amanah' => 'required|string|max:255',
            'organisasi' => 'nullable|string|max:255',
            'gaji' => 'required|integer',
            'skill_manajerial' => 'nullable|string|max:255',
            'skill_leadership' => 'nullable|string|max:255',
            'raport_profesi' => 'required|string|max:255',
            'kedisiplinan' => 'required|string|max:255',
            'ketuntasan_kerja' => 'required|string|max:255',
            'catatan_negatif' => 'nullable|string|max:255',
            'prestasi' => 'nullable|string|max:255',
            'terverifikasi' => 'required|boolean',
        ], [
            'id.required' => 'Informasi Rekap tidak boleh kosong.',
            'id.uuid' => 'Format Informasi Rekap tidak valid.',
            'id.exists' => 'Rekap tidak ditemukan',
            'amanah.required' => 'Amanah tidak boleh kosong.',
            'amanah.string' => 'Amanah harus berupa teks.',
            'amanah.max' => 'Amanah maksimal 255 karakter.',
            'organisasi.string' => 'Organisasi harus berupa teks.',
            'organisasi.max' => 'Organisasi maksimal 255 karakter.',
            'gaji.required' => 'Gaji tidak boleh kosong.',
            'gaji.integer' => 'Gaji harus berupa angka.',
            'skill_manajerial.string' => 'Skill manajerial harus berupa teks.',
            'skill_manajerial.max' => 'Skill manajerial maksimal 255 karakter.',
            'skill_leadership.string' => 'Skill leadership harus berupa teks.',
            'skill_leadership.max' => 'Skill leadership maksimal 255 karakter.',
            'raport_profesi.required' => 'Raport profesi tidak boleh kosong.',
            'raport_profesi.string' => 'Raport profesi harus berupa teks.',
            'raport_profesi.max' => 'Raport profesi maksimal 255 karakter.',
            'kedisiplinan.required' => 'Kedisiplinan tidak boleh kosong.',
            'kedisiplinan.string' => 'Kedisiplinan harus berupa teks.',
            'kedisiplinan.max' => 'Kedisiplinan maksimal 255 karakter.',
            'ketuntasan_kerja.required' => 'Ketuntasan kerja tidak boleh kosong.',
            'ketuntasan_kerja.string' => 'Ketuntasan kerja harus berupa teks.',
            'ketuntasan_kerja.max' => 'Ketuntasan kerja maksimal 255 karakter.',
            'catatan_negatif.string' => 'Catatan negatif harus berupa teks.',
            'catatan_negatif.max' => 'Catatan negatif maksimal 255 karakter.',
            'prestasi.string' => 'Prestasi harus berupa teks.',
            'prestasi.max' => 'Prestasi maksimal 255 karakter.',
            'terverifikasi.required' => 'Status verifikasi tidak boleh kosong.',
            'terverifikasi.boolean' => 'Status verifikasi harus berupa nilai true atau false.',
        ]);

        if ($validation->fails()) {
            return Response::json([
                'message' => $validation->errors()->first()
            ], 400);
        }

        $validated = $validation->validated();

        try {
            $rekapPegawai = RekapPegawai::findOrFail($validated['id']);

            $rekapPegawai->update($validated);

            return Response::json([
                'message' => 'Data rekap pegawai berhasil diperbarui',
            ]);
        } catch (QueryException $exception) {
            return Response::json([
                'message' => 'Server gagal memproses permintaan'
            ], 500);
        }
    }


    /**
     * @throws ValidationException
     */
    public function updateStatus(Request $request)
    {
        $validation = Validator::make($request->only('id'), [
            'id' => 'required|string'
        ], [
            'id.required' => 'Informasi Rekap tidak diberikan',
            'id.string' => 'Format data tidak valid',
        ]);
        if ($validation->fails()) {
            return Response::json([
                'message' => $validation->errors()->first(),
            ], 400);
        }
        $validated = $validation->validated();

        try {
            $rekap = RekapPegawai::find($validated['id']);

            if (!$rekap) {
                return Response::json([
                    'message' => 'Rekap tidak ditemukan',
                ], 404);
            }

            $rekap->terverifikasi = !$rekap->terverifikasi;
            $rekap->save();

            return Response::json([
                'message' => 'Status berhasil diperbarui',
            ]);
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
