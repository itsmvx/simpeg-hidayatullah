import { Head } from "@inertiajs/react";
import {
    Card,
    Typography, Button, Popover, PopoverHandler, PopoverContent, Select, Option, Tooltip
} from "@material-tailwind/react";
import {
    ArrowBigLeft, ArrowBigRight,
    CircleUser, Save,
    Trash2, TriangleAlert,
} from "lucide-react";
import { ChangeEvent, FormEvent, useEffect, useState } from "react";
import "react-day-picker/dist/style.css";
import { MasterLayout } from "@/Layouts/MasterLayout";
import { FormPegawai, IDNamaColumn, JenisKelamin, PageProps } from "@/types";
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
    formDataKeluargaDefault,
    formDataOrganisasiDefault,
    formDataPendidikanFormalDefault,
    formDataPendidikanNonFormalDefault,
    formDataPengalamanNonPPHDefault,
    formDataPengalamanPPHDefault,
    jenisKelamin, statusAktif,
    statusPernikahan
} from "@/Lib/StaticData";
import { Checkbox } from "@/Components/Checkbox";

export default function MASTER_PegawaiCreateUploadPage({ auth, golongans, marhalahs, statusPegawais, units }: PageProps<{
    golongans: IDNamaColumn[];
    marhalahs: IDNamaColumn[];
    statusPegawais: IDNamaColumn[];
    units: IDNamaColumn[];
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
        data: FormPegawai[];
        onSubmit: boolean;
    };
    const formInputsInit: FormInputs = {
        currIndex: -1,
        data: [],
        onSubmit: false
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
    const handleSelectChange = (index: number, dataKey: keyof FormPegawai, value: string) => {
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
    const handleCheckboxChange = (index: number, event: ChangeEvent<HTMLInputElement>) => {
        const { name, checked } = event.target;
        setFormInputs((prevState) => ({
            ...prevState,
            data: prevState.data.map((prevData, idx) => {
                if (idx === index) {
                    return {
                        ...prevData,
                        [name]: checked,
                    };
                }
                return prevData;
            })
        }));
    };
    const handleDateChange = (index: number, dataKey: keyof FormPegawai, date: Date | undefined) => {
        setFormInputs((prevState) => ({
            ...prevState,
            data: prevState.data.map((prevData, idx) => {
                if (idx === index) {
                    if (dataKey === 'tanggal_lahir' && date) {
                        const { months, years } = calculateAge(date)
                        return {
                            ...prevData,
                            tanggal_lahir: date,
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
        const notRequiredKey = ['bpjs_kesehatan', 'bpjs_ketenagakerjaan', 'sertifikasi'];

        return Object.keys(formInputs.data[index]).some((key) => {
            if (notRequiredKey.includes(key)) {
                return false;
            }
            const value = formInputs.data[index][key as keyof FormPegawai];
            return value === undefined || value === null || value === '';
        });
    };

    const handleFormSubmit = (event: FormEvent<HTMLFormElement>) => {
        event.preventDefault();
        setFormInputs((prevState) => ({
            ...prevState,
            onSubmit: true
        }));
        const pegawaiPayload = formInputs.data[formInputs.currIndex];
        const pegawaiSchema = z.object({
            nik: z.string({ message: "Format NIK tidak valid" }).min(1, { message: "NIK tidak boleh kosong" }),
            nip: z.string({ message: "Format NIP tidak valid" }).min(1, { message: "NIP tidak boleh kosong" }),
            nama: z.string({ message: "Format nama tidak valid" }).min(1, { message: "Nama tidak boleh kosong" }),
            jenis_kelamin: z.enum(['Laki-Laki', 'Perempuan'], { message: "Format jenis kelamin tidak valid" }),
            tempat_lahir: z.string({ message: "Format tempat lahir tidak valid" }).min(1, { message: "Tempat lahir tidak boleh kosong" }),
            tanggal_lahir: z.date({ message: "Format tanggal lahir tidak valid" }),
            usia_tahun: z.number({ message: "Format usia tahun tidak valid" }),
            usia_bulan: z.number({ message: "Format usia bulan tidak valid" }),
            suku: z.string({ message: "Format suku tidak valid" }).min(1, { message: "Suku tidak boleh kosong" }),
            alamat: z.string({ message: "Format alamat tidak valid" }).min(1, { message: "Alamat tidak boleh kosong" }),
            agama: z.string({ message: "Format agama tidak valid" }).min(1, { message: "Agama tidak boleh kosong" }),
            status_pernikahan: z.enum(['Belum Menikah', 'Menikah', 'Cerai Hidup', 'Cerai Mati'], { message: "Format status pernikahan tidak valid" }),
            golongan_id: z.string({ message: "Format Data Golongan tidak valid" }).uuid({ message: "Format Data Golongan tidak valid" }).nullable(),
            marhalah_id: z.string({ message: "Format Data Marhalah tidak valid" }).uuid({ message: "Format Data Marhalah tidak valid" }).nullable(),
            status_pegawai_id: z.string({ message: "Format Data Status Pegawai tidak valid" }).uuid({ message: "Format Data Status Pegawai tidak valid" }).nullable(),
            unit_id: z.string({ message: "Format Data Unit tidak valid" }).uuid({ message: "Format Data Unit tidak valid" }).nullable(),
            tanggal_masuk: z.date({ message: "Format tanggal masuk tidak valid" }),
            tanggal_marhalah: z.date({ message: "Format tanggal marhalah tidak valid" }).optional(),
            status_aktif: z.enum(['Aktif', 'Nonaktif', 'Cuti'], { message: "Format status aktif tidak valid" }),
            amanah: z.string({ message: "Format amanah tidak valid" }).min(1, { message: "Amanah tidak boleh kosong" }),
            amanah_atasan: z.string({ message: "Format amanah atasan tidak valid" }).min(1, { message: "Amanah atasan tidak boleh kosong" }),
            kompetensi_quran: z.string({ message: "Format data kompetensi Qur'an tidak valid" }).min(1, { message: "Kompetensi Qur'an tidak boleh kosong" }),
            sertifikasi: z.string({ message: "Format sertifikasi tidak valid" }).nullable(),
            no_hp: z.string({ message: "Format nomor HP tidak valid" }).min(1, { message: "Nomor HP tidak boleh kosong" }),
            bpjs_kesehatan: z.boolean({ message: "Format BPJS Kesehatan tidak valid" }),
            bpjs_ketenagakerjaan: z.boolean({ message: "Format BPJS Ketenagakerjaan tidak valid" }),
            data_keluarga: z.string({ message: "Format data keluarga tidak valid" }).min(1, { message: "Data keluarga tidak boleh kosong" }),
            data_pendidikan_formal: z.string({ message: "Format data pendidikan formal tidak valid" }).min(1, { message: "Data pendidikan formal tidak boleh kosong" }),
            data_pendidikan_non_formal: z.string({ message: "Format data pendidikan non formal tidak valid" }).min(1, { message: "Data pendidikan non formal tidak boleh kosong" }),
            data_pengalaman_organisasi: z.string({ message: "Format data pengalaman organisasi tidak valid" }).min(1, { message: "Data pengalaman organisasi tidak boleh kosong" }),
            data_pengalaman_kerja_pph: z.string({ message: "Format data pengalaman kerja PPH tidak valid" }).min(1, { message: "Data pengalaman kerja PPH tidak boleh kosong" }),
            data_pengalaman_kerja_non_pph: z.string({ message: "Format data pengalaman kerja non PPH tidak valid" }).min(1, { message: "Data pengalaman kerja non PPH tidak boleh kosong" }),
            keahlian: z.string({ message: "Format data keahlian tidak valid" }).nullable().optional(),
        });

        const pegawaiParse = pegawaiSchema.safeParse({
            ...pegawaiPayload
        });

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
                    currIndex: prevState.currIndex === 0
                        ? 0
                        : prevState.currIndex - 1,
                    data: prevState.data.filter((_, idx) => idx !== prevState.currIndex)
                }))
            })
            .catch((err: unknown) => {
                const errMsg = err instanceof AxiosError
                    ? err?.response?.data.message ?? 'Error tidak diketahui terjadi'
                    : 'Error tidak diketahui terjadi'
                notifyToast('error', errMsg);
            })
            .finally(() => setFormInputs((prevState) => ({ ...prevState, onSubmit: false })));
    };

    const mapDataToFormPegawai = (data: any[]): FormPegawai => {
        const tanggal_lahirStr = data[4]?.split(', ')[1];
        const tanggal_lahir = tanggal_lahirStr ? parse(tanggal_lahirStr, 'dd MMMM yyyy', new Date(), { locale: id }) : undefined;
        const tahunMasuk = excelDateToJSDate(data[8]);
        const { months, years } = calculateAge(tanggal_lahir ? tanggal_lahir : new Date());

        return {
            nik: data[1] || "",
            nip: data[0] || "",
            nama: data[2] || "",
            jenis_kelamin: data[3] === 'L' ? 'Laki-Laki' as JenisKelamin : 'Perempuan' as JenisKelamin,
            tempat_lahir: data[4].split(',')[0] || "",
            tanggal_lahir: isValid(tanggal_lahir) ? tanggal_lahir : undefined,
            usia_tahun: years,
            usia_bulan: months,
            suku: '',
            alamat: data[14] || "",
            status_pernikahan: statusPernikahan.includes(data[7]) ? data[7] : "",
            golongan_id: golongans.find((golongan) => golongan.nama === data[10])?.id ?? null,
            marhalah_id: marhalahs.find((marhalah) => marhalah.nama === data[12])?.id ?? null,
            status_pegawai_id: statusPegawais.find((status) => status.nama === data[9])?.id ?? null,
            unit_id: units.find((unit) => unit.nama === data[6])?.id ?? null,
            status_aktif: statusAktif.includes(data[13]) ? data[13] : 'Aktif',
            amanah: "",
            amanah_atasan: "",
            kompetensi_quran: data[11] || "",
            sertifikasi: data[15] || "",
            no_hp: data[5] || "",
            tanggal_masuk: isValid(tahunMasuk) ? tahunMasuk : undefined,
            bpjs_kesehatan: false,
            bpjs_ketenagakerjaan: false,
            agama: "Islam",
            data_keluarga: JSON.stringify([formDataKeluargaDefault]),
            data_pendidikan_formal: JSON.stringify([formDataPendidikanFormalDefault]),
            data_pendidikan_non_formal: JSON.stringify([formDataPendidikanNonFormalDefault]),
            data_pengalaman_organisasi: JSON.stringify([formDataOrganisasiDefault]),
            data_pengalaman_kerja_pph: JSON.stringify([formDataPengalamanPPHDefault]),
            data_pengalaman_kerja_non_pph: JSON.stringify([formDataPengalamanNonPPHDefault]),
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
                            "Status Pernikahan",
                            "Tahun Masuk",
                            "Status Pegawai",
                            "Golongan",
                            "Qur'an",
                            "Marhalah",
                            "Aktif/Cuti",
                            "Alamat",
                            "Sertifikasi"
                        ];
                        let invalidHeader: string = '';
                        const isValidHeaders = raw_data[0].every((header, index) => {
                            if (header === ACCEPT_HEADERS[index]) {
                                return true;
                            }
                            invalidHeader = header;
                            return false;
                        });
                        if (!isValidHeaders) {
                            throw new Error(`Format data tidak valid! (Header ${invalidHeader})`);
                        }
                        const sanitizedData = raw_data.slice(1).filter((data) => data.length > 0).map((row) => row.slice(1));
                        setFormInputs((prevState) => ({
                            ...prevState,
                            currIndex: 0,
                            data: sanitizedData.map((data) => mapDataToFormPegawai(data)),
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

    return (
        <>
            <Head title={ `Master - Upload Pegawai` }/>
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
                                        label="Nomor Induk Kewarganegaraan ( NIK )"
                                        name="nik"
                                        value={ formInputs.data[formInputs.currIndex].nik }
                                        onChange={ (event) => handleInputChange(formInputs.currIndex, event) }
                                        required
                                        error={ !formInputs.data[formInputs.currIndex].nik }
                                    />
                                    <Input
                                        type="text"
                                        color="teal"
                                        label="Nomor Induk Pegawai ( NIP )"
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
                                        name="nama"
                                        value={ formInputs.data[formInputs.currIndex].nama }
                                        onChange={ (event) => handleInputChange(formInputs.currIndex, event) }
                                        required
                                        error={ !formInputs.data[formInputs.currIndex].nama }
                                    />
                                    <Input
                                        type="text" color="teal"
                                        label="Suku bangsa"
                                        name="suku"
                                        value={ formInputs.data[formInputs.currIndex].suku }
                                        onChange={ (event) => handleInputChange(formInputs.currIndex, event) }
                                        error={ !formInputs.data[formInputs.currIndex].suku }
                                        required
                                    />
                                    <Input
                                        type="text"
                                        color="teal"
                                        label="Tempat Lahir"
                                        name="tempat_lahir"
                                        value={ formInputs.data[formInputs.currIndex].tempat_lahir }
                                        onChange={ (event) => handleInputChange(formInputs.currIndex, event) }
                                        required
                                        error={ !formInputs.data[formInputs.currIndex].tempat_lahir }
                                    />
                                    <Popover placement="bottom">
                                        <PopoverHandler>
                                            <Input
                                                color="teal"
                                                label="Tanggal Lahir"
                                                value={ dateInputValue(formInputs.data[formInputs.currIndex].tanggal_lahir) }
                                                readOnly
                                                required
                                                error={ !formInputs.data[formInputs.currIndex].tanggal_lahir }
                                            />
                                        </PopoverHandler>
                                        <PopoverContent className="z-30">
                                            <DayPicker
                                                mode="single"
                                                selected={ formInputs.data[formInputs.currIndex].tanggal_lahir }
                                                onSelect={(value: Date | undefined) => handleDateChange(formInputs.currIndex, 'tanggal_lahir', value) }
                                                showOutsideDays
                                                className="border-0"
                                                captionLayout="dropdown-buttons"
                                                fromYear={ 1950 }
                                                toYear={ new Date().getFullYear() }
                                                disabled={ { after: new Date() } }
                                            />
                                        </PopoverContent>
                                    </Popover>
                                    <div className="flex flex-row gap-4">
                                        <Input
                                            type="text"
                                            color="teal"
                                            label="Usia (Tahun)"
                                            name="usia_tahun"
                                            disabled
                                            value={ formInputs.data[formInputs.currIndex].usia_tahun }
                                            icon={ <p className="-ml-4 text-xs font-semibold">Tahun</p> }
                                            containerProps={ { className: 'min-w-10 w-[10px]' } }
                                        />
                                        <Input
                                            type="text"
                                            color="teal"
                                            label="Usia (Bulan)"
                                            name="usia_bulan"
                                            disabled
                                            value={ formInputs.data[formInputs.currIndex].usia_bulan }
                                            icon={ <p className="-ml-4 text-xs font-semibold">Bulan</p> }
                                            containerProps={ { className: 'min-w-10 w-[10px]' } }
                                        />
                                    </div>
                                    <Select
                                        label="Jenis kelamin"
                                        color="teal"
                                        name="jenis_kelamin"
                                        value={ formInputs.data[formInputs.currIndex].jenis_kelamin }
                                        aria-required={true}
                                        onChange={ (value: string | undefined) => handleSelectChange(formInputs.currIndex, 'jenis_kelamin', value ?? '') }
                                        error={ !formInputs.data[formInputs.currIndex].jenis_kelamin }
                                    >
                                        {
                                            jenisKelamin.map((jenis, index) => ((
                                                <Option key={index} value={jenis}>
                                                    { jenis }
                                                </Option>
                                            )))
                                        }
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
                                        color="teal"
                                        name="status_pernikahan"
                                        value={ formInputs.data[formInputs.currIndex].status_pernikahan }
                                        onChange={ (value: string | undefined) => handleSelectChange(formInputs.currIndex, 'status_pernikahan', value ?? '') }
                                        error={ !formInputs.data[formInputs.currIndex].status_pernikahan }
                                    >
                                        {
                                            statusPernikahan.map((status, index) => ((
                                                <Option key={index} value={status}>
                                                    { status }
                                                </Option>
                                            )))
                                        }
                                    </Select>
                                    <Select
                                        label="Golongan"
                                        color="teal"
                                        name="golongan_id"
                                        value={ formInputs.data[formInputs.currIndex].golongan_id ?? undefined }
                                        onChange={ (value: string | undefined) => handleSelectChange(formInputs.currIndex, 'golongan_id', value ?? '') }
                                        error={ !formInputs.data[formInputs.currIndex].golongan_id }
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
                                        name="marhalah_id"
                                        value={ formInputs.data[formInputs.currIndex].marhalah_id ?? undefined }
                                        onChange={ (value: string | undefined) => handleSelectChange(formInputs.currIndex, 'marhalah_id', value ?? '') }
                                        error={ !formInputs.data[formInputs.currIndex].marhalah_id }
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
                                        name="status_pegawai_id"
                                        value={ formInputs.data[formInputs.currIndex].status_pegawai_id ?? undefined }
                                        onChange={ (value: string | undefined) => handleSelectChange(formInputs.currIndex, 'status_pegawai_id', value ?? '') }
                                        error={ !formInputs.data[formInputs.currIndex].status_pegawai_id }
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
                                        name="unit_id"
                                        value={ formInputs.data[formInputs.currIndex].unit_id ?? undefined }
                                        onChange={ (value: string | undefined) => handleSelectChange(formInputs.currIndex, 'unit_id', value ?? '') }
                                        error={ !formInputs.data[formInputs.currIndex].unit_id }
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
                                    <Popover placement="bottom">
                                        <PopoverHandler>
                                            <Input
                                                color="teal"
                                                label="Tahun Masuk"
                                                value={ dateInputValue(formInputs.data[formInputs.currIndex].tanggal_masuk) }
                                                readOnly
                                                required
                                                error={ !formInputs.data[formInputs.currIndex].tanggal_masuk }
                                            />
                                        </PopoverHandler>
                                        <PopoverContent>
                                            <DayPicker
                                                mode="single"
                                                selected={ formInputs.data[formInputs.currIndex].tanggal_masuk }
                                                onSelect={(value: Date | undefined) => handleDateChange(formInputs.currIndex, 'tanggal_masuk', value) }
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
                                        label="Status Aktif"
                                        color="teal"
                                        name="status_aktif"
                                        value={ formInputs.data[formInputs.currIndex].status_aktif }
                                        onChange={ (value: string | undefined) => handleSelectChange(formInputs.currIndex, 'status_aktif', value ?? '') }
                                        error={ !formInputs.data[formInputs.currIndex].status_aktif }
                                    >
                                        {
                                            statusAktif.map((status, index) => ((
                                                <Option key={index} value={status}>
                                                    { status }
                                                </Option>
                                            )))
                                        }
                                    </Select>
                                    <Input
                                        type="text" color="teal"
                                        label="Kompetensi Qur'an"
                                        name="kompetensi_quran"
                                        value={ formInputs.data[formInputs.currIndex].kompetensi_quran }
                                        onChange={ (event) => handleInputChange(formInputs.currIndex, event) }
                                        required
                                        error={ !formInputs.data[formInputs.currIndex].kompetensi_quran }
                                    />
                                    <Input
                                        type="text" color="teal"
                                        label="Amanah"
                                        name="amanah"
                                        value={ formInputs.data[formInputs.currIndex].amanah }
                                        onChange={ (event) => handleInputChange(formInputs.currIndex, event) }
                                        required
                                        error={ !formInputs.data[formInputs.currIndex].amanah }
                                    />
                                    <Input
                                        type="text" color="teal"
                                        label="Amanah atasan langsung"
                                        name="amanah_atasan"
                                        value={ formInputs.data[formInputs.currIndex].amanah_atasan }
                                        onChange={ (event) => handleInputChange(formInputs.currIndex, event) }
                                        required
                                        error={ !formInputs.data[formInputs.currIndex].amanah_atasan }
                                    />
                                    <Input
                                        type="text" color="teal"
                                        label="Nomor HP/WA"
                                        name="no_hp"
                                        value={ formInputs.data[formInputs.currIndex].no_hp }
                                        onChange={ (event) => handleInputChange(formInputs.currIndex, event) }
                                        required
                                        error={ !formInputs.data[formInputs.currIndex].no_hp }
                                    />
                                    <Input
                                        type="text" color="teal"
                                        label="Sertifikasi (bila ada)"
                                        name="sertifikasi"
                                        value={ formInputs.data[formInputs.currIndex].sertifikasi }
                                        onChange={ (event) => handleInputChange(formInputs.currIndex, event) }
                                    />

                                    <div className="flex flex-row gap-1">
                                        <Checkbox
                                            name="bpjs_kesehatan"
                                            label="BPJS Kesehatan"
                                            labelProps={{
                                                className: 'font-medium'
                                            }}
                                            checked={ formInputs.data[formInputs.currIndex].bpjs_kesehatan }
                                            onChange={ (event) => handleCheckboxChange(formInputs.currIndex, event) }
                                        />
                                        <Checkbox
                                            name="bpjs_ketenagakerjaan"
                                            label="BPJS Ketenagakerjaan"
                                            labelProps={{
                                                className: 'font-medium'
                                            }}
                                            checked={ formInputs.data[formInputs.currIndex].bpjs_ketenagakerjaan }
                                            onChange={ (event) => handleCheckboxChange(formInputs.currIndex, event) }
                                        />
                                    </div>

                                    <Button
                                        type="submit"
                                        className="col-span-1 lg:col-span-2 w-52 ml-auto flex items-center justify-center gap-3"
                                        disabled={formSubmitDisabled(formInputs.currIndex) || formInputs.onSubmit}
                                        loading={formInputs.onSubmit}
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
