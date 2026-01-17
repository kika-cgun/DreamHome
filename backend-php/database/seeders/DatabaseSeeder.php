<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use App\Models\User;
use App\Models\Category;
use App\Models\Location;
use App\Models\Listing;
use App\Models\ListingImage;
use App\Enums\Role;
use App\Enums\ListingType;
use App\Enums\ListingStatus;

class DatabaseSeeder extends Seeder
{
    public function run(): void
    {
        // Create users
        $admin = User::create([
            'email' => 'admin@dreamhome.com',
            'password' => 'admin123',
            'first_name' => 'Admin',
            'last_name' => 'System',
            'role' => Role::ADMIN->value,
        ]);

        $agent = User::create([
            'email' => 'agent@dreamhome.com',
            'password' => 'agent123',
            'first_name' => 'James',
            'last_name' => 'Bond',
            'phone' => '007007007',
            'agency_name' => 'MI6 Real Estate',
            'role' => Role::AGENT->value,
        ]);

        $user = User::create([
            'email' => 'user@dreamhome.com',
            'password' => 'user123',
            'first_name' => 'John',
            'last_name' => 'Doe',
            'phone' => '123456789',
            'role' => Role::USER->value,
        ]);

        // Create categories
        $apartment = Category::create([
            'name' => 'Apartment',
            'description' => 'Flats and apartments',
        ]);

        $house = Category::create([
            'name' => 'House',
            'description' => 'Detached houses and villas',
        ]);

        $office = Category::create([
            'name' => 'Office',
            'description' => 'Office spaces',
        ]);

        $land = Category::create([
            'name' => 'Land',
            'description' => 'Construction lands',
        ]);

        // Create locations
        $warsaw = Location::create([
            'city' => 'Warsaw',
            'district' => 'Mokotow',
        ]);

        $krakow = Location::create([
            'city' => 'Krakow',
            'district' => 'Stare Miasto',
        ]);

        $gdansk = Location::create([
            'city' => 'Gdansk',
            'district' => 'Wrzeszcz',
        ]);

        // Create a sample listing
        $listing = Listing::create([
            'title' => 'Luxury Apartment in Warsaw',
            'description' => 'Beautiful apartment with city view',
            'price' => 1500000,
            'area' => 85.5,
            'rooms' => 3,
            'floor' => '5',
            'type' => ListingType::SALE->value,
            'status' => ListingStatus::ACTIVE->value,
            'user_id' => $agent->id,
            'category_id' => $apartment->id,
            'location_id' => $warsaw->id,
        ]);

        // Add image to listing
        ListingImage::create([
            'listing_id' => $listing->id,
            'image_url' => 'https://images.unsplash.com/photo-1522708323590-d24dbb6b0267',
            'is_primary' => true,
            'sort_order' => 0,
        ]);

        echo "Database seeded successfully!\n";
    }
}
