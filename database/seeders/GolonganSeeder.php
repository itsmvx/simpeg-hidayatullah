<?php

namespace Database\Seeders;

use App\Models\Golongan;
use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;
use Illuminate\Support\Str;

class GolonganSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        //
        Golongan::create([
            'id' => Str::uuid(),
            'nama' => 'Golongan II-A',
            'keterangan' => 'Golongan II-A',
        ]);
        Golongan::create([
            'id' => Str::uuid(),
            'nama' => 'Golongan II-B',
            'keterangan' => 'Golongan II-B',
        ]);
        Golongan::create([
            'id' => Str::uuid(),
            'nama' => 'Golongan II-C',
            'keterangan' => 'Golongan II-C',
        ]);
        Golongan::create([
            'id' => Str::uuid(),
            'nama' => 'Golongan III-A',
            'keterangan' => 'Golongan III-A',
        ]);
        Golongan::create([
            'id' => Str::uuid(),
            'nama' => 'Golongan III-B',
            'keterangan' => 'Golongan III-B',
        ]);
        Golongan::create([
            'id' => Str::uuid(),
            'nama' => 'Golongan III-C',
            'keterangan' => 'Golongan III-C',
        ]);

    }
}
