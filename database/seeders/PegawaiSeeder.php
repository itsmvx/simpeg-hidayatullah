<?php

namespace Database\Seeders;

use App\Models\Pegawai;
use Illuminate\Database\Seeder;
use Faker\Factory as Faker;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Str;

class PegawaiSeeder extends Seeder
{
    public function run(): void
    {
        $faker = Faker::create('id_ID');
        $golonganIds = DB::table('golongan')->pluck('id')->toArray();
        $marhalahIds = DB::table('marhalah')->pluck('id')->toArray();
        $statusPegawaiIds = DB::table('status_pegawai')->pluck('id')->toArray();
        $unitIds = DB::table('unit')->pluck('id')->toArray();

        for ($i = 0; $i < 500; $i++) {
            Pegawai::create([
                'id' => Str::uuid(),
                'username' => $faker->userName,
                'password' => Hash::make('123', ['rounds' => 12]),
                'nip' => $faker->unique()->numerify('###############'),
                'nik' => $faker->unique()->nik(),
                'foto' => null,
                'nama' => $faker->name,
                'jenis_kelamin' => $faker->randomElement(['Laki-Laki', 'Perempuan']),
                'tempat_lahir' => $faker->city,
                'tanggal_lahir' => $faker->date(),
                'no_hp' => $faker->phoneNumber,
                'suku' => $faker->randomElement(['Jawa', 'Sunda', 'Batak', 'Minangkabau']),
                'alamat' => $faker->address,
                'agama' => 'Islam',
                'status_pernikahan' => $faker->randomElement(['Belum Menikah', 'Menikah', 'Cerai']),
                'amanah' => $faker->jobTitle,
                'amanah_atasan' => $faker->jobTitle,
                'kompetensi_quran' => $faker->randomElement(['Jilid 1', 'Jilid 2', 'Jilid 3', 'Jilid 4', null]),
                'sertifikasi' => $faker->randomElement(['Diknas', 'Kemenag', null]),
                'status_aktif' => $faker->randomElement(['Aktif', 'Nonaktif', 'Cuti']),
                'tanggal_masuk' => $faker->date(),
                'tanggal_promosi' => $faker->optional()->date(),
                'tanggal_marhalah' => $faker->optional()->date(),
                'bpjs_kesehatan' => $faker->boolean,
                'bpjs_ketenagakerjaan' => $faker->boolean,
                'data_keluarga' => json_encode([
                    [
                        'status' => 'Ayah',
                        'nama' => $faker->name('male'),
                        'jenisKelamin' => 'Laki-Laki',
                        'tempatLahir' => $faker->city,
                        'tanggalLahir' => $faker->date(),
                        'pekerjaan' => $faker->jobTitle,
                        'pendidikan' => 'S1'
                    ]
                ]),
                'data_pendidikan_formal' => json_encode([
                    [
                        'tingkat' => 'S1',
                        'sekolah' => $faker->company,
                        'lulus' => $faker->year
                    ]
                ]),
                'data_pendidikan_non_formal' => json_encode([
                    [
                        'jenis' => 'Pelatihan',
                        'penyelenggara' => $faker->company,
                        'tempat' => $faker->city,
                        'tahun' => $faker->year
                    ]
                ]),
                'data_pengalaman_organisasi' => json_encode([
                    [
                        'nama' => $faker->company,
                        'jabatan' => $faker->jobTitle,
                        'masa' => '2020-2023',
                        'keterangan' => $faker->sentence
                    ]
                ]),
                'data_pengalaman_kerja_pph' => json_encode([
                    [
                        'unit' => $faker->company,
                        'jabatan' => $faker->jobTitle,
                        'amanah' => $faker->jobTitle,
                        'mulai' => '2021-01-01',
                        'akhir' => '2023-12-31'
                    ]
                ]),
                'data_pengalaman_kerja_non_pph' => json_encode([
                    [
                        'instansi' => $faker->company,
                        'jabatan' => $faker->jobTitle,
                        'tahun' => $faker->year,
                        'keterangan' => $faker->sentence
                    ]
                ]),
                'golongan_id' => $faker->randomElement($golonganIds),
                'marhalah_id' => $faker->randomElement($marhalahIds),
                'status_pegawai_id' => $faker->randomElement($statusPegawaiIds),
                'unit_id' => $faker->randomElement($unitIds),
                'created_at' => now(),
                'updated_at' => now(),
            ]);
        }
    }
}
