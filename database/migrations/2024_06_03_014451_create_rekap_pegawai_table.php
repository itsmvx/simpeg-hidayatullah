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
        Schema::create('rekap_pegawai', function (Blueprint $table) {
            $table->uuid('id')->primary();
            $table->foreignUuid('pegawai_id')->constrained('pegawai')->cascadeOnDelete();
            $table->foreignUuid('unit_id')->nullable()->constrained('unit')->onDelete('set null');
            $table->foreignUuid('golongan_id')->nullable()->constrained('golongan')->onDelete('set null');
            $table->foreignUuid('status_pegawai_id')->nullable()->constrained('status_pegawai')->onDelete('set null');
            $table->foreignUuid('marhalah_id')->nullable()->constrained('marhalah')->onDelete('set null');
            $table->foreignUuid('periode_rekap_id')->constrained('periode_rekap')->cascadeOnDelete();
            $table->string('amanah');
            $table->string('organisasi')->nullable();
            $table->integer('gaji');
            $table->string('skill_manajerial')->nullable();
            $table->string('skill_leadership')->nullable();
            $table->string('raport_profesi');
            $table->string('kedisiplinan');
            $table->string('ketuntasan_kerja');
            $table->string('catatan_negatif')->nullable();
            $table->string('prestasi')->nullable();
            $table->boolean('terverifikasi')->default(false);
            $table->timestamps();

            $table->unique(['pegawai_id', 'periode_rekap_id']);
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('rekap_pegawai');
    }
};
