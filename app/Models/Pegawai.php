<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Concerns\HasUuids;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\HasMany;
use Illuminate\Foundation\Auth\User as Authenticatable;

class Pegawai extends Authenticatable
{
    use HasFactory, HasUuids;

    protected $table = 'pegawai';
    protected $primaryKey = 'id';
    protected $guarded = ['id'];

    public function unit(): BelongsTo
    {
        return $this->belongsTo(Unit::class, 'unit_id', 'id');
    }
    public function status_pegawai(): BelongsTo
    {
        return $this->belongsTo(StatusPegawai::class, 'status_pegawai_id', 'id');
    }
    public function marhalah(): BelongsTo
    {
        return $this->belongsTo(Marhalah::class, 'marhalah_id', 'id');
    }
    public function golongan(): BelongsTo
    {
        return $this->belongsTo(Golongan::class, 'golongan_id', 'id');
    }
    public function rekap_pegawai(): HasMany
    {
        return $this->hasMany(RekapPegawai::class, 'pegawai_id', 'id');
    }
    public function pengajuan_promosi()
    {
        return $this->hasMany(PengajuanPromosi::class, 'pegawai_id', 'id');
    }
}
