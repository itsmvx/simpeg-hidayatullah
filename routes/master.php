<?php

use App\Http\Controllers\Pages\AdminMasterPagesController;
use App\Http\Controllers\StatusPegawaiController;
use Illuminate\Support\Facades\Route;

Route::prefix('master')->name('master.')->middleware('admin.master')->group(function () {
    Route::get('/login', [AdminMasterPagesController::class, 'loginPage'])->name('login');
    Route::get('/dashboard', [AdminMasterPagesController::class, 'dashboardPage'])->name('dashboard');
    Route::prefix('/unit')->name('unit.')->group(function () {
        Route::get('/', [AdminMasterPagesController::class, 'unitIndexPage'])->name('index');
        Route::get('/details', [AdminMasterPagesController::class, 'unitDetailsPage'])->name('details');
    });
    Route::prefix('/golongan')->name('golongan.')->group(function () {
        Route::get('/', [AdminMasterPagesController::class, 'golonganIndexPage'])->name('index');
        Route::get('/details', [AdminMasterPagesController::class, 'golonganDetailsPage'])->name('details');
    });
    Route::prefix('/marhalah')->name('marhalah.')->group(function () {
        Route::get('/', [AdminMasterPagesController::class, 'marhalahIndexPage'])->name('index');
        Route::get('/details', [AdminMasterPagesController::class, 'marhalahDetailsPage'])->name('details');
    });
    Route::prefix('/admin')->name('admin.')->group(function () {
        Route::get('/', [AdminMasterPagesController::class, 'adminIndexPage'])->name('index');
        Route::get('/details', [AdminMasterPagesController::class, 'adminDetailsPage'])->name('details');
    });
    Route::prefix('/pegawai')->name('pegawai.')->group(function () {
        Route::get('/', [AdminMasterPagesController::class, 'pegawaiIndexPage'])->name('index');
        Route::get('/create', [AdminMasterPagesController::class, 'pegawaiCreatePage'])->name('create');
        Route::get('/details', [AdminMasterPagesController::class, 'pegawaiDetailsPage'])->name('details');
    });
    Route::prefix('/status-pegawai')->name('status-pegawai.')->group(function () {
        Route::get('/', [AdminMasterPagesController::class, 'statusPegawaiIndexPage'])->name('index');
        Route::get('/details', [AdminMasterPagesController::class, 'statusPegawaiDetailsPage'])->name('details');
    });
    Route::prefix('/inventaris')->name('inventaris.')->group(function () {
        Route::get('/', [AdminMasterPagesController::class, 'unitIndexPage'])->name('index');
    });

    Route::get('/rekap-pegawai', [AdminMasterPagesController::class, 'unitIndexPage'])->name('rekap-pegawai');
});

