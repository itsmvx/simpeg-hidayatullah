import { Head } from "@inertiajs/react";
import {
    Card,
    Collapse,
    IconButton, List, ListItem,
    Typography, Button
} from "@material-tailwind/react";
import {
    CircleUser,
    GraduationCap, Medal,
    Menu as MenuIcon, Moon, Save,
    Star, Sun,
    Users,
    X
} from "lucide-react";
import { ChangeEvent, FormEvent, lazy, Suspense, useEffect, useRef, useState } from "react";
import "react-day-picker/dist/style.css";
import { useTheme } from "@/Hooks/useTheme";
import { AdminLayout } from "@/Layouts/AdminLayout";
import PegawaiFormDataDiri from "@/Components/PegawaiFormDataDiri";
import PegawaiFormDataKeluarga from "@/Components/PegawaiFormDataKeluarga";
import PegawaiFormDataPendidikanFormal from "@/Components/PegawaiFormDataPendidikanFormal";
import PegawaiFormDataPendidikanNonFormal from "@/Components/PegawaiFormDataPendidikanNonFormal";
import PegawaiFormDataOrganisasi from "@/Components/PegawaiFormDataOrganisasi";
import PegawaiFormDataPengalamanPPH from "@/Components/PegawaiFormDataPengalamanPPH";
import PegawaiFormDataPengalamanNonPPH from "@/Components/PegawaiFormDataPengalamanNonPPH";
import { PageProps } from "@/types";
import { z } from "zod";
import { notifyToast } from "@/Lib/Utils";
import axios, { AxiosError } from "axios";
const PegawaiFormSuccess = lazy(() => import('./../../Components/PegawaiFormSuccess'));

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
    marhalahId: string;
    golonganId: string;
    statusPegawaiId: string;
    unitId: string;
    amanah: string;
    amanahAtasanLangsung: string;
    nomorHpWa: string;
    tahunMasuk?: Date;
    bpjskesehatan: string;
    bpjsketenagakerjaan: string;
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

export default function MASTER_PegawaiCreatePage({ auth, golongans, marhalahs, statusPegawais, units }: PageProps<{
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

    const formDataKeluargaInit: FormDataKeluarga =  {
        status: '',
        nama: '',
        jenisKelamin: '',
        tempatLahir: '',
        tanggalLahir: '',
        pekerjaan: '',
        pendidikan: ''
    };
    const formDataPendidikanFormalInit: FormDataPendidikanFormal = {
        tingkat: '',
        sekolah: '',
        lulus: ''
    };
    const formDataPendidikanNonFormalInit: FormDataPendidikanNonFormal = {
        jenis: '',
        penyelenggara: '',
        tempat: '',
        tahun: ''
    };
    const formDataOrganisasiInit: FormDataOrganisasi = {
        nama: '',
        jabatan: '',
        masa: '',
        keterangan: ''
    };
    const formDataPengalamanPPHInit: FormDataPengalamanPPH = {
        unit: '',
        jabatan: '',
        amanah: '',
        mulai: '',
        akhir: ''
    };
    const formDataPengalamanNonPPHInit: FormDataPengalamanNonPPH = {
        instansi: '',
        jabatan: '',
        tahun: '',
        keterangan: ''
    };

    const [ onSuccess, setOnSuccess ]  = useState<boolean>(false);
    const [ openNav, setOpenNav] = useState(false);
    const [formDataDiri, setFormDataDiri] = useState<FormDataDiri>({
        nik: '',
        nip: '',
        namaLengkap: '',
        sukuBangsa: '',
        tempatLahir: '',
        usiaTahun: '',
        usiaBulan: '',
        jenisKelamin: '',
        alamat: '',
        agama: '',
        statusPernikahan: '',
        golonganId: '',
        marhalahId: '',
        statusPegawaiId: '',
        unitId: '',
        amanah: '',
        amanahAtasanLangsung: '',
        nomorHpWa: '',
        bpjskesehatan: '',
        bpjsketenagakerjaan: ''
    });
    const [ formDataKeluarga, setFormDataKeluarga ] = useState<{
        status: string;
        nama: string;
        jenisKelamin: string;
        tempatLahir: string;
        tanggalLahir: string;
        pekerjaan: string;
        pendidikan: string;
    }[]>([ formDataKeluargaInit ]);
    const [ formDataPendidikanFormal, setFormDataPendidikanFormal ] = useState<{
        tingkat: string;
        sekolah: string;
        lulus: string;
    }[]>([ formDataPendidikanFormalInit ]);
    const [ formDataPendidikanNonFormal, setFormDataPendidikanNonFormal ] = useState<{
        jenis: string;
        penyelenggara: string;
        tempat: string;
        tahun: string;
    }[]>([ formDataPendidikanNonFormalInit ]);
    const [ formDataOrganisasi, setFormDataOrganisasi ] = useState<{
        nama: string;
        jabatan: string;
        masa: string;
        keterangan: string;
    }[]>([ formDataOrganisasiInit ]);
    const [ formDataPengalamanPPH, setFormDataPengalamanPPH ] = useState<{
        unit: string;
        jabatan: string;
        amanah: string;
        mulai: string;
        akhir: string;
    }[]>([ formDataPengalamanPPHInit ]);
    const [ formDataPengalamanNonPPH, setFormPengalamanNonPPH ] = useState<{
        instansi: string;
        jabatan: string;
        tahun: string;
        keterangan: string;
    }[]>([ formDataPengalamanNonPPHInit ]);

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
        const pegawaiSchema = z.object({
            nip: z.string({ message: "NIP tidak boleh kosong" }),
            nik: z.string({ message: "NIK tidak boleh kosong" }),
            foto: z.string().url({ message: "Foto harus berupa URL yang valid" }).nullable(),
            nama: z.string({ message: "Nama tidak boleh kosong" }),
            jenis_kelamin: z.enum(['Laki-Laki', 'Perempuan'], { message: "Jenis kelamin harus Laki-Laki atau 'Perempuan" }),
            tempat_lahir: z.string({ message: "Tempat lahir tidak boleh kosong" }),
            tanggal_lahir: z.date({ message: "Tanggal lahir tidak valid" }),
            no_hp: z.string({ message: "Nomor HP tidak boleh kosong" }),
            status_pernikahan: z.string({ message: "Status pernikahan tidak boleh kosong" }),
            amanah: z.string({ message: "Amanah tidak boleh kosong" }),
            tanggal_masuk: z.date({ message: "Tanggal masuk harus berupa tanggal yang valid" }),
            bpjs_kesehatan: z.string().nullable(),
            bpjs_ketenagakerjaan: z.string().nullable(),
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
            nip: formDataDiri.nip,
            nik: formDataDiri.nik,
            foto: null,
            nama: formDataDiri.namaLengkap,
            jenis_kelamin: formDataDiri.jenisKelamin,
            tempat_lahir: formDataDiri.tempatLahir,
            tanggal_lahir: formDataDiri.tanggalLahir,
            no_hp: formDataDiri.nomorHpWa,
            status_pernikahan: formDataDiri.statusPernikahan,
            amanah: formDataDiri.amanah,
            tanggal_masuk: formDataDiri.tahunMasuk,
            bpjs_kesehatan: formDataDiri.bpjskesehatan,
            bpjs_ketenagakerjaan: formDataDiri.bpjsketenagakerjaan,
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

        axios.post(route('pegawai.create'), {
            ...pegawaiParse.data
        })
            .then(() => {
                notifyToast('success', 'Pegawai berhasil ditambahkan!');
                setOnSuccess(true);
            })
            .catch((err: unknown) => {
                const errMsg = err instanceof AxiosError
                    ? err?.response?.data.message ?? 'Error tidak diketahui terjadi'
                    : 'Error tidak diketahui terjadi'
                notifyToast('error', errMsg);
            })
    };

    useEffect(() => {
        if (formDataDiri.tanggalLahir) {
            const calculateAge = (birthDate: Date) => {
                const now = new Date();
                let years = now.getFullYear() - birthDate.getFullYear();
                let months = now.getMonth() - birthDate.getMonth();

                if (months < 0) {
                    years--;
                    months += 12;
                }

                return { years, months };
            };

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

    return (
        <>
            <Head title="Form Pegawai"/>
            <AdminLayout>
                {
                    onSuccess ? (
                        <Suspense fallback={<div>Loading</div>}>
                            <div className="flex-1">
                                <PegawaiFormSuccess nama="orang" nip="1111" password="2222" />
                            </div>
                        </Suspense>
                    ) : (
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
                                        <IconButton
                                            variant="text"
                                            size="sm"
                                            onClick={ () => setTheme((prevState) => prevState === 'light' ? 'dark' : 'light') }
                                            className="lg:justify-self-end"
                                        >
                                            {
                                                theme === 'light'
                                                    ? (<Sun/>)
                                                    : (<Moon/>)
                                            }
                                        </IconButton>
                                    </div>
                                </div>
                                <Collapse open={ openNav }>
                                    <NavLists/>
                                </Collapse>
                            </header>
                            <Card className="w-full px-6">
                                <form onSubmit={ handleFormSubmit }
                                      className="grid grid-cols-1 lg:grid-cols-2 gap-x-6 gap-y-4 p-5 dark:bg-gray-900">
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
                                        formInitial={ formDataKeluargaInit }
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
                                        formInitial={ formDataPendidikanFormalInit }
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
                                        formInitial={ formDataPendidikanNonFormalInit }
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
                                        formInitial={ formDataOrganisasiInit }
                                    />

                                    <div className="mt-6 col-span-1 lg:col-span-2">
                                        <Typography variant="h4" className="flex items-center gap-2">
                                            Pengalaman bekerja di PPH
                                        </Typography>
                                    </div>
                                    <PegawaiFormDataPengalamanPPH
                                        formState={ formDataPengalamanPPH }
                                        setFormState={ setFormDataPengalamanPPH }
                                        formInitial={ formDataPengalamanPPHInit }
                                    />

                                    <div className="mt-6 col-span-1 lg:col-span-2">
                                        <Typography variant="h4" className="flex items-center gap-2">
                                            Pengalaman bekerja di luar PPH
                                        </Typography>
                                    </div>
                                    <PegawaiFormDataPengalamanNonPPH
                                        formState={ formDataPengalamanNonPPH }
                                        setFormState={ setFormPengalamanNonPPH }
                                        formInitial={ formDataPengalamanNonPPHInit }
                                    />

                                    <Button
                                        type="submit"
                                        className="col-span-1 lg:col-span-2 w-52 ml-auto flex items-center justify-center gap-3"
                                    >
                                        <Save/>
                                        Simpan
                                    </Button>
                                </form>
                            </Card>
                        </main>
                    )
                }
            </AdminLayout>
        </>
    );
}
