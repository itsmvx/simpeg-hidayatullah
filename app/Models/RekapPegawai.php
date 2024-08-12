<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Concerns\HasUuids;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\HasMany;

class RekapPegawai extends Model
{
    use HasFactory, HasUuids;

    protected $table = 'rekap_pegawai';
    protected $guarded = ['id'];

    public function pegawai()
    {
        return $this->belongsTo(Pegawai::class, 'pegawai_id', 'id');
    }
    public function unit()
    {
        return $this->belongsTo(User::class, 'unit_id', 'id');
    }
    public function marhalah()
    {
        return $this->belongsTo(Marhalah::class, 'marhalah_id', 'id');
    }
    public function golongan()
    {
        return $this->belongsTo(Golongan::class, 'golongan_id', 'id');
    }
    public function status_pegawai(): BelongsTo
    {
        return $this->belongsTo(StatusPegawai::class, 'status_pegawai_id', 'id');
    }
}
