import { Head, router } from "@inertiajs/react";
import {
    Card,
    Collapse,
    IconButton, List, ListItem,
    Typography, Button, Tooltip, Select, Option
} from "@material-tailwind/react";
import {
    CircleAlert,
    CircleUser,
    GraduationCap, Medal,
    Menu as MenuIcon, Moon, MoveLeft, Pencil, RotateCcw, Save,
    Star, Sun, TrendingUp, TriangleAlert,
    Users,
    X
} from "lucide-react";
import { ChangeEvent, FormEvent, lazy, Suspense, useEffect, useMemo, useRef, useState } from "react";
import "react-day-picker/dist/style.css";
import { useTheme } from "@/Hooks/useTheme";
import { MasterLayout } from "@/Layouts/MasterLayout";
import PegawaiFormDataDiri from "@/Components/PegawaiDetailsFormDataDiri";
import PegawaiFormDataKeluarga from "@/Components/PegawaiCreateFormDataKeluarga";
import PegawaiFormDataPendidikanFormal from "@/Components/PegawaiCreateFormDataPendidikanFormal";
import PegawaiFormDataPendidikanNonFormal from "@/Components/PegawaiCreateFormDataPendidikanNonFormal";
import PegawaiFormDataOrganisasi from "@/Components/PegawaiCreateFormDataOrganisasi";
import PegawaiFormDataPengalamanPPH from "@/Components/PegawaiCreateFormDataPengalamanPPH";
import PegawaiFormDataPengalamanNonPPH from "@/Components/PegawaiCreateFormDataPengalamanNonPPH";
import type {
    FormDataDiri, FormDataKeluarga,
    FormDataOrganisasi,
    FormDataPendidikanFormal,
    FormDataPendidikanNonFormal, FormDataPengalamanNonPPH,
    FormDataPengalamanPPH,
    PageProps,
    Pegawai
} from "@/types";
import { z } from "zod";
import { calculateAge, notifyToast } from "@/Lib/Utils";
import axios, { AxiosError, AxiosProgressEvent } from "axios";
import {
    formDataKeluargaDefault, formDataOrganisasiDefault,
    formDataPendidikanFormalDefault,
    formDataPendidikanNonFormalDefault, formDataPengalamanNonPPHDefault, formDataPengalamanPPHDefault
} from "@/Lib/StaticData";
import { toast } from "react-toastify";
import { HarunaPP, MenAvatar, WomenAvatar } from "@/Lib/StaticImages";
import { id } from "date-fns/locale";
import { format } from "date-fns";

export default function MASTER_PegawaiDetailsPage({ auth, pegawai, golongans, marhalahs, statusPegawais, units }: PageProps<{
    pegawai: Pegawai & {
        tanggal_promosi: string;
        lama_promosi: string;
    };
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

    const { theme, setTheme } = useTheme();
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
    const formDataDiriInit: FormDataDiri = useMemo(() => {
        const { years, months } = calculateAge(new Date(pegawai.tanggal_lahir));

        return {
            nik: pegawai.nik,
            nip: pegawai.nik,
            namaLengkap: pegawai.nama,
            sukuBangsa: pegawai.suku,
            tempatLahir: pegawai.tempat_lahir,
            tanggalLahir: new Date(pegawai.tanggal_lahir),
            usiaTahun: years.toString(),
            usiaBulan: months.toString(),
            jenisKelamin: pegawai.jenis_kelamin,
            alamat: pegawai.alamat,
            agama: pegawai.agama,
            statusPernikahan: pegawai.status_pernikahan,
            golonganId: pegawai.golongan_id,
            marhalahId: pegawai.marhalah_id,
            statusPegawaiId: pegawai.status_pegawai_id,
            unitId: pegawai.unit_id,
            tahunMasuk: new Date(pegawai.tanggal_masuk),
            amanah: pegawai.amanah,
            amanahAtasanLangsung: pegawai.amanah_atasan,
            nomorHpWa: pegawai.no_hp,
            bpjskesehatan: pegawai.bpjs_kesehatan,
            bpjsketenagakerjaan: pegawai.bpjs_ketenagakerjaan
        }
    }, [ pegawai ]);

    const formDataKeluargaInit: FormDataKeluarga[] = useMemo(() => (JSON.parse(pegawai.data_keluarga)), [ pegawai ]);
    const formDataPendidikanFormalInit: FormDataPendidikanFormal[] = useMemo(() => JSON.parse(pegawai.pendidikan_formal), [ pegawai ]);
    const formDataPendidikanNonFormalInit: FormDataPendidikanNonFormal[] = useMemo(() => JSON.parse(pegawai.pendidikan_non_formal), [ pegawai ]);
    const formDataOrganisasiInit: FormDataOrganisasi[] = useMemo(() => JSON.parse(pegawai.pengalaman_organisasi), [ pegawai ]);
    const formDataPengalamanPPHInit: FormDataPengalamanPPH[] = useMemo(() => JSON.parse(pegawai.pengalaman_kerja_pph), [ pegawai ]);
    const formDataPengalamanNonPPHInit: FormDataPengalamanNonPPH[] = useMemo(() => JSON.parse(pegawai.pengalaman_kerja_non_pph), [ pegawai ]);

    const [ openNav, setOpenNav] = useState(false);
    const [ formDataDiri, setFormDataDiri ] = useState<FormDataDiri>(formDataDiriInit);
    const [ formDataKeluarga, setFormDataKeluarga ] = useState<{
        status: string;
        nama: string;
        jenisKelamin: string;
        tempatLahir: string;
        tanggalLahir: string;
        pekerjaan: string;
        pendidikan: string;
    }[]>(formDataKeluargaInit);
    const [ formDataPendidikanFormal, setFormDataPendidikanFormal ] = useState<{
        tingkat: string;
        sekolah: string;
        lulus: string;
    }[]>(formDataPendidikanFormalInit);
    const [ formDataPendidikanNonFormal, setFormDataPendidikanNonFormal ] = useState<{
        jenis: string;
        penyelenggara: string;
        tempat: string;
        tahun: string;
    }[]>(formDataPendidikanNonFormalInit);
    const [ formDataOrganisasi, setFormDataOrganisasi ] = useState<{
        nama: string;
        jabatan: string;
        masa: string;
        keterangan: string;
    }[]>(formDataOrganisasiInit);
    const [ formDataPengalamanPPH, setFormDataPengalamanPPH ] = useState<{
        unit: string;
        jabatan: string;
        amanah: string;
        mulai: string;
        akhir: string;
    }[]>(formDataPengalamanPPHInit);
    const [ formDataPengalamanNonPPH, setFormPengalamanNonPPH ] = useState<{
        instansi: string;
        jabatan: string;
        tahun: string;
        keterangan: string;
    }[]>(formDataPengalamanNonPPHInit);

    const [ onChangeDataDiri, setOnChangeDataDiri ] = useState(false);
    const [ onChangeDataKeluarga, setOnChangeDataKeluarga ] = useState(false);
    const [ onChangeDataOrganisasi, setOnChangeDataOrganisasi ] = useState(false);
    const [ onChangeDataPendidikanFormal, setOnChangeDataPendidikanFormal ] = useState(false);
    const [ onChangeDataPendidikanNonFormal, setOnChangeDataPendidikanNonFormal ] = useState(false);
    const [ onChangeDataPengalamanPPH, setOnChangeDataPengalamanPPH ] = useState(false);
    const [ onChangeDataPengalamanNonPPH, setOnChangeDataPengalamanNonPPH ] = useState(false);
    const [ onChangeDataPromosi, setOnChangeDataPromosi ] = useState(false);
    const [ onSubmit, setOnSubmit ] = useState(false);
    const [ onLoadImage, setOnLoadImage ] = useState(false);
    const onChangeForm = (): boolean => onChangeDataDiri
        || onChangeDataKeluarga
        || onChangeDataOrganisasi
        || onChangeDataPendidikanFormal
        || onChangeDataPendidikanNonFormal
        || onChangeDataPengalamanPPH
        || onChangeDataPengalamanNonPPH;


    const handleInputChange = (event: ChangeEvent<HTMLInputElement>) => {
        const { name, value } = event.target;
        setFormDataDiri((prevState) => ({
            ...prevState,
            [name]: value,
        }));
    };
    const handleSelectChange = (key: keyof FormDataDiri, value: string) => {
        setFormDataDiri((prevState) => ({
            ...prevState,
            [key]: value,
        }));
    };
    const handleDateChange = (date: Date | undefined, key: keyof FormDataDiri) => {
        setFormDataDiri((prevState) => ({
            ...prevState,
            [key]: date,
        }));
    };
    const handleFormSubmit = (event: FormEvent<HTMLFormElement>) => {
        event.preventDefault();
        setOnSubmit(true);
        const pegawaiSchema = z.object({
            id: z.string({ message: "Format Pegawai tidak valid!" }),
            nip: z.string({ message: "NIP tidak boleh kosong" }),
            nik: z.string({ message: "NIK tidak boleh kosong" }),
            foto: z.string().url({ message: "Foto harus berupa URL yang valid" }).nullable(),
            nama: z.string({ message: "Nama tidak boleh kosong" }),
            jenis_kelamin: z.enum(['Laki-Laki', 'Perempuan'], { message: "Jenis kelamin harus Laki-Laki atau 'Perempuan" }),
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
            id: pegawai.id,
            nip: formDataDiri.nip,
            nik: formDataDiri.nik,
            foto: null,
            nama: formDataDiri.namaLengkap,
            jenis_kelamin: formDataDiri.jenisKelamin,
            tempat_lahir: formDataDiri.tempatLahir,
            tanggal_lahir: formDataDiri.tanggalLahir,
            no_hp: formDataDiri.nomorHpWa,
            suku: formDataDiri.sukuBangsa,
            alamat: formDataDiri.alamat,
            agama: formDataDiri.agama,
            status_pernikahan: formDataDiri.statusPernikahan,
            amanah: formDataDiri.amanah,
            amanah_atasan: formDataDiri.amanahAtasanLangsung,
            tanggal_masuk: formDataDiri.tahunMasuk,
            bpjs_kesehatan: formDataDiri.bpjskesehatan,
            bpjs_ketenagakerjaan: formDataDiri.bpjsketenagakerjaan,
            data_keluarga: JSON.stringify(formDataKeluarga),
            pendidikan_formal: JSON.stringify(formDataPendidikanFormal),
            pendidikan_non_formal: JSON.stringify(formDataPendidikanNonFormal),
            pengalaman_organisasi: JSON.stringify(formDataOrganisasi),
            pengalaman_kerja_pph: JSON.stringify(formDataPengalamanPPH),
            pengalaman_kerja_non_pph: JSON.stringify(formDataPengalamanNonPPH),
            keahlian: null,
            golongan_id: formDataDiri.golonganId,
            marhalah_id: formDataDiri.marhalahId,
            status_pegawai_id: formDataDiri.statusPegawaiId,
            unit_id: formDataDiri.unitId
        };

        const pegawaiParse = pegawaiSchema.safeParse(pegawaiPayload);

        if (!pegawaiParse.success) {
            notifyToast('error', pegawaiParse.error.issues[0].message ?? 'Error Validasi');
            return;
        }

        axios.post(route('pegawai.update'), {
            ...pegawaiParse.data
        })
            .then(() => {
                notifyToast('success', 'Pegawai berhasil diperbarui!');
                router.reload({ only: [ 'pegawai' ]});
                setOnChangeDataDiri(false);
                setOnChangeDataKeluarga(false);
                setOnChangeDataOrganisasi(false);
                setOnChangeDataPendidikanFormal(false);
                setOnChangeDataPendidikanNonFormal(false);
                setOnChangeDataPengalamanPPH(false);
                setOnChangeDataPengalamanNonPPH(false);
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
    const handleRollbackPromosi = () => {
        setFormDataDiri((prevState) => ({
            ...prevState,
            golonganId: pegawai.golongan_id,
            marhalahId: pegawai.marhalah_id,
            statusPegawaiId: pegawai.status_pegawai_id
        }));
    };


    useEffect(() => {
        if (formDataDiri.tanggalLahir) {
            const { years, months } = calculateAge(formDataDiri.tanggalLahir);
            setFormDataDiri((prevState) => ({
                ...prevState,
                usiaTahun: years.toString(),
                usiaBulan: months.toString(),
            }));
        }
    }, [formDataDiri.tanggalLahir]);

    useEffect(() => {
        const handleResize = () => {
            window.innerWidth >= 960 && setOpenNav(false)
        };
        window.addEventListener("resize", handleResize);

        return () => window.removeEventListener('resize', handleResize);
    }, []);

    useEffect(() => {
        setOnChangeDataDiri(JSON.stringify(formDataDiri) !== JSON.stringify(formDataDiriInit));
        setOnChangeDataPromosi(formDataDiri.golonganId !== pegawai.golongan_id || formDataDiri.marhalahId !== pegawai.marhalah_id || formDataDiri.statusPegawaiId !== pegawai.status_pegawai_id);
    }, [ formDataDiri ]);
    useEffect(() => {
        setOnChangeDataKeluarga(JSON.stringify(formDataKeluarga) !== JSON.stringify(formDataKeluargaInit));
    }, [ formDataKeluarga ]);
    useEffect(() => {
        setOnChangeDataOrganisasi(JSON.stringify(formDataOrganisasi) !== JSON.stringify(formDataOrganisasiInit));
    }, [ formDataOrganisasi ]);
    useEffect(() => {
        setOnChangeDataPendidikanFormal(JSON.stringify(formDataPendidikanFormal) !== JSON.stringify(formDataPendidikanFormalInit));
    }, [ formDataPendidikanFormal ]);
    useEffect(() => {
        setOnChangeDataPendidikanNonFormal(JSON.stringify(formDataPendidikanNonFormal) !== JSON.stringify(formDataPendidikanNonFormalInit));
    }, [ formDataPendidikanNonFormal ]);
    useEffect(() => {
        setOnChangeDataPengalamanPPH(JSON.stringify(formDataPengalamanPPH) !== JSON.stringify(formDataPengalamanPPHInit));
    }, [ formDataPengalamanPPH ]);
    useEffect(() => {
        setOnChangeDataPengalamanNonPPH(JSON.stringify(formDataPengalamanNonPPH) !== JSON.stringify(formDataPengalamanNonPPHInit));
    }, [ formDataPengalamanNonPPH ]);

    return (
        <>
            <Head title="Form Pegawai"/>
            <MasterLayout auth={auth}>
                <main className="w-full min-h-screen bg-gray-50 space-y-4">
                    <header className="my-5 px-6 sticky top-16 z-10 py-2 bg-white rounded-md rounded-b-none border ">
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
                    <Card className="w-full px-6 pt-5">
                        <Tooltip content="Kembali">
                            <IconButton variant="text" onClick={() => router.visit(route('master.pegawai.index'))}>
                                <MoveLeft />
                            </IconButton>
                        </Tooltip>
                        <div className="mx-auto relative">
                            <div className="rounded-full flex items-center justify-center w-44 h-44 overflow-hidden border-4 border-pph-black/70">
                                <img
                                    src={ pegawai.foto ? `/storage/${ pegawai.foto }` : pegawai.jenis_kelamin === 'Laki-Laki'? MenAvatar : WomenAvatar }
                                    alt={ pegawai.foto ? `${ pegawai.nama }-profil` : 'no-pict' }
                                    width={ pegawai.foto ? 200 : 200 }
                                    className="object-cover object-center mx-auto"
                                    onLoad={ () => setOnLoadImage(false) }
                                />
                                <div
                                    className={ `${ onLoadImage ? 'absolute' : 'hidden' } absolute inset-0 flex items-center justify-center bg-gray-300/85 rounded-full` }>
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
                        <Typography className="mt-5 text-sm text-center font-medium">
                            Promosi terakhir : { format(pegawai.tanggal_promosi, 'PPPp', {
                            locale: id
                        }) }
                            <span className="italic">
                                    ({ pegawai.lama_promosi } hari lalu)
                                </span>
                        </Typography>
                        <form onSubmit={ handleFormSubmit } className="grid grid-cols-1 lg:grid-cols-2 gap-x-6 gap-y-4 p-5 dark:bg-gray-900">
                            <div ref={ formDataDiriRef } className="col-span-1 lg:col-span-2">
                                <Typography variant="h4" className="flex items-center gap-2">
                                    <CircleUser/>
                                    Data Diri
                                </Typography>
                            </div>
                            <PegawaiFormDataDiri
                                formState={ formDataDiri }
                                changeInput={ handleInputChange }
                                changeDate={ handleDateChange }
                                changeSelect={ handleSelectChange }
                                handleSubmit={ handleFormSubmit }
                                golongans={ golongans }
                                marhalahs={ marhalahs }
                                statusPegawais={ statusPegawais }
                                units={ units }
                            />

                            <div className="mt-6 col-span-1 lg:col-span-2">
                                <Typography variant="h4" className="flex items-center gap-2">
                                    <TrendingUp/>
                                    Promosi
                                </Typography>
                            </div>

                            <div className="col-span-full grid grid-cols-1 lg:grid-cols-2 gap-x-6 gap-y-4 dark:bg-gray-900">
                                <div className="px-6 py-2 bg-yellow-100 rounded-md border col-span-full">
                                    <Typography className="flex justify-items-center gap-1.5 font-semibold text-lg" color="blue-gray">
                                        <span>
                                            <CircleAlert/>
                                        </span>
                                        Informasi
                                    </Typography>
                                    <ul className="list-disc list-inside px-2 font-medium text-sm text-blue-gray-900">
                                        <li>Mengubah informasi Golongan, Marhalah atau Status Pegawai akan mengatur ulang lama masa promosi pegawai</li>
                                        <li>Anda dapat membatalkan perubahan jika data belum disimpan</li>
                                    </ul>
                                </div>
                                <div className="col-span-full flex flex-row items-center justify-end gap-2">
                                    <p className={ `text-sm font-medium ${onChangeDataPromosi ? 'text-red-600' : 'text-gray-900'}` }>
                                        { onChangeDataPromosi ? 'Anda membuat perubahan!' : 'Tidak ada perubahan' }
                                    </p>
                                    <Tooltip content={onChangeDataPromosi ? 'Batalkan perubahan' : undefined} className="bg-green-600">
                                        <IconButton
                                            variant={onChangeDataPromosi ? 'filled' : 'text'}
                                            color={onChangeDataPromosi ? 'green' : 'black'}
                                            disabled={!onChangeDataPromosi}
                                            onClick={handleRollbackPromosi} className="rounded-full !shadow-none"
                                        >
                                            <RotateCcw />
                                        </IconButton>
                                    </Tooltip>
                                </div>
                                <Select
                                    label="Golongan"
                                    color="teal"
                                    name="golonganId"
                                    value={ formDataDiri.golonganId ?? undefined }
                                    onChange={ (value: string | undefined) => handleSelectChange('golonganId', value ?? '') }
                                >
                                    {
                                        golongans.length > 0
                                            ? golongans.sort((a, b) => a.nama.localeCompare(b.nama)).map(({
                                                                                                              id,
                                                                                                              nama
                                                                                                          }) => ((
                                                <Option key={ id } value={ id }>{ nama }</Option>
                                            )))
                                            : (
                                                <Option disabled value="null">
                                                    <p className="flex items-center gap-2">
                                                        <TriangleAlert className="text-red-600"/>
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
                                    value={ formDataDiri.marhalahId ?? undefined }
                                    onChange={ (value: string | undefined) => handleSelectChange('marhalahId', value ?? '') }
                                >
                                    {
                                        marhalahs.length > 0
                                            ? marhalahs.sort((a, b) => a.nama.localeCompare(b.nama)).map(({
                                                                                                              id,
                                                                                                              nama
                                                                                                          }) => ((
                                                <Option key={ id } value={ id }>{ nama }</Option>
                                            )))
                                            : (
                                                <Option disabled value="null">
                                                    <p className="flex items-center gap-2">
                                                        <TriangleAlert className="text-red-600"/>
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
                                    value={ formDataDiri.statusPegawaiId ?? undefined }
                                    onChange={ (value: string | undefined) => handleSelectChange('statusPegawaiId', value ?? '') }
                                >
                                    {
                                        statusPegawais.length > 0
                                            ? statusPegawais.sort((a, b) => a.nama.localeCompare(b.nama)).map(({
                                                                                                                   id,
                                                                                                                   nama
                                                                                                               }) => ((
                                                <Option key={ id } value={ id }>{ nama }</Option>
                                            )))
                                            : (
                                                <Option disabled value="null">
                                                    <p className="flex items-center gap-2">
                                                        <TriangleAlert className="text-red-600"/>
                                                        <span className="text-gray-900 font-semibold">
                                                            Belum ada Status Pegawai terdaftar
                                                        </span>
                                                    </p>
                                                </Option>
                                            )
                                    }
                                </Select>
                            </div>

                            <div ref={ formDataKeluargaRef } id="data-keluarga"
                                 className="mt-6 col-span-1 lg:col-span-2">
                                <Typography variant="h4" className="flex items-center gap-2">
                                    <Users/>
                                    Data Keluarga
                                </Typography>
                            </div>
                            <PegawaiFormDataKeluarga
                                formState={ formDataKeluarga }
                                setFormState={ setFormDataKeluarga }
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
                                formState={ formDataPendidikanFormal }
                                setFormState={ setFormDataPendidikanFormal }
                                formDefault={ formDataPendidikanFormalDefault }
                            />

                            <div className="mt-6 col-span-1 lg:col-span-2">
                                <Typography variant="h4" className="flex items-center gap-2">
                                    <Medal/>
                                    Data Pendidikan non Formal
                                </Typography>
                            </div>
                            <PegawaiFormDataPendidikanNonFormal
                                formState={ formDataPendidikanNonFormal }
                                setFormState={ setFormDataPendidikanNonFormal }
                                formDefault={ formDataPendidikanNonFormalDefault }
                            />

                            <div ref={ formDataPengalaman } id="data-pengalaman"
                                 className="mt-6 col-span-1 lg:col-span-2">
                                <Typography variant="h4" className="flex items-center gap-2">
                                    Pengalaman Organisasi
                                </Typography>
                            </div>
                            <PegawaiFormDataOrganisasi
                                formState={ formDataOrganisasi }
                                setFormState={ setFormDataOrganisasi }
                                formDefault={ formDataOrganisasiDefault }
                            />

                            <div className="mt-6 col-span-1 lg:col-span-2">
                                <Typography variant="h4" className="flex items-center gap-2">
                                    Pengalaman bekerja di PPH
                                </Typography>
                            </div>
                            <PegawaiFormDataPengalamanPPH
                                formState={ formDataPengalamanPPH }
                                setFormState={ setFormDataPengalamanPPH }
                                formDefault={ formDataPengalamanPPHDefault }
                            />

                            <div className="mt-6 col-span-1 lg:col-span-2">
                                <Typography variant="h4" className="flex items-center gap-2">
                                    Pengalaman bekerja di luar PPH
                                </Typography>
                            </div>
                            <PegawaiFormDataPengalamanNonPPH
                                formState={ formDataPengalamanNonPPH }
                                setFormState={ setFormPengalamanNonPPH }
                                formDefault={ formDataPengalamanNonPPHDefault }
                            />

                            <Button
                                type="submit"
                                disabled={ !onChangeForm() || onSubmit }
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
            </MasterLayout>
        </>
    );
}
