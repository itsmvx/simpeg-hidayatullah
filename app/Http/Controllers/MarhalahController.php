<?php

namespace App\Http\Controllers;

use App\Models\Marhalah;
use Illuminate\Database\QueryException;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Response;
use Illuminate\Support\Facades\Validator;
use Illuminate\Support\Str;

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
     */
    public function update(Request $request, Marhalah $kader)
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
