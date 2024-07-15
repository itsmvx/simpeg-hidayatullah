import { Head } from "@inertiajs/react";
import {
    Card,
    Collapse,
    IconButton, List, ListItem,
    Navbar, Select, Option,
    Typography, PopoverHandler, PopoverContent, Popover, Button
} from "@material-tailwind/react";
import {
    ChevronLeft,
    ChevronRight,
    CircleUser,
    GraduationCap, Medal,
    Menu as MenuIcon, Moon, Save,
    Star, Sun,
    Users,
    X
} from "lucide-react";
import { useEffect, useRef, useState } from "react";
import { Input } from "@/Components/Input";
import { format } from "date-fns";
import { DayPicker } from "react-day-picker";
import "react-day-picker/dist/style.css";
import { id } from "date-fns/locale";
import { useTheme } from "@/Hooks/useTheme";


export default function PelamarFormPage() {
    const { theme, setTheme } = useTheme();
    const TABLE_KELUARGA_HEAD = ["Status", "Nama lengkap", "Jenis kelamin", "Tempat lahir", "Tanggal lahir", "Pekerjaan", "Pendidikan"];
    const STATUS_KELUARGA = [ "Kepala keluarga", "Istri", "Anak","Orang tua", "Lainnya" ];
    const TABLE_PENDIDIKAN_FORMAL_HEAD = [ "Tingkat pendidikan", "Nama Sekolah/Universitas", "Tahun lulus" ];
    const JENIS_PENDIDIKAN_FORMAL = [ "SD", "SMP", "SMA sederajat", "S1", "S2", "S3" ];
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
    console.log(theme);
    const NavLists = () => {
        return (
            <>
                <List className="mt-2 mb-4 flex flex-col gap-2 lg:mb-0 lg:mt-0 lg:flex-row lg:items-center lg:gap-2.5 *:font-medium *:text-sm *:flex *:gap-1 *:w-auto">
                    <ListItem className="!p-0">
                        <a href="" onClick={(e) => {
                            e.preventDefault();
                            if (dataDiriRef.current) {
                                const offset = window.innerWidth >= 960 ? 120 : 80;
                                const elementPosition = dataDiriRef.current.getBoundingClientRect().top + window.scrollY;
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
                            if (dataKeluargaRef.current) {
                                const offset = window.innerWidth >= 960 ? 120 : 80;
                                const elementPosition = dataKeluargaRef.current.getBoundingClientRect().top + window.scrollY;
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
                            if (dataPendidikanRef.current) {
                                const offset = window.innerWidth >= 960 ? 120 : 80;
                                const elementPosition = dataPendidikanRef.current.getBoundingClientRect().top + window.scrollY;
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
                            if (dataPengalamanRef.current) {
                                const offset = window.innerWidth >= 960 ? 120 : 80;
                                const elementPosition = dataPengalamanRef.current.getBoundingClientRect().top + window.scrollY;
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

    const [ openNav, setOpenNav] = useState(false);
    const [ date, setDate ] = useState<Date>();

    const dataDiriRef = useRef<HTMLDivElement | null>(null);
    const dataKeluargaRef = useRef<HTMLDivElement | null>(null);
    const dataPendidikanRef = useRef<HTMLDivElement | null>(null);
    const dataPengalamanRef = useRef<HTMLDivElement | null>(null);


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
            <main className="w-full min-h-screen bg-gray-50 space-y-4">
                <Navbar className="sticky top-0 z-10 h-max max-w-full rounded-none px-4 py-2 lg:px-8 lg:py-4">
                    <div className="flex items-center justify-between text-blue-gray-900">
                        <Typography
                            className="mr-4 cursor-pointer py-1.5 font-medium"
                        >
                            Form Pegawai PPH Surabaya
                        </Typography>
                        <div className="flex-1 flex items-center justify-end gap-4">
                            <IconButton
                                variant="text"
                                className="ml-auto h-6 w-6 text-inherit hover:bg-transparent focus:bg-transparent active:bg-transparent lg:hidden"
                                ripple={false}
                                onClick={() => setOpenNav(!openNav)}
                            >
                                {openNav ? ( <X /> ) : ( <MenuIcon /> )}
                            </IconButton>
                            <div className="mr-4 hidden lg:block">
                                <NavLists />
                            </div>
                            <IconButton
                                variant="text"
                                size="sm"
                                onClick={() => setTheme((prevState) => prevState === 'light' ? 'dark' : 'light')}
                                className="lg:justify-self-end"
                            >
                                {
                                    theme === 'light'
                                        ? ( <Sun /> )
                                        : ( <Moon /> )
                                }
                            </IconButton>
                        </div>
                    </div>
                    <Collapse open={openNav}>
                        <NavLists />
                    </Collapse>
                </Navbar>
                <Card className="w-full md:w-11/12 mx-auto p-3">
                    <form className="grid grid-cols-1 lg:grid-cols-2 gap-x-6 gap-y-4 p-5 dark:bg-gray-900">
                        <div ref={dataDiriRef} id="data-diri" className="col-span-1 lg:col-span-2">
                            <Typography variant="h4" className="flex items-center gap-2">
                                <CircleUser/>
                                Data Diri
                            </Typography>
                        </div>
                        <Input type="text" color="teal" label="Nama lengkap"/>
                        <Input type="text" color="teal" label="Suku bangsa"/>
                        <Input type="text" color="teal" label="Tempat Lahir"/>
                        <Popover placement="bottom">
                            <PopoverHandler>
                                <Input
                                    color="teal"
                                    label="Tanggal Lahir"
                                    onChange={ () => null }
                                    value={ date ? format(date, "PPP", { locale: id }) : "" }
                                />
                            </PopoverHandler>
                            <PopoverContent>
                                <DayPicker
                                    mode="single"
                                    selected={ date }
                                    onSelect={ setDate }
                                    showOutsideDays
                                    className="border-0"
                                    classNames={ {
                                        caption: "relative w-full flex items-center justify-center gap-2 py-2 mb-4 relative items-center",
                                        caption_label: "text-sm font-medium text-gray-900",
                                        caption_dropdowns: '',
                                        dropdown_month: 'rdp-dropdown_month min-w-16 font-semibold',
                                        nav: "absolute flex items-center justify-between w-full",
                                        nav_button:
                                            "absolute h-6 w-6 bg-transparent hover:bg-blue-gray-50 p-1 rounded-md transition-colors duration-300",
                                        table: "w-full border-collapse",
                                        head_row: "flex font-medium text-gray-900",
                                        head_cell: "m-0.5 w-9 font-normal text-sm",
                                        row: "flex w-full mt-2",
                                        cell: "text-gray-600 rounded-md h-9 w-9 text-center text-sm p-0 m-0.5 relative [&:has([aria-selected].day-range-end)]:rounded-r-md [&:has([aria-selected].day-outside)]:bg-gray-900/20 [&:has([aria-selected].day-outside)]:text-white [&:has([aria-selected])]:bg-gray-900/50 first:[&:has([aria-selected])]:rounded-l-md last:[&:has([aria-selected])]:rounded-r-md focus-within:relative focus-within:z-20",
                                        day: "h-9 w-9 p-0 font-normal",
                                        day_range_end: "day-range-end",
                                        day_selected:
                                            "rounded-md bg-gray-900 text-white hover:bg-gray-900 hover:text-white focus:bg-gray-900 focus:text-white",
                                        day_today: "rounded-md bg-gray-200 text-gray-900",
                                        day_outside:
                                            "day-outside text-gray-500 opacity-50 aria-selected:bg-gray-500 aria-selected:text-gray-900 aria-selected:bg-opacity-10",
                                        day_disabled: "text-gray-500 opacity-50",
                                        day_hidden: "invisible",
                                    } }
                                    components={ {
                                        IconLeft: ({ ...props }) => (
                                            <ChevronLeft { ...props } className="h-4 w-4 stroke-2"/>
                                        ),
                                        IconRight: ({ ...props }) => (
                                            <ChevronRight { ...props } className="h-4 w-4 stroke-2"/>
                                        ),
                                    } }
                                    captionLayout="dropdown-buttons"
                                    fromYear={ 1970 }
                                    toYear={ 2077 }
                                />
                            </PopoverContent>
                        </Popover>
                        <div className="flex flex-row gap-4">
                            <Input
                                type="text"
                                color="teal"
                                label="Usia (Tahun)"
                                icon={ <p className="-ml-4 text-xs font-semibold">Tahun</p> }
                                containerProps={ {
                                    className: 'min-w-36 w-[10px]'
                                } }
                            />
                            <Input
                                type="text"
                                color="teal"
                                label="Usia (Bulan)"
                                icon={ <p className="-ml-4 text-xs font-semibold">Bulan</p> }
                                containerProps={ {
                                    className: 'min-w-36 w-[10px]'
                                } }
                            />
                        </div>
                        <Select label="Jenis kelamin" color="teal">
                            <Option>Laki-laki</Option>
                            <Option>Perempuan</Option>
                        </Select>
                        <Input type="text" color="teal" label="Alamat"/>
                        <Input type="text" color="teal" label="Agama"/>
                        <Select label="Status pernikahan" color="teal">
                            <Option>Belum menikah</Option>
                            <Option>Menikah</Option>
                            <Option>Cerai hidup</Option>
                            <Option>Cerai mati</Option>
                        </Select>
                        <Input type="text" color="teal" label="Jabatan saat ini"/>
                        <Input type="text" color="teal" label="Pangkat dan golongan"/>
                        <Input type="text" color="teal" label="Instansi"/>
                        <Input type="text" color="teal" label="Jabatan atasan langsung"/>
                        <Input type="text" color="teal" label="Nomor HP/WA"/>

                        <div ref={dataKeluargaRef} id="data-keluarga" className="mt-6 col-span-1 lg:col-span-2">
                            <Typography variant="h4" className="flex items-center gap-2">
                                <Users/>
                                Data Keluarga
                            </Typography>
                        </div>
                        <Card className="col-span-1 lg:col-span-2 w-full overflow-auto !rounded-none pb-14">
                            <table className="col-span-2 table-auto text-left border-2">
                                <thead>
                                <tr>
                                    { TABLE_KELUARGA_HEAD.map((head) => (
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
                                { Array.from({ length: 5 }).map((_, index) => {
                                    const isLast = index === 5 - 1;
                                    const classes = isLast ? "p-4" : "p-4 border-b border-blue-gray-50";

                                    return (
                                        <tr key={ index }>
                                            <td className={ classes }>
                                                <Select label="Status dlm keluarga" color="teal">
                                                    { STATUS_KELUARGA.map((status) => ((
                                                        <Option key={ status } value={ status }>
                                                            { status }
                                                        </Option>
                                                    ))) }
                                                </Select></td>
                                            { TABLE_KELUARGA_HEAD.filter((_, index) => index !== 0).map((head, index) => (
                                                <>
                                                    <td key={ index } className={ classes }>
                                                        {
                                                            head === 'Jenis kelamin'
                                                                ? (
                                                                    <>
                                                                        <Select label="Jenis kelamin" color="teal">
                                                                            <Option>Laki-laki</Option>
                                                                            <Option>Perempuan</Option>
                                                                        </Select>
                                                                    </>
                                                                ) : head === 'Tanggal lahir'
                                                                    ? (
                                                                        <>
                                                                            <Input
                                                                                color="teal"
                                                                                type="date"
                                                                                label={ head }
                                                                            />
                                                                        </>
                                                                    ) : (
                                                                        <Input
                                                                            color="teal"
                                                                            type="text"
                                                                            label={ head }
                                                                        />
                                                                    )
                                                        }
                                                    </td>
                                                </>
                                            )) }
                                        </tr>
                                    );
                                }) }
                                </tbody>
                            </table>
                        </Card>

                        <div ref={dataPendidikanRef} id="data-pendidikan" className="mt-6 col-span-1 lg:col-span-2">
                            <Typography variant="h4" className="flex items-center gap-2">
                                <GraduationCap/>
                                Data Pendidikan Formal
                            </Typography>
                        </div>
                        <Card className="col-span-1 lg:col-span-2 w-full overflow-auto !rounded-none pb-14">
                            <table className="col-span-2 table-auto text-left border-2">
                                <thead>
                                <tr>
                                    { TABLE_PENDIDIKAN_FORMAL_HEAD.map((head) => (
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
                                            <td className={ classes }>
                                                <Select label="Tingkat pendidikan" color="teal">
                                                    { JENIS_PENDIDIKAN_FORMAL.map((jenis) => ((
                                                        <Option key={ jenis } value={ jenis }>
                                                            { jenis }
                                                        </Option>
                                                    ))) }
                                                </Select>
                                            </td>
                                            <td className={ classes }>
                                                <Input
                                                    color="teal"
                                                    type="text"
                                                    label="Nama Sekolah/Akademi"
                                                />
                                            </td>
                                            <td className={ classes }>
                                                <Input
                                                    color="teal"
                                                    type="text"
                                                    label="Tahun lulus"
                                                />
                                            </td>
                                        </tr>
                                    );
                                }) }
                                </tbody>
                            </table>
                        </Card>

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

                        <div ref={dataPengalamanRef} id="data-pengalaman" className="mt-6 col-span-1 lg:col-span-2">
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

                        <Button className="col-span-1 lg:col-span-2 w-52 ml-auto flex items-center justify-center gap-3">
                            <Save />
                            Simpan
                        </Button>
                    </form>
                </Card>
            </main>
        </>
    );
}
