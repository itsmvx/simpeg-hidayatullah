<?php

use App\Http\Controllers\Pages\AdminMasterPagesController;
use Illuminate\Support\Facades\Route;

Route::prefix('master')->name('master.')->middleware('admin')->group(function () {
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
        Route::get('/create-upload', [AdminMasterPagesController::class, 'pegawaiCreateUploadPage'])->name('create-upload');
        Route::get('/details', [AdminMasterPagesController::class, 'pegawaiDetailsPage'])->name('details');
    });
    Route::prefix('/status-pegawai')->name('status-pegawai.')->group(function () {
        Route::get('/', [AdminMasterPagesController::class, 'statusPegawaiIndexPage'])->name('index');
        Route::get('/details', [AdminMasterPagesController::class, 'statusPegawaiDetailsPage'])->name('details');
    });
    Route::prefix('/rekap-pegawai')->name('rekap-pegawai.')->group(function () {
        Route::get('/', [AdminMasterPagesController::class, 'rekapPegawaiIndexPage'])->name('index');
        Route::get('/create', [AdminMasterPagesController::class, 'rekapPegawaiCreatePage'])->name('create');
        Route::get('/details', [AdminMasterPagesController::class, 'rekapPegawaiDetailsPage'])->name('details');
    });
    Route::prefix('/periode-rekap')->name('periode-rekap.')->group(function () {
        Route::get('/', [AdminMasterPagesController::class, 'periodeRekapIndexPage'])->name('index');
        Route::get('/details', [AdminMasterPagesController::class, 'periodeRekapDetailsPage'])->name('details');
    });
    Route::prefix('pengajuan-promosi')->name('pengajuan-promosi.')->group(function () {
        Route::get('/', [AdminMasterPagesController::class, 'pengajuanPromosiIndexPage'])->name('index');
        Route::get('/create', [AdminMasterPagesController::class, 'pengajuanPromosiCreatePage'])->name('create');
        Route::get('/details', [AdminMasterPagesController::class, 'pengajuanPromosiDetailsPage'])->name('details');
    });
    Route::prefix('/inventaris')->name('inventaris.')->group(function () {
        Route::get('/', [AdminMasterPagesController::class, 'unitIndexPage'])->name('index');
    });
});

