<?php

namespace App\Http\Controllers\AdminUnit;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Inertia\Inertia;

class PegawaiController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index()
    {
        return Inertia::render('Admin/AdminUnit/Pegawai/Index', [
            'pegawais' => fn () => DB::table('pegawai')
                ->select(
                    'pegawai.id',
                    'pegawai.nip',
                    'pegawai.nama',
                    'pegawai.unit_id',
                    'pegawai.status_pegawai_id as statusPegawaiId',
                    'pegawai.created_at',
                    'unit.nama as unit_nama',
                    'status_pegawai.nama as statusPegawai_nama'
                )
                ->leftJoin('unit', 'pegawai.unit_id', '=', 'unit.id')
                ->leftJoin('status_pegawai', 'pegawai.status_pegawai_id', '=', 'status_pegawai.id')
                ->get()
        ]);
    }

    /**
     * Show the form for creating a new resource.
     */
    public function create()
    {
        //
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
    public function destroy(string $id)
    {
        //
    }
}
