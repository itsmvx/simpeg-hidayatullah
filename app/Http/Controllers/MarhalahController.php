<?php

namespace App\Http\Controllers;

use App\Models\Marhalah;
use Illuminate\Database\QueryException;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Response;
use Illuminate\Support\Facades\Validator;
use Illuminate\Support\Str;
use Illuminate\Validation\ValidationException;

class MarhalahController extends Controller
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
            $kader = Marhalah::where('nama', '=', $validated['nama'])->first();

            if ($kader) {
                return Response::json([
                    'message' => "Marhalah sudah ada!",
                ], 409);
            }
            Marhalah::create([
                'id' => Str::uuid(),
                'nama' => $validated['nama'],
                'keterangan' => $validated['keterangan']
            ]);
            return Response::json([
                'message' => 'Marhalah berhasil dibuat!'
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
    public function show(Marhalah $kader)
    {
        //
    }

    /**
     * Show the form for editing the specified resource.
     */
    public function edit(Marhalah $kader)
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
            'id.required' => 'Id Marhalah tidak boleh kosong!',
            'nama.required' => 'Nama Marhalah tidak boleh kosong!',
            'nama.string' => 'Format Nama Marhalah tidak valid!',
            'keterangan.string' => 'Format Keterangan Marhalah tidak valid!',
        ]);
        if ($validation->fails()) {
            return Response::json([
                'message' => $validation->errors()->first(),
            ], 400);
        }
        $validated = $validation->validated();
        try {
            $unit = Marhalah::find($validated['id']);
            if (!$unit) {
                return Response::json([
                    'message' => 'Marhalah tidak ditemukan!'
                ], 404);
            }
            $unit->update($validated);
            return Response::json([
                'message' => 'Marhalah berhasil diperbarui!',
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
        $validation = Validator::make($request->only('id'), [
            'id' => 'required|string'
        ], [
            'id.required' => 'Marhalah tidak boleh kosong!'
        ]);
        if ($validation->fails()) {
            return Response::json([
                'message' => $validation->errors()->first(),
            ], 400);
        }
        $validated = $validation->validated();

        try {
            $kader = Marhalah::find($validated['id']);
            if (!$kader) {
                return Response::json([
                    'message' => 'Marhalah tidak ditemukan!'
                ], 400);
            }
            if ($kader->delete()) {
                return Response::json([
                    'message' => 'Marhalah berhasil dihapus!'
                ]);
            } else {
                return Response::json([
                    'message' => 'Marhalah gagal dihapus!'
                ], 500);
            }
        } catch (QueryException $exception) {
            return Response::json([
                'message' => 'Server gagal memproses permintaan',
            ], 500);
        }
    }
}
