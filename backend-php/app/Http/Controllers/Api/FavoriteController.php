<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Favorite;
use Illuminate\Http\Request;

class FavoriteController extends Controller
{
    public function index()
    {
        $user = auth()->user();

        $favorites = Favorite::with(['listing.user', 'listing.category', 'listing.location', 'listing.images'])
            ->where('user_id', $user->id)
            ->get();

        return response()->json($favorites->map(function ($favorite) {
            return $this->formatListing($favorite->listing);
        }));
    }

    public function store(Request $request)
    {
        $user = auth()->user();

        $validated = $request->validate([
            'listingId' => 'required|exists:listings,id',
        ]);

        $favorite = Favorite::firstOrCreate([
            'user_id' => $user->id,
            'listing_id' => $validated['listingId'],
        ]);

        return response()->json(['message' => 'Added to favorites'], 201);
    }

    public function destroy($listingId)
    {
        $user = auth()->user();

        $favorite = Favorite::where('user_id', $user->id)
            ->where('listing_id', $listingId)
            ->first();

        if ($favorite) {
            $favorite->delete();
        }

        return response()->json(null, 204);
    }

    private function formatListing($listing)
    {
        $images = $listing->images->pluck('image_url')->toArray();
        $primaryImage = $listing->images->where('is_primary', true)->first()?->image_url ?? ($images[0] ?? null);

        return [
            'id' => $listing->id,
            'title' => $listing->title,
            'description' => $listing->description,
            'price' => $listing->price,
            'area' => $listing->area,
            'rooms' => $listing->rooms,
            'floor' => $listing->floor,
            'type' => $listing->type,
            'status' => $listing->status,
            'user' => [
                'id' => $listing->user->id,
                'email' => $listing->user->email,
                'firstName' => $listing->user->first_name,
                'lastName' => $listing->user->last_name,
                'phone' => $listing->user->phone,
                'avatarUrl' => $listing->user->avatar_url,
                'agencyName' => $listing->user->agency_name,
                'role' => $listing->user->role->value,
                'createdAt' => $listing->user->created_at,
            ],
            'category' => $listing->category->name,
            'city' => $listing->location->city,
            'district' => $listing->location->district,
            'primaryImage' => $primaryImage,
            'images' => $images,
            'createdAt' => $listing->created_at,
        ];
    }
}
