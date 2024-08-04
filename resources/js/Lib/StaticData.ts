import {
    FormDataKeluarga, FormDataOrganisasi,
    FormDataPendidikanFormal,
    FormDataPendidikanNonFormal, FormDataPengalamanNonPPH, FormDataPengalamanPPH
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
