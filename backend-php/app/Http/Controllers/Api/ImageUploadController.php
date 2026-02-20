<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Storage;
use Illuminate\Support\Str;
use Illuminate\Support\Facades\Log;

class ImageUploadController extends Controller
{
    public function upload(Request $request)
    {
        $request->validate([
            'files' => 'required|array',
            'files.*' => 'image|max:2048', // 2MB max per file (server limit)
        ]);

        $uploadedUrls = [];

        // Get upload configuration from environment
        $customUploadDir = env('UPLOAD_DIR');
        $urlPrefix = env('UPLOAD_URL_PREFIX', '/storage/uploads/');

        foreach ($request->file('files') as $file) {
            if (!$file || !$file->isValid()) {
                Log::warning('ImageUpload: Skipped invalid file', [
                    'error' => $file ? $file->getError() : 'null file',
                ]);
                continue;
            }

            // Generate unique filename
            $extension = strtolower($file->getClientOriginalExtension());
            if (empty($extension)) {
                $extension = 'jpg';
            }
            $filename = Str::uuid() . '.' . $extension;

            if ($customUploadDir) {
                // Production: save to shared folder
                if (!is_dir($customUploadDir)) {
                    if (!mkdir($customUploadDir, 0755, true)) {
                        Log::error('ImageUpload: Failed to create directory', [
                            'dir' => $customUploadDir,
                            'error' => error_get_last(),
                        ]);
                        return response()->json([
                            'message' => 'Upload directory could not be created. Contact server administrator.',
                            'dir' => $customUploadDir,
                        ], 500);
                    }
                }

                if (!is_writable($customUploadDir)) {
                    Log::error('ImageUpload: Directory not writable', [
                        'dir' => $customUploadDir,
                    ]);
                    return response()->json([
                        'message' => 'Upload directory is not writable. Check server permissions.',
                        'dir' => $customUploadDir,
                    ], 500);
                }

                $moved = $file->move($customUploadDir, $filename);
                if (!$moved) {
                    Log::error('ImageUpload: Failed to move file', [
                        'filename' => $filename,
                        'dir' => $customUploadDir,
                    ]);
                    return response()->json([
                        'message' => 'Failed to save uploaded file.',
                    ], 500);
                }
            } else {
                // Development: use Laravel storage
                $stored = $file->storeAs('uploads', $filename, 'public');
                if (!$stored) {
                    Log::error('ImageUpload: Failed to store file in Laravel storage', [
                        'filename' => $filename,
                    ]);
                    return response()->json([
                        'message' => 'Failed to store file.',
                    ], 500);
                }
            }

            // Return URL with configured prefix
            $uploadedUrls[] = rtrim($urlPrefix, '/') . '/' . $filename;
        }

        return response()->json($uploadedUrls);
    }

    public function show($filename)
    {
        // Security: only allow alphanumeric, dash, underscore, dot
        if (!preg_match('/^[\w\-]+\.[a-zA-Z]{2,5}$/', $filename)) {
            return response()->json(['error' => 'Invalid filename'], 400);
        }

        $customUploadDir = env('UPLOAD_DIR');

        if ($customUploadDir) {
            $path = rtrim($customUploadDir, '/') . '/' . $filename;
        } else {
            $path = storage_path('app/public/uploads/' . $filename);
        }

        if (!file_exists($path)) {
            return response()->json(['error' => 'Image not found'], 404);
        }

        $mimeType = mime_content_type($path);
        return response()->file($path, ['Content-Type' => $mimeType]);
    }

    /**
     * Diagnostic endpoint - remove after debugging
     */
    public function diagnose(Request $request)
    {
        $customUploadDir = env('UPLOAD_DIR');
        $urlPrefix = env('UPLOAD_URL_PREFIX');

        return response()->json([
            'upload_dir' => $customUploadDir,
            'upload_dir_exists' => $customUploadDir ? is_dir($customUploadDir) : null,
            'upload_dir_writable' => $customUploadDir ? is_writable($customUploadDir) : null,
            'url_prefix' => $urlPrefix,
            'php_upload_max_filesize' => ini_get('upload_max_filesize'),
            'php_post_max_size' => ini_get('post_max_size'),
            'php_max_file_uploads' => ini_get('max_file_uploads'),
            'storage_path' => storage_path('app/public/uploads'),
            'storage_writable' => is_writable(storage_path('app/public')),
        ]);
    }
}
