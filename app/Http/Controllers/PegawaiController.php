<?php

namespace App\Http\Controllers;

use App\Models\Pegawai;
use App\Models\RekapPegawai;
use Illuminate\Database\QueryException;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Facades\Response;
use Illuminate\Support\Facades\Storage;
use Illuminate\Support\Facades\Validator;
use Illuminate\Support\Str;
use Illuminate\Validation\ValidationException;

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
     * @throws ValidationException
     */
    public function create(Request $request)
    {
        $validation = Validator::make($request->all(), [
            'nip' => 'required|string|unique:pegawai,nip',
            'nik' => 'required|string|unique:pegawai,nik',
            'nama' => 'required|string',
            'jenis_kelamin' => 'required|in:Laki-Laki,Perempuan',
            'tempat_lahir' => 'required|string',
            'tanggal_lahir' => 'required|date',
            'no_hp' => 'required|string',
            'suku' => 'required|string',
            'alamat' => 'required|string',
            'agama' => 'required|string',
            'status_pernikahan' => 'required|in:Belum Menikah,Menikah,Cerai Hidup,Cerai Mati',
            'amanah' => 'required|string',
            'amanah_atasan' => 'required|string',
            'tanggal_masuk' => 'required|date',
            'bpjs_kesehatan' => 'boolean',
            'bpjs_ketenagakerjaan' => 'boolean',
            'kompetensi_quran' => 'required|string',
            'data_keluarga' => 'required|string',
            'data_pendidikan_formal' => 'required|string',
            'data_pendidikan_non_formal' => 'required|string',
            'data_pengalaman_organisasi' => 'required|string',
            'data_pengalaman_kerja_pph' => 'required|string',
            'data_pengalaman_kerja_non_pph' => 'required|string',
            'keahlian' => 'nullable|string',
            'golongan_id' => 'nullable|uuid',
            'marhalah_id' => 'nullable|uuid',
            'status_pegawai_id' => 'nullable|uuid',
            'unit_id' => 'nullable|uuid',
        ], [
            'nip.required' => 'NIP tidak boleh kosong',
            'nip.unique' => 'NIP Pegawai sudah terdaftar',
            'nik.required' => 'NIK tidak boleh kosong',
            'nik.unique' => 'NIK Pegawai sudah terdaftar',
            'nama.required' => 'Nama tidak boleh kosong',
            'jenis_kelamin.required' => 'Jenis kelamin harus Laki-Laki atau Perempuan',
            'tempat_lahir.required' => 'Tempat lahir tidak boleh kosong',
            'tanggal_lahir.required' => 'Tanggal lahir tidak valid',
            'no_hp.required' => 'Nomor HP tidak boleh kosong',
            'suku.required' => 'Suku bangsa tidak boleh kosong',
            'suku.string' => 'Format input Suku bangsa tidak valid',
            'alamat.required' => 'Alamat tidak boleh kosong',
            'alamat.string' => 'Format input Alamat tidak valid',
            'agama.required' => 'Input Agama tidak boleh kosong',
            'agama.string' => 'Format input Agama tidak valid',
            'status_pernikahan.required' => 'Status pernikahan tidak boleh kosong',
            'amanah.required' => 'Amanah tidak boleh kosong',
            'amanah_atasan.required' => 'Amanah atasan tidak boleh kosong',
            'tanggal_masuk.required' => 'Tanggal masuk harus berupa tanggal yang valid',
            'kompetensi_quran.required' => "Kompetensi Qur'an wajib diisi",
            'data_pendidikan_formal.required' => 'Data Pendidikan formal tidak valid',
            'data_pendidikan_non_formal.required' => 'Data Pendidikan non formal tidak valid',
            'data_pengalaman_organisasi.required' => 'Data Pengalaman Organisasi tidak valid',
            'data_pengalaman_kerja_pph.required' => 'Data Pengalaman Kerja di PPH tidak valid',
            'data_pengalaman_kerja_non_pph.required' => 'Data Pengalaman kerja non PPH tidak valid',
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

        $validated = $validation->validated();


        try {
            Pegawai::create(array_merge($validated, [
                'id' => Str::uuid(),
                'username' => $validated['nip'],
                'password' => Hash::make($password, ['rounds' => 12]),
                'tanggal_lahir' => $tanggal_lahir,
                'tanggal_masuk' => $tanggal_masuk
            ]));
        } catch (QueryException $exception) {
            return Response::json([
                'message' => 'Server gagal memproses permintaan'
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
    public function show(Request $request)
    {
        try {
            $validation = Validator::make($request->only('id'), [
                'id' => 'required',
            ], [
                'id.required' => 'Input Pegawai tidak boleh kosong',
            ]);

            if ($validation->fails()) {
                return Response::json([
                    'message' => $validation->errors()->first()
                ], 404);
            }

            $pegawai = Pegawai::select(
                'pegawai.nip',
                'pegawai.nama',
                'pegawai.foto',
                'pegawai.jenis_kelamin',
                'pegawai.tanggal_masuk',
                'pegawai.tempat_lahir',
                'pegawai.tanggal_lahir',
                'pegawai.no_hp',
                'pegawai.alamat',
                'pegawai.data_pendidikan_formal',
                'pegawai.keahlian',
                'unit.nama as unit',
                'status_pegawai.nama as status_pegawai',
                'marhalah.nama as marhalah',
                'golongan.nama as golongan'
            )
                ->leftJoin('unit', 'unit.id', '=', 'pegawai.unit_id')
                ->leftJoin('status_pegawai', 'status_pegawai.id', '=', 'pegawai.status_pegawai_id')
                ->leftJoin('marhalah', 'marhalah.id', '=', 'pegawai.marhalah_id')
                ->leftJoin('golongan', 'golongan.id', '=', 'pegawai.golongan_id')
                ->where('pegawai.id', '=', $request->id)
                ->first();

            if (!$pegawai) {
                return Response::json([
                    'message' => 'Data Pegawai tidak ditemukan',
                ], 404);
            }

            $rekapBulanan = RekapPegawai::select(
                'rekap_pegawai.gaji',
                'rekap_pegawai.raport_profesi',
                'rekap_pegawai.kedisiplinan',
                'rekap_pegawai.ketuntasan_kerja',
                'rekap_pegawai.skill_manajerial',
                'rekap_pegawai.skill_leadership',
                'rekap_pegawai.prestasi',
                'rekap_pegawai.catatan_negatif',
                'rekap_pegawai.pembinaan',
            )
                ->join('periode_rekap', 'periode_rekap.id', '=', 'rekap_pegawai.periode_rekap_id')
                ->where('rekap_pegawai.pegawai_id', '=', $request->id)
                ->where('periode_rekap.jenis', '=', 'bulanan')
                ->where('terverifikasi', true)
                ->orderBy('periode_rekap.awal', 'desc')
                ->first();

            $rekapTahunan = RekapPegawai::select('rekap_pegawai.amanah')
                ->select(
                    'amanah',
                    'periode_rekap.nama as periode',
                    'unit.nama as unit'
                )
                ->leftjoin('periode_rekap', 'periode_rekap.id', '=', 'rekap_pegawai.periode_rekap_id')
                ->leftjoin('unit', 'unit.id', '=', 'rekap_pegawai.unit_id')
                ->where('rekap_pegawai.pegawai_id', '=', $request->id)
                ->where('periode_rekap.jenis', '=', 'tahunan')
                ->where('terverifikasi', true)
                ->orderBy('periode_rekap.awal', 'asc')
                ->get();


            return Response::json([
                'data' => [
                    'pegawai' => $pegawai,
                    'rekapBulanan' => $rekapBulanan,
                    'rekapTahunan' => $rekapTahunan,
                ]
            ]);

        } catch (QueryException $exception) {
            return Response::json([
                'message' => $exception->getMessage()
//                'message' => 'Server gagal memproses permintaan'
            ], 500);
        }
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
    public function update(Request $request)
    {
        try {
            $id = $request->input('id');

            $validation = Validator::make($request->all(), [
                'id' => 'required|uuid|exists:pegawai,id',
                'nip' => "required|string|unique:pegawai,nip,{$id},id",
                'nik' => "required|string|unique:pegawai,nik,{$id},id",
                'nama' => 'required|string',
                'jenis_kelamin' => 'required|in:Laki-Laki,Perempuan',
                'tempat_lahir' => 'required|string',
                'tanggal_lahir' => 'required|date',
                'no_hp' => 'required|string',
                'suku' => 'required|string',
                'alamat' => 'required|string',
                'agama' => 'required|string',
                'status_pernikahan' => 'required|in:Belum Menikah,Menikah,Cerai Hidup,Cerai Mati',
                'amanah' => 'required|string',
                'amanah_atasan' => 'required|string',
                'tanggal_masuk' => 'required|date',
                'tanggal_marhalah' => 'nullable|date',
                'tanggal_promosi' => 'nullable|date',
                'bpjs_kesehatan' => 'boolean',
                'bpjs_ketenagakerjaan' => 'boolean',
                'kompetensi_quran' => 'required|string',
                'sertifikasi' => 'nullable|string',
                'data_keluarga' => 'required|string',
                'data_pendidikan_formal' => 'required|string',
                'data_pendidikan_non_formal' => 'required|string',
                'data_pengalaman_organisasi' => 'required|string',
                'data_pengalaman_kerja_pph' => 'required|string',
                'data_pengalaman_kerja_non_pph' => 'required|string',
                'keahlian' => 'nullable|string',
                'golongan_id' => 'nullable|uuid',
                'marhalah_id' => 'nullable|uuid',
                'status_pegawai_id' => 'nullable|uuid',
                'unit_id' => 'nullable|uuid',
            ], [
                'id.required' => 'Input Pegawai tidak boleh kosong!',
                'id.uuid' => 'Input Pegawai tidak valid!',
                'id.exists' => 'Pegawai tidak ditemukan!',
                'nip.required' => 'NIP tidak boleh kosong',
                'nip.unique' => 'NIP Pegawai sudah terdaftar',
                'nik.required' => 'NIK tidak boleh kosong',
                'nik.unique' => 'NIK Pegawai sudah terdaftar',
                'nama.required' => 'Nama tidak boleh kosong',
                'jenis_kelamin.required' => 'Jenis kelamin harus Laki-Laki atau Perempuan',
                'tempat_lahir.required' => 'Tempat lahir tidak boleh kosong',
                'tanggal_lahir.required' => 'Tanggal lahir tidak valid',
                'no_hp.required' => 'Nomor HP tidak boleh kosong',
                'suku.required' => 'Suku bangsa tidak boleh kosong',
                'suku.string' => 'Format input Suku bangsa tidak valid',
                'alamat.required' => 'Alamat tidak boleh kosong',
                'alamat.string' => 'Format input Alamat tidak valid',
                'agama.required' => 'Input Agama tidak boleh kosong',
                'agama.string' => 'Format input Agama tidak valid',
                'status_pernikahan.required' => 'Status pernikahan tidak boleh kosong',
                'amanah.required' => 'Amanah tidak boleh kosong',
                'amanah_atasan.required' => 'Amanah atasan tidak boleh kosong',
                'tanggal_masuk.required' => 'Tanggal masuk harus berupa tanggal yang valid',
                'tanggal_marhalah.date' => 'Tanggal marhalah harus berupa tanggal yang valid',
                'tanggal_promosi.date' => 'Tanggal promosi harus berupa tanggal yang valid',
                'kompetensi_quran.required' => "Kompetensi Qur'an wajib diisi",
                'data_pendidikan_formal.required' => 'Data Pendidikan formal tidak valid',
                'data_pendidikan_non_formal.required' => 'Data Pendidikan non formal tidak valid',
                'data_pengalaman_organisasi.required' => 'Data Pengalaman Organisasi tidak valid',
                'data_pengalaman_kerja_pph.required' => 'Data Pengalaman Kerja di PPH tidak valid',
                'data_pengalaman_kerja_non_pph.required' => 'Data Pengalaman kerja non PPH tidak valid',
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

            $pegawai = Pegawai::find($request->id);
            if (!$pegawai) {
                return Response::json([
                    'message' => 'Pegawai tidak ditemukan!'
                ], 404);
            }

            $tanggal_lahir = date('Y-m-d', strtotime($request->tanggal_lahir));
            $tanggal_masuk = date('Y-m-d', strtotime($request->tanggal_masuk));
            $tanggal_promosi = $request->get('tanggal_promosi') ? date('Y-m-d', strtotime($request->tanggal_promosi)) : null;
            $tanggal_marhalah = $request->get('tanggal_marhalah') ? date('Y-m-d', strtotime($request->tanggal_marhalah)) : null;

            $validatedData = $validation->validated();

            $pegawai->update(array_merge($validatedData, [
                'tanggal_lahir' => $tanggal_lahir,
                'tanggal_masuk' => $tanggal_masuk,
                'tanggal_promosi' => $tanggal_promosi,
                'tanggal_marhalah' => $tanggal_marhalah
            ]));

            if (
                $pegawai->golongan_id !== $request->golongan_id ||
                $pegawai->status_pegawai_id !== $request->status_pegawai_id
            ) {
                $pegawai->update([
                    'tanggal_promosi' => now('Asia/Jakarta'),
                ]);
            }

            return Response::json([
                'message' => 'Pegawai telah diperbarui!',
                'data' => [
                    'marhalah' => $tanggal_marhalah,
                    'promosi' => $tanggal_promosi
                ]
            ]);
        } catch (QueryException $e) {
            return Response::json([
                'message' => $e->getMessage(),
//                'message' => 'Server gagal memproses permintaan!'
            ], 500);
        }
    }


    /**
     * @throws ValidationException
     */
    public function updateByAdmin(Request $request)
    {
        try {
            $id = $request->input('id');
            $validation = Validator::make($request->all(), [
                'id' => 'required|uuid|exists:pegawai,id',
                'nip' => "required|string|unique:pegawai,nip,{$id},id",
                'nik' => "required|string|unique:pegawai,nik,{$id},id",
                'nama' => 'required|string',
                'jenis_kelamin' => 'required|in:Laki-Laki,Perempuan',
                'tempat_lahir' => 'required|string',
                'tanggal_lahir' => 'required|date',
                'no_hp' => 'required|string',
                'suku' => 'required|string',
                'alamat' => 'required|string',
                'status_pernikahan' => 'required|string',
                'amanah' => 'required|string',
                'tanggal_masuk' => 'required|date',
                'bpjs_kesehatan' => 'boolean',
                'bpjs_ketenagakerjaan' => 'boolean',
                'data_keluarga' => 'required|string',
                'data_pendidikan_formal' => 'required|string',
                'data_pendidikan_non_formal' => 'required|string',
                'data_pengalaman_organisasi' => 'required|string',
                'data_pengalaman_kerja_pph' => 'required|string',
                'data_pengalaman_kerja_non_pph' => 'required|string',
                'keahlian' => 'nullable|string',
            ], [
                'id.required' => 'Input Pegawai tidak boleh kosong!',
                'id.uuid' => 'Input Pegawai tidak valid!',
                'id.exists' => 'Pegawai tidak ditemukan!',
                'nip.required' => 'NIP tidak boleh kosong',
                'nip.unique' => 'NIP Pegawai sudah terdaftar',
                'nik.required' => 'NIK tidak boleh kosong',
                'nik.unique' => 'NIK Pegawai sudah terdaftar',
                'nama.required' => 'Nama tidak boleh kosong',
                'jenis_kelamin.required' => 'Jenis kelamin harus Laki-Laki atau Perempuan',
                'tempat_lahir.required' => 'Tempat lahir tidak boleh kosong',
                'tanggal_lahir.required' => 'Tanggal lahir tidak valid',
                'no_hp.required' => 'Nomor HP tidak boleh kosong',
                'suku.required' => 'Suku bangsa tidak boleh kosong',
                'suku.string' => 'Format input Suku bangsa tidak valid',
                'alamat.required' => 'Alamat tidak boleh kosong',
                'alamat.string' => 'Format input Alamat tidak valid',
                'agama.required' => 'Input Agama tidak boleh kosong',
                'agama.string' => 'Format input Agama tidak valid',
                'status_pernikahan.required' => 'Status pernikahan tidak boleh kosong',
                'amanah.required' => 'Amanah tidak boleh kosong',
                'tanggal_masuk.required' => 'Tanggal masuk harus berupa tanggal yang valid',
                'data_pendidikan_formal.required' => 'Data Pendidikan formal tidak valid',
                'data_pendidikan_non_formal.required' => 'Data Pendidikan non formal tidak valid',
                'data_pengalaman_organisasi.required' => 'Data Pengalaman Organisasi tidak valid',
                'data_pengalaman_kerja_pph.required' => 'Data Pengalaman Kerja di PPH tidak valid',
                'data_pengalaman_kerja_non_pph.required' => 'Data Pengalaman kerja non PPH tidak valid',
                'keahlian.string' => 'Format data keahlian tidak valid',
            ]);

            if ($validation->fails()) {
                return Response::json([
                    'message' => $validation->errors()->first()
                ], 422);
            }

            $pegawai = Pegawai::find($request->id);
            if (!$pegawai) {
                return Response::json([
                    'message' => 'Pegawai tidak ditemukan!'
                ], 404);
            }

            $tanggal_lahir = date('Y-m-d', strtotime($request->tanggal_lahir));
            $tanggal_masuk = date('Y-m-d', strtotime($request->tanggal_masuk));

            $validatedData = $validation->validated();
            $pegawai->update(array_merge($validatedData, [
                'tanggal_lahir' => $tanggal_lahir,
                'tanggal_masuk' => $tanggal_masuk,
            ]));
            return Response::json([
                'message' => 'Data Pegawai telah diperbarui!'
            ]);
        } catch (QueryException $e) {
            return Response::json([
                'message' => 'Server gagal memproses permintaan!'
            ], 500);
        }
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(Request $request)
    {
        $validation = Validator::make($request->only(['id']), [
            'id' => 'required|string|exists:pegawai,id',
        ], [
            'id.required' => 'Input Pegawai tidak boleh kosong!',
            'id.exists' => 'Pegawai tidak ditemukan!',
        ]);

        if ($validation->fails()) {
            return Response::json([
                'message' => $validation->errors()->first(),
            ], 400);
        }

        $validated = $validation->validated();

        DB::beginTransaction();

        try {
            $pegawai = Pegawai::where('id', '=', $validated['id'])->first();

            if (!$pegawai) {
                DB::rollBack();
                return Response::json([
                    'message' => 'Pegawai tidak ditemukan!',
                ], 404);
            }

            RekapPegawai::where('pegawai_id', '=', $validated['id'])->delete();

            $pegawai->delete();

            DB::commit();

            return Response::json([
                'message' => 'Pegawai dan Rekapnya berhasil dihapus!'
            ]);
        } catch (QueryException $exception) {
            DB::rollBack();
            return Response::json([
                'message' => 'Server gagal memproses permintaan',
            ], 500);
        }
    }
    public function pegawaiToRekap(Request $request)
    {
        $validation = Validator::make($request->only(['unit_id', 'periode_id']), [
            'unit_id' => 'required|uuid|exists:unit,id',
            'periode_id' => 'required|uuid|exists:periode_rekap,id',
        ], [
            'unit_id.required' => 'Unit tidak boleh kosong',
            'unit_id.uuid' => 'Format Unit tidak valid',
            'periode_id.required' => 'Periode tidak boleh kosong',
            'periode_id.uuid' => 'Format Periode tidak valid',
        ]);

        if ($validation->fails()) {
            return response()->json([
                'message' => $validation->errors()->first()
            ], 400);
        }

        $validated = $validation->validated();

        try {
            $pegawais = Pegawai::where('unit_id', $validated['unit_id'])
                ->whereDoesntHave('rekap_pegawai', function ($query) use ($validated) {
                    $query->where('periode_rekap_id', $validated['periode_id']);
                })
                ->with(['unit:id,nama', 'golongan:id,nama', 'status_pegawai:id,nama', 'marhalah:id,nama'])
                ->select('id', 'nama', 'unit_id', 'golongan_id', 'status_pegawai_id', 'marhalah_id')
                ->get()
                ->makeHidden(['golongan_id', 'status_pegawai_id', 'marhalah_id', 'unit_id']);

            return Response::json([
                'data' => $pegawais
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

    public function dataToRekapByAdmin(Request $request)
    {
        $validation = Validator::make($request->only(['unit_id', 'periode_id']), [
            'unit_id' => 'required|uuid|exists:unit,id',
            'periode_id' => 'required|uuid|exists:periode_rekap,id',
        ], [
            'unit_id.required' => 'Unit tidak boleh kosong',
            'unit_id.uuid' => 'Format Unit tidak valid',
            'periode_id.required' => 'Periode tidak boleh kosong',
            'periode_id.uuid' => 'Format Periode tidak valid',
        ]);

        if ($validation->fails()) {
            return response()->json([
                'message' => $validation->errors()->first()
            ], 400);
        }

        $validated = $validation->validated();

        try {
            $pegawais = Pegawai::where('unit_id', $validated['unit_id'])
                ->whereDoesntHave('rekap_pegawai', function ($query) use ($validated) {
                    $query->where('periode_rekap_id', $validated['periode_id']);
                })
                ->with(['unit:id,nama', 'golongan:id,nama', 'status_pegawai:id,nama', 'marhalah:id,nama'])
                ->select('id', 'nama', 'unit_id', 'golongan_id', 'status_pegawai_id', 'marhalah_id')
                ->get()
                ->makeHidden(['golongan_id', 'status_pegawai_id', 'marhalah_id', 'unit_id']);

            return Response::json([
                'data' => $pegawais
            ]);
        } catch (QueryException $exception) {
            return Response::json([
                'message' => 'Server gagal memproses permintaan'
            ], 500);
        }
    }


    public function uploadFoto(Request $request)
    {
        $validator = Validator::make($request->all(), [
            'id' => 'required|exists:pegawai,id',
            'image' => 'required|image|mimes:jpeg,png,jpg|max:2048',
        ], [
            'id.required' => 'Input Pegawai tidak boleh kosong!',
            'id.exists' => 'Pegawai tidak ditemukan',
            'image.required' => 'Foto tidak boleh kosong',
            'image.image' => 'Format Foto tidak valid',
            'image.mimes' => 'Format Foto tidak valid',
            'image.max' => 'Ukuran Foto maksimal 2MB'
        ]);

        if ($validator->fails()) {
            return Response::json(['message' => $validator->errors()->first()], 422);
        }

        $pegawai = Pegawai::find($request->get('id'));
        if (!$pegawai) {
            return  Response::json([
                'message' => 'Pegawai tidak ditemukan',
            ], 404);
        }

        if ($request->hasFile('image')) {
            $file = $request->file('image');
            $fileName = $pegawai->id. '_' .time() . '_' . $file->getClientOriginalName();
            $filePath = $file->storeAs('foto', $fileName, 'public');

            if ($pegawai->foto) {
                Storage::disk('public')->delete($pegawai->foto);
            }

            $pegawai->foto = $filePath;
            $pegawai->save();

            return Response::json([
                'message' => 'Foto berhasil diupload',
                'foto_url' => Storage::url($filePath)
            ]);
        }

        return Response::json(['message' => 'Foto tidak ditemukan'], 400);
    }
}
