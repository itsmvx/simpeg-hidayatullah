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
        Schema::create('pegawai', function (Blueprint $table) {
            $table->uuid('id')->primary();
            $table->string('username')->unique();
            $table->string('password');
            $table->string('nip')->unique();
            $table->string('nik')->unique();
            $table->string('foto')->comment('URL Storage');
            $table->string('nama');
            $table->enum('jenis_kelamin', ['L', 'P']);
            $table->string('tempat_lahir');
            $table->date('tanggal_lahir');
            $table->integer('usia');
            $table->string('no_hp');
            $table->string('status_pernikahan');
            $table->date('tahun_masuk');
            $table->string('bpjs_kesehatan')->nullable();
            $table->string('bpjs_ketenagakerjaan')->nullable();
            $table->string('kepangkatan');
            $table->string('keahlian')->nullable()->comment('Array[] stringify');
            $table->string('pendidikan_formal')->comment('Array[] stringify');
            $table->string('pendidikan_non_formal')->nullable()->comment('Array[] stringify');
            $table->foreignUuid('unit_id')->constrained('unit');
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('pegawai');
    }
};
