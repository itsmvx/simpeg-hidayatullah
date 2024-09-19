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

        $hewan = [
            'kucing', 'gajah', 'harimau', 'kumbang', 'kuda', 'burung', 'sapi',
            'kambing', 'macan', 'rusa', 'kancil', 'domba', 'beruang', 'kelinci',
            'hiu', 'lumba', 'penyu', 'gurita','paus',
            'pinguin', 'bangau', 'rajawali', 'elang', 'pelikan', 'camar',
            'merpati', 'garuda', 'angsa', 'kakaktua',
            'tupai', 'koala', 'bebek', 'cumi', 'kerang', 'lele',
            'naga', 'komodo', 'panda', 'tapir', 'capung', 'semut',
            'lebah', 'belalang', 'rubah'
        ];

        $amanah = [
            "Guru Qur'an", "Ka TU", "Kebersihan", "Kepala Sekolah", "Security",
            "Waka Akademik", "Waka Humas", "Waka Kesiswaan",
            "Guru IPA", "Guru IPS", "Guru Matematika", "Guru Bahasa Indonesia",
            "Guru PKN", "Guru Fiqih", "Wali Kelas", "Partner Kelas",
            "Staff TU"
        ];

        for ($i = 0; $i < 1400; $i++) {
            $jenisKelamin = $faker->randomElement(['Laki-Laki', 'Perempuan']);
            $nama = $jenisKelamin === 'Laki-Laki' ? $faker->name('male') : $faker->name('female');

            $tanggalLahir = $faker->dateTimeBetween('-60 years', '-19 years')->format('Y-m-d');
            $tanggalMasuk = $faker->dateTimeBetween($tanggalLahir . ' +19 years', 'now')->format('Y-m-d');
            $defaultPassword = $faker->randomElement($hewan) . $faker->numberBetween(1000, 9999);

            Pegawai::create([
                'id' => Str::uuid(),
                'password' => Hash::make($defaultPassword, ['rounds' => 12]),
                'default_password' => $defaultPassword,
                'nip' => $faker->unique()->numerify('###############'),
                'nik' => $faker->unique()->nik(),
                'foto' => null,
                'nama' => $nama,
                'jenis_kelamin' => $jenisKelamin,
                'tempat_lahir' => $faker->city,
                'tanggal_lahir' => $tanggalLahir,
                'tanggal_masuk' => $tanggalMasuk,
                'no_hp' => $faker->phoneNumber,
                'suku' => $faker->randomElement(['Jawa', 'Sunda', 'Batak', 'Minangkabau']),
                'alamat' => $faker->address,
                'agama' => 'Islam',
                'status_pernikahan' => $faker->randomElement(['Belum Menikah', 'Menikah', 'Cerai Hidup', 'Cerai Mati']),
                'amanah' => $faker->randomElement($amanah),
                'amanah_atasan' => $faker->name(),
                'kompetensi_quran' => $faker->randomElement(['Jilid 1', 'Jilid 2', 'Jilid 3', 'Jilid 4', null]),
                'sertifikasi' => $faker->randomElement(['Diknas', 'Kemenag', null]),
                'status_aktif' => $faker->randomElement(['Aktif', 'Nonaktif', 'Cuti']),
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
