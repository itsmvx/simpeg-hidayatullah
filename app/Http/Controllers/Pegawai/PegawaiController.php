<?php

namespace App\Http\Controllers\Pegawai;

use App\Http\Controllers\Controller;
use App\Models\Golongan;
use App\Models\Marhalah;
use App\Models\Pegawai;
use App\Models\StatusPegawai;
use App\Models\Unit;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\DB;
use Inertia\Inertia;
use Illuminate\Support\Facades\Hash;
use Illuminate\Validation\Rules\Password;
use Illuminate\Http\RedirectResponse;

class PegawaiController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index()
    {
        // dd(Auth::guard('pegawai')->user()->id);

        $pegawai = Pegawai::select('*', DB::raw('DATEDIFF(CURDATE(), tanggal_promosi) as lama_promosi'))
            ->find(Auth::guard('pegawai')->user()->id);
        if (!$pegawai) {
            abort(404);
        }

        $pegawai->makeHidden(['password', 'updated_at']);

        return Inertia::render('Pegawai/Index', [
            'pegawai' => fn() => $pegawai,
            'golongans' => fn() => Golongan::select('id', 'nama')->get(),
            'marhalahs' => fn() => Marhalah::select('id', 'nama')->get(),
            'statusPegawais' => fn() => StatusPegawai::select('id', 'nama')->get(),
            'units' => fn() => Unit::select('id', 'nama')->get(),
        ]);
    }

    public function profile()
    {
        $pegawai = Pegawai::select('*', DB::raw('DATEDIFF(CURDATE(), tanggal_promosi) as lama_promosi'))
            ->find(Auth::guard('pegawai')->user()->id);
        if (!$pegawai) {
            abort(404);
        }

        $pegawai->makeHidden(['password', 'updated_at']);

        return Inertia::render('Pegawai/Profile', [
            'pegawai' => fn() => $pegawai,
        ]);
    }
    /**
     * Show the form for creating a new resource.
     */
    public function create()
    {
        //
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
    public function show(string $id)
    {
        //
    }

    /**
     * Show the form for editing the specified resource.
     */
    public function edit(string $id)
    {
        //
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(Request $request): RedirectResponse
    {
        $user = Auth::guard('pegawai')->user();
        
        $validated = $request->validate([
            'current_password' => ['required', 'current_password:pegawai'],
            'password' => ['required', Password::defaults(), 'confirmed'],
        ]);

        if (!Hash::check($validated['current_password'], $user->password)) {
            return back()->withErrors(['current_password' => 'The current password is incorrect.']);
        }

        $user->update([
            'password' => Hash::make($validated['password']),
        ]);

        return back()->with('status', 'Password updated successfully.');
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(string $id)
    {
        //
    }
}
