interface AuthUser {
    id: string;
    nama: string;
    username: string;
    unit_id: string | null;
}

export interface Unit  {
    id: string;
    nama: string;
    keterangan: string;
    created_at: string;
}

export interface StatusPegawai {
    id: string;
    nama: string;
    keterangan: string;
    created_at: string;
}
export interface Admin {
    id: string;
    nama: string;
    username: string;
    password: string;
    unit_id: Unit;
    created_at?: string;
    updated_at?: string;
}

export interface Marhalah {
    id: string;
    nama: string;
    keterangan: string;
    created_at: string;
}

export interface Golongan {
    id: string;
    nama: string;
    keterangan: string;
    created_at: string;
}

export type Pegawai = {
    id: string;
    username: string;
    password: string;
    nip: string;
    nik: string;
    foto: string | null;
    nama: string;
    jenis_kelamin: 'Laki-Laki' | 'Perempuan';
    tempat_lahir: string;
    tanggal_lahir: string;
    no_hp: string;
    suku: string;
    alamat: string;
    agama: string;
    status_pernikahan: string;
    amanah: string;
    amanah_atasan: string;
    tanggal_masuk: string;
    bpjs_kesehatan: string | null;
    bpjs_ketenagakerjaan: string | null;
    data_keluarga: string;
    pendidikan_formal: string;
    pendidikan_non_formal: string;
    pengalaman_organisasi: string;
    pengalaman_kerja_pph: string;
    pengalaman_kerja_non_pph: string;
    keahlian: string | null;
    golongan_id: string | null;
    marhalah_id: string | null;
    status_pegawai_id: string | null;
    unit_id: string | null;
    created_at?: string;
    updated_at?: string;
};
export type FormDataDiri = {
    nik: string;
    nip: string;
    namaLengkap: string;
    sukuBangsa: string;
    tempatLahir: string;
    tanggalLahir?: Date;
    usiaTahun: string;
    usiaBulan: string;
    jenisKelamin: string;
    alamat: string;
    agama: string;
    statusPernikahan: string;
    marhalahId: string | null;
    golonganId: string | null;
    statusPegawaiId: string | null;
    unitId: string | null;
    amanah: string;
    amanahAtasanLangsung: string;
    nomorHpWa: string;
    tahunMasuk?: Date;
    bpjskesehatan: string | null;
    bpjsketenagakerjaan: string | null;
};
export type FormDataKeluarga = {
    status: string;
    nama: string;
    jenisKelamin: string;
    tempatLahir: string;
    tanggalLahir: string;
    pekerjaan: string;
    pendidikan: string;
};
export type FormDataPendidikanFormal = {
    tingkat: string;
    sekolah: string;
    lulus: string;
};
export type FormDataPendidikanNonFormal = {
    jenis: string;
    penyelenggara: string;
    tempat: string;
    tahun: string;
};
export type FormDataOrganisasi = {
    nama: string;
    jabatan: string;
    masa: string;
    keterangan: string;
};
export type FormDataPengalamanPPH = {
    unit: string;
    jabatan: string;
    amanah: string;
    mulai: string;
    akhir: string;
};
export type FormDataPengalamanNonPPH = {
    instansi: string;
    jabatan: string;
    tahun: string;
    keterangan: string;
};
export type JenisKelamin = 'Laki-Laki' | 'Perempuan';

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
export type IDNamaColumn = {
    id: string;
    nama: string;
};
export type FilterBy<T extends Record<string, unknown> = Record<string, unknown>> = T & {
    marhalah: string[];
    golongan: string[];
    statusPegawai: string[];
    jenisKelamin: string[];
    unit: string[];
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
