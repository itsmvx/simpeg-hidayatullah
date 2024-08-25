<?php

use App\Http\Controllers\AdminController;
use App\Http\Controllers\RekapPegawaiController;
use App\Http\Controllers\AuthController;
use App\Http\Controllers\GolonganController;
use App\Http\Controllers\MarhalahController;
use App\Http\Controllers\PegawaiController;
use App\Http\Controllers\PeriodeRekapController;
use App\Http\Controllers\StatusPegawaiController;
use App\Http\Controllers\UnitController;
use App\Models\Pegawai;
use App\Models\Unit;
use Carbon\Carbon;
use Illuminate\Support\Facades\Route;
use Inertia\Inertia;

Route::prefix('auth')->name('auth.')->group(function () {
    Route::get('/login', [AuthController::class, 'loginPage'])->name('login')->middleware('noauth');
    Route::post('/admin', [AuthController::class, 'authAdmin'])->name('admin')->middleware('noauth');
    Route::post('/pegawai', [AuthController::class, 'authPegawai'])->name('pegawai')->middleware('noauth');
    Route::get('/user', [AuthController::class, 'getUser'])->name('user');
    Route::post('/logout', [AuthController::class, 'logout'])->name('logout');
});


Route::get('/', function () {
    return Inertia::render('Welcome', [
        'data' => fn() => [
            'pegawai' => fn() => Pegawai::count(),
            'unit' => fn() => Unit::count(),
        ]
    ]);
});
Route::get('/hall-of-fames', function () {
    return Inertia::render('HallOfFames');
})->name('hall-of-fames');

Route::prefix('unit')->name('unit.')->group(function () {
    Route::post('/exists-check', [UnitController::class, 'isExists'])->name('exists');
    Route::post('/create', [UnitController::class, 'create'])->name('create');
    Route::post('/update', [UnitController::class, 'update'])->name('update');
    Route::post('/delete', [UnitController::class, 'destroy'])->name('delete');
});
Route::prefix('golongan')->name('golongan.')->group(function () {
    Route::post('/create', [GolonganController::class, 'create'])->name('create');
    Route::post('/update', [GolonganController::class, 'update'])->name('update');
    Route::post('/delete', [GolonganController::class, 'destroy'])->name('delete');
});
Route::prefix('marhalah')->name('marhalah.')->group(function () {
    Route::post('/create', [MarhalahController::class, 'create'])->name('create');
    Route::post('/update', [MarhalahController::class, 'update'])->name('update');
    Route::post('/delete', [MarhalahController::class, 'destroy'])->name('delete');
});
Route::prefix('admin')->name('admin.')->group(function () {
    Route::post('/create', [AdminController::class, 'create'])->name('create');
    Route::post('/update', [AdminController::class, 'update'])->name('update');
    Route::post('/delete', [AdminController::class, 'destroy'])->name('delete');
    Route::post('/reset', [AdminController::class, 'reset'])->name('reset');
});
Route::prefix('status-pegawai')->name('status-pegawai.')->group(function () {
    Route::post('/create', [StatusPegawaiController::class, 'create'])->name('create');
    Route::post('/update', [StatusPegawaiController::class, 'update'])->name('update');
    Route::post('/delete', [StatusPegawaiController::class, 'destroy'])->name('delete');
});
Route::prefix('pegawai')->name('pegawai.')->group(function () {
    Route::post('/create', [PegawaiController::class, 'create'])->name('create');
    Route::post('/data', [PegawaiController::class, 'show'])->name('data');
    Route::post('/update', [PegawaiController::class, 'update'])->name('update');
    Route::post('/update-by-admin', [PegawaiController::class, 'updateByAdmin'])->name('update-by-admin');
    Route::post('/delete', [PegawaiController::class, 'destroy'])->name('delete');
    Route::post('/data-to-rekap', [PegawaiController::class, 'dataToRekap'])->name('data-to-rekap');
    Route::post('/data-to-rekap-by-admin', [PegawaiController::class, 'dataToRekapByAdmin'])->name('data-to-rekap-by-admin');
    Route::post('/upload-foto', [PegawaiController::class, 'uploadFoto'])->name('upload-foto');
});
Route::prefix('periode-rekap')->name('periode-rekap.')->group(function () {
    Route::post('/create', [PeriodeRekapController::class, 'create'])->name('create');
    Route::post('/update', [PeriodeRekapController::class, 'update'])->name('update');
    Route::post('/update-status', [PeriodeRekapController::class, 'updateStatus'])->name('update-status');
    Route::post('/delete', [PeriodeRekapController::class, 'destroy'])->name('delete');
    Route::post('/periodes-to-rekap', [PeriodeRekapController::class, 'periodesToRekap'])->name('periodes-to-rekap');
});
Route::prefix('rekap-pegawai')->name('rekap-pegawai.')->group(function () {
    Route::post('/create', [RekapPegawaiController::class, 'create'])->name('create');
    Route::post('/update', [RekapPegawaiController::class, 'update'])->name('update');
    Route::post('/update-by-admin', [RekapPegawaiController::class, 'updateByAdmin'])->name('update-by-admin');
    Route::post('/update-status', [RekapPegawaiController::class, 'updateStatus'])->name('update-status');
    Route::post('/delete', [RekapPegawaiController::class, 'destroy'])->name('delete');
});

require __DIR__ . '/admin.php';
require __DIR__ . '/master.php';
require __DIR__ . '/pegawai.php';
