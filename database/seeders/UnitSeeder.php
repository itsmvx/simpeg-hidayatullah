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
            'nama' => 'SD Lukman Al Hakim',
            'keterangan' => 'Unit SD Lukman Al Hakim',
        ]);
        Unit::create([
            'id' => Str::uuid(),
            'nama' => 'SMP Lukman Al Hakim',
            'keterangan' => 'Unit SMP Lukman Al Hakim',
        ]);
        Unit::create([
            'id' => Str::uuid(),
            'nama' => 'SMA Lukman Al Hakim',
            'keterangan' => 'Unit SMA Lukman Al Hakim',
        ]);
    }
}
