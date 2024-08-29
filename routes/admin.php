<?php

use App\Http\Controllers\Pages\AdminUnitPagesController;
use Illuminate\Support\Facades\Route;

Route::prefix('admin')->name('admin.')->middleware('admin')->group(function () {
    Route::get('/dashboard', [AdminUnitPagesController::class, 'dashboardPage'])->name('dashboard');

    Route::prefix('unit')->name('unit.')->group(function () {
        Route::get('/', [AdminUnitPagesController::class, 'unitIndexPage'])->name('index');
        Route::get('/details', [AdminUnitPagesController::class, 'unitDetailsPage'])->name('details');
    });
    Route::prefix('pegawai')->name('pegawai.')->group(function () {
        Route::get('/', [AdminUnitPagesController::class, 'pegawaiIndexPage'])->name('index');
        Route::get('/create', [AdminUnitPagesController::class, 'pegawaiCreatePage'])->name('create');
        Route::get('/details', [AdminUnitPagesController::class, 'pegawaiDetailsPage'])->name('details');
    });
    Route::prefix('rekap-pegawai')->name('rekap-pegawai.')->group(function () {
        Route::get('/', [AdminUnitPagesController::class, 'rekapPegawaiIndexPage'])->name('index');
        Route::get('/create', [AdminUnitPagesController::class, 'rekapPegawaiCreatePage'])->name('create');
        Route::get('/details', [AdminUnitPagesController::class, 'rekapPegawaiDetailsPage'])->name('details');
    });
    Route::prefix('pengajuan-promosi')->name('pengajuan-promosi.')->group(function () {
        Route::get('/', [AdminUnitPagesController::class, 'pengajuanPromosiIndexPage'])->name('index');
        Route::get('/create', [AdminUnitPagesController::class, 'pengajuanPromosiCreatePage'])->name('create');
        Route::get('/details', [AdminUnitPagesController::class, 'pengajuanPromosiDetailsPage'])->name('details');
    });
});
