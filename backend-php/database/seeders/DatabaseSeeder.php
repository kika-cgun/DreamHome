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
            'name' => 'Mieszkanie',
            'description' => 'Mieszkania i apartamenty',
        ]);

        $house = Category::create([
            'name' => 'Dom',
            'description' => 'Domy jednorodzinne i wille',
        ]);

        $office = Category::create([
            'name' => 'Biuro',
            'description' => 'Powierzchnie biurowe',
        ]);

        $land = Category::create([
            'name' => 'Działka',
            'description' => 'Działki budowlane',
        ]);

        $commercial = Category::create([
            'name' => 'Lokal użytkowy',
            'description' => 'Lokale handlowe i usługowe',
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

        // Create sample listings - Sale
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

        ListingImage::create([
            'listing_id' => $listing->id,
            'image_url' => 'https://images.unsplash.com/photo-1522708323590-d24dbb6b0267',
            'is_primary' => true,
            'sort_order' => 0,
        ]);

        // Rental listing 1
        $rental1 = Listing::create([
            'title' => 'Modern Apartment for Rent in Krakow',
            'description' => 'Cozy apartment in the city center',
            'price' => 3500,
            'area' => 65.0,
            'rooms' => 2,
            'floor' => '3',
            'type' => ListingType::RENT->value,
            'status' => ListingStatus::ACTIVE->value,
            'user_id' => $agent->id,
            'category_id' => $apartment->id,
            'location_id' => $krakow->id,
        ]);

        ListingImage::create([
            'listing_id' => $rental1->id,
            'image_url' => 'https://images.unsplash.com/photo-1502672260266-1c1ef2d93688',
            'is_primary' => true,
            'sort_order' => 0,
        ]);

        // Rental listing 2
        $rental2 = Listing::create([
            'title' => 'House for Rent in Gdansk',
            'description' => 'Spacious house near the beach',
            'price' => 5500,
            'area' => 120.0,
            'rooms' => 4,
            'type' => ListingType::RENT->value,
            'status' => ListingStatus::ACTIVE->value,
            'user_id' => $agent->id,
            'category_id' => $house->id,
            'location_id' => $gdansk->id,
        ]);

        ListingImage::create([
            'listing_id' => $rental2->id,
            'image_url' => 'https://images.unsplash.com/photo-1568605114967-8130f3a36994',
            'is_primary' => true,
            'sort_order' => 0,
        ]);

        echo "Database seeded successfully (1 sale, 2 rentals)!\n";
    }
}
