<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Concerns\HasUuids;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Foundation\Auth\User as Authenticatable;

class Pegawai extends Authenticatable
{
    use HasFactory, HasUuids;

    protected $table = 'pegawai';
    protected $primaryKey = 'id';
    protected $guarded = ['id'];

}
