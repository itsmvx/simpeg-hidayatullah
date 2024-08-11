<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Concerns\HasUuids;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\HasMany;

class Marhalah extends Model
{
    use HasFactory, HasUuids;

    protected $table = 'marhalah';
    protected $primaryKey = 'id';
    protected $guarded = ['id'];

    public function pegawai(): HasMany
    {
        return $this->hasMany(Pegawai::class, 'marhalah_id', 'id');
    }
    public function rekap_pegawai(): HasMany
    {
        return $this->hasMany(RekapPegawai::class, 'marhalah_id', 'id');
    }
}
