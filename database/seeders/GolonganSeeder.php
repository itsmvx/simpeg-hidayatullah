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
            'nama' => 'IIA',
            'keterangan' => 'Golongan II-A',
        ]);
        Golongan::create([
            'id' => Str::uuid(),
            'nama' => 'IIB',
            'keterangan' => 'Golongan II-B',
        ]);
        Golongan::create([
            'id' => Str::uuid(),
            'nama' => 'IIC',
            'keterangan' => 'Golongan II-C',
        ]);
        Golongan::create([
            'id' => Str::uuid(),
            'nama' => 'IID',
            'keterangan' => 'Golongan II-D',
        ]);
        Golongan::create([
            'id' => Str::uuid(),
            'nama' => 'IIIA',
            'keterangan' => 'Golongan III-A',
        ]);
        Golongan::create([
            'id' => Str::uuid(),
            'nama' => 'IIIB',
            'keterangan' => 'Golongan III-B',
        ]);
        Golongan::create([
            'id' => Str::uuid(),
            'nama' => 'IIIC',
            'keterangan' => 'Golongan III-C',
        ]);
        Golongan::create([
            'id' => Str::uuid(),
            'nama' => 'IIID',
            'keterangan' => 'Golongan III-D',
        ]);
        Golongan::create([
            'id' => Str::uuid(),
            'nama' => 'IVA',
            'keterangan' => 'Golongan IV-A',
        ]);
        Golongan::create([
            'id' => Str::uuid(),
            'nama' => 'IVB',
            'keterangan' => 'Golongan IV-B',
        ]);
        Golongan::create([
            'id' => Str::uuid(),
            'nama' => 'IVC',
            'keterangan' => 'Golongan IV-C',
        ]);
        Golongan::create([
            'id' => Str::uuid(),
            'nama' => 'IVD',
            'keterangan' => 'Golongan IV-D',
        ]);
    }
}
