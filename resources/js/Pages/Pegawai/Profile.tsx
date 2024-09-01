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
import { PegawaiLayout } from "@/Layouts/PegawaiLayout";
import UpdatePasswordForm from "@/Components/Pegawai/UpdatePasswordForm";

export default function Profile({ auth, pegawai, golongans, marhalahs, statusPegawais, units }: PageProps<{
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
                            <Users />
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
    }, [pegawai]);

    const formDataKeluargaInit: FormDataKeluarga[] = useMemo(() => (JSON.parse(pegawai.data_keluarga)), [pegawai]);
    const formDataPendidikanFormalInit: FormDataPendidikanFormal[] = useMemo(() => JSON.parse(pegawai.pendidikan_formal), [pegawai]);
    const formDataPendidikanNonFormalInit: FormDataPendidikanNonFormal[] = useMemo(() => JSON.parse(pegawai.pendidikan_non_formal), [pegawai]);
    const formDataOrganisasiInit: FormDataOrganisasi[] = useMemo(() => JSON.parse(pegawai.pengalaman_organisasi), [pegawai]);
    const formDataPengalamanPPHInit: FormDataPengalamanPPH[] = useMemo(() => JSON.parse(pegawai.pengalaman_kerja_pph), [pegawai]);
    const formDataPengalamanNonPPHInit: FormDataPengalamanNonPPH[] = useMemo(() => JSON.parse(pegawai.pengalaman_kerja_non_pph), [pegawai]);

    const [openNav, setOpenNav] = useState(false);
    const [formDataDiri, setFormDataDiri] = useState<FormDataDiri>(formDataDiriInit);
    const [formDataKeluarga, setFormDataKeluarga] = useState<{
        status: string;
        nama: string;
        jenisKelamin: string;
        tempatLahir: string;
        tanggalLahir: string;
        pekerjaan: string;
        pendidikan: string;
    }[]>(formDataKeluargaInit);
    const [formDataPendidikanFormal, setFormDataPendidikanFormal] = useState<{
        tingkat: string;
        sekolah: string;
        lulus: string;
    }[]>(formDataPendidikanFormalInit);
    const [formDataPendidikanNonFormal, setFormDataPendidikanNonFormal] = useState<{
        jenis: string;
        penyelenggara: string;
        tempat: string;
        tahun: string;
    }[]>(formDataPendidikanNonFormalInit);
    const [formDataOrganisasi, setFormDataOrganisasi] = useState<{
        nama: string;
        jabatan: string;
        masa: string;
        keterangan: string;
    }[]>(formDataOrganisasiInit);
    const [formDataPengalamanPPH, setFormDataPengalamanPPH] = useState<{
        unit: string;
        jabatan: string;
        amanah: string;
        mulai: string;
        akhir: string;
    }[]>(formDataPengalamanPPHInit);
    const [formDataPengalamanNonPPH, setFormPengalamanNonPPH] = useState<{
        instansi: string;
        jabatan: string;
        tahun: string;
        keterangan: string;
    }[]>(formDataPengalamanNonPPHInit);

    const [onChangeDataDiri, setOnChangeDataDiri] = useState(false);
    const [onChangeDataKeluarga, setOnChangeDataKeluarga] = useState(false);
    const [onChangeDataOrganisasi, setOnChangeDataOrganisasi] = useState(false);
    const [onChangeDataPendidikanFormal, setOnChangeDataPendidikanFormal] = useState(false);
    const [onChangeDataPendidikanNonFormal, setOnChangeDataPendidikanNonFormal] = useState(false);
    const [onChangeDataPengalamanPPH, setOnChangeDataPengalamanPPH] = useState(false);
    const [onChangeDataPengalamanNonPPH, setOnChangeDataPengalamanNonPPH] = useState(false);
    const [onChangeDataPromosi, setOnChangeDataPromosi] = useState(false);
    const [onSubmit, setOnSubmit] = useState(false);
    const [onLoadImage, setOnLoadImage] = useState(false);

    const handleImageChange = (e: ChangeEvent<HTMLInputElement>) => {
        if (e.target.files && e.target.files.length > 0) {
            const file = e.target.files[0];
            if (file && file.size > 2 * 1024 * 1024) {
                notifyToast('error', 'Ukuran file maksimal adalah 2MB!');
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
                    router.reload({ only: ['pegawai'] });
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
    }, [formDataDiri]);
    useEffect(() => {
        setOnChangeDataKeluarga(JSON.stringify(formDataKeluarga) !== JSON.stringify(formDataKeluargaInit));
    }, [formDataKeluarga]);
    useEffect(() => {
        setOnChangeDataOrganisasi(JSON.stringify(formDataOrganisasi) !== JSON.stringify(formDataOrganisasiInit));
    }, [formDataOrganisasi]);
    useEffect(() => {
        setOnChangeDataPendidikanFormal(JSON.stringify(formDataPendidikanFormal) !== JSON.stringify(formDataPendidikanFormalInit));
    }, [formDataPendidikanFormal]);
    useEffect(() => {
        setOnChangeDataPendidikanNonFormal(JSON.stringify(formDataPendidikanNonFormal) !== JSON.stringify(formDataPendidikanNonFormalInit));
    }, [formDataPendidikanNonFormal]);
    useEffect(() => {
        setOnChangeDataPengalamanPPH(JSON.stringify(formDataPengalamanPPH) !== JSON.stringify(formDataPengalamanPPHInit));
    }, [formDataPengalamanPPH]);
    useEffect(() => {
        setOnChangeDataPengalamanNonPPH(JSON.stringify(formDataPengalamanNonPPH) !== JSON.stringify(formDataPengalamanNonPPHInit));
    }, [formDataPengalamanNonPPH]);

    return (
        <>
            <Head title="Form Pegawai" />
            <PegawaiLayout auth={auth}>
                <main className="w-full min-h-screen bg-gray-50 space-y-4">
                    <Card className="w-full px-6 pt-5">
                        <Tooltip content="Kembali">
                            <IconButton variant="text" onClick={() => router.visit(route('pegawai.dashboard'))}>
                                <MoveLeft />
                            </IconButton>
                        </Tooltip>
                        <div className="mx-auto relative">
                            <div className="rounded-full flex items-center justify-center w-44 h-44 overflow-hidden border-4 border-pph-black/70">
                                <img
                                    src={pegawai.foto ? `/storage/${pegawai.foto}` : pegawai.jenis_kelamin === 'Laki-Laki' ? MenAvatar : WomenAvatar}
                                    alt={pegawai.foto ? `${pegawai.nama}-profil` : 'no-pict'}
                                    width={pegawai.foto ? 200 : 200}
                                    className="object-cover object-center mx-auto"
                                    onLoad={() => setOnLoadImage(false)}
                                />
                                <div
                                    className={`${onLoadImage ? 'absolute' : 'hidden'} absolute inset-0 flex items-center justify-center bg-gray-300/85 rounded-full`}>
                                    <span className="animate-spin border-4 border-l-transparent border-gray-700/80 rounded-full w-10 h-10 inline-block align-middle m-auto"></span>
                                </div>
                            </div>
                            <div className="absolute w-7 h-7 top-0 -right-8">
                                <div className="relative">
                                    <label htmlFor="file-input" className="w-full h-full cursor-pointer">
                                        <Pencil width={25} />
                                    </label>
                                    <input
                                        id="file-input"
                                        type="file"
                                        accept="image/*"
                                        className="absolute hidden inset-0 w-7 h-7 opacity-0 !cursor-pointer z-30 text-sm text-stone-500 file:mr-5 file:py-1 file:px-3 file:border-[1px] file:text-xs file:font-medium file:bg-stone-50 file:text-stone-700 hover:file:cursor-pointer hover:file:bg-blue-50 hover:file:text-blue-700"
                                        onChange={handleImageChange}
                                    />
                                </div>
                            </div>
                        </div>
                        <Typography className="mt-5 text-sm text-center font-medium">
                            Promosi terakhir : {format(pegawai.tanggal_promosi, 'PPP', { locale: id })}
                            <span className="italic">
                                &nbsp;({pegawai.lama_promosi} hari lalu)
                            </span>
                        </Typography>
                    </Card>
                    <Card className="w-full px-7 pt-5 mt-5 mb-5">
                        <UpdatePasswordForm />
                    </Card>
                </main>
            </PegawaiLayout>
        </>
    );
}
