<?php

namespace Database\Seeders;

use App\Models\StatusPegawai;
use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;
use Illuminate\Support\Str;

class StatusPegawaiSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        //
        StatusPegawai::create([
            'id' => Str::uuid(),
            'nama' => 'Pegawai Tetap',
            'keterangan' => 'Status Pegawai Tetap'
        ]);
        StatusPegawai::create([
            'id' => Str::uuid(),
            'nama' => 'Pegawai Kontrak',
            'keterangan' => 'Status Pegawai Kontrak'
        ]);
        StatusPegawai::create([
            'id' => Str::uuid(),
            'nama' => 'Pegawai Honorer',
            'keterangan' => 'Status Pegawai Honorer'
        ]);
    }
}
