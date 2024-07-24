<?php

use App\Http\Controllers\AdminController;
use App\Http\Controllers\AuthController;
use App\Http\Controllers\GolonganController;
use App\Http\Controllers\KaderController;
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
});
Route::prefix('golongan')->name('golongan.')->group(function () {
//    Route::get('/', [GolonganController::class, 'index'])->name('index');
    Route::post('/create', [GolonganController::class, 'create'])->name('create');
    Route::post('/update', [GolonganController::class, 'update'])->name('update');
    Route::post('/delete', [GolonganController::class, 'destroy'])->name('delete');
});
Route::prefix('kader')->name('kader.')->group(function () {
//    Route::get('/', [GolonganController::class, 'index'])->name('index');
    Route::post('/create', [KaderController::class, 'create'])->name('create');
    Route::post('/update', [KaderController::class, 'update'])->name('update');
    Route::post('/delete', [KaderController::class, 'destroy'])->name('delete');
});
Route::prefix('admin')->name('admin.')->group(function () {
    Route::post('/create', [AdminController::class, 'create'])->name('create');
    Route::post('/update', [AdminController::class, 'update'])->name('update');
    Route::post('/delete', [AdminController::class, 'destroy'])->name('delete');
    Route::post('/reset', [AdminController::class, 'reset'])->name('reset');
});


Route::get('/dashboard', function () {
    return Inertia::render('DashboardPage');
});
Route::get('/form-pelamar', function () {
    return Inertia::render('PelamarFormPage');
});

require __DIR__.'/admin.php';
require __DIR__.'/pegawai.php';
