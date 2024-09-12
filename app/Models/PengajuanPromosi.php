<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Concerns\HasUuids;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\MorphTo;

class PengajuanPromosi extends Model
{
    use HasFactory, HasUuids;

    protected $table = 'pengajuan_promosi';
    protected $guarded = ['id'];

    public function admin(): BelongsTo
    {
        return $this->belongsTo(Admin::class, 'admin_id', 'id');
    }
    public function admin_penyetuju(): BelongsTo
    {
        return $this->belongsTo(Admin::class, 'admin_penyetuju_id', 'id');
    }
    public function pegawai(): BelongsTo
    {
        return $this->belongsTo(Pegawai::class, 'pegawai_id', 'id');
    }
    public function unit(): BelongsTo
    {
        return $this->belongsTo(Unit::class, 'unit_id', 'id');
    }
    public function asal(): MorphTo
    {
        return $this->morphTo();
    }
    public function akhir(): MorphTo
    {
        return $this->morphTo();
    }
}
