import { Head, router } from "@inertiajs/react";
import { Card, IconButton, Typography, Button, Tooltip, Select, Option, PopoverHandler, PopoverContent, Popover } from "@material-tailwind/react";
import { Award, CircleAlert, CircleUser, GraduationCap, Medal, MoveLeft, Pencil, Save,  Users } from "lucide-react";
import { ChangeEvent, FormEvent, useEffect, useMemo, useRef, useState } from "react";
import "react-day-picker/dist/style.css";
import PegawaiFormDataKeluarga from "@/Components/FormDataKeluarga";
import PegawaiFormDataPendidikanFormal from "@/Components/FormDataPendidikanFormal";
import PegawaiFormDataPendidikanNonFormal from "@/Components/FormDataPendidikanNonFormal";
import PegawaiFormDataOrganisasi from "@/Components/FormDataPengalamanOrganisasi";
import PegawaiFormDataPengalamanPPH from "@/Components/FormDataPengalamanKerjaPPH";
import PegawaiFormDataPengalamanNonPPH from "@/Components/FormDataPengalamanKerjaNonPPH";
import type {
    FormPegawai,
    FormPegawaiDataKeluarga,
    FormPegawaiDataOrganisasi,
    FormPegawaiDataPendidikanFormal,
    FormPegawaiDataPendidikanNonFormal, FormPegawaiDataPengalamanNonPPH,
    FormPegawaiDataPengalamanPPH, IDNamaColumn, ModelWithColumns,
    PageProps,
} from "@/types";
import { z } from "zod";
import { calculateAge, calculateDatePast, notifyToast } from "@/Lib/Utils";
import axios, { AxiosError, AxiosProgressEvent } from "axios";
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
import { toast } from "react-toastify";
import { MenAvatar, WomenAvatar } from "@/Lib/StaticImages";
import { id } from "date-fns/locale";
import { format } from "date-fns";
import { Pegawai } from "@/types/models";
import { Input } from "@/Components/Input";
import { DayPicker } from "react-day-picker";
import { Checkbox } from "@/Components/Checkbox";
import { PegawaiLayout } from "@/Layouts/PegawaiLayout";

export default function PEGAWAI_ProfilePage({ auth, pegawai, currDate }: PageProps<{
    pegawai: ModelWithColumns<Pegawai, {
        golongan: IDNamaColumn;
        marhalah: IDNamaColumn;
        status_pegawai: IDNamaColumn;
        unit: IDNamaColumn;
    }>;
    currDate: string;
}>) {

    const pegawaiStateInit: FormPegawai<{
        onSubmit: boolean;
    }> = useMemo(() => {
        const { years, months } = calculateAge(new Date(pegawai.tanggal_lahir));
        return {
            id: pegawai.id,
            nik: pegawai.nik,
            nip: pegawai.nip,
            nama: pegawai.nama,
            jenis_kelamin: pegawai.jenis_kelamin,
            tempat_lahir: pegawai.tempat_lahir,
            tanggal_lahir: new Date(pegawai.tanggal_lahir),
            usia_tahun: years,
            usia_bulan: months,
            suku: pegawai.suku,
            alamat: pegawai.alamat,
            agama: pegawai.agama,
            status_pernikahan: pegawai.status_pernikahan,
            golongan_id: pegawai.golongan_id,
            marhalah_id: pegawai.marhalah_id,
            status_pegawai_id: pegawai.status_pegawai_id,
            unit_id: pegawai.unit_id,
            tanggal_masuk: new Date(pegawai.tanggal_masuk),
            tanggal_promosi: pegawai.tanggal_promosi ? new Date(pegawai.tanggal_promosi) : undefined,
            tanggal_marhalah: pegawai.tanggal_marhalah ? new Date(pegawai.tanggal_marhalah) : undefined,
            status_aktif: pegawai.status_aktif,
            amanah: pegawai.amanah,
            amanah_atasan: pegawai.amanah_atasan,
            kompetensi_quran: pegawai.kompetensi_quran ?? '',
            sertifikasi: pegawai.sertifikasi ?? '',
            no_hp: pegawai.no_hp,
            bpjs_kesehatan: Boolean(pegawai.bpjs_kesehatan),
            bpjs_ketenagakerjaan: Boolean(pegawai.bpjs_ketenagakerjaan),
            data_keluarga: pegawai.data_keluarga,
            data_pendidikan_formal: pegawai.data_pendidikan_formal,
            data_pendidikan_non_formal: pegawai.data_pendidikan_non_formal,
            data_pengalaman_organisasi: pegawai.data_pengalaman_organisasi,
            data_pengalaman_kerja_pph: pegawai.data_pengalaman_kerja_pph,
            data_pengalaman_kerja_non_pph: pegawai.data_pengalaman_kerja_non_pph,
            onSubmit: false
        }
    }, [ pegawai ]);

    const [ pegawaiState, setPegawaiState ] = useState<FormPegawai<{
        onSubmit: boolean;
    }>>(pegawaiStateInit)

    const [ openNav, setOpenNav] = useState(false);
    const [ dataKeluarga, setDataKeluarga ] = useState<FormPegawaiDataKeluarga[]>( JSON.parse(pegawai.data_keluarga) );
    const [ dataPendidikanFormal, setDataPendidikanFormal ] = useState<FormPegawaiDataPendidikanFormal[]>( JSON.parse(pegawai.data_pendidikan_formal));
    const [ dataPendidikanNonFormal, setDataPendidikanNonFormal ] = useState<FormPegawaiDataPendidikanNonFormal[]>( JSON.parse(pegawai.data_pendidikan_non_formal) );
    const [ dataOrganisasi, setDataOrganisasi ] = useState<FormPegawaiDataOrganisasi[]>( JSON.parse(pegawai.data_pengalaman_organisasi) );
    const [ dataPengalamanPPH, setDataPengalamanPPH ] = useState<FormPegawaiDataPengalamanPPH[]>( JSON.parse(pegawai.data_pengalaman_kerja_pph) );
    const [ dataPengalamanNonPPH, setDataPengalamanNonPPH ] = useState<FormPegawaiDataPengalamanNonPPH[]>( JSON.parse(pegawai.data_pengalaman_kerja_non_pph) );

    const handleInputChange = (event: ChangeEvent<HTMLInputElement>) => {
        const { name, value } = event.target;
        setPegawaiState((prevState) => ({
            ...prevState,
            [name]: value,
        }));
    };
    const handleSelectChange = (key: keyof FormPegawai, value: string) => {
        setPegawaiState((prevState) => ({
            ...prevState,
            [key]: value,
        }));
    };
    const handleDateChange = (date: Date | undefined, key: keyof FormPegawai) => {
        setPegawaiState((prevState) => ({
            ...prevState,
            [key]: date,
        }));
    };

    const [ onChangeDataPromosi, setOnChangeDataPromosi ] = useState(false);
    const [ onSubmit, setOnSubmit ] = useState(false);
    const [ onLoadImage, setOnLoadImage ] = useState(false);

    const handleFormSubmit = (event: FormEvent<HTMLFormElement>) => {
        event.preventDefault();
        setOnSubmit(true);
        const pegawaiSchema = z.object({
            nik: z.string({ message: "Format NIK tidak valid" }).min(1, { message: "NIK tidak boleh kosong" }),
            nip: z.string({ message: "Format NIP tidak valid" }).min(1, { message: "NIP tidak boleh kosong" }),
            nama: z.string({ message: "Format nama tidak valid" }).min(1, { message: "Nama tidak boleh kosong" }),
            jenis_kelamin: z.enum(['Laki-Laki', 'Perempuan'], { message: "Format jenis kelamin tidak valid" }),
            tempat_lahir: z.string({ message: "Format tempat lahir tidak valid" }).min(1, { message: "Tempat lahir tidak boleh kosong" }),
            tanggal_lahir: z.date({ message: "Format tanggal lahir tidak valid" }),
            suku: z.string({ message: "Format suku tidak valid" }).min(1, { message: "Suku tidak boleh kosong" }),
            alamat: z.string({ message: "Format alamat tidak valid" }).min(1, { message: "Alamat tidak boleh kosong" }),
            agama: z.string({ message: "Format agama tidak valid" }).min(1, { message: "Agama tidak boleh kosong" }),
            status_pernikahan: z.enum(['Belum Menikah', 'Menikah', 'Cerai Hidup', 'Cerai Mati'], { message: "Format status pernikahan tidak valid" }),
            golongan_id: z.string({ message: "Format Data Golongan tidak valid" }).uuid({ message: "Format Data Golongan tidak valid" }).nullable(),
            marhalah_id: z.string({ message: "Format Data Marhalah tidak valid" }).uuid({ message: "Format Data Marhalah tidak valid" }).nullable(),
            status_pegawai_id: z.string({ message: "Format Data Status Pegawai tidak valid" }).uuid({ message: "Format Data Status Pegawai tidak valid" }).nullable(),
            unit_id: z.string({ message: "Format Data Unit tidak valid" }).uuid({ message: "Format Data Unit tidak valid" }).nullable(),
            tanggal_masuk: z.date({ message: "Format tanggal masuk tidak valid" }),
            tanggal_promosi: z.date({ message: "Format tanggal Promosi tidak valid" }).optional(),
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
        const pegawaiPayload = {
            ...pegawaiState,
        };

        const pegawaiParse = pegawaiSchema.safeParse(pegawaiPayload);

        if (!pegawaiParse.success) {
            notifyToast('error', pegawaiParse.error.issues[0].message ?? 'Error Validasi');
            return;
        }

        axios.post(route('pegawai.update'), {
            ...pegawaiParse.data,
            id: pegawai.id,
        })
            .then(() => {
                notifyToast('success', 'Pegawai berhasil diperbarui!');
                router.reload({ only: [ 'pegawai' ]});
            })
            .catch((err: unknown) => {
                const errMsg = err instanceof AxiosError
                    ? err?.response?.data.message ?? 'Error tidak diketahui terjadi'
                    : 'Error tidak diketahui terjadi'
                notifyToast('error', errMsg);
            })
            .finally(() => setOnSubmit(false));
    };
    const handleImageChange = (e: ChangeEvent<HTMLInputElement>) => {
        if (e.target.files && e.target.files.length > 0) {
            const file = e.target.files[0];
            if (file && file.size > 2 * 1024 * 1024) {
                notifyToast('error','Ukuran file maksimal adalah 2MB!');
                return;
            }
            const formData = new FormData();
            formData.append('image', file);
            formData.append('id', pegawai.id);
            const id = toast.loading("Mengunggah Foto...");
            axios.post(route('pegawai.upload-foto'), formData, {
                onUploadProgress: (p: AxiosProgressEvent) => {
                    const progress: number = p.loaded / (p.total ?? 100);
                    toast.update(id, { type: "info", isLoading: true, progress: progress });
                }
            })
                .then(() => {
                    setOnLoadImage(true);
                    router.reload({ only: [ 'pegawai' ] });
                    notifyToast('success', 'Berhasil mengunggah foto');
                })
                .catch(() => {
                    notifyToast('error', 'Gagal mengunggah foto')
                });
        }
    };

    useEffect(() => {
        if (pegawaiState.tanggal_lahir) {
            const { years, months } = calculateAge(pegawaiState.tanggal_lahir);
            setPegawaiState((prevState) => ({
                ...prevState,
                usia_tahun: years,
                usia_bulan: months,
            }));
        }
    }, [pegawaiState.tanggal_lahir]);
    useEffect(() => {
        setPegawaiState((prevState) => ({
            ...prevState,
            data_keluarga: JSON.stringify(dataKeluarga)
        }))
    }, [ dataKeluarga ]);
    useEffect(() => {
        setPegawaiState((prevState) => ({
            ...prevState,
            data_pendidikan_formal: JSON.stringify(dataPendidikanFormal)
        }));
    }, [ dataPendidikanFormal ]);
    useEffect(() => {
        setPegawaiState((prevState) => ({
            ...prevState,
            data_pendidikan_non_formal: JSON.stringify(dataPendidikanNonFormal)
        }));
    }, [ dataPendidikanNonFormal ]);
    useEffect(() => {
        setPegawaiState((prevState) => ({
            ...prevState,
            data_pengalaman_organisasi: JSON.stringify(dataOrganisasi)
        }));
    }, [ dataOrganisasi ]);
    useEffect(() => {
        setPegawaiState((prevState) => ({
            ...prevState,
            data_pengalaman_kerja_pph: JSON.stringify(dataPengalamanPPH)
        }));
    }, [ dataPengalamanPPH ]);
    useEffect(() => {
        setPegawaiState((prevState) => ({
            ...prevState,
            data_pengalaman_kerja_non_pph: JSON.stringify(dataPengalamanNonPPH)
        }));
    }, [ dataPengalamanNonPPH ]);

    useEffect(() => {
        const handleResize = () => {
            window.innerWidth >= 960 && setOpenNav(false)
        };
        window.addEventListener("resize", handleResize);

        return () => window.removeEventListener('resize', handleResize);
    }, []);

    useEffect(() => {
        setOnChangeDataPromosi(pegawaiState.golongan_id !== pegawai.golongan_id ||  pegawaiState.status_pegawai_id !== pegawai.status_pegawai_id);
    }, [ pegawaiState ]);
    useEffect(() => {
        if (onChangeDataPromosi && pegawai.tanggal_promosi) {
            setPegawaiState((prevState) => ({
                ...prevState,
                tanggal_promosi: new Date(currDate)
            }));
        }
    }, [ onChangeDataPromosi ]);

    return (
        <>
            <Head title="Pegawai - Data Pegawai"/>
            <PegawaiLayout auth={auth}>
                <main className="w-full min-h-screen bg-gray-50">
                    <header className="px-6 py-3 bg-white border-b-2 !shadow-none">
                        <Typography className="flex justify-items-center gap-1.5 font-semibold text-lg">
                            <span>
                                <CircleAlert/>
                            </span>
                            Informasi
                        </Typography>
                        <ul className="list-disc list-inside px-2 font-medium text-sm">
                            <li>Data dengan tanda (<span className="text-red-600">*</span>) tidak dapat anda perbarui</li>
                            <li>Untuk mengubah data dengan tanda (<span className="text-red-600">*</span>) anda dapat menghubungi Admin TU Unit anda atau langsung ke Bag.Personalia</li>
                        </ul>
                    </header>
                    <Card className="w-full px-6 pt-5 !shadow-none">
                        <Tooltip content="Kembali">
                            <IconButton variant="text" onClick={ () => router.visit('/') }>
                                <MoveLeft/>
                            </IconButton>
                        </Tooltip>
                        <div className="mx-auto relative">
                            <div
                                className="rounded-full flex items-center justify-center w-44 h-44 overflow-hidden border-4 border-pph-black/70">
                                <img
                                    src={ pegawai.foto ? `/storage/${ pegawai.foto }` : pegawai.jenis_kelamin === 'Laki-Laki' ? MenAvatar : WomenAvatar }
                                    alt={ pegawai.foto ? `${ pegawai.nama }-profil` : 'no-pict' }
                                    width={ pegawai.foto ? 200 : 200 }
                                    className="object-cover object-center mx-auto"
                                    onLoad={ () => setOnLoadImage(false) }
                                />
                                <div className={ `${ onLoadImage ? 'absolute' : 'hidden' } absolute inset-0 flex items-center justify-center bg-gray-300/85 rounded-full` }>
                                    <span className="animate-spin border-4 border-l-transparent border-gray-700/80 rounded-full w-10 h-10 inline-block align-middle m-auto"></span>
                                </div>
                            </div>
                            <div className="absolute w-7 h-7 top-0 -right-8">
                                <div className="relative">
                                    <label htmlFor="file-input" className="w-full h-full cursor-pointer">
                                        <Pencil width={ 25 }/>
                                    </label>
                                    <input
                                        id="file-input"
                                        type="file"
                                        accept="image/*"
                                        className="absolute hidden inset-0 w-7 h-7 opacity-0 !cursor-pointer z-30 text-sm text-stone-500 file:mr-5 file:py-1 file:px-3 file:border-[1px] file:text-xs file:font-medium file:bg-stone-50 file:text-stone-700 hover:file:cursor-pointer hover:file:bg-blue-50 hover:file:text-blue-700"
                                        onChange={ handleImageChange }
                                    />
                                </div>
                            </div>
                        </div>
                        <Typography className="mt-5 flex flex-col text-sm text-center font-medium">
                            Promosi terakhir
                            : { pegawai.tanggal_promosi ? format(pegawai.tanggal_promosi, 'PPP', { locale: id }) : '-' }
                            <span className="italic">
                                &nbsp;( { pegawai.tanggal_promosi ? `${ calculateDatePast(new Date(pegawai.tanggal_promosi), new Date()) } hari lalu` : 'belum ada keterangan' } )
                            </span>
                        </Typography>
                        <form onSubmit={ handleFormSubmit }
                              className="grid grid-cols-1 lg:grid-cols-2 gap-x-6 gap-y-4 p-5">
                            <div className="col-span-1 lg:col-span-2">
                                <Typography variant="h4" className="flex items-center gap-2">
                                    <CircleUser/>
                                    Data Diri
                                </Typography>
                            </div>
                            <Input
                                type="text"
                                color="teal"
                                label="Nomor Induk Kewarganegaraan ( NIK )"
                                name="nik"
                                value={ pegawai.nik }
                                required
                                readOnly
                            />
                            <Input
                                type="text"
                                color="teal"
                                label="Nomor Induk Pegawai ( NIP )"
                                name="nip"
                                value={ pegawai.nip }
                                required
                                readOnly
                            />
                            <Input
                                type="text"
                                color="teal"
                                label="Nama lengkap"
                                name="nama"
                                value={ pegawaiState.nama }
                                readOnly
                                required
                            />
                            <Input
                                type="text" color="teal"
                                label="Suku bangsa"
                                name="suku"
                                value={ pegawaiState.suku }
                                onChange={ handleInputChange }
                            />
                            <Input
                                type="text"
                                color="teal"
                                label="Tempat Lahir"
                                name="tempat_lahir"
                                value={ pegawaiState.tempat_lahir }
                                onChange={ handleInputChange }
                            />
                            <Popover placement="bottom">
                                <PopoverHandler>
                                    <Input
                                        color="teal"
                                        label="Tanggal Lahir"
                                        value={ pegawaiState.tanggal_lahir ? format(pegawaiState.tanggal_lahir, "PPP", { locale: id }) : "" }
                                        readOnly
                                    />
                                </PopoverHandler>
                                <PopoverContent className="z-30">
                                    <DayPicker
                                        mode="single"
                                        selected={ pegawaiState.tanggal_lahir }
                                        onSelect={ (value: Date | undefined) => handleDateChange(value, 'tanggal_lahir') }
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
                                    value={ pegawaiState.usia_tahun }
                                    icon={ <p className="-ml-4 text-xs font-semibold">Tahun</p> }
                                    containerProps={ { className: 'min-w-12 w-[10px]' } }
                                />
                                <Input
                                    type="text"
                                    color="teal"
                                    label="Usia (Bulan)"
                                    name="usia_bulan"
                                    disabled
                                    value={ pegawaiState.usia_bulan }
                                    icon={ <p className="-ml-4 text-xs font-semibold">Bulan</p> }
                                    containerProps={ { className: 'min-w-12 w-[10px]' } }
                                />
                            </div>
                            <Select
                                label="Jenis kelamin"
                                color="teal"
                                name="jenis_kelamin"
                                value={ pegawaiState.jenis_kelamin }
                                aria-required={ true }
                                onChange={ (value: string | undefined) => handleSelectChange('jenis_kelamin', value ?? '') }
                            >
                                {
                                    jenisKelamin.map((jenis, index) => ((
                                        <Option key={ index } value={ jenis }>
                                            { jenis }
                                        </Option>
                                    )))
                                }
                            </Select>
                            <Input
                                type="text" color="teal"
                                label="Alamat"
                                name="alamat"
                                value={ pegawaiState.alamat }
                                onChange={ handleInputChange }
                            />
                            <Input
                                type="text"
                                color="teal"
                                label="Agama"
                                name="agama"
                                value={ pegawaiState.agama }
                                onChange={ handleInputChange }
                            />
                            <Select
                                label="Status pernikahan"
                                color="teal"
                                name="status_pernikahan"
                                value={ pegawaiState.status_pernikahan }
                                onChange={ (value: string | undefined) => handleSelectChange('status_pernikahan', value ?? '') }
                            >
                                {
                                    statusPernikahan.map((status, index) => ((
                                        <Option key={ index } value={ status }>
                                            { status }
                                        </Option>
                                    )))
                                }
                            </Select>
                            <Input
                                color="teal"
                                label="Tanggal Masuk"
                                value={ pegawaiState.tanggal_masuk ? format(pegawaiState.tanggal_masuk, "PPP", { locale: id }) : "" }
                                readOnly
                                required
                            />
                            <Input
                                type="text"
                                color="teal"
                                label="Unit"
                                name="unit"
                                value={ pegawai.unit.nama }
                                readOnly
                                required
                            />
                            <Input
                                type="text"
                                color="teal"
                                label="Amanah"
                                name="amanah"
                                value={ pegawai.amanah }
                                readOnly
                                required
                            />
                            <Input
                                type="text" color="teal"
                                label="Amanah atasan langsung"
                                name="amanah_atasan"
                                value={ pegawai.amanah_atasan }
                                readOnly
                                required
                            />
                            <Input
                                type="text"
                                color="teal"
                                label="Nomor HP/WA"
                                name="no_hp"
                                value={ pegawaiState.no_hp }
                                onChange={ handleInputChange }
                            />
                            <Input
                                type="text"
                                color="teal"
                                label="Kompetensi Qur'an"
                                name="kompetensi_quran"
                                value={ pegawaiState.kompetensi_quran }
                                readOnly
                                required
                            />
                            <Input
                                type="text"
                                color="teal"
                                label="Status Aktif"
                                name="status_aktif"
                                value={ pegawai.status_aktif }
                                readOnly
                                required
                            />
                            <div className="flex flex-row gap-1">
                                <Checkbox
                                    name="bpjs_kesehatan"
                                    label={<p>BPJS Kesehatan<span className="text-red-600">*</span></p>}
                                    labelProps={{
                                        className: 'font-semibold text-black'
                                    }}
                                    checked={ pegawaiState.bpjs_kesehatan }
                                    readOnly
                                    disabled
                                />
                                <Checkbox
                                    name="bpjs_ketenagakerjaan"
                                    label={<p>BPJS Ketenagakerjaan<span className="text-red-600">*</span></p>}
                                    labelProps={{
                                        className: 'font-semibold text-black'
                                    }}
                                    checked={ pegawaiState.bpjs_ketenagakerjaan }
                                    readOnly
                                    disabled
                                />
                            </div>

                            <div className="col-span-1 lg:col-span-2">
                                <Typography variant="h4" className="flex items-center gap-2">
                                    <Award/>
                                    Data Kepegawaian
                                </Typography>
                            </div>
                            <div className="col-span-full grid grid-cols-1 lg:grid-cols-2 gap-x-6 gap-y-4">
                                <Input
                                    type="text" color="teal"
                                    label="Marhalah"
                                    name="marhalah"
                                    value={ pegawai.marhalah.nama }
                                    readOnly
                                    required
                                />
                                <Input
                                    color="teal"
                                    label="Tanggal Marhalah"
                                    value={ pegawaiState.tanggal_marhalah ? `${ format(pegawaiState.tanggal_marhalah, "PPP", { locale: id }) } ( ${ calculateDatePast(new Date(pegawaiState.tanggal_marhalah), new Date(currDate)) } lalu )` : "Belum diatur" }
                                    readOnly
                                    required
                                    className="italic !font-semibold"
                                />
                            </div>

                            <div className="col-span-full grid grid-cols-1 lg:grid-cols-2 gap-x-6 gap-y-4">
                                <Input
                                    type="text"
                                    color="teal"
                                    label="Golongan"
                                    name="golongan"
                                    value={ pegawai.golongan.nama }
                                    readOnly
                                    required
                                />
                                <Input
                                    type="text"
                                    color="teal"
                                    label="Marhalah"
                                    name="marhalah"
                                    value={ pegawai.marhalah.nama }
                                    readOnly
                                    required
                                />
                                <Input
                                    type="text"
                                    color="teal"
                                    label="Status Pegawai"
                                    name="status_pegawai"
                                    value={ pegawai.status_pegawai.nama }
                                    readOnly
                                    required
                                />
                                <Input
                                    type="text"
                                    color="teal"
                                    label="Unit"
                                    name="unit"
                                    value={ pegawai.unit.nama }
                                    readOnly
                                    required
                                />
                            </div>
                            <Input
                                color="teal"
                                label="Tanggal Promosi"
                                value={ pegawaiState.tanggal_promosi ? `${ format(pegawaiState.tanggal_promosi, "PPP", { locale: id }) } ( ${ calculateDatePast(new Date(pegawaiState.tanggal_promosi), new Date(currDate)) } lalu )` : "Belum diatur" }
                                readOnly
                                required
                                className="italic !font-semibold"
                            />

                            <div id="data-keluarga"
                                 className="mt-6 col-span-1 lg:col-span-2">
                                <Typography variant="h4" className="flex items-center gap-2">
                                    <Users/>
                                    Data Keluarga
                                </Typography>
                            </div>
                            <PegawaiFormDataKeluarga
                                formState={ dataKeluarga }
                                setFormState={ setDataKeluarga }
                                formDefault={ formDataKeluargaDefault }
                            />

                            <div id="data-pendidikan" className="mt-6 col-span-1 lg:col-span-2">
                                <Typography variant="h4" className="flex items-center gap-2">
                                    <GraduationCap/>
                                    Data Pendidikan Formal
                                </Typography>
                            </div>
                            <PegawaiFormDataPendidikanFormal
                                formState={ dataPendidikanFormal }
                                setFormState={ setDataPendidikanFormal }
                                formDefault={ formDataPendidikanFormalDefault }
                            />

                            <div className="mt-6 col-span-1 lg:col-span-2">
                                <Typography variant="h4" className="flex items-center gap-2">
                                    <Medal/>
                                    Data Pendidikan non Formal
                                </Typography>
                            </div>
                            <PegawaiFormDataPendidikanNonFormal
                                formState={ dataPendidikanNonFormal }
                                setFormState={ setDataPendidikanNonFormal }
                                formDefault={ formDataPendidikanNonFormalDefault }
                            />

                            <div id="data-pengalaman" className="mt-6 col-span-1 lg:col-span-2">
                                <Typography variant="h4" className="flex items-center gap-2">
                                    Pengalaman Organisasi
                                </Typography>
                            </div>
                            <PegawaiFormDataOrganisasi
                                formState={ dataOrganisasi }
                                setFormState={ setDataOrganisasi }
                                formDefault={ formDataOrganisasiDefault }
                            />

                            <div className="mt-6 col-span-1 lg:col-span-2">
                                <Typography variant="h4" className="flex items-center gap-2">
                                    Pengalaman bekerja di PPH
                                </Typography>
                            </div>
                            <PegawaiFormDataPengalamanPPH
                                formState={ dataPengalamanPPH }
                                setFormState={ setDataPengalamanPPH }
                                formDefault={ formDataPengalamanPPHDefault }
                            />

                            <div className="mt-6 col-span-1 lg:col-span-2">
                                <Typography variant="h4" className="flex items-center gap-2">
                                    Pengalaman bekerja di luar PPH
                                </Typography>
                            </div>
                            <PegawaiFormDataPengalamanNonPPH
                                formState={ dataPengalamanNonPPH }
                                setFormState={ setDataPengalamanNonPPH }
                                formDefault={ formDataPengalamanNonPPHDefault }
                            />

                            <Button
                                type="submit"
                                loading={ onSubmit }
                                className="col-span-1 lg:col-span-2 w-52 min-h-14 ml-auto flex items-center justify-center gap-3"
                            >
                                {
                                    onSubmit
                                        ? 'Menyimpan..'
                                        : (
                                            <>
                                                <Save/>
                                                Simpan
                                            </>
                                        )
                                }
                            </Button>
                        </form>
                    </Card>
                </main>
            </PegawaiLayout>
        </>
    );
}
