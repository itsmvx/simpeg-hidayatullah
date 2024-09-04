<?php

use App\Http\Controllers\Pegawai\PegawaiController;
use Illuminate\Support\Facades\Route;

Route::prefix('pegawai')->name('pegawai.')->group(function () {
    Route::get('/dashboard', [PegawaiController::class, 'index'])->name('dashboard');
    Route::get('/profile', [PegawaiController::class, 'profile'])->name('profile');
    Route::put('/password/update', [PegawaiController::class, 'update'])->name('password.update');
});