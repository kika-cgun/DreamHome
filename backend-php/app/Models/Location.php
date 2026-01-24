<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Location extends Model
{
    use HasFactory;

    protected $fillable = [
        'city',
        'district',
        'image_url',
    ];

    public function listings()
    {
        return $this->hasMany(Listing::class);
    }
}
