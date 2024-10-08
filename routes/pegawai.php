<?php

use App\Http\Controllers\Pages\PegawaiPagesController;
use Illuminate\Support\Facades\Route;

Route::prefix('pegawai')->name('pegawai.')->group(function () {
    Route::get('/profile', [PegawaiPagesController::class, 'profilePage'])->name('profile');
    Route::get('/dashboard', [PegawaiPagesController::class, 'dashboardPage'])->name('dashboard');

    Route::prefix('rekap-pegawai')->name('rekap-pegawai.')->group(function () {
        Route::get('/', [PegawaiPagesController::class, 'rekapPegawaiIndexPage'])->name('index');
        Route::get('/details', [PegawaiPagesController::class, 'rekapPegawaiDetailsPage'])->name('details');
    });
});
