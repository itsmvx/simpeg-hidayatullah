<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Concerns\HasUuids;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\HasMany;

class Kader extends Model
{
    use HasFactory, HasUuids;

    protected $table = 'kader';
    protected $primaryKey = 'id';
    protected $guarded = ['id'];

    public function pegawai(): HasMany
    {
        return $this->hasMany(Pegawai::class, 'kader_id', 'id');
    }
}
