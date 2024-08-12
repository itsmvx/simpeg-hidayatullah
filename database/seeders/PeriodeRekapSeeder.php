<?php

namespace Database\Seeders;

use App\Models\PeriodeRekap;
use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;
use Illuminate\Support\Str;

class PeriodeRekapSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        PeriodeRekap::create([
            'id' => Str::uuid(),
            'nama' => 'April 2024',
            'keterangan' => 'Periode Rekapitulasi Pegawai April 2024',
            'awal' => '2024-04-01',
            'akhir' => '2024-04-30',
            'jenis' => 'bulanan',
            'status' => false
        ]);
        PeriodeRekap::create([
            'id' => Str::uuid(),
            'nama' => 'Mei 2024',
            'keterangan' => 'Periode Rekapitulasi Pegawai Mei 2024',
            'awal' => '2024-05-01',
            'akhir' => '2024-05-31',
            'jenis' => 'bulanan',
            'status' => false
        ]);
        PeriodeRekap::create([
            'id' => Str::uuid(),
            'nama' => 'Semester Ganjil 2024',
            'keterangan' => 'Periode Rekapitulasi Pegawai Semester Ganjil 2024',
            'awal' => '2024-06-01',
            'akhir' => '2024-06-30',
            'jenis' => 'semesteran',
            'status' => true
        ]);
        PeriodeRekap::create([
            'id' => Str::uuid(),
            'nama' => 'Juni 2024',
            'keterangan' => 'Periode Rekapitulasi Pegawai Semester Genap 2024',
            'awal' => '2024-06-01',
            'akhir' => '2024-06-30',
            'jenis' => 'bulanan',
            'status' => true
        ]);
    }
}
