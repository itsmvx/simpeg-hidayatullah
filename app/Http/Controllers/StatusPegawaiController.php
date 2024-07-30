<?php

namespace App\Http\Controllers;

use App\Models\StatusPegawai;
use Illuminate\Database\QueryException;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Response;
use Illuminate\Support\Facades\Validator;
use Illuminate\Support\Str;

class StatusPegawaiController extends Controller
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
            $statusPegawai = StatusPegawai::where('nama', '=', $validated['nama'])->first();

            if ($statusPegawai) {
                return Response::json([
                    'message' => "Status Pegawai sudah ada!",
                ], 409);
            }
            DB::table('status_pegawai')->insert([
                'id' => Str::uuid(),
                'nama' => $validated['nama'],
                'keterangan' => $validated['keterangan'],
                'created_at' => now('Asia/Jakarta'),
                'updated_at' => now('Asia/Jakarta'),
            ]);
            return Response::json([
                'message' => 'Status Pegawai berhasil dibuat!'
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
    public function show(StatusPegawai $statusPegawai)
    {
        //
    }

    /**
     * Show the form for editing the specified resource.
     */
    public function edit(StatusPegawai $statusPegawai)
    {
        //
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(Request $request, StatusPegawai $statusPegawai)
    {
        //
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(StatusPegawai $statusPegawai)
    {
        //
    }
}
