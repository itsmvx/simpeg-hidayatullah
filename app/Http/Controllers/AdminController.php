<?php

namespace App\Http\Controllers;

use App\Models\Admin;
use Illuminate\Database\QueryException;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Facades\Response;
use Illuminate\Support\Facades\Validator;
use Illuminate\Validation\ValidationException;
use Inertia\Inertia;

class AdminController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index()
    {
        //
    }

    public function details($id)
    {
        if (!$id) {
            abort(404);
        }

        return Inertia::render('Admin/Master/DetailsAdminPage', [
            'admin' => fn() => Admin::where('id', '=', $id)->with('unit')->first()
        ]);
    }
    /**
     * Show the form for creating a new resource.
     * @throws ValidationException
     */
    public function create(Request $request)
    {
        $validation = Validator::make($request->only('nama', 'username', 'password', 'unit_id'), [
            'nama' => 'required|string',
            'username' => 'required|string',
            'password' => 'required|string',
            'unit_id' => 'required|exists:unit,id'
        ], [
            'nama.required' => 'Nama tidak boleh kosong',
            'username.required' => 'Username tidak boleh kosong',
            'password.required' => 'Password tidak boleh kosong',
            'unit_id.required' => 'Unit tidak boleh kosong',
            'unit_id.exists' => 'Unit tidak ditemukan'
        ]);
        if ($validation->fails()) {
            return Response::json([
                'message' => $validation->errors()->first(),
            ], 400);
        }
        $validated = $validation->validated();
        try {
            Admin::create([
                'nama' => $validated['nama'],
                'username' => $validated['username'],
                'password' => Hash::make($validated['password'], [ 'rounds' => 12 ]),
                'unit_id' => $validated['unit_id']
            ]);

            return Response::json([
                'message' => 'Admin berhasil ditambahkan'
            ]);
        } catch (QueryException $exception) {
            return Response::json([
                'message' => 'Server gagal memproses permintaan',
            ], 500);
        }
    }

    /**
     * Store a newly created resource in storage.
     */
    public function store(Request $request)
    {
        //
    }

    /**
     * Display the specified resource.
     */
    public function show()
    {
        //
    }

    /**
     * Show the form for editing the specified resource.
     */
    public function edit()
    {
        //
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(Request $request)
    {
        //
    }

    /**
     * Remove the specified resource from storage.
     * @throws ValidationException
     */
    public function destroy(Request $request)
    {
        $validation = Validator::make($request->only('id'), [
            'id' => 'required|string'
        ], [
            'id.required' => 'Admin tidak boleh kosong!'
        ]);
        if ($validation->fails()) {
            return Response::json([
                'message' => $validation->errors()->first(),
            ], 400);
        }
        $validated = $validation->validated();

        try {
            $admin = Admin::find($validated['id']);
            if (!$admin) {
                return Response::json([
                    'message' => 'Admin tidak ditemukan!'
                ], 400);
            }
            if ($admin->delete()) {
                return Response::json([
                    'message' => 'Admin berhasil dihapus!'
                ]);
            } else {
                return Response::json([
                    'message' => 'Admin gagal dihapus!'
                ], 500);
            }
        } catch (QueryException $exception) {
            return Response::json([
                'message' => 'Server gagal memproses permintaan',
            ], 500);
        }
    }
}
