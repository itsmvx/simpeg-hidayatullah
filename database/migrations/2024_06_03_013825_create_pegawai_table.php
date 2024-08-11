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
            $table->string('username');
            $table->string('password');
            $table->string('nip')->unique();
            $table->string('nik')->unique();
            $table->string('foto')->nullable()->comment('URL Storage');
            $table->string('nama');
            $table->enum('jenis_kelamin', ['Laki-Laki', 'Perempuan']);
            $table->string('tempat_lahir');
            $table->date('tanggal_lahir');
            $table->string('no_hp');
            $table->string('suku');
            $table->string('alamat');
            $table->string('agama');
            $table->string('status_pernikahan');
            $table->string('amanah');
            $table->string('amanah_atasan');
            $table->date('tanggal_masuk');
            $table->date('tanggal_promosi')->default(now('Asia/Jakarta'));
            $table->string('bpjs_kesehatan')->nullable();
            $table->string('bpjs_ketenagakerjaan')->nullable();
            $table->longText('data_keluarga')->comment('Array[] stringify');
            $table->longText('pendidikan_formal')->comment('Array[] stringify');
            $table->longText('pendidikan_non_formal')->comment('Array[] stringify');
            $table->longText('pengalaman_organisasi')->comment('Array[] stringify');
            $table->longText('pengalaman_kerja_pph')->comment('Array[] stringify');
            $table->longText('pengalaman_kerja_non_pph')->comment('Array[] stringify');
            $table->longText('keahlian')->nullable()->comment('Array[] stringify');
            $table->foreignUuid('golongan_id')->nullable()->constrained('golongan')->onDelete('set null');
            $table->foreignUuid('marhalah_id')->nullable()->constrained('marhalah')->onDelete('set null');
            $table->foreignUuid('status_pegawai_id')->nullable()->constrained('status_pegawai')->onDelete('set null');
            $table->foreignUuid('unit_id')->nullable()->constrained('unit')->onDelete('set null');
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
