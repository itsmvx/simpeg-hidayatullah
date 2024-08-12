<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Concerns\HasUuids;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\HasMany;

class PeriodeRekap extends Model
{
    use HasFactory, HasUuids;
    protected $table = 'periode_rekap';
    protected $primaryKey = 'id';
    protected $guarded = ['id'];

    public function rekap_pegawai(): HasMany
    {
        return $this->hasMany(RekapPegawai::class, 'periode_rekap_id', 'id');
    }
}
