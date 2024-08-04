<?php

use App\Http\Controllers\AdminController;
use App\Http\Controllers\AuthController;
use App\Http\Controllers\GolonganController;
use App\Http\Controllers\MarhalahController;
use App\Http\Controllers\Pages\AdminMasterPagesController;
use App\Http\Controllers\Pages\AdminUnitPagesController;
use App\Http\Controllers\PegawaiController;
use App\Http\Controllers\StatusPegawaiController;
use App\Http\Controllers\UnitController;
use Illuminate\Foundation\Application;
use Illuminate\Support\Facades\Route;
use Inertia\Inertia;

Route::prefix('auth')->name('auth.')->group(function () {
    Route::post('/login/master', [AuthController::class, 'authAdminMaster'])->name('master');
    Route::post('/login/admin', [AuthController::class, 'authAdminUnit'])->name('admin');
    Route::post('/login/pegawai', [AuthController::class, 'authPegawai'])->name('pegawai');

    Route::get('/user', [AuthController::class, 'getUser'])->name('user');
    Route::post('/logout', [AuthController::class, 'logout'])->name('logout');
});


Route::get('/', function () {
    return Inertia::render('Welcome', [
        'canLogin' => Route::has('login'),
        'canRegister' => Route::has('register'),
        'laravelVersion' => Application::VERSION,
        'phpVersion' => PHP_VERSION,
    ]);
});

Route::prefix('auth')->name('auth.')->group(function () {
    Route::post('/master', [AuthController::class, 'authAdminMaster'])->name('master');
    Route::post('/admin', [AuthController::class, 'authAdminUnit'])->name('admin');
});

Route::prefix('unit')->name('unit.')->group(function () {
    Route::post('/exists-check', [UnitController::class, 'isExists'])->name('exists');
    Route::post('/create', [UnitController::class, 'create'])->name('create');
    Route::post('/update/{id}', [UnitController::class, 'update'])->name('update');
    Route::post('/delete', [UnitController::class, 'destroy'])->name('delete');
});
Route::prefix('golongan')->name('golongan.')->group(function () {
    Route::post('/create', [GolonganController::class, 'create'])->name('create');
    Route::post('/update/{id}', [GolonganController::class, 'update'])->name('update');
    Route::post('/delete', [GolonganController::class, 'destroy'])->name('delete');
});
Route::prefix('marhalah')->name('marhalah.')->group(function () {
    Route::post('/create', [MarhalahController::class, 'create'])->name('create');
    Route::post('/update/{id}', [MarhalahController::class, 'update'])->name('update');
    Route::post('/delete', [MarhalahController::class, 'destroy'])->name('delete');
});
Route::prefix('admin')->name('admin.')->group(function () {
    Route::post('/create', [AdminController::class, 'create'])->name('create');
    Route::post('/update', [AdminController::class, 'update'])->name('update');
    Route::post('/delete', [AdminController::class, 'destroy'])->name('delete');
    Route::post('/reset', [AdminController::class, 'reset'])->name('reset');
    Route::get('/', [AdminUnitPagesController::class, 'loginPage'])->name('login');
    Route::get('/{unitId}/dashboard', [AdminUnitPagesController::class, 'dashboardPage'])->name('dashboard');

});
Route::prefix('status-pegawai')->name('status-pegawai.')->group(function () {
    Route::post('/create', [StatusPegawaiController::class, 'create'])->name('create');
    Route::put('/update/{id}', [StatusPegawaiController::class, 'update'])->name('update');
    Route::post('/delete', [StatusPegawaiController::class, 'destroy'])->name('delete');
});
Route::prefix('pegawai')->name('pegawai.')->group(function () {
    Route::post('/create', [PegawaiController::class, 'create'])->name('create');
    Route::post('/update', [PegawaiController::class, 'update'])->name('update');
    Route::post('/delete', [PegawaiController::class, 'destroy'])->name('delete');
});


Route::get('/dashboard', function () {
    return Inertia::render('DashboardPage');
});
Route::get('/form-pelamar', function () {
    return Inertia::render('PelamarFormPage');
});

require __DIR__.'/admin.php';
require __DIR__.'/master.php';
require __DIR__.'/pegawai.php';
