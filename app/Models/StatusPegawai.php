<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Concerns\HasUuids;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\HasMany;

class StatusPegawai extends Model
{
    use HasFactory, HasUuids;

    protected $table = 'status_pegawai';
    protected $guarded = ['id'];

    public function pegawai(): HasMany
    {
        return $this->hasMany(Pegawai::class, 'status_pegawai_id', 'id');
    }
}
