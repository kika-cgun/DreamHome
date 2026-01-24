<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use App\Enums\ListingType;
use App\Enums\ListingStatus;

class Listing extends Model
{
    use HasFactory;

    protected $fillable = [
        'title',
        'description',
        'price',
        'area',
        'rooms',
        'floor',
        'type',
        'status',
        'city',
        'district',
        'user_id',
        'category_id',
        'location_id',
    ];

    protected $casts = [
        'type' => ListingType::class,
        'status' => ListingStatus::class,
        'price' => 'decimal:2',
        'area' => 'decimal:2',
    ];

    public function user()
    {
        return $this->belongsTo(User::class);
    }

    public function category()
    {
        return $this->belongsTo(Category::class);
    }

    public function location()
    {
        return $this->belongsTo(Location::class);
    }

    public function images()
    {
        return $this->hasMany(ListingImage::class);
    }

    public function favorites()
    {
        return $this->hasMany(Favorite::class);
    }
}
