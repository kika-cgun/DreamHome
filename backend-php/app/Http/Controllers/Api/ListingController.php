<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Listing;
use App\Models\ListingImage;
use App\Enums\ListingStatus;
use Illuminate\Http\Request;

class ListingController extends Controller
{
    public function index(Request $request)
    {
        $query = Listing::with(['user', 'category', 'location', 'images']);

        // Apply filters
        if ($request->has('categoryId')) {
            $query->where('category_id', $request->categoryId);
        }
        if ($request->has('locationId')) {
            $query->where('location_id', $request->locationId);
        }
        if ($request->has('type')) {
            $query->where('type', $request->type);
        }
        if ($request->has('priceMin')) {
            $query->where('price', '>=', $request->priceMin);
        }
        if ($request->has('priceMax')) {
            $query->where('price', '<=', $request->priceMax);
        }
        if ($request->has('minArea')) {
            $query->where('area', '>=', $request->minArea);
        }
        if ($request->has('maxArea')) {
            $query->where('area', '<=', $request->maxArea);
        }
        if ($request->has('minRooms')) {
            $query->where('rooms', '>=', $request->minRooms);
        }
        if ($request->has('maxRooms')) {
            $query->where('rooms', '<=', $request->maxRooms);
        }
        if ($request->has('city')) {
            $query->where('city', 'ILIKE', '%' . $request->city . '%');
        }
        if ($request->has('category')) {
            $query->whereHas('category', function ($q) use ($request) {
                $q->where('name', 'ILIKE', '%' . $request->category . '%');
            });
        }

        $listings = $query->get();

        return response()->json($listings->map(function ($listing) {
            return $this->formatListing($listing);
        }));
    }

    public function show($id)
    {
        $listing = Listing::with(['user', 'category', 'location', 'images'])->findOrFail($id);
        return response()->json($this->formatListing($listing));
    }

    public function my()
    {
        $user = auth()->user();
        $listings = Listing::with(['user', 'category', 'location', 'images'])
            ->where('user_id', $user->id)
            ->get();

        return response()->json($listings->map(function ($listing) {
            return $this->formatListing($listing);
        }));
    }

    public function store(Request $request)
    {
        $user = auth()->user();

        // All authenticated users can now create listings

        $validated = $request->validate([
            'title' => 'required|string',
            'description' => 'nullable|string',
            'price' => 'required|numeric|min:0',
            'area' => 'required|numeric|min:0',
            'rooms' => 'nullable|integer',
            'floor' => 'nullable|string',
            'type' => 'required|in:SALE,RENT',
            'categoryId' => 'required|exists:categories,id',
            'locationId' => 'nullable|exists:locations,id',
            'city' => 'nullable|string',
            'district' => 'nullable|string',
            'imageUrls' => 'nullable|array',
            'imageUrls.*' => 'string',
        ]);

        $listing = Listing::create([
            'title' => $validated['title'],
            'description' => $validated['description'] ?? null,
            'price' => $validated['price'],
            'area' => $validated['area'],
            'rooms' => $validated['rooms'] ?? null,
            'floor' => $validated['floor'] ?? null,
            'type' => $validated['type'],
            'status' => ListingStatus::ACTIVE->value,
            'city' => $validated['city'] ?? null,
            'district' => $validated['district'] ?? null,
            'user_id' => $user->id,
            'category_id' => $validated['categoryId'],
            'location_id' => $validated['locationId'] ?? null,
        ]);

        if (isset($validated['imageUrls'])) {
            foreach ($validated['imageUrls'] as $index => $url) {
                ListingImage::create([
                    'listing_id' => $listing->id,
                    'image_url' => $url,
                    'is_primary' => $index === 0,
                    'sort_order' => $index,
                ]);
            }
        }

        $listing->load(['user', 'category', 'location', 'images']);
        return response()->json($this->formatListing($listing), 201);
    }

    public function update(Request $request, $id)
    {
        $user = auth()->user();
        $listing = Listing::findOrFail($id);

        if ($listing->user_id !== $user->id && $user->role->value !== 'ADMIN') {
            return response()->json(['error' => 'You do not have permission to update this listing'], 403);
        }

        $validated = $request->validate([
            'title' => 'nullable|string',
            'description' => 'nullable|string',
            'price' => 'nullable|numeric|min:0',
            'area' => 'nullable|numeric|min:0',
            'rooms' => 'nullable|integer',
            'floor' => 'nullable|string',
            'type' => 'nullable|in:SALE,RENT',
            'categoryId' => 'nullable|exists:categories,id',
            'locationId' => 'nullable|exists:locations,id',
            'city' => 'nullable|string',
            'district' => 'nullable|string',
            'imageUrls' => 'nullable|array',
        ]);

        $listing->update(array_filter([
            'title' => $validated['title'] ?? $listing->title,
            'description' => $validated['description'] ?? $listing->description,
            'price' => $validated['price'] ?? $listing->price,
            'area' => $validated['area'] ?? $listing->area,
            'rooms' => $validated['rooms'] ?? $listing->rooms,
            'floor' => $validated['floor'] ?? $listing->floor,
            'type' => $validated['type'] ?? $listing->type,
            'city' => $validated['city'] ?? $listing->city,
            'district' => $validated['district'] ?? $listing->district,
            'category_id' => $validated['categoryId'] ?? $listing->category_id,
            'location_id' => $validated['locationId'] ?? $listing->location_id,
        ]));

        if (isset($validated['imageUrls'])) {
            $listing->images()->delete();
            foreach ($validated['imageUrls'] as $index => $url) {
                ListingImage::create([
                    'listing_id' => $listing->id,
                    'image_url' => $url,
                    'is_primary' => $index === 0,
                    'sort_order' => $index,
                ]);
            }
        }

        $listing->load(['user', 'category', 'location', 'images']);
        return response()->json($this->formatListing($listing));
    }

    public function destroy($id)
    {
        $user = auth()->user();
        $listing = Listing::findOrFail($id);

        if ($listing->user_id !== $user->id && $user->role->value !== 'ADMIN') {
            return response()->json(['error' => 'You do not have permission to delete this listing'], 403);
        }

        $listing->delete();
        return response()->json(null, 204);
    }

    public function cityCounts()
    {
        $counts = Listing::where('status', ListingStatus::ACTIVE->value)
            ->whereNotNull('city')
            ->groupBy('city')
            ->selectRaw('city, count(*) as count')
            ->orderBy('count', 'desc')
            ->get()
            ->map(function ($item) {
                return [
                    'name' => $item->city,
                    'count' => $item->count
                ];
            });

        return response()->json($counts);
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
            'city' => $listing->city ?? ($listing->location?->city),
            'district' => $listing->district ?? ($listing->location?->district),
            'primaryImage' => $primaryImage,
            'images' => $images,
            'createdAt' => $listing->created_at,
        ];
    }
}
