import {
    FormPegawaiDataKeluarga,
    FormPegawaiDataOrganisasi,
    FormPegawaiDataPendidikanFormal,
    FormPegawaiDataPendidikanNonFormal,
    FormPegawaiDataPengalamanNonPPH,
    FormPegawaiDataPengalamanPPH,
    JenisKelamin,
    JenisPengajuanPromosi, JenisPeriodeRekap, StatusAktif,
    StatusPernikahan
} from "@/types";

export const formDataKeluargaDefault: FormPegawaiDataKeluarga =  {
    status: '',
    nama: '',
    jenisKelamin: '',
    tempatLahir: '',
    tanggalLahir: '',
    pekerjaan: '',
    pendidikan: ''
};
export const formDataPendidikanFormalDefault: FormPegawaiDataPendidikanFormal = {
    tingkat: '',
    sekolah: '',
    lulus: ''
};
export const formDataPendidikanNonFormalDefault: FormPegawaiDataPendidikanNonFormal = {
    jenis: '',
    penyelenggara: '',
    tempat: '',
    tahun: ''
};
export const formDataOrganisasiDefault: FormPegawaiDataOrganisasi = {
    nama: '',
    jabatan: '',
    masa: '',
    keterangan: ''
};
export const formDataPengalamanPPHDefault: FormPegawaiDataPengalamanPPH = {
    unit: '',
    jabatan: '',
    amanah: '',
    mulai: '',
    akhir: ''
};
export const formDataPengalamanNonPPHDefault: FormPegawaiDataPengalamanNonPPH = {
    instansi: '',
    jabatan: '',
    tahun: '',
    keterangan: ''
};

export const jenisKelamin: JenisKelamin[] = ['Laki-Laki', 'Perempuan'];
export const jenisPeriodeRekap: JenisPeriodeRekap[] = ['mingguan', 'bulanan', 'semesteran', 'tahunan'];
export const statusAktif: StatusAktif[] = ['Aktif', 'Nonaktif', 'Cuti'];
export const statusPernikahan: StatusPernikahan[] = ['Belum Menikah', 'Menikah', 'Cerai Hidup', 'Cerai Mati'];
export const jenisPengajuanPromosi: {
    label: string;
    value: JenisPengajuanPromosi;
}[] = [
    {
        label: 'Golongan',
        value: 'golongan'
    },
    {
        label: 'Marhalah',
        value: 'marhalah',
    },
    {
        label: 'Status Pegawai',
        value: 'status_pegawai'
    }
];
export const viewPerPage: number[] = [25, 50, 100, 150];
