<?php

use App\Http\Controllers\Admin\MasterPagesController;
use Illuminate\Support\Facades\Route;
use Inertia\Inertia;

Route::prefix('admin')->name('admin.')->group(function () {
    Route::get('/dashboard', function () {
        return Inertia::render('Admin/DashboardPage');
    })->name('dashboard');
});
Route::prefix('~')->name('master.')->group(function () {
    Route::get('/unit', [MasterPagesController::class, 'manageUnitPage'])->name('manage-unit');
    Route::get('/golongan', [MasterPagesController::class, 'manageGolonganPage'])->name('manage-golongan');
    Route::get('/kader', [MasterPagesController::class, 'manageKaderPage'])->name('manage-kader');
    Route::get('/admins', [MasterPagesController::class, 'manageAdminPage'])->name('manage-admin');
    Route::get('/pegawai', [MasterPagesController::class, 'manageUnitPage'])->name('manage-pegawai');
    Route::get('/rekap-pegawai', [MasterPagesController::class, 'manageUnitPage'])->name('rekap-pegawai');
    Route::get('/inventaris', [MasterPagesController::class, 'manageUnitPage'])->name('manage-inventaris');
});
