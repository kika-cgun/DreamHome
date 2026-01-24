<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Location;
use Illuminate\Http\Request;

class LocationController extends Controller
{
    public function index()
    {
        return response()->json(Location::all());
    }

    public function store(Request $request)
    {
        $user = auth()->user();

        if ($user->role->value !== 'ADMIN') {
            return response()->json(['error' => 'Only ADMINs can create locations'], 403);
        }

        $validated = $request->validate([
            'city' => 'required|string',
            'district' => 'nullable|string',
            'image_url' => 'nullable|string|url',
        ]);

        // Normalize city name: first letter uppercase, rest lowercase
        $validated['city'] = ucfirst(strtolower(trim($validated['city'])));

        $location = Location::create($validated);

        return response()->json($location, 201);
    }

    public function update(Request $request, $id)
    {
        $user = auth()->user();

        if ($user->role->value !== 'ADMIN') {
            return response()->json(['error' => 'Only ADMINs can update locations'], 403);
        }

        $location = Location::findOrFail($id);

        $validated = $request->validate([
            'city' => 'required|string',
            'district' => 'nullable|string',
            'image_url' => 'nullable|string|url',
        ]);

        // Normalize city name: first letter uppercase, rest lowercase
        $validated['city'] = ucfirst(strtolower(trim($validated['city'])));

        $location->update($validated);

        return response()->json($location);
    }

    public function destroy($id)
    {
        $user = auth()->user();

        if ($user->role->value !== 'ADMIN') {
            return response()->json(['error' => 'Only ADMINs can delete locations'], 403);
        }

        $location = Location::findOrFail($id);
        $location->delete();

        return response()->json(['message' => 'Location deleted successfully']);
    }
}

