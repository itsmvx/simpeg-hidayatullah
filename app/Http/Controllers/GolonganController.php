<?php

namespace App\Http\Controllers;

use App\Models\Golongan;
use Illuminate\Database\QueryException;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Response;
use Illuminate\Support\Facades\Validator;
use Illuminate\Support\Str;
use Illuminate\Validation\ValidationException;

class GolonganController extends Controller
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
        $validation = Validator::make($request->only('nama', 'keterangan'), [
            'nama' => 'required|string',
            'keterangan' => 'required|string',
        ]);
        if ($validation->fails()) {
            return Response::json([
                'message' => $validation->errors()->first(),
            ], 400);
        }
        $validated = $validation->validated();
        try {
            $golongan = Golongan::where('nama', '=', $validated['nama'])->first();

            if ($golongan) {
                return Response::json([
                    'message' => "Golongan sudah ada!",
                ], 409);
            }
            Golongan::create([
                'id' => Str::uuid(),
                'nama' => $validated['nama'],
                'keterangan' => $validated['keterangan']
            ]);
            return Response::json([
                'message' => 'Golongan berhasil dibuat!'
            ]);
        } catch (QueryException $exception) {
            return Response::json([
                'message' => 'Server gagal memproses permintaan',
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
    public function show(Golongan $golongan)
    {
        //
    }

    /**
     * Show the form for editing the specified resource.
     */
    public function edit(Golongan $golongan)
    {
        //
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(Request $request)
    {
        $validation = Validator::make($request->only(['id', 'nama', 'keterangan']), [
            'id' => 'required',
            'nama' => 'required|string',
            'keterangan' => 'nullable|string',
        ], [
            'id.required' => 'Id Golongan tidak boleh kosong!',
            'nama.required' => 'Nama Golongan tidak boleh kosong!',
            'nama.string' => 'Format Nama Golongan tidak valid!',
            'keterangan.string' => 'Format Keterangan Golongan tidak valid!',
        ]);
        if ($validation->fails()) {
            return Response::json([
                'message' => $validation->errors()->first(),
            ], 400);
        }
        $validated = $validation->validated();
        try {
            $unit = Golongan::find($validated['id']);
            if (!$unit) {
                return Response::json([
                    'message' => 'Golongan tidak ditemukan!'
                ], 404);
            }
            $unit->update($validated);
            return Response::json([
                'message' => 'Golongan berhasil diperbarui!',
            ]);
        } catch (QueryException $exception) {
            return Response::json([
                'message' => 'Server gagal memproses permintaan',
            ], 500);
        }
    }

    /**
     * Remove the specified resource from storage.
     * @throws ValidationException
     */
    public function destroy(Request $request)
    {
        $validation = Validator::make($request->only('id'), [
            'id' => 'required|string'
        ], [
            'id.required' => 'golongan tidak boleh kosong!'
        ]);
        if ($validation->fails()) {
            return Response::json([
                'message' => $validation->errors()->first(),
            ], 400);
        }
        $validated = $validation->validated();

        try {
            $golongan = Golongan::find($validated['id']);
            if (!$golongan) {
                return Response::json([
                    'message' => 'Golongan tidak ditemukan!'
                ], 400);
            }
            if ($golongan->delete()) {
                return Response::json([
                    'message' => 'Golongan berhasil dihapus!'
                ]);
            } else {
                return Response::json([
                    'message' => 'Golongan gagal dihapus!'
                ], 500);
            }
        } catch (QueryException $exception) {
            return Response::json([
                'message' => 'Server gagal memproses permintaan',
            ], 500);
        }
    }
}
