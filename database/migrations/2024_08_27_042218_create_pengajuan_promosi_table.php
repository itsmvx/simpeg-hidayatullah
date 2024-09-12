<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    /**
     * Run the migrations.
     */
    public function up(): void
    {
        Schema::create('pengajuan_promosi', function (Blueprint $table) {
            $table->uuid('id')->primary();
            $table->string('nama');
            $table->string('jenis');
            $table->foreignUuid('unit_id')->constrained('unit')->cascadeOnDelete();
            $table->foreignUuid('admin_id')->nullable()->constrained('admin')->onDelete('set null');
            $table->foreignUuid('admin_penyetuju_id')->nullable()->constrained('admin')->onDelete('set null');
            $table->foreignUuid('pegawai_id')->constrained('pegawai')->cascadeOnDelete();
            $table->uuidMorphs('asal');
            $table->uuidMorphs('akhir');
            $table->text('keterangan')->nullable();
            $table->text('komentar')->nullable();
            $table->enum('status_pengajuan', ['menunggu', 'disetujui', 'ditolak'])->default('menunggu');
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('pengajuan_promosis');
    }
};
