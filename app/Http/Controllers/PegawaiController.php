<?php

namespace App\Http\Controllers;

use App\Models\Pegawai;
use Illuminate\Database\QueryException;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Facades\Response;
use Illuminate\Support\Facades\Validator;
use Illuminate\Support\Str;

class PegawaiController extends Controller
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
        $validation = Validator::make($request->all(), [
            'nip' => 'required|string|unique:pegawai,nip',
            'nik' => 'required|string|unique:pegawai,nik',
            'foto' => 'nullable|url',
            'nama' => 'required|string',
            'jenis_kelamin' => 'required|in:Laki-Laki,Perempuan',
            'tempat_lahir' => 'required|string',
            'tanggal_lahir' => 'required|date',
            'no_hp' => 'required|string',
            'status_pernikahan' => 'required|string',
            'amanah' => 'required|string',
            'tanggal_masuk' => 'required|date',
            'bpjs_kesehatan' => 'nullable|string',
            'bpjs_ketenagakerjaan' => 'nullable|string',
            'pendidikan_formal' => 'required|string',
            'pendidikan_non_formal' => 'required|string',
            'pengalaman_organisasi' => 'required|string',
            'pengalaman_kerja_pph' => 'required|string',
            'pengalaman_kerja_non_pph' => 'required|string',
            'keahlian' => 'nullable|string',
            'golongan_id' => 'required|uuid',
            'marhalah_id' => 'required|uuid',
            'status_pegawai_id' => 'required|uuid',
            'unit_id' => 'required|uuid',
        ], [
            'nip.required' => 'NIP tidak boleh kosong',
            'nip.unique' => 'NIP Pegawai sudah terdaftar',
            'nik.required' => 'NIK tidak boleh kosong',
            'nik.unique' => 'NIK Pegawai sudah terdaftar',
            'foto.url' => 'Foto harus berupa URL yang valid',
            'nama.required' => 'Nama tidak boleh kosong',
            'jenis_kelamin.required' => 'Jenis kelamin harus Laki-Laki atau Perempuan',
            'tempat_lahir.required' => 'Tempat lahir tidak boleh kosong',
            'tanggal_lahir.required' => 'Tanggal lahir tidak valid',
            'no_hp.required' => 'Nomor HP tidak boleh kosong',
            'status_pernikahan.required' => 'Status pernikahan tidak boleh kosong',
            'amanah.required' => 'Amanah tidak boleh kosong',
            'tanggal_masuk.required' => 'Tanggal masuk harus berupa tanggal yang valid',
            'pendidikan_formal.required' => 'Data Pendidikan formal tidak valid',
            'pendidikan_non_formal.required' => 'Data Pendidikan non formal tidak valid',
            'pengalaman_organisasi.required' => 'Data Pengalaman Organisasi tidak valid',
            'pengalaman_kerja_pph.required' => 'Data Pengalaman Kerja di PPH tidak valid',
            'pengalaman_kerja_non_pph.required' => 'Data Pengalaman kerja non PPH tidak valid',
            'keahlian.string' => 'Format data keahlian tidak valid',
            'golongan_id.uuid' => 'Format Data Golongan tidak valid',
            'marhalah_id.uuid' => 'Format Data Marhalah tidak valid',
            'status_pegawai_id.uuid' => 'Format Data Status Pegawai tidak valid',
            'unit_id.uuid' => 'Format Data Unit tidak valid',
        ]);

        if ($validation->fails()) {
            return Response::json([
                'message' => $validation->errors()->first()
            ], 422);
        }

        $tanggal_lahir = date('Y-m-d', strtotime($request->tanggal_lahir));
        $tanggal_masuk = date('Y-m-d', strtotime($request->tanggal_masuk));

        $password = date('Ymd', strtotime($tanggal_lahir));

        try {
            Pegawai::create([
                'id' => Str::uuid(),
                'username' => $request->nip,
                'password' => Hash::make($password, [ 'rounds' => 12 ]),
                'nip' => $request->nip,
                'nik' => $request->nik,
                'foto' => $request->foto,
                'nama' => $request->nama,
                'jenis_kelamin' => $request->jenis_kelamin,
                'tempat_lahir' => $request->tempat_lahir,
                'tanggal_lahir' => $tanggal_lahir,
                'no_hp' => $request->no_hp,
                'status_pernikahan' => $request->status_pernikahan,
                'amanah' => $request->amanah,
                'tanggal_masuk' => $tanggal_masuk,
                'bpjs_kesehatan' => $request->bpjs_kesehatan,
                'bpjs_ketenagakerjaan' => $request->bpjs_ketenagakerjaan,
                'pendidikan_formal' => $request->pendidikan_formal,
                'pendidikan_non_formal' => $request->pendidikan_non_formal,
                'pengalaman_organisasi' => $request->pengalaman_organisasi,
                'pengalaman_kerja_pph' => $request->pengalaman_kerja_pph,
                'pengalaman_kerja_non_pph' => $request->pengalaman_kerja_non_pph,
                'keahlian' => $request->keahlian,
                'golongan_id' => $request->golongan_id,
                'marhalah_id' => $request->marhalah_id,
                'status_pegawai_id' => $request->status_pegawai_id,
                'unit_id' => $request->unit_id,
            ]);
        } catch (QueryException $exception) {
            return Response::json([
//                'message' => $exception->getMessage()
                'message' => 'Data pegawai berhasil gagal ditambahkan!'
            ], 500);
        }
        return Response::json([
            'message' => 'Pegawai berhasil ditambahkan!',
        ]);
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
    public function show(Pegawai $pegawai)
    {
        //
    }

    /**
     * Show the form for editing the specified resource.
     */
    public function edit(Pegawai $pegawai)
    {
        //
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(Request $request, Pegawai $pegawai)
    {
        //
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(Pegawai $pegawai)
    {
        //
    }
}
