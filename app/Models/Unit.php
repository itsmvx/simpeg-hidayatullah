<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Concerns\HasUuids;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\HasMany;

class Unit extends Model
{
    use HasFactory, HasUuids;
    protected $table = 'unit';
    protected $primaryKey = 'id';
    protected $guarded = ['id'];

    public function admin(): HasMany
    {
        return $this->hasMany(Admin::class, 'unit_id', 'id');
    }
    public function pegawai(): HasMany
    {
        return $this->hasMany(Pegawai::class, 'unit_id', 'id');
    }
    public function pengajuan_promosi()
    {
        return $this->hasMany(PengajuanPromosi::class, 'unit_id', 'id');
    }
}
