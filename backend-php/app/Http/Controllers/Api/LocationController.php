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
        ]);

        $location = Location::create($validated);

        return response()->json($location, 201);
    }
}
