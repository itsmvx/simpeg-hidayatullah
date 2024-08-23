<?php

namespace App\Http\Controllers;

use App\Models\Admin;
use App\Models\Unit;
use Illuminate\Database\QueryException;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Facades\Response;
use Illuminate\Support\Facades\Validator;
use Illuminate\Support\Str;
use Illuminate\Validation\ValidationException;

class UnitController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index()
    {
        //
    }

    public function isExists(Request $request)
    {
        $validator = Validator::make($request->only('nama'), [
            'nama' => 'required',
        ], [
            'nama.required' => 'Nama unit harus diisi',
        ]);
        if ($validator->fails()) {
            return Response::json([
                'message' => $validator->errors()->first(),
            ], 400);
        }
        $isExists = Unit::where('nama', '=', $request->get('nama'))->exists();
        try {
            return Response::json([
                'exists' => $isExists,
                'message' => $isExists
                    ? 'Nama Unit tersedia untuk digunakan'
                    : 'Nama Unit tidak tersedia untuk digunakan'
            ]);
        } catch (QueryException $exception) {
            return Response::json([
                'exists' => null,
                'message' => 'Server gagal memproses permintaan',
            ]);
        }
    }
    /**
     * Show the form for creating a new resource.
     */
    public function create(Request $request): JsonResponse
    {
        try {
            $unitValidation = Validator::make($request->only('nama', 'keterangan'), [
                'nama' => 'required|string|unique:unit,nama',
                'keterangan' => 'required|string',
            ], [
                'nama.required' => 'Nama unit tidak boleh kosong!',
                'nama.unique' => 'Nama unit sudah terdaftar!',
                'keterangan.required' => 'Keterangan unit tidak boleh kosong!',
            ]);

            if ($unitValidation->fails()) {
                return Response::json([
                    'message' => $unitValidation->errors()->first()
                ], 400);
            }
            $unitValidated = $unitValidation->validated();
            Unit::create([
                'id' => Str::uuid(),
                'nama' => $unitValidated['nama'],
                'keterangan' => $unitValidated['keterangan'],
            ]);

            return Response::json([
                'message' => 'Unit berhasil ditambahkan!',
            ]);
        } catch (QueryException $exception) {
            $unitFromRequest = $request->get('unit');
            Unit::where('nama', '=', $unitFromRequest->nama)->delete();
            return Response::json([
                'message' => 'Terjadi kesalahan! Unit gagal ditambahkan.',
            ], 500);
        }
    }

    /**
     * Store a newly created resource in storage.
     */
    public function store(Request $request)
    {
    }

    /**
     * Display the specified resource.
     */
    public function show(Unit $unit)
    {
        //
    }

    /**
     * Show the form for editing the specified resource.
     */
    public function edit(Unit $unit)
    {
        //
    }

    /**
     * Update the specified resource in storage.
     * @throws ValidationException
     */
    public function update(Request $request)
    {
        $validation = Validator::make($request->only(['id', 'nama', 'keterangan']), [
            'id' => 'required',
            'nama' => 'required|string',
            'keterangan' => 'nullable|string',
        ], [
            'id.required' => 'Id Unit tidak boleh kosong!',
            'nama.required' => 'Nama Unit tidak boleh kosong!',
            'nama.string' => 'Format Nama Unit tidak valid!',
            'keterangan.string' => 'Format Keterangan Unit tidak valid!',
        ]);
        if ($validation->fails()) {
            return Response::json([
                'message' => $validation->errors()->first(),
            ], 400);
        }
        $validated = $validation->validated();
        try {
            $unit = Unit::find($validated['id']);
            if (!$unit) {
                return Response::json([
                    'message' => 'Unit tidak ditemukan!'
                ], 404);
            }
            $unit->update($validated);
            return Response::json([
                'message' => 'Unit berhasil diperbarui!',
            ]);
        } catch (QueryException $exception) {
            return Response::json([
                'message' => 'Server gagal memproses permintaan',
            ], 500);
        }
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(Request $request)
    {
        $validation = Validator::make($request->only(['id']), [
            'id' => 'required|exists:unit,id',
        ], [
            'id.required' => 'Input Unit tidak boleh kosong!',
            'id.exists' => 'Unit tidak ditemukan!',
        ]);

        if ($validation->fails()) {
            return Response::json([
                'message' => $validation->errors()->first(),
            ], 422);
        }

        $validated = $validation->validated();

        DB::beginTransaction();

        try {
            $unit = Unit::find($validated['id']);

            if (!$unit) {
                DB::rollBack();
                return Response::json([
                    'message' => 'Unit tidak ditemukan!'
                ], 404);
            }

            $unit->delete();

            DB::commit();

            return Response::json([
                'message' => 'Unit dan Admin terkait berhasil dihapus!'
            ]);
        } catch (QueryException $exception) {
            DB::rollBack();
            return Response::json([
                'message' => 'Server gagal memproses permintaan',
            ], 500);
        }
    }
}
