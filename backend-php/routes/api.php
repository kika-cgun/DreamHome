<?php

use Illuminate\Support\Facades\Route;
use App\Http\Controllers\Api\AuthController;
use App\Http\Controllers\Api\ListingController;
use App\Http\Controllers\Api\CategoryController;
use App\Http\Controllers\Api\LocationController;
use App\Http\Controllers\Api\FavoriteController;
use App\Http\Controllers\Api\UserController;
use App\Http\Controllers\Api\HealthController;
use App\Http\Controllers\Api\ImageUploadController;

// Health check routes
Route::get('/health', [HealthController::class, 'health']);
Route::get('/health/details', [HealthController::class, 'healthDetails']);

// Public routes
Route::post('/auth/register', [AuthController::class, 'register']);
Route::post('/auth/login', [AuthController::class, 'login']);
Route::get('/listings', [ListingController::class, 'index']);
Route::get('/listings/city-counts', [ListingController::class, 'cityCounts']);
Route::get('/listings/{id}', [ListingController::class, 'show'])->where('id', '[0-9]+');
Route::get('/categories', [CategoryController::class, 'index']);
Route::get('/locations', [LocationController::class, 'index']);

// Image serving (public)
Route::get('/uploads/images/{filename}', [ImageUploadController::class, 'show']);

// Authenticated routes
Route::middleware('jwt.auth')->group(function () {
    Route::get('/users/me', [UserController::class, 'me']);
    Route::put('/users/me', [UserController::class, 'update']);

    // Image uploads
    Route::post('/uploads/images', [ImageUploadController::class, 'upload']);

    // Favorites
    Route::get('/favorites', [FavoriteController::class, 'index']);
    Route::post('/favorites', [FavoriteController::class, 'store']);
    Route::post('/favorites/{listingId}', [FavoriteController::class, 'storeByPath']);
    Route::delete('/favorites/{listingId}', [FavoriteController::class, 'destroy']);

    // Listings (create, update, delete - requires AGENT or ADMIN)
    Route::get('/listings/my', [ListingController::class, 'my']);
    Route::post('/listings', [ListingController::class, 'store']);
    Route::put('/listings/{id}', [ListingController::class, 'update'])->where('id', '[0-9]+');
    Route::delete('/listings/{id}', [ListingController::class, 'destroy'])->where('id', '[0-9]+');

    // Admin only routes
    Route::get('/users', [UserController::class, 'index']);
    Route::put('/users/{id}/role', [UserController::class, 'updateRole']);
    Route::delete('/users/{id}', [UserController::class, 'destroy']);

    // Categories CRUD
    Route::post('/categories', [CategoryController::class, 'store']);
    Route::put('/categories/{id}', [CategoryController::class, 'update']);
    Route::delete('/categories/{id}', [CategoryController::class, 'destroy']);

    // Locations CRUD
    Route::post('/locations', [LocationController::class, 'store']);
    Route::put('/locations/{id}', [LocationController::class, 'update']);
    Route::delete('/locations/{id}', [LocationController::class, 'destroy']);
});
