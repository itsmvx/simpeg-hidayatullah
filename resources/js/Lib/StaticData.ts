import {
    FormDataKeluarga, FormDataOrganisasi,
    FormDataPendidikanFormal,
    FormDataPendidikanNonFormal, FormDataPengalamanNonPPH, FormDataPengalamanPPH, JenisKelamin, JenisPengajuanPromosi
} from "@/types";

export const formDataKeluargaDefault: FormDataKeluarga =  {
    status: '',
    nama: '',
    jenisKelamin: '',
    tempatLahir: '',
    tanggalLahir: '',
    pekerjaan: '',
    pendidikan: ''
};
export const formDataPendidikanFormalDefault: FormDataPendidikanFormal = {
    tingkat: '',
    sekolah: '',
    lulus: ''
};
export const formDataPendidikanNonFormalDefault: FormDataPendidikanNonFormal = {
    jenis: '',
    penyelenggara: '',
    tempat: '',
    tahun: ''
};
export const formDataOrganisasiDefault: FormDataOrganisasi = {
    nama: '',
    jabatan: '',
    masa: '',
    keterangan: ''
};
export const formDataPengalamanPPHDefault: FormDataPengalamanPPH = {
    unit: '',
    jabatan: '',
    amanah: '',
    mulai: '',
    akhir: ''
};
export const formDataPengalamanNonPPHDefault: FormDataPengalamanNonPPH = {
    instansi: '',
    jabatan: '',
    tahun: '',
    keterangan: ''
};

export const jenisKelamin: JenisKelamin[] = ['Laki-Laki', 'Perempuan'];
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
