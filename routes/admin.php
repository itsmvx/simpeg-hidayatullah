<?php

use App\Http\Controllers\Pages\AdminMasterController;
use App\Http\Controllers\Pages\AdminUnitController;
use Illuminate\Support\Facades\Route;

Route::prefix('admin')->name('admin.')->group(function () {
    Route::get('/', [AdminUnitController::class, 'loginPage'])->name('login');
    Route::get('/{unitId}/dashboard', [AdminUnitController::class, 'dashboardPage'])->name('dashboard');
});
Route::prefix('~')->name('master.')->middleware('admin.master')->group(function () {
    Route::get('/login', [AdminMasterController::class, 'loginPage'])->name('login');
    Route::prefix('/unit')->name('unit.')->group(function () {
        Route::get('/', [AdminMasterController::class, 'unitIndexPage'])->name('index');
        Route::get('/details', [AdminMasterController::class, 'unitDetailsPage'])->name('details');
    });
    Route::prefix('/golongan')->name('golongan.')->group(function () {
        Route::get('/', [AdminMasterController::class, 'golonganIndexPage'])->name('index');
    });
    Route::prefix('/kader')->name('kader.')->group(function () {
        Route::get('/', [AdminMasterController::class, 'kaderIndexPage'])->name('index');
    });
    Route::prefix('/admin')->name('admin.')->group(function () {
        Route::get('/', [AdminMasterController::class, 'adminIndexPage'])->name('index');
        Route::get('/details', [AdminMasterController::class, 'adminDetailsPage'])->name('details');
    });
    Route::prefix('/pegawai')->name('pegawai.')->group(function () {
        Route::get('/', [AdminMasterController::class, 'pegawaiIndexPage'])->name('index');
        Route::get('/create', [AdminMasterController::class, 'pegawaiCreatePage'])->name('create');
    });
    Route::prefix('/inventaris')->name('inventaris.')->group(function () {
        Route::get('/', [AdminMasterController::class, 'unitIndexPage'])->name('index');
    });

    Route::get('/rekap-pegawai', [AdminMasterController::class, 'unitIndexPage'])->name('rekap-pegawai');
});
