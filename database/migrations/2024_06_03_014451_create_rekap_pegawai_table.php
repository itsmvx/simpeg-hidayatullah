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
            $table->foreignUuid('pegawai_id')->constrained('pegawai');
            $table->foreignUuid('golongan_id')->constrained('golongan');
            $table->foreignUuid('status_pegawai_id')->constrained('status_pegawai');
            $table->foreignUuid('amanah_id')->constrained('amanah');
            $table->foreignUuid('unit_id')->constrained('unit');
            $table->foreignUuid('marhalah_id')->constrained('marhalah');
            $table->integer('gaji');
            $table->string('skill_manajerial')->nullable();
            $table->string('skill_leadership')->nullable();
            $table->string('raport_profesi');
            $table->string('kedisiplinan');
            $table->string('ketuntasan_kerja');
            $table->year('tahun_ajaran_awal');
            $table->year('tahun_ajaran_akhir');
            $table->string('catatan_negatif')->nullable()->comment('Array[] stringify');
            $table->string('prestasi')->nullable()->comment('Array[] stringify');
            $table->timestamps();
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
