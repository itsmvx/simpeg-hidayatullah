<?php

namespace Database\Seeders;

use App\Models\Marhalah;
use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;
use Illuminate\Support\Str;

class MarhalahSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        //
        Marhalah::create([
            'id' => Str::uuid(),
            'nama' => 'Ula',
            'keterangan' => 'Marhalah Ula'
        ]);
        Marhalah::create([
            'id' => Str::uuid(),
            'nama' => 'TL Ula',
            'keterangan' => 'Marhalah TL Ula'
        ]);
        Marhalah::create([
            'id' => Str::uuid(),
            'nama' => 'Wusto',
            'keterangan' => 'Marhalah Wusto'
        ]);
        Marhalah::create([
            'id' => Str::uuid(),
            'nama' => 'TL BA',
            'keterangan' => 'Marhalah TL BA'
        ]);
        Marhalah::create([
            'id' => Str::uuid(),
            'nama' => 'Belum BA',
            'keterangan' => 'Marhalah Belum BA'
        ]);
    }
}
