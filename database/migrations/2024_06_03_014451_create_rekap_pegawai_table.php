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
            $table->foreignUuid('unit_id')->constrained('unit');
            $table->foreignUuid('golongan_id')->constrained('golongan');
            $table->foreignUuid('status_pegawai_id')->constrained('status_pegawai');
            $table->foreignUuid('marhalah_id')->constrained('marhalah');
            $table->foreignUuid('periode_rekap_id')->constrained('periode_rekap');
            $table->string('amanah');
            $table->string('organisasi');
            $table->integer('gaji');
            $table->string('skill_manajerial');
            $table->string('skill_leadership');
            $table->string('raport_profesi');
            $table->string('kedisiplinan');
            $table->string('ketuntasan_kerja');
            $table->string('catatan_negatif');
            $table->string('prestasi');
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
