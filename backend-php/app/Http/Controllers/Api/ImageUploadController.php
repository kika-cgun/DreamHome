<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Storage;
use Illuminate\Support\Str;

class ImageUploadController extends Controller
{
    public function upload(Request $request)
    {
        $request->validate([
            'files' => 'required|array',
            'files.*' => 'image|max:10240', // 10MB max per file
        ]);

        $uploadedUrls = [];

        // Get upload configuration from environment
        $customUploadDir = env('UPLOAD_DIR');
        $urlPrefix = env('UPLOAD_URL_PREFIX', '/storage/uploads/');

        foreach ($request->file('files') as $file) {
            if (!$file->isValid()) {
                continue;
            }

            // Generate unique filename
            $extension = $file->getClientOriginalExtension();
            $filename = Str::uuid() . '.' . $extension;

            if ($customUploadDir) {
                // Production: save to shared folder
                if (!is_dir($customUploadDir)) {
                    mkdir($customUploadDir, 0755, true);
                }
                $file->move($customUploadDir, $filename);
            } else {
                // Development: use Laravel storage
                $file->storeAs('uploads', $filename, 'public');
            }

            // Return URL with configured prefix
            $uploadedUrls[] = $urlPrefix . $filename;
        }

        return response()->json($uploadedUrls);
    }

    public function show($filename)
    {
        $path = storage_path('app/public/uploads/' . $filename);

        if (!file_exists($path)) {
            return response()->json(['error' => 'Image not found'], 404);
        }

        $mimeType = mime_content_type($path);
        return response()->file($path, ['Content-Type' => $mimeType]);
    }
}
