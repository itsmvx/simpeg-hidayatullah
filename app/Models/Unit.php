<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Concerns\HasUuids;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Unit extends Model
{
    use HasFactory, HasUuids;
    protected $table = 'unit';
    protected $primaryKey = 'id';
    protected $guarded = ['id'];

    public function admin()
    {
        return $this->hasMany(Admin::class, 'unit_id', 'id');
    }
}
