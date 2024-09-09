<?php

namespace App\Http\Controllers;

use App\Models\Golongan;
use App\Models\Marhalah;
use App\Models\Pegawai;
use App\Models\PengajuanPromosi;
use App\Models\StatusPegawai;
use App\Models\Unit;
use Illuminate\Database\Eloquent\ModelNotFoundException;
use Illuminate\Database\QueryException;
use Illuminate\Http\Request;
use Illuminate\Support\Carbon;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Response;
use Illuminate\Support\Facades\Validator;
use Illuminate\Support\Str;
use Illuminate\Validation\Rule;
use Illuminate\Validation\ValidationException;

class PengajuanPromosiController extends Controller
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
     * @throws ValidationException
     */
    public function create(Request $request)
    {
        $modelsType = [
            'golongan' => Golongan::class,
            'marhalah' => Marhalah::class,
            'status_pegawai' => StatusPegawai::class,
            'unit' => Unit::class,
        ];

        try {
            $validation = Validator::make($request->only([
                'nama',
                'admin_id',
                'pegawai_id',
                'unit_id',
                'asal_type',
                'asal_id',
                'akhir_type',
                'akhir_id',
                'keterangan',
            ]), [
                'nama' => 'required|string',
                'unit_id' => 'required|uuid',
                'admin_id' => 'required|uuid|exists:admin,id',
                'pegawai_id' => 'required|uuid|exists:pegawai,id',
                'asal_type' => ['required', 'string', Rule::in(array_keys($modelsType))],
                'asal_id' => [
                    'required',
                    'uuid',
                    function ($attribute, $value, $fail) use ($request, $modelsType) {
                        $modelClass = $modelsType[$request->asal_type] ?? null;
                        if ($modelClass && !$modelClass::where('id', $value)->exists()) {
                            $fail("The selected {$attribute} is invalid.");
                        }
                    }
                ],
                'akhir_type' => ['required', 'string', Rule::in(array_keys($modelsType))],
                'akhir_id' => [
                    'required',
                    'uuid',
                    function ($attribute, $value, $fail) use ($request, $modelsType) {
                        $modelClass = $modelsType[$request->akhir_type] ?? null;
                        if ($modelClass && !$modelClass::where('id', $value)->exists()) {
                            $fail("The selected {$attribute} is invalid.");
                        }
                    }
                ],
                'keterangan' => 'nullable|string',
            ], [
                'nama.required' => 'Judul Pengajuan tidak boleh kosong',
                'nama.string' => 'Format Judul Pengajuan tidak valid',
                'unit_id.required' => 'Unit tidak boleh kosong',
                'unit_id.uuid' => 'Format Unit tidak valid',
                'admin_id.required' => 'Admin tidak boleh kosong',
                'admin_id.uuid' => 'Format Admin tidak valid',
                'admin_id.exists' => 'Admin tidak ditemukan',
                'pegawai_id.required' => 'Pegawai tidak boleh kosong',
                'pegawai_id.uuid' => 'Format Pegawai tidak valid',
                'pegawai.exists' => 'Pegawai tidak ditemukan',
                'asal_type.required' => 'Asal Type tidak boleh kosong',
                'asal_id.required' => 'Asal ID tidak boleh kosong',
                'akhir_type.required' => 'Akhir Type tidak boleh kosong',
                'akhir_id.required' => 'Akhir ID tidak boleh kosong',
            ]);

            if ($validation->fails()) {
                return Response::json([
                    'message' => $validation->errors()->first()
                ], 400);
            }

            $validated = $validation->validated();

            $isExists = DB::table('pengajuan_promosi')
                ->where('unit_id', $validated['unit_id'])
                ->where('pegawai_id', $validated['pegawai_id'])
                ->where('asal_type', $modelsType[$validated['asal_type']])
                ->where('asal_id', $validated['asal_id'])
                ->where('status_pengajuan', 'menunggu')
                ->exists();

            if ($isExists) {
                return Response::json([
                    'message' => 'Pengajuan promosi sejenis yang masih menunggu sudah ada'
                ], 409);
            }

            $jenisPromosi = [
                'golongan' => 'Golongan',
                'marhalah' => 'Marhalah',
                'status_pegawai' => 'Status Pegawai',
                'unit' => 'Unit',
            ];

            PengajuanPromosi::create([
                'id' => Str::uuid(),
                'nama' => $validated['nama'],
                'jenis' => $jenisPromosi[$validated['asal_type']],
                'unit_id' => $validated['unit_id'],
                'admin_id' => $validated['admin_id'],
                'pegawai_id' => $validated['pegawai_id'],
                'asal_type' => $modelsType[$validated['asal_type']],
                'asal_id' => $validated['asal_id'],
                'akhir_type' => $modelsType[$validated['akhir_type']],
                'akhir_id' => $validated['akhir_id'],
                'keterangan' => $validated['keterangan'],
            ]);

            return Response::json([
                'message' => 'Pengajuan promosi berhasil dibuat',
            ]);
        } catch (QueryException $exception) {
            return Response::json([
                'msg' => $exception->getMessage(),
                'message' => 'Server gagal memproses permintaan'
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
    public function show(string $id)
    {
        //
    }

    /**
     * Show the form for editing the specified resource.
     */
    public function edit(string $id)
    {
        //
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(Request $request, string $id)
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
            'id.required' => 'Format Pengajuan tidak boleh kosong!'
        ]);
        if ($validation->fails()) {
            return Response::json([
                'message' => $validation->errors()->first(),
            ], 400);
        }
        $validated = $validation->validated();

        try {
            $pengajuanPromosi = PengajuanPromosi::find($validated['id']);
            if (!$pengajuanPromosi) {
                return Response::json([
                    'message' => 'Pengajuan Promosi tidak ditemukan!'
                ], 400);
            }
            if ($pengajuanPromosi->delete()) {
                return Response::json([
                    'message' => 'Pengajuan Promosi berhasil dihapus!'
                ]);
            } else {
                return Response::json([
                    'message' => 'Pengajuan Promosi gagal dihapus!'
                ], 500);
            }
        } catch (QueryException $exception) {
            return Response::json([
                'message' => 'Server gagal memproses permintaan',
            ], 500);
        }
    }

    public function review(Request $request)
    {
        try {
            $validation = Validator::make($request->only([
                'id', 'asal_id', 'asal_type', 'akhir_id', 'akhir_type', 'admin_penyetuju_id', 'pegawai_id', 'diterima'
            ]), [
                'id' => 'required|string',
                'asal_id' => 'required|string',
                'asal_type' => 'required|string',
                'akhir_type' => 'required|string',
                'akhir_id' => 'required|string',
                'admin_penyetuju_id' => 'required|string',
                'diterima' => 'required|boolean',
                'pegawai_id' => 'required|string',
            ], [
                'id.required' => 'Format Pengajuan tidak boleh kosong!',
                'asal_id.required' => 'Asal pengajuan tidak boleh kosong!',
                'asal_type.required' => 'Tipe pengajuan tidak boleh kosong!',
                'akhir_type.required' => 'Tipe pengajuan tidak boleh kosong!',
                'akhir_id.required' => 'Tujuan pengajuan tidak boleh kosong!',
                'admin_penyetuju_id.required' => 'Admin penyetujuan tidak boleh kosong!',
                'diterima.required' => 'Status pengajuan tidak boleh kosong!',
                'pegawai_id.required' => 'Pegawai tidak boleh kosong!',
            ]);

            if ($validation->fails()) {
                return Response::json([
                    'message' => $validation->errors()->first()
                ], 422);
            }

            $validated = $validation->validated();

            $pengajuanPromosi = PengajuanPromosi::find($validated['id']);
            $pegawai = Pegawai::find($validated['pegawai_id']);

            if (!$pengajuanPromosi) {
                return Response::json([
                    'message' => 'Pengajuan Promosi tidak ditemukan!'
                ], 404);
            }

            if (!$pegawai) {
                return Response::json([
                    'message' => 'Pegawai tidak ditemukan!'
                ], 404);
            }

            $asalModelClass = $validated['asal_type'];
            $akhirModelClass = $validated['akhir_type'];

            if (!class_exists($asalModelClass) || !class_exists($akhirModelClass)) {
                return Response::json([
                    'message' => 'Tipe pengajuan tidak valid!'
                ], 422);
            }

            $asalModel = $asalModelClass::find($validated['asal_id']);
            $akhirModel = $akhirModelClass::find($validated['akhir_id']);

            if (!$asalModel || !$akhirModel) {
                return Response::json([
                    'message' => 'Data asal atau tujuan tidak ditemukan!'
                ], 404);
            }

            if ($validated['diterima']) {
                if ($validated['asal_type'] === 'App\Models\Golongan') {
                    $pegawai->update([
                        'golongan_id' => $validated['akhir_id'],
                        'tanggal_promosi' => Carbon::now('Asia/Jakarta')
                    ]);
                } elseif ($validated['asal_type'] === 'App\Models\StatusPegawai') {
                    $pegawai->update([
                        'status_pegawai_id' => $validated['akhir_id'],
                        'tanggal_promosi' => Carbon::now('Asia/Jakarta')
                    ]);
                } elseif ($validated['asal_type'] === 'App\Models\Marhalah') {
                    $pegawai->update([
                        'marhalah_id' => $validated['akhir_id'],
                    ]);
                }
            }

            $pengajuanPromosi->update([
                'asal_type' => $validated['asal_type'],
                'akhir_type' => $validated['akhir_type'],
                'admin_penyetuju_id' => $validated['admin_penyetuju_id'],
                'status_pengajuan' => $validated['diterima'] ? 'disetujui' : 'ditolak',
            ]);

            return Response::json([
                'message' => 'Pengajuan berhasil diperbarui!',
                'pengajuan' => $pengajuanPromosi
            ], 200);
        } catch (ModelNotFoundException $e) {
            return Response::json([
                'message' => 'Data yang diminta tidak ditemukan!',
            ], 404);
        } catch (QueryException $e) {
            return Response::json([
                'message' => 'Server gagal memproses permintaan',
            ], 500);
        } catch (\Exception $e) {
            return Response::json([
                'message' => 'Server gagal memproses permintaan',
            ], 500);
        }
    }
}
