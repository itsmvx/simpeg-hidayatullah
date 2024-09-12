import { Head, router } from "@inertiajs/react";
import {
    Card,
    Collapse,
    IconButton, List, ListItem,
    Typography, Button, Popover, PopoverHandler, PopoverContent, Select, Option, Tooltip
} from "@material-tailwind/react";
import {
    CircleUser,
    GraduationCap, Medal,
    Menu as MenuIcon, MoveLeft, Save,
    Star, TriangleAlert,
    Users,
    X
} from "lucide-react";
import { ChangeEvent, FormEvent, useEffect, useRef, useState } from "react";
import "react-day-picker/dist/style.css";
import { MasterLayout } from "@/Layouts/MasterLayout";
import PegawaiFormDataKeluarga from "@/Components/FormDataKeluarga";
import PegawaiFormDataPendidikanFormal from "@/Components/FormDataPendidikanFormal";
import PegawaiFormDataPendidikanNonFormal from "@/Components/FormDataPendidikanNonFormal";
import PegawaiFormDataOrganisasi from "@/Components/FormDataPengalamanOrganisasi";
import PegawaiFormDataPengalamanPPH from "@/Components/FormDataPengalamanKerjaPPH";
import PegawaiFormDataPengalamanNonPPH from "@/Components/FormDataPengalamanKerjaNonPPH";
import {
    FormPegawai,
    FormPegawaiDataKeluarga, FormPegawaiDataOrganisasi, FormPegawaiDataPendidikanFormal,
    FormPegawaiDataPendidikanNonFormal, FormPegawaiDataPengalamanNonPPH, FormPegawaiDataPengalamanPPH,
    IDNamaColumn,
    PageProps
} from "@/types";
import { z } from "zod";
import { calculateAge, notifyToast } from "@/Lib/Utils";
import axios, { AxiosError } from "axios";
import {
    formDataKeluargaDefault,
    formDataOrganisasiDefault,
    formDataPendidikanFormalDefault,
    formDataPendidikanNonFormalDefault,
    formDataPengalamanNonPPHDefault,
    formDataPengalamanPPHDefault, jenisKelamin, statusAktif, statusPernikahan
} from "@/Lib/StaticData";
import { Input } from "@/Components/Input";
import { format } from "date-fns";
import { id } from "date-fns/locale";
import { DayPicker } from "react-day-picker";
import { Checkbox } from "@/Components/Checkbox";

export default function MASTER_PegawaiCreatePage({ auth, golongans, marhalahs, statusPegawais, units }: PageProps<{
    golongans: IDNamaColumn[];
    marhalahs: IDNamaColumn[];
    statusPegawais: IDNamaColumn[];
    units: IDNamaColumn[];
}>) {

    const formDataDiriRef = useRef<HTMLDivElement | null>(null);
    const formDataKeluargaRef = useRef<HTMLDivElement | null>(null);
    const formDataPendidikanRef = useRef<HTMLDivElement | null>(null);
    const formDataPengalaman = useRef<HTMLDivElement | null>(null);

    const scrollIntoView = (topOffset: number) => {
        window.scrollTo({
            top: topOffset,
            behavior: 'smooth'
        })
    };
    const NavLists = () => {
        return (
            <>
                <List className="mt-2 mb-4 flex flex-col gap-2 lg:mb-0 lg:mt-0 lg:flex-row lg:items-center lg:gap-2.5 *:font-medium *:text-sm *:flex *:gap-1 *:w-auto">
                    <ListItem className="!p-0">
                        <a href="" onClick={(e) => {
                            e.preventDefault();
                            if (formDataDiriRef.current) {
                                const offset = window.innerWidth >= 960 ? 140 : 100;
                                const elementPosition = formDataDiriRef.current.getBoundingClientRect().top + window.scrollY;
                                const offsetPosition = elementPosition - offset;
                                scrollIntoView(offsetPosition);
                            }
                        }} className="p-3 w-full flex items-center justify-center gap-1">
                            <CircleUser />
                            Data diri
                        </a>
                    </ListItem>
                    <ListItem className="!p-0">
                        <a href="" onClick={(e) => {
                            e.preventDefault();
                            if (formDataKeluargaRef.current) {
                                const offset = window.innerWidth >= 960 ? 140 : 120;
                                const elementPosition = formDataKeluargaRef.current.getBoundingClientRect().top + window.scrollY;
                                const offsetPosition = elementPosition - offset;
                                scrollIntoView(offsetPosition);
                            }
                        }} className="p-3 w-full flex items-center justify-center gap-1">
                            <Users/>
                            Data keluarga
                        </a>
                    </ListItem>
                    <ListItem className="!p-0">
                        <a href="" onClick={(e) => {
                            e.preventDefault();
                            if (formDataPendidikanRef.current) {
                                const offset = window.innerWidth >= 960 ? 140 : 100;
                                const elementPosition = formDataPendidikanRef.current.getBoundingClientRect().top + window.scrollY;
                                const offsetPosition = elementPosition - offset;
                                scrollIntoView(offsetPosition);
                            }
                        }} className="p-3 w-full flex items-center justify-center gap-1">
                            <GraduationCap />
                            Pendidikan
                        </a>
                    </ListItem>
                    <ListItem className="!p-0">
                        <a href="" onClick={(e) => {
                            e.preventDefault();
                            if (formDataPengalaman.current) {
                                const offset = window.innerWidth >= 960 ? 140 : 100;
                                const elementPosition = formDataPengalaman.current.getBoundingClientRect().top + window.scrollY;
                                const offsetPosition = elementPosition - offset;
                                scrollIntoView(offsetPosition);
                            }
                        }} className="p-3 w-full flex items-center justify-center gap-1">
                            <Star />
                            Pengalaman
                        </a>
                    </ListItem>
                </List>
            </>
        );
    };

    const formInputsInit: FormPegawai<{
        onSubmit: boolean;
    }> = {
        nik: '',
        nip: '',
        nama: '',
        jenis_kelamin: '',
        tempat_lahir: '',
        usia_tahun: 0,
        usia_bulan: 0,
        suku: '',
        alamat: '',
        agama: 'Islam',
        status_pernikahan: '',
        golongan_id: '',
        marhalah_id: '',
        status_pegawai_id: '',
        unit_id: '',
        status_aktif: 'Aktif',
        amanah: '',
        amanah_atasan: '',
        kompetensi_quran: '',
        sertifikasi: '',
        no_hp: '',
        bpjs_kesehatan: false,
        bpjs_ketenagakerjaan: false,
        data_keluarga: JSON.stringify(formDataKeluargaDefault),
        data_pendidikan_formal: JSON.stringify(formDataPendidikanFormalDefault),
        data_pendidikan_non_formal: JSON.stringify(formDataPendidikanNonFormalDefault),
        data_pengalaman_organisasi: JSON.stringify(formDataOrganisasiDefault),
        data_pengalaman_kerja_pph: JSON.stringify(formDataPengalamanPPHDefault),
        data_pengalaman_kerja_non_pph: JSON.stringify(formDataPengalamanNonPPHDefault),
        onSubmit: false
    };

    const [ openNav, setOpenNav] = useState(false);
    const [ formInputs, setFormInputs ] = useState<FormPegawai<{
        onSubmit: boolean;
    }>>(formInputsInit);

    const [ dataKeluarga, setDataKeluarga ] = useState<FormPegawaiDataKeluarga[]>([ formDataKeluargaDefault ]);
    const [ dataPendidikanFormal, setDataPendidikanFormal ] = useState<FormPegawaiDataPendidikanFormal[]>([ formDataPendidikanFormalDefault ]);
    const [ dataPendidikanNonFormal, setDataPendidikanNonFormal ] = useState<FormPegawaiDataPendidikanNonFormal[]>([ formDataPendidikanNonFormalDefault ]);
    const [ dataOrganisasi, setDataOrganisasi ] = useState<FormPegawaiDataOrganisasi[]>([ formDataOrganisasiDefault ]);
    const [ dataPengalamanPPH, setDataPengalamanPPH ] = useState<FormPegawaiDataPengalamanPPH[]>([ formDataPengalamanPPHDefault ]);
    const [ dataPengalamanNonPPH, setDataPengalamanNonPPH ] = useState<FormPegawaiDataPengalamanNonPPH[]>([ formDataPengalamanNonPPHDefault ]);

    const handleInputChange = (event: ChangeEvent<HTMLInputElement>) => {
        const { name, value } = event.target;
        setFormInputs((prevState) => ({
            ...prevState,
            [name]: value,
        }));
    };
    const handleCheckboxChange = (event: ChangeEvent<HTMLInputElement>) => {
        const { name, checked } = event.target;
        setFormInputs((prevState) => ({
            ...prevState,
            [name]: checked,
        }));
    }
    const handleSelectChange = (key: keyof FormPegawai, value: string) => {
        setFormInputs((prevState) => ({
            ...prevState,
            [key]: value,
        }));
    };
    const handleDateChange = (date: Date | undefined, key: keyof FormPegawai) => {
        setFormInputs((prevState) => ({
            ...prevState,
            [key]: date,
        }));
    };
    const formDisabled = (): boolean => {
        if(formInputs.onSubmit) return true;
        const unRequiredField = ['usia_tahun','usia_bulan','bpjs_kesehatan','bpjs_ketenagakerjaan','sertifikasi','onSubmit'];
        return Object.keys(formInputs).some((key) => {
            if (unRequiredField.includes(key)) return false;

            return !formInputs[key];
        });
    };
    const handleFormSubmit = (event: FormEvent<HTMLFormElement>) => {
        event.preventDefault();
        setFormInputs((prevState) => ({
            ...prevState,
            onSubmit: true
        }));
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
        const pegawaiPayload = {
            ...formInputs
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
                setFormInputs(() => ({
                    ...formInputsInit
                }));
            })
            .catch((err: unknown) => {
                const errMsg = err instanceof AxiosError
                    ? err?.response?.data.message ?? 'Error tidak diketahui terjadi'
                    : 'Error tidak diketahui terjadi'
                notifyToast('error', errMsg);
                setFormInputs((prevState) => ({
                    ...prevState,
                    onSubmit: false
                }));
            });
    };

    useEffect(() => {
        if (formInputs.tanggal_lahir) {
            const { years, months } = calculateAge(formInputs.tanggal_lahir);
            setFormInputs((prevState) => ({
                ...prevState,
                usia_tahun: years,
                usia_bulan: months,
            }));
        }
    }, [ formInputs.tanggal_lahir ]);

    useEffect(() => {
        setFormInputs((prevState) => ({
            ...prevState,
            data_keluarga: JSON.stringify(dataKeluarga)
        }))
    }, [ dataKeluarga ]);
    useEffect(() => {
        setFormInputs((prevState) => ({
            ...prevState,
            data_pendidikan_formal: JSON.stringify(dataPendidikanFormal)
        }));
    }, [ dataPendidikanFormal ]);
    useEffect(() => {
        setFormInputs((prevState) => ({
            ...prevState,
            data_pendidikan_non_formal: JSON.stringify(dataPendidikanNonFormal)
        }));
    }, [ dataPendidikanNonFormal ]);
    useEffect(() => {
        setFormInputs((prevState) => ({
            ...prevState,
            data_pengalaman_organisasi: JSON.stringify(dataOrganisasi)
        }));
    }, [ dataOrganisasi ]);
    useEffect(() => {
        setFormInputs((prevState) => ({
            ...prevState,
            data_pengalaman_kerja_pph: JSON.stringify(dataPengalamanPPH)
        }));
    }, [ dataPengalamanPPH ]);
    useEffect(() => {
        setFormInputs((prevState) => ({
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

    return (
        <>
            <Head title={ `Master - Menambahkan Pegawai` }/>
            <MasterLayout auth={ auth }>
                <main className="w-full min-h-screen bg-gray-50 space-y-4">
                    <header
                        className="my-5 px-6 sticky top-16 z-10 py-2 bg-white rounded-md rounded-b-none border ">
                        <div className="flex items-center justify-between text-blue-gray-900">
                            <Typography
                                className="cursor-pointer py-1.5 font-medium w-40"
                            >
                                Form Pegawai PPH Surabaya
                            </Typography>
                            <div className="flex-1 flex items-center justify-end gap-4">
                                <IconButton
                                    variant="text"
                                    className="ml-auto h-6 w-6 text-inherit hover:bg-transparent focus:bg-transparent active:bg-transparent lg:hidden"
                                    ripple={ false }
                                    onClick={ () => setOpenNav(!openNav) }
                                >
                                    { openNav ? (<X/>) : (<MenuIcon/>) }
                                </IconButton>
                                <div className="mr-4 hidden lg:block">
                                    <NavLists/>
                                </div>
                            </div>
                        </div>
                        <Collapse open={ openNav }>
                            <NavLists/>
                        </Collapse>
                    </header>
                    <Card className="w-full px-1.5 lg:px-6 !shadow-none">
                        <Tooltip content="Kembali">
                            <IconButton variant="text" onClick={() => router.visit(route('master.pegawai.index'))} className="mt-2">
                                <MoveLeft />
                            </IconButton>
                        </Tooltip>
                        <form onSubmit={ handleFormSubmit } className="grid grid-cols-1 lg:grid-cols-2 gap-x-6 gap-y-4 p-5">
                            <div ref={ formDataDiriRef } className="col-span-1 lg:col-span-2">
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
                                value={ formInputs.nik }
                                onChange={ handleInputChange }
                                required
                            />
                            <Input
                                type="text"
                                color="teal"
                                label="Nomor Induk Pegawai ( NIP )"
                                name="nip"
                                value={ formInputs.nip }
                                onChange={ handleInputChange }
                                required
                            />
                            <Input
                                type="text"
                                color="teal"
                                label="Nama lengkap"
                                name="nama"
                                value={ formInputs.nama }
                                onChange={ handleInputChange }
                                required
                            />
                            <Input
                                type="text" color="teal"
                                label="Suku bangsa"
                                name="suku"
                                value={ formInputs.suku }
                                onChange={ handleInputChange }
                                required
                            />
                            <Input
                                type="text"
                                color="teal"
                                label="Tempat Lahir"
                                name="tempat_lahir"
                                value={ formInputs.tempat_lahir }
                                onChange={ handleInputChange }
                                required
                            />
                            <Popover placement="bottom">
                                <PopoverHandler>
                                    <Input
                                        color="teal"
                                        label="Tanggal Lahir"
                                        value={ formInputs.tanggal_lahir ? format(formInputs.tanggal_lahir, "PPP", { locale: id }) : "" }
                                        readOnly
                                        required
                                    />
                                </PopoverHandler>
                                <PopoverContent className="z-30">
                                    <DayPicker
                                        mode="single"
                                        selected={ formInputs.tanggal_lahir }
                                        onSelect={(value: Date | undefined) => handleDateChange(value, 'tanggal_lahir') }
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
                                    value={ formInputs.usia_tahun }
                                    icon={ <p className="-ml-4 text-xs font-semibold">Tahun</p> }
                                    containerProps={ { className: 'min-w-20 w-[10px]' } }
                                />
                                <Input
                                    type="text"
                                    color="teal"
                                    label="Usia (Bulan)"
                                    name="usia_bulan"
                                    disabled
                                    value={ formInputs.usia_bulan }
                                    icon={ <p className="-ml-4 text-xs font-semibold">Bulan</p> }
                                    containerProps={ { className: 'min-w-20 w-[10px]' } }
                                />
                            </div>
                            <Select
                                label="Jenis kelamin"
                                color="teal"
                                name="jenis_kelamin"
                                value={ formInputs.jenis_kelamin }
                                aria-required={true}
                                onChange={ (value: string | undefined) => handleSelectChange('jenis_kelamin', value ?? '') }
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
                                value={ formInputs.alamat }
                                onChange={ handleInputChange }
                                required
                            />
                            <Input
                                type="text"
                                color="teal"
                                label="Agama"
                                name="agama"
                                value={ formInputs.agama }
                                onChange={ handleInputChange }
                                required
                            />
                            <Select
                                label="Status pernikahan"
                                color="teal"
                                name="status_pernikahan"
                                value={ formInputs.status_pernikahan }
                                onChange={ (value: string | undefined) => handleSelectChange('status_pernikahan', value ?? '') }
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
                                value={ formInputs.golongan_id ?? undefined }
                                onChange={ (value: string | undefined) => handleSelectChange('golongan_id', value ?? '') }
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
                                value={ formInputs.marhalah_id ?? undefined }
                                onChange={ (value: string | undefined) => handleSelectChange('marhalah_id', value ?? '') }
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
                                value={ formInputs.status_pegawai_id ?? undefined }
                                onChange={ (value: string | undefined) => handleSelectChange('status_pegawai_id', value ?? '') }
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
                                value={ formInputs.unit_id ?? undefined }
                                onChange={ (value: string | undefined) => handleSelectChange('unit_id', value ?? '') }
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
                                        value={ formInputs.tanggal_masuk ? format(formInputs.tanggal_masuk, "y", { locale: id }) : "" }
                                        readOnly
                                        required
                                    />
                                </PopoverHandler>
                                <PopoverContent>
                                    <DayPicker
                                        mode="single"
                                        selected={ formInputs.tanggal_masuk }
                                        onSelect={ (value: Date | undefined) => handleDateChange(value, 'tanggal_masuk') }
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
                                value={ formInputs.status_aktif }
                                onChange={ (value: string | undefined) => handleSelectChange('status_aktif', value ?? '') }
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
                                value={ formInputs.kompetensi_quran }
                                onChange={ handleInputChange }
                                required
                            />
                            <Input
                                type="text" color="teal"
                                label="Amanah"
                                name="amanah"
                                value={ formInputs.amanah }
                                onChange={ handleInputChange }
                                required
                            />
                            <Input
                                type="text" color="teal"
                                label="Amanah atasan langsung"
                                name="amanah_atasan"
                                value={ formInputs.amanah_atasan }
                                onChange={ handleInputChange }
                                required
                            />
                            <Input
                                type="text" color="teal"
                                label="Nomor HP/WA"
                                name="no_hp"
                                value={ formInputs.no_hp }
                                onChange={ handleInputChange }
                                required
                            />
                            <Input
                                type="text" color="teal"
                                label="Sertifikasi (bila ada)"
                                name="sertifikasi"
                                value={ formInputs.sertifikasi }
                                onChange={ handleInputChange }
                            />

                            <div className="flex flex-row gap-1">
                                <Checkbox
                                    name="bpjs_kesehatan"
                                    label="BPJS Kesehatan"
                                    labelProps={{
                                        className: 'font-medium'
                                    }}
                                    checked={ formInputs.bpjs_kesehatan }
                                    onChange={ handleCheckboxChange }
                                />
                                <Checkbox
                                    name="bpjs_ketenagakerjaan"
                                    label="BPJS Ketenagakerjaan"
                                    labelProps={{

                                        className: 'font-medium'
                                    }}
                                    checked={ formInputs.bpjs_ketenagakerjaan }
                                    onChange={ handleCheckboxChange }
                                />
                            </div>

                            <div ref={ formDataKeluargaRef } id="data-keluarga"
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

                            <div ref={ formDataPendidikanRef } id="data-pendidikan"
                                 className="mt-6 col-span-1 lg:col-span-2">
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

                            <div ref={ formDataPengalaman } id="data-pengalaman"
                                 className="mt-6 col-span-1 lg:col-span-2">
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
                                className="col-span-1 lg:col-span-2 w-52 ml-auto flex items-center justify-center gap-3"
                                disabled={formDisabled()}
                                loading={formInputs.onSubmit}
                            >
                                <Save/>
                                Simpan
                            </Button>
                        </form>
                    </Card>
                </main>
            </MasterLayout>
        </>
    );
}
