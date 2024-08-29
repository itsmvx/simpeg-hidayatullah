import { Head, router } from "@inertiajs/react";
import {
    Card,
    Collapse,
    IconButton, List, ListItem,
    Typography, Button, Popover, PopoverHandler, PopoverContent, Select, Option, Tooltip
} from "@material-tailwind/react";
import {
    ArrowBigLeft, ArrowBigRight,
    CircleUser,
    GraduationCap, Medal,
    Menu as MenuIcon, Moon, Save,
    Star, Sun, Trash2, TriangleAlert,
    Users,
    X
} from "lucide-react";
import { ChangeEvent, FormEvent, lazy, Suspense, useEffect, useRef, useState } from "react";
import "react-day-picker/dist/style.css";
import { MasterLayout } from "@/Layouts/MasterLayout";
import { FormDataDiri, JenisKelamin, PageProps } from "@/types";
import { z } from "zod";
import { calculateAge, excelDateToJSDate, notifyToast } from "@/Lib/Utils";
import axios, { AxiosError } from "axios";
import * as XLSX from "xlsx";
import { DragNDropFile } from "@/Components/DragAndDropFile";
import { Input } from "@/Components/Input";
import { format, isValid, parse } from "date-fns";
import { id } from "date-fns/locale";
import { DayPicker } from "react-day-picker";
import {
    formDataKeluargaDefault, formDataOrganisasiDefault,
    formDataPendidikanFormalDefault,
    formDataPendidikanNonFormalDefault, formDataPengalamanNonPPHDefault, formDataPengalamanPPHDefault
} from "@/Lib/StaticData";


export default function MASTER_PegawaiCreateUploadPage({ auth, golongans, marhalahs, statusPegawais, units }: PageProps<{
    golongans: {
        id: string;
        nama: string;
    }[];
    marhalahs: {
        id: string;
        nama: string;
    }[];
    statusPegawais: {
        id: string;
        nama: string;
    }[];
    units: {
        id: string;
        nama: string;
    }[];
}>) {

    type uploadFile = {
        file: File | null;
        onInvalid: boolean;
        invalidMsg: string;
    };
    const uploadFileInit: uploadFile = {
        file: null,
        onInvalid: false,
        invalidMsg: ''
    };
    const [ uploadFile, setUploadFile ] = useState<uploadFile>(uploadFileInit);

    const handleSetFile = (file: File | null) => {
        setUploadFile((prevState) => ({
            ...prevState,
            file: file
        }));
    };

    type FormInputs = {
        currIndex: number;
        data: FormDataDiri[];
    };
    const formInputsInit: FormInputs = {
        currIndex: -1,
        data: []
    };
    const [ formInputs, setFormInputs ] = useState<FormInputs>(formInputsInit);
    const dateInputValue = (date: Date | undefined, dateFormat: string = 'PPP'): string => {
        return date
            ? format(date, dateFormat, { locale: id })
            : '';
    };
    const handleInputChange = (index: number, event: ChangeEvent<HTMLInputElement>) => {
        const { name, value } = event.target;
        setFormInputs((prevState) => ({
            ...prevState,
            data: prevState.data.map((prevData, idx) => {
                if (idx === index) {
                    return {
                        ...prevData,
                        [name]: value,
                    };
                }
                return prevData;
            })
        }))
    };
    const handleSelectChange = (index: number, dataKey: keyof FormDataDiri, value: string) => {
        setFormInputs((prevState) => ({
            ...prevState,
            data: prevState.data.map((prevData, idx) => {
                if (index === idx) {
                    return {
                        ...prevData,
                        [dataKey]: value
                    }
                }
                return prevData;
            })
        }))
    };
    const handleDateChange = (index: number, dataKey: keyof FormDataDiri, date: Date | undefined) => {
        setFormInputs((prevState) => ({
            ...prevState,
            data: prevState.data.map((prevData, idx) => {
                if (idx === index) {
                    if (dataKey === 'tanggalLahir' && date) {
                        const { months, years } = calculateAge(date)
                        return {
                            ...prevData,
                            tanggalLahir: date,
                            usiaBulan: months.toString(),
                            usiaTahun: years.toString(),
                        }
                    }
                    return {
                        ...prevData,
                        [dataKey]: date
                    }
                }
                return prevData;
            })
        }))
    };
    const handleNavigateCurrData = (type: 'prev' | 'next') => {
        setFormInputs((prevState) => ({
            ...prevState,
            currIndex: type === 'prev'
                ? prevState.currIndex === 0
                    ? 0
                    : prevState.currIndex - 1
                : prevState.currIndex === prevState.data.length - 1
                    ? prevState.data.length - 1
                    : prevState.currIndex + 1
        }))
    }
    const formSubmitDisabled = (index: number): boolean => {
        const notRequiredKey = ['bpjskesehatan', 'bpjsketenagakerjaan'];

        return Object.keys(formInputs.data[index]).some((key) => {
            if (notRequiredKey.includes(key)) {
                return false;
            }
            const value = formInputs.data[index][key as keyof FormDataDiri];
            return value === undefined || value === null || value === '';
        });
    };

    const handleFormSubmit = (event: FormEvent<HTMLFormElement>) => {
        event.preventDefault();
        const pegawaiSchema = z.object({
            nip: z.string({ message: "NIP tidak boleh kosong" }),
            nik: z.string({ message: "NIK tidak boleh kosong" }),
            foto: z.string().url({ message: "Foto harus berupa URL yang valid" }).nullable(),
            nama: z.string({ message: "Nama tidak boleh kosong" }),
            jenis_kelamin: z.enum(['Laki-Laki', 'Perempuan'], { message: "Jenis kelamin belum dipilih" }),
            tempat_lahir: z.string({ message: "Tempat lahir tidak boleh kosong" }),
            tanggal_lahir: z.date({ message: "Tanggal lahir tidak valid" }),
            no_hp: z.string({ message: "Nomor HP tidak boleh kosong" }),
            suku: z.string({ message: 'Input Suku bangsa tidak boleh kosong' }),
            alamat: z.string({ message: 'Alamat tidak boleh kosong' }),
            agama: z.string({ message: 'Agama tidak boleh kosong' }),
            status_pernikahan: z.string({ message: "Status pernikahan tidak boleh kosong" }),
            amanah: z.string({ message: "Amanah tidak boleh kosong" }),
            amanah_atasan: z.string({ message: "Amanah Atasan tidak boleh kosong" }),
            tanggal_masuk: z.date({ message: "Tanggal masuk harus berupa tanggal yang valid" }),
            bpjs_kesehatan: z.string().nullable(),
            bpjs_ketenagakerjaan: z.string().nullable(),
            data_keluarga: z.string({ message: "Data Keluarga tidak valid" }),
            pendidikan_formal: z.string({ message: "Data Pendidikan formal tidak valid" }),
            pendidikan_non_formal: z.string({ message: "Data Pendidikan non formal tidak valid" }),
            pengalaman_organisasi: z.string({ message: "Data Pengalaman Organisasi tidak valid" }),
            pengalaman_kerja_pph: z.string({ message: "Data Pengalaman Kerja di PPH tidak valid" }),
            pengalaman_kerja_non_pph: z.string({ message: "Data Pengalaman kerja non PPH tidak valid" }),
            keahlian: z.string({ message: "Format data keahlian tidak valid" }).nullable(),
            golongan_id: z.string({ message: "Format Data Golongan tidak valid " }).uuid({ message: "Format Data Golongan tidak valid " }),
            marhalah_id: z.string({ message: "Format Data Marhalah tidak valid " }).uuid({ message: "Format Data Marhalah tidak valid " }),
            status_pegawai_id: z.string({ message: "Format Data Status Pegawai tidak valid " }).uuid({ message: "Format Data Status Pegawai tidak valid " }),
            unit_id: z.string({ message: "Format Data Unit tidak valid " }).uuid({ message: "Format Data Unit tidak valid " })
        });
        const pegawaiPayload = {
            nip: formInputs.data[formInputs.currIndex].nip,
            nik: formInputs.data[formInputs.currIndex].nik,
            foto: null,
            nama: formInputs.data[formInputs.currIndex].namaLengkap,
            jenis_kelamin: formInputs.data[formInputs.currIndex].jenisKelamin,
            tempat_lahir: formInputs.data[formInputs.currIndex].tempatLahir,
            tanggal_lahir: formInputs.data[formInputs.currIndex].tanggalLahir,
            no_hp: formInputs.data[formInputs.currIndex].nomorHpWa,
            suku: formInputs.data[formInputs.currIndex].sukuBangsa,
            alamat: formInputs.data[formInputs.currIndex].alamat,
            agama: formInputs.data[formInputs.currIndex].agama,
            status_pernikahan: formInputs.data[formInputs.currIndex].statusPernikahan,
            amanah: formInputs.data[formInputs.currIndex].amanah,
            amanah_atasan: formInputs.data[formInputs.currIndex].amanahAtasanLangsung,
            tanggal_masuk: formInputs.data[formInputs.currIndex].tahunMasuk,
            bpjs_kesehatan: formInputs.data[formInputs.currIndex].bpjskesehatan,
            bpjs_ketenagakerjaan: formInputs.data[formInputs.currIndex].bpjsketenagakerjaan,
            data_keluarga: JSON.stringify([formDataKeluargaDefault]),
            pendidikan_formal: JSON.stringify([formDataPendidikanFormalDefault]),
            pendidikan_non_formal: JSON.stringify([formDataPendidikanNonFormalDefault]),
            pengalaman_organisasi: JSON.stringify([formDataOrganisasiDefault]),
            pengalaman_kerja_pph: JSON.stringify([formDataPengalamanPPHDefault]),
            pengalaman_kerja_non_pph: JSON.stringify([formDataPengalamanNonPPHDefault]),
            keahlian: null,
            golongan_id: formInputs.data[formInputs.currIndex].golonganId,
            marhalah_id: formInputs.data[formInputs.currIndex].marhalahId,
            status_pegawai_id: formInputs.data[formInputs.currIndex].statusPegawaiId,
            unit_id: formInputs.data[formInputs.currIndex].unitId
        };

        const pegawaiParse = pegawaiSchema.safeParse(pegawaiPayload);

        if (!pegawaiParse.success) {
            notifyToast('error', pegawaiParse.error.issues[0].message ?? 'Error Validasi');
            return;
        }

        axios.post(route('pegawai.create'), {
            ...pegawaiParse.data
        })
            .then(() => {
                notifyToast('success', 'Pegawai berhasil ditambahkan!');
                setFormInputs((prevState) => ({
                    ...prevState,
                    currIndex: prevState.currIndex - 1,
                    data: prevState.data.filter((_, idx) => idx !== prevState.currIndex)
                }))
            })
            .catch((err: unknown) => {
                const errMsg = err instanceof AxiosError
                    ? err?.response?.data.message ?? 'Error tidak diketahui terjadi'
                    : 'Error tidak diketahui terjadi'
                notifyToast('error', errMsg);
            })
    };

    const mapDataToFormDataDiri = (data: any[]): FormDataDiri => {
        const tanggalLahirStr = data[4]?.split(', ')[1];
        const tanggalLahir = tanggalLahirStr ? parse(tanggalLahirStr, 'dd MMMM yyyy', new Date(), { locale: id }) : undefined;
        const tahunMasuk = excelDateToJSDate(data[8]);
        const { months, years } = calculateAge(tanggalLahir ? tanggalLahir : new Date());

        return {
            nik: data[1] || "",
            nip: data[0] || "",
            namaLengkap: data[2] || "",
            jenisKelamin: data[3] === 'L' ? 'Laki-Laki' as JenisKelamin : 'Perempuan' as JenisKelamin,
            tempatLahir: data[4].split(',')[0] || "",
            tanggalLahir: isValid(tanggalLahir) ? tanggalLahir : undefined,
            usiaTahun: years.toString(),
            usiaBulan: months.toString(),
            alamat: data[14] || "",
            statusPernikahan: data[7] || "",
            unitId: units.find((unit) => unit.nama === data[6])?.id ?? null,
            golonganId: golongans.find((golongan) => golongan.nama === data[10])?.id ?? null,
            statusPegawaiId: statusPegawais.find((status) => status.nama === data[9])?.id ?? null,
            marhalahId: marhalahs.find((marhalah) => marhalah.nama === data[12])?.id ?? null,
            amanah: "",
            amanahAtasanLangsung: "",
            nomorHpWa: data[5] || "",
            tahunMasuk: isValid(tahunMasuk) ? tahunMasuk : undefined,
            bpjskesehatan: null,
            bpjsketenagakerjaan: null,
            agama: "",
            sukuBangsa: "",
        };
    };


    useEffect(() => {
        const handleFile = async () => {
            if (uploadFile.file) {
                try {
                    const arrayBuffer = await uploadFile.file.arrayBuffer();
                    const workbook = XLSX.read(arrayBuffer);
                    const worksheet = workbook.Sheets[workbook.SheetNames[0]];
                    const raw_data: any[] = XLSX.utils.sheet_to_json(worksheet, { header: 1 });
                    if (raw_data.length > 0) {
                        const ACCEPT_HEADERS = [
                            "NO",
                            "NIP",
                            "NIK",
                            "Nama",
                            "L/P",
                            "Tempat dan Tanggal Lahir",
                            "Nomor HP",
                            "Unit",
                            "Status",
                            "Tahun Masuk",
                            "Status Pegawai",
                            "Golongan",
                            "Qur'an",
                            "Marhalah",
                            "Aktif/Cuti",
                            "Alamat"
                        ];

                        const isValidHeaders = raw_data[0].every((header, index) => header === ACCEPT_HEADERS[index]);
                        if (!isValidHeaders) {
                            throw new Error('Format data tidak valid! (Header)');
                        }
                        const sanitizedData = raw_data.slice(1).filter((data) => data.length > 0).map((row) => row.slice(1));
                        setFormInputs((prevState) => ({
                            ...prevState,
                            currIndex: 0,
                            data: sanitizedData.map((data) => mapDataToFormDataDiri(data)),
                        }));
                    }

                } catch (error: unknown) {
                    const errMsg = error instanceof Error ? error.message : 'Gagal Membaca dokumen';
                    notifyToast('error', errMsg);
                }
            }
        };
        handleFile();
    }, [ uploadFile.file ]);


    console.log(formInputs)
    return (
        <>
            <Head title="Form Pegawai"/>
            <MasterLayout auth={auth}>
                {
                    uploadFile.file && formInputs.data.length > 0 && formInputs.currIndex > -1 ? (
                        <main className="w-full min-h-screen bg-gray-50 space-y-4">
                            <Card className="w-full px-1.5 lg:px-6">
                                <div className="p-5 flex flex-col md:flex-row justify-between gap-2.5">
                                    <Typography variant="h6">
                                        Data ke { formInputs.currIndex + 1 } dari { formInputs.data.length } yang berhasil dibaca
                                    </Typography>
                                    <div className="flex gap-5">
                                        <Button variant="text" onClick={() => handleNavigateCurrData('prev')} disabled={formInputs.currIndex === 0}>
                                            <ArrowBigLeft />
                                        </Button>
                                        <Button variant="text" onClick={() => handleNavigateCurrData('next')} disabled={formInputs.currIndex === formInputs.data.length - 1}>
                                            <ArrowBigRight />
                                        </Button>
                                    </div>
                                </div>
                                <form onSubmit={ handleFormSubmit } className="grid grid-cols-1 lg:grid-cols-2 gap-x-6 gap-y-4 p-5">
                                    <div className="col-span-1 lg:col-span-full flex justify-between">
                                        <Typography variant="h4" className="flex items-center gap-2">
                                            <CircleUser/>
                                            Data Diri
                                        </Typography>
                                        <Tooltip content="Hapus Data ini">
                                            <Button
                                                variant="text"
                                                onClick={() => {
                                                    setFormInputs((prevState) => ({
                                                        ...prevState,
                                                        currIndex: prevState.currIndex === 0 ? 0 : prevState.currIndex - 1,
                                                        data: prevState.data.filter((_, idx) => idx !== prevState.currIndex)
                                                    }))
                                                }}
                                                className="w-min p-2.5 ml-auto"
                                            >
                                                <Trash2 width={21} className="text-red-400" />
                                            </Button>
                                        </Tooltip>
                                    </div>
                                    <Input
                                        type="text"
                                        color="teal"
                                        label="NIK"
                                        name="nik"
                                        value={ formInputs.data[formInputs.currIndex].nik }
                                        onChange={ (event) => handleInputChange(formInputs.currIndex, event) }
                                        required
                                        error={ !formInputs.data[formInputs.currIndex].nik }
                                    />
                                    <Input
                                        type="text"
                                        color="teal"
                                        label="NIP"
                                        name="nip"
                                        value={ formInputs.data[formInputs.currIndex].nip }
                                        onChange={ (event) => handleInputChange(formInputs.currIndex, event) }
                                        required
                                        error={ !formInputs.data[formInputs.currIndex].nip }
                                    />
                                    <Input
                                        type="text"
                                        color="teal"
                                        label="Nama lengkap"
                                        name="namaLengkap"
                                        value={ formInputs.data[formInputs.currIndex].namaLengkap }
                                        onChange={ (event) => handleInputChange(formInputs.currIndex, event) }
                                        required
                                        error={ !formInputs.data[formInputs.currIndex].namaLengkap }
                                    />
                                    <Input
                                        type="text" color="teal"
                                        label="Suku bangsa"
                                        name="sukuBangsa"
                                        value={ formInputs.data[formInputs.currIndex].sukuBangsa }
                                        onChange={ (event) => handleInputChange(formInputs.currIndex, event) }
                                        required
                                        error={ !formInputs.data[formInputs.currIndex].sukuBangsa }
                                    />
                                    <Input
                                        type="text"
                                        color="teal"
                                        label="Tempat Lahir"
                                        name="tempatLahir"
                                        value={ formInputs.data[formInputs.currIndex].tempatLahir }
                                        onChange={ (event) => handleInputChange(formInputs.currIndex, event) }
                                        required
                                        error={ !formInputs.data[formInputs.currIndex].tempatLahir }
                                    />
                                    <Popover placement="bottom">
                                        <PopoverHandler>
                                            <Input
                                                color="teal"
                                                label="Tanggal Lahir"
                                                value={ dateInputValue(formInputs.data[formInputs.currIndex].tanggalLahir) }
                                                readOnly
                                                required
                                                error={ !formInputs.data[formInputs.currIndex].tanggalLahir }
                                            />
                                        </PopoverHandler>
                                        <PopoverContent className="z-30">
                                            <DayPicker
                                                mode="single"
                                                selected={ formInputs.data[formInputs.currIndex].tanggalLahir }
                                                onSelect={(value: Date | undefined) => handleDateChange(formInputs.currIndex,  'tanggalLahir', value) }
                                                showOutsideDays
                                                className="border-0"
                                                captionLayout="dropdown-buttons"
                                                fromYear={ 1950 }
                                                toYear={ new Date().getFullYear() }
                                                disabled={ { after: new Date() } }
                                            />
                                        </PopoverContent>
                                    </Popover>
                                    <div className="flex flex-col lg:flex-row gap-4">
                                        <Input
                                            type="text"
                                            color="teal"
                                            label="Usia (Tahun)"
                                            name="usiaTahun"
                                            disabled
                                            value={ formInputs.data[formInputs.currIndex].usiaTahun }
                                            icon={ <p className="-ml-4 text-xs font-semibold">Tahun</p> }
                                            containerProps={ { className: 'min-w-24 w-[10px]' } }
                                        />
                                        <Input
                                            type="text"
                                            color="teal"
                                            label="Usia (Bulan)"
                                            name="usiaBulan"
                                            disabled
                                            value={ formInputs.data[formInputs.currIndex].usiaBulan }
                                            icon={ <p className="-ml-4 text-xs font-semibold">Bulan</p> }
                                            containerProps={ { className: 'min-w-24 w-[10px]' } }
                                        />
                                    </div>
                                    <Select
                                        label="Jenis kelamin"
                                        color="teal"
                                        name="jenisKelamin"
                                        value={ formInputs.data[formInputs.currIndex].jenisKelamin }
                                        aria-required={true}
                                        onChange={ (value: string | undefined) => handleSelectChange(formInputs.currIndex, 'jenisKelamin', value ?? '') }
                                        error={ !formInputs.data[formInputs.currIndex].jenisKelamin }
                                    >
                                        <Option value="Laki-Laki">Laki-Laki</Option>
                                        <Option value="Perempuan">Perempuan</Option>
                                    </Select>
                                    <Input
                                        type="text" color="teal"
                                        label="Alamat"
                                        name="alamat"
                                        value={ formInputs.data[formInputs.currIndex].alamat }
                                        onChange={ (event) => handleInputChange(formInputs.currIndex, event) }
                                        required
                                        error={ !formInputs.data[formInputs.currIndex].alamat }
                                    />
                                    <Input
                                        type="text"
                                        color="teal"
                                        label="Agama"
                                        name="agama"
                                        value={ formInputs.data[formInputs.currIndex].agama }
                                        onChange={ (event) => handleInputChange(formInputs.currIndex, event) }
                                        required
                                        error={ !formInputs.data[formInputs.currIndex].agama }
                                    />
                                    <Select
                                        label="Status pernikahan"
                                        color="teal" name="statusPernikahan"
                                        value={ formInputs.data[formInputs.currIndex].statusPernikahan }
                                        onChange={ (value: string | undefined) => handleSelectChange(formInputs.currIndex, 'statusPernikahan', value ?? '') }
                                        error={ !formInputs.data[formInputs.currIndex].statusPernikahan }
                                    >
                                        <Option value="Belum menikah">Belum menikah</Option>
                                        <Option value="Menikah">Menikah</Option>
                                        <Option value="Cerai hidup">Cerai hidup</Option>
                                        <Option value="Cerai mati">Cerai mati</Option>
                                    </Select>
                                    <Popover placement="bottom">
                                        <PopoverHandler>
                                            <Input
                                                color="teal"
                                                label="Tahun Masuk"
                                                value={ dateInputValue(formInputs.data[formInputs.currIndex].tahunMasuk, 'y') }
                                                readOnly
                                                required
                                                error={ !formInputs.data[formInputs.currIndex].tahunMasuk }
                                            />
                                        </PopoverHandler>
                                        <PopoverContent>
                                            <DayPicker
                                                mode="single"
                                                selected={ formInputs.data[formInputs.currIndex].tahunMasuk }
                                                onSelect={ (value: Date | undefined) => handleDateChange(formInputs.currIndex, 'tahunMasuk', value) }
                                                showOutsideDays
                                                className="border-0"
                                                captionLayout="dropdown-buttons"
                                                fromYear={ 1950 }
                                                toYear={ new Date().getFullYear() }
                                                disabled={ { after: new Date() } }
                                            />
                                        </PopoverContent>
                                    </Popover>
                                    <Select
                                        label="Golongan"
                                        color="teal"
                                        name="golonganId"
                                        value={ formInputs.data[formInputs.currIndex].golonganId ?? undefined }
                                        onChange={ (value: string | undefined) => handleSelectChange(formInputs.currIndex, 'golonganId', value ?? '') }
                                        error={ !formInputs.data[formInputs.currIndex].golonganId }
                                    >
                                        {
                                            golongans.length > 0
                                                ? golongans.sort((a, b) => a.nama.localeCompare(b.nama)).map(({ id, nama }) => ((
                                                    <Option key={id} value={id}>{nama}</Option>
                                                )))
                                                : (
                                                    <Option disabled value="null">
                                                        <p className="flex items-center gap-2">
                                                            <TriangleAlert className="text-red-600" />
                                                            <span className="text-gray-900 font-semibold">
                                                                Belum ada Golongan terdaftar
                                                            </span>
                                                        </p>
                                                    </Option>
                                                )
                                        }
                                    </Select>
                                    <Select
                                        label="Marhalah"
                                        color="teal"
                                        name="marhalahId"
                                        value={ formInputs.data[formInputs.currIndex].marhalahId ?? undefined }
                                        onChange={ (value: string | undefined) => handleSelectChange(formInputs.currIndex, 'marhalahId', value ?? '') }
                                        error={ !formInputs.data[formInputs.currIndex].marhalahId }
                                    >
                                        {
                                            marhalahs.length > 0
                                                ? marhalahs.sort((a, b) => a.nama.localeCompare(b.nama)).map(({ id, nama }) => ((
                                                    <Option key={id} value={id}>{nama}</Option>
                                                )))
                                                : (
                                                    <Option disabled value="null">
                                                        <p className="flex items-center gap-2">
                                                            <TriangleAlert className="text-red-600" />
                                                            <span className="text-gray-900 font-semibold">
                                                                Belum ada Marhalah terdaftar
                                                            </span>
                                                        </p>
                                                    </Option>
                                                )
                                        }
                                    </Select>
                                    <Select
                                        label="Status Pegawai"
                                        color="teal"
                                        name="statusPegawaiId"
                                        value={ formInputs.data[formInputs.currIndex].statusPegawaiId ?? undefined }
                                        onChange={ (value: string | undefined) => handleSelectChange(formInputs.currIndex, 'statusPegawaiId', value ?? '') }
                                        error={ !formInputs.data[formInputs.currIndex].statusPegawaiId }
                                    >
                                        {
                                            statusPegawais.length > 0
                                                ? statusPegawais.sort((a, b) => a.nama.localeCompare(b.nama)).map(({ id, nama }) => ((
                                                    <Option key={id} value={id}>{nama}</Option>
                                                )))
                                                : (
                                                    <Option disabled value="null">
                                                        <p className="flex items-center gap-2">
                                                            <TriangleAlert className="text-red-600" />
                                                            <span className="text-gray-900 font-semibold">
                                                                Belum ada Status Pegawai terdaftar
                                                            </span>
                                                        </p>
                                                    </Option>
                                                )
                                        }
                                    </Select>
                                    <Select
                                        label="Unit"
                                        color="teal"
                                        name="unitId"
                                        value={ formInputs.data[formInputs.currIndex].unitId ?? undefined }
                                        onChange={ (value: string | undefined) => handleSelectChange(formInputs.currIndex, 'unitId', value ?? '') }
                                        error={ !formInputs.data[formInputs.currIndex].unitId }
                                    >
                                        {
                                            units.length > 0
                                                ? units.sort((a, b) => a.nama.localeCompare(b.nama)).map(({ id, nama }) => ((
                                                    <Option key={id} value={id}>{nama}</Option>
                                                )))
                                                : (
                                                    <Option disabled value="null">
                                                        <p className="flex items-center gap-2">
                                                            <TriangleAlert className="text-red-600" />
                                                            <span className="text-gray-900 font-semibold">
                                                                Belum ada Unit terdaftar
                                                            </span>
                                                        </p>
                                                    </Option>
                                                )
                                        }
                                    </Select>
                                    <Input
                                        type="text" color="teal" label="Amanah"
                                        name="amanah"
                                        value={ formInputs.data[formInputs.currIndex].amanah }
                                        onChange={ (event) => handleInputChange(formInputs.currIndex, event) }
                                        required
                                        error={ !formInputs.data[formInputs.currIndex].amanah }
                                    />
                                    <Input
                                        type="text" color="teal" label="Amanah atasan langsung"
                                        name="amanahAtasanLangsung"
                                        value={ formInputs.data[formInputs.currIndex].amanahAtasanLangsung }
                                        onChange={ (event) => handleInputChange(formInputs.currIndex, event) }
                                        required
                                        error={ !formInputs.data[formInputs.currIndex].amanah }
                                    />
                                    <Input
                                        type="text" color="teal"
                                        label="Nomor HP/WA" name="nomorHpWa"
                                        value={ formInputs.data[formInputs.currIndex].nomorHpWa }
                                        onChange={ (event) => handleInputChange(formInputs.currIndex, event) }
                                        required
                                        error={ !formInputs.data[formInputs.currIndex].nomorHpWa }
                                    />
                                    <Input
                                        type="text" color="teal" label="BPJS Kesehatan ( jika ada )"
                                        name="bpjskesehatan"
                                        value={ formInputs.data[formInputs.currIndex].bpjskesehatan ?? undefined }
                                        onChange={ (event) => handleInputChange(formInputs.currIndex, event) }
                                    />
                                    <Input
                                        type="text" color="teal" label="BPJS Ketenagakerjaan ( jika ada )"
                                        name="bpjsketenagakerjaan"
                                        value={ formInputs.data[formInputs.currIndex].bpjsketenagakerjaan ?? undefined }
                                        onChange={ (event) => handleInputChange(formInputs.currIndex, event) }
                                    />

                                    <Button
                                        type="submit"
                                        className="col-span-1 lg:col-span-2 w-52 ml-auto flex items-center justify-center gap-3"
                                        disabled={formSubmitDisabled(formInputs.currIndex)}
                                    >
                                        <Save/>
                                        Simpan
                                    </Button>
                                </form>
                            </Card>
                        </main>
                    ) : (
                        <DragNDropFile setFile={handleSetFile} />
                    )
                }
            </MasterLayout>
        </>
    );
}
