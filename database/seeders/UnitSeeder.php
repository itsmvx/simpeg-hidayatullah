<?php

namespace Database\Seeders;

use App\Models\Unit;
use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;
use Illuminate\Support\Str;

class UnitSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        //
        Unit::create([
            'id' => Str::uuid(),
            'nama' => 'K. PPH',
            'keterangan' => 'Unit K. PPH',
        ]);
        Unit::create([
            'id' => Str::uuid(),
            'nama' => 'Roumah Wakaf',
            'keterangan' => 'Unit Roumah Wakaf',
        ]);
        Unit::create([
            'id' => Str::uuid(),
            'nama' => 'SD',
            'keterangan' => 'Unit SD Luqman Al Hakim',
        ]);
        Unit::create([
            'id' => Str::uuid(),
            'nama' => 'SMP',
            'keterangan' => 'Unit SMP Luqman Al Hakim',
        ]);
        Unit::create([
            'id' => Str::uuid(),
            'nama' => 'SMA',
            'keterangan' => 'Unit SMA Luqman Al Hakim',
        ]);
        Unit::create([
            'id' => Str::uuid(),
            'nama' => 'STAIL',
            'keterangan' => 'Unit STAI Luqman Al Hakim',
        ]);
    }
}
