<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Concerns\HasUuids;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\HasMany;

class Golongan extends Model
{
    use HasFactory, HasUuids;

    protected $table = 'golongan';
    protected $guarded = ['id'];


    public function pegawai(): HasMany
    {
        return $this->hasMany(Pegawai::class, 'golongan_id', 'id');
    }
    public function rekap_pegawai(): HasMany
    {
        return $this->hasMany(RekapPegawai::class, 'golongan_id', 'id');
    }
}
