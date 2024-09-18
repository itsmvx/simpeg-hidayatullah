interface AuthUser {
    id: string;
    nama: string;
    username: string | null;
    foto: string | null;
    jenis_kelamin: JenisKelamin | null;
    unit_id: string | null;
};

export type StatusPernikahan = 'Belum Menikah' | 'Menikah' | 'Cerai Hidup' | 'Cerai Mati';
export type StatusAktif = 'Aktif' | 'Nonaktif' | 'Cuti';
export type JenisKelamin = 'Laki-Laki' | 'Perempuan';
export type JenisPengajuanPromosi = 'golongan' | 'marhalah' | 'status_pegawai';
export type JenisPeriodeRekap = 'mingguan' | 'bulanan' | 'semesteran' | 'tahunan';
export type StatusPengajuanPromosi = 'menunggu' | 'ditolak' | 'disetujui';
export type IDNamaColumn = {
    id: string;
    nama: string;
};

export type FormPegawai<T extends Record<string, unknown> = Record<string, unknown>> = T & {
    nik: string;
    nip: string;
    nama: string;
    jenis_kelamin: JenisKelamin | '';
    tempat_lahir: string;
    tanggal_lahir?: Date;
    usia_tahun: number;
    usia_bulan: number;
    suku: string;
    alamat: string;
    agama: string;
    status_pernikahan: StatusPernikahan | '';
    golongan_id: string | null;
    marhalah_id: string | null;
    status_pegawai_id: string | null;
    unit_id: string | null;
    tanggal_masuk?: Date;
    tanggal_promosi?: Date;
    tanggal_marhalah?: Date;
    status_aktif: StatusAktif;
    amanah: string;
    amanah_atasan: string;
    kompetensi_quran: string;
    sertifikasi: string;
    no_hp: string;
    bpjs_kesehatan: boolean;
    bpjs_ketenagakerjaan: boolean;
    data_keluarga: string;
    data_pendidikan_formal: string;
    data_pendidikan_non_formal: string;
    data_pengalaman_organisasi: string;
    data_pengalaman_kerja_pph: string;
    data_pengalaman_kerja_non_pph: string;
}
export type FormPegawaiDataKeluarga = {
    status: string;
    nama: string;
    jenisKelamin: string;
    tempatLahir: string;
    tanggalLahir: string;
    pekerjaan: string;
    pendidikan: string;
};
export type FormPegawaiDataPendidikanFormal = {
    tingkat: string;
    sekolah: string;
    lulus: string;
};
export type FormPegawaiDataPendidikanNonFormal = {
    jenis: string;
    penyelenggara: string;
    tempat: string;
    tahun: string;
};
export type FormPegawaiDataOrganisasi = {
    nama: string;
    jabatan: string;
    masa: string;
    keterangan: string;
};
export type FormPegawaiDataPengalamanPPH = {
    unit: string;
    jabatan: string;
    amanah: string;
    mulai: string;
    akhir: string;
};
export type FormPegawaiDataPengalamanNonPPH = {
    instansi: string;
    jabatan: string;
    tahun: string;
    keterangan: string;
};
export type FormRekapPegawai<T extends Record<string, unknown> = Record<string, unknown>> = T & {
    pegawai_id: string;
    unit_id: string | null;
    golongan_id: string | null;
    status_pegawai_id: string | null;
    marhalah_id: string | null;
    periode_rekap_id: string;
    amanah: string;
    organisasi: string | null;
    gaji: number;
    skill_manajerial: string | null;
    skill_leadership: string | null;
    raport_profesi: string;
    kedisiplinan: string;
    ketuntasan_kerja: string;
    catatan_negatif: string | null;
    prestasi: string | null;
    pembinaan: string | null;
    terverifikasi: boolean;
};
export type PegawaiToRekap = {
    id: string;
    nama: string;
    unit: IDNamaColumn;
    golongan: IDNamaColumn;
    marhalah: IDNamaColumn;
    status_pegawai: IDNamaColumn;
};

export type ModelOnlyColumns<T, K extends keyof T> = Pick<T, K>;
export type ModelWithoutColumns<T, K extends keyof T> = Omit<T, K>;
export type ModelWithColumns<T, U> = T & U;


export type PageProps<T extends Record<string, unknown> = Record<string, unknown>> = T & {
    auth: {
        user: AuthUser | null;
        role: 'admin' | 'pegawai' | null
    };
};
export type PaginationLink = {
    url: string | null;
    label: string;
    active: boolean;
};
export type PaginationData<T> = {
    current_page: number;
    data: T;
    first_page_url: string;
    from: number;
    last_page: number;
    last_page_url: string;
    links: PaginationLink[];
    next_page_url: string | null;
    path: string;
    per_page: number;
    prev_page_url: string | null;
    to: number;
    total: number;
};

export type MTColor =
    | "transparent"
    | "white"
    | "blue-gray"
    | "gray"
    | "brown"
    | "deep-orange"
    | "orange"
    | "amber"
    | "yellow"
    | "lime"
    | "light-green"
    | "green"
    | "teal"
    | "cyan"
    | "light-blue"
    | "blue"
    | "indigo"
    | "deep-purple"
    | "purple"
    | "pink"
    | "red";
