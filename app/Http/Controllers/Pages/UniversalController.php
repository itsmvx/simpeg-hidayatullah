<?php

namespace App\Http\Controllers\Pages;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Response;

class UniversalController extends Controller
{
    //
    public function downloadService(Request $request)
    {
        $fileRequest = $request->query('file');
        if (!$fileRequest || !base64_decode($fileRequest)) {
            abort(404);
        }

        $file = public_path('downloads/' . base64_decode($fileRequest));

        if (!file_exists($file)) {
            abort(404);
        }
        return Response::download($file);
    }
}
