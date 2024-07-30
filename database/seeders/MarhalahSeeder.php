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
            'nama' => 'Non Ula',
            'keterangan' => 'Marhalah Non Ula'
        ]);
        Marhalah::create([
            'id' => Str::uuid(),
            'nama' => 'Wasito',
            'keterangan' => 'Marhalah Wasito'
        ]);
    }
}
