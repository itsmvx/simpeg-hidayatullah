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
import { ChangeEvent, useEffect, useRef, useState } from "react";
import { Input } from "@/Components/Input";
import "react-day-picker/dist/style.css";
import { useTheme } from "@/Hooks/useTheme";
import { AdminLayout } from "@/Layouts/AdminLayout";
import PegawaiFormDataDiri from "@/Components/PegawaiFormDataDiri";
import PegawaiFormDataKeluarga from "@/Components/PegawaiFormDataKeluarga";
import PegawaiFormDataPendidikanFormal from "@/Components/PegawaiFormDataPendidikanFormal";

export type FormDataDiri = {
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
    jabatanSaatIni: string;
    pangkatGolongan: string;
    instansi: string;
    jabatanAtasanLangsung: string;
    nomorHpWa: string;
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

export default function PegawaiCreatePage() {
    const { theme, setTheme } = useTheme();
    const formDataDiriRef = useRef<HTMLDivElement | null>(null);
    const formDataKeluargaRef = useRef<HTMLDivElement | null>(null);
    const formDataPendidikanRef = useRef<HTMLDivElement | null>(null);
    const formDataPengalaman = useRef<HTMLDivElement | null>(null);

    const TABLE_PENDIDIKAN_NONFORMAL_HEAD = [ "Jenis Kursus/Training", "Penyelenggara", "Tempat", "Tahun" ];
    const TABLE_ORGANISASI_HEAD = [ "Nama organisasi", "Jabatan", "Masa bhakti", "Keterangan" ];
    const TABLE_BEKERJA_DI_PPH_HEAD = [ "Jabatan", "Instansi", "Bagian", "Tanggal mulai", "Tanggal berakhir" ];
    const TABLE_BEKERJA_LUAR_PPH_HEAD = [ "Instansi", "Jabatan", "Tahun", "Keterangan" ];

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

    const formDataKeluargaInit =  {
        status: '',
        nama: '',
        jenisKelamin: '',
        tempatLahir: '',
        tanggalLahir: '',
        pekerjaan: '',
        pendidikan: ''
    };
    const formDataPendidikanFormalInit = {
        tingkat: '',
        sekolah: '',
        lulus: ''
    };

    const [ openNav, setOpenNav] = useState(false);
    const [formDataDiri, setFormDataDiri] = useState<FormDataDiri>({
        namaLengkap: '',
        sukuBangsa: '',
        tempatLahir: '',
        usiaTahun: '',
        usiaBulan: '',
        jenisKelamin: '',
        alamat: '',
        agama: '',
        statusPernikahan: '',
        jabatanSaatIni: '',
        pangkatGolongan: '',
        instansi: '',
        jabatanAtasanLangsung: '',
        nomorHpWa: '',
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
    const handleDateChange = (date: Date | undefined) => {
        setFormDataDiri((prevState) => ({
            ...prevState,
            tanggalLahir: date,
        }));
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

    console.log(formDataKeluarga);

    return (
        <>
            <Head title="Form Pegawai"/>
            <AdminLayout>
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
                        <form className="grid grid-cols-1 lg:grid-cols-2 gap-x-6 gap-y-4 p-5 dark:bg-gray-900">
                            <div ref={formDataDiriRef} className="col-span-1 lg:col-span-2">
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
                            <Card className="col-span-1 lg:col-span-2 w-full overflow-auto !rounded-none pb-14">
                                <table className="col-span-2 table-auto text-left border-2">
                                    <thead>
                                    <tr>
                                        { TABLE_PENDIDIKAN_NONFORMAL_HEAD.map((head) => (
                                            <th
                                                key={ head }
                                                className="border-b border-blue-gray-100 bg-blue-gray-50 p-4"
                                            >
                                                <Typography
                                                    variant="small"
                                                    color="blue-gray"
                                                    className="font-normal leading-none opacity-70"
                                                >
                                                    { head }
                                                </Typography>
                                            </th>
                                        )) }
                                    </tr>
                                    </thead>
                                    <tbody>
                                    { Array.from({ length: 4 }).map((_, index) => {
                                        const isLast = index === 4 - 1;
                                        const classes = isLast ? "p-4" : "p-4 border-b border-blue-gray-50";

                                        return (
                                            <tr key={ index }>
                                                { TABLE_PENDIDIKAN_NONFORMAL_HEAD.map((head) => ((
                                                    <td key={ head } className={ classes }>
                                                        <Input
                                                            color="teal"
                                                            type="text"
                                                            label={ head }
                                                        />
                                                    </td>
                                                ))) }
                                            </tr>
                                        );
                                    }) }
                                    </tbody>
                                </table>
                            </Card>

                            <div ref={ formDataPengalaman } id="data-pengalaman"
                                 className="mt-6 col-span-1 lg:col-span-2">
                                <Typography variant="h4" className="flex items-center gap-2">
                                    Pengalaman Organisasi
                                </Typography>
                            </div>
                            <Card className="col-span-1 lg:col-span-2 w-full overflow-auto !rounded-none pb-14">
                                <table className="col-span-2 table-auto text-left border-2">
                                    <thead>
                                    <tr>
                                        { TABLE_ORGANISASI_HEAD.map((head) => (
                                            <th
                                                key={ head }
                                                className="border-b border-blue-gray-100 bg-blue-gray-50 p-4"
                                            >
                                                <Typography
                                                    variant="small"
                                                    color="blue-gray"
                                                    className="font-normal leading-none opacity-70"
                                                >
                                                    { head }
                                                </Typography>
                                            </th>
                                        )) }
                                    </tr>
                                    </thead>
                                    <tbody>
                                    { Array.from({ length: 4 }).map((_, index) => {
                                        const isLast = index === 4 - 1;
                                        const classes = isLast ? "p-4" : "p-4 border-b border-blue-gray-50";

                                        return (
                                            <tr key={ index }>
                                                { TABLE_ORGANISASI_HEAD.map((head) => ((
                                                    <td key={ head } className={ classes }>
                                                        <Input
                                                            color="teal"
                                                            type="text"
                                                            label={ head }
                                                        />
                                                    </td>
                                                ))) }
                                            </tr>
                                        );
                                    }) }
                                    </tbody>
                                </table>
                            </Card>

                            <div className="mt-6 col-span-1 lg:col-span-2">
                                <Typography variant="h4" className="flex items-center gap-2">
                                    Pengalaman bekerja di PPH
                                </Typography>
                            </div>
                            <Card className="col-span-1 lg:col-span-2 w-full overflow-auto !rounded-none pb-14">
                                <table className="col-span-2 table-auto text-left border-2">
                                    <thead>
                                    <tr>
                                        { TABLE_BEKERJA_DI_PPH_HEAD.map((head) => (
                                            <th
                                                key={ head }
                                                className="border-b border-blue-gray-100 bg-blue-gray-50 p-4"
                                            >
                                                <Typography
                                                    variant="small"
                                                    color="blue-gray"
                                                    className="font-normal leading-none opacity-70"
                                                >
                                                    { head }
                                                </Typography>
                                            </th>
                                        )) }
                                    </tr>
                                    </thead>
                                    <tbody>
                                    { Array.from({ length: 4 }).map((_, index) => {
                                        const isLast = index === 4 - 1;
                                        const classes = isLast ? "p-4" : "p-4 border-b border-blue-gray-50";

                                        return (
                                            <tr key={ index }>
                                                { TABLE_BEKERJA_DI_PPH_HEAD.map((head) => ((
                                                    <td key={ head } className={ classes }>
                                                        <Input
                                                            color="teal"
                                                            type="text"
                                                            label={ head }
                                                        />
                                                    </td>
                                                ))) }
                                            </tr>
                                        );
                                    }) }
                                    </tbody>
                                </table>
                            </Card>

                            <div className="mt-6 col-span-1 lg:col-span-2">
                                <Typography variant="h4" className="flex items-center gap-2">
                                    Pengalaman bekerja di luar PPH
                                </Typography>
                            </div>
                            <Card className="col-span-1 lg:col-span-2 w-full overflow-auto !rounded-none pb-14">
                                <table className="col-span-2 table-auto text-left border-2">
                                    <thead>
                                    <tr>
                                        { TABLE_BEKERJA_LUAR_PPH_HEAD.map((head) => (
                                            <th
                                                key={ head }
                                                className="border-b border-blue-gray-100 bg-blue-gray-50 p-4"
                                            >
                                                <Typography
                                                    variant="small"
                                                    color="blue-gray"
                                                    className="font-normal leading-none opacity-70"
                                                >
                                                    { head }
                                                </Typography>
                                            </th>
                                        )) }
                                    </tr>
                                    </thead>
                                    <tbody>
                                    { Array.from({ length: 4 }).map((_, index) => {
                                        const isLast = index === 4 - 1;
                                        const classes = isLast ? "p-4" : "p-4 border-b border-blue-gray-50";

                                        return (
                                            <tr key={ index }>
                                                { TABLE_BEKERJA_LUAR_PPH_HEAD.map((head) => ((
                                                    <td key={ head } className={ classes }>
                                                        <Input
                                                            color="teal"
                                                            type="text"
                                                            label={ head }
                                                        />
                                                    </td>
                                                ))) }
                                            </tr>
                                        );
                                    }) }
                                    </tbody>
                                </table>
                            </Card>

                            <Button
                                className="col-span-1 lg:col-span-2 w-52 ml-auto flex items-center justify-center gap-3">
                                <Save/>
                                Simpan
                            </Button>
                        </form>
                    </Card>
                </main>
            </AdminLayout>
        </>
    );
}
