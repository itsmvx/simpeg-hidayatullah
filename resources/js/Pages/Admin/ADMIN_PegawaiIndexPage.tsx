import {
    Button,
    Card,
    CardBody,
    CardFooter,
    CardHeader,
    Dialog,
    DialogBody,
    DialogFooter,
    DialogHeader,
    IconButton,
    List,
    ListItem,
    ListItemPrefix,
    Tooltip,
    Typography
} from "@material-tailwind/react";
import { ChevronDown, Download, FileSearch, Pencil, Search, X } from "lucide-react";
import { IDNamaColumn, JenisKelamin,  PageProps, PaginationData } from "@/types";
import { Head, Link, router } from "@inertiajs/react";
import { Input } from "@/Components/Input";
import { format } from "date-fns";
import { id as localeID } from "date-fns/locale/id";
import { Checkbox } from "@/Components/Checkbox";
import { ChangeEvent, useState } from "react";
import { toast } from "react-toastify";
import axios, { AxiosError, AxiosProgressEvent } from "axios";
import Pagination from "@/Components/Pagination";
import CV_PDFGenerator, { PegawaiExportCV } from "@/Lib/Dokumen_RekapPegawai";
import { pdf } from "@react-pdf/renderer";
import { saveAs } from "file-saver";
import { jenisKelamin } from "@/Lib/StaticData";
import { AdminLayout } from "@/Layouts/AdminLayout";

type Pegawais = {
    id: string;
    nip: string;
    nama: string;
    jenis_kelamin: JenisKelamin;
    tanggal_promosi: string;
    lama_promosi: string;
    golongan: IDNamaColumn | null;
    marhalah: IDNamaColumn | null;
    status_pegawai: IDNamaColumn | null;
    created_at: string;
}[];

export default function ADMIN_PegawaiIndexPage({ auth, marhalahs, golongans, statusPegawais, units, pagination, }: PageProps<{
    marhalahs: IDNamaColumn[];
    golongans: IDNamaColumn[];
    statusPegawais: IDNamaColumn[];
    units: IDNamaColumn[];
    pagination: PaginationData<Pegawais>;
}>) {

    const TABLE_HEAD = ['No','NIP', 'Nama', 'Jenis Kelamin', 'Status Pegawai', 'Golongan dan Marhalah', 'Promosi Terakhir', 'Tanggal daftar', 'Aksi'];

    const deleteDialogInit = {
        open: false,
        pegawaiId: '',
    };
    const [ sortBy, setSortBy ] = useState('');
    type FilterBy = {
        marhalah: string[];
        golongan: string[];
        statusPegawai: string[];
        jenisKelamin: string[];
        unit: string[];
    };
    const filterByInit: FilterBy = {
        marhalah: [],
        golongan: [],
        statusPegawai: [],
        jenisKelamin: [],
        unit: []
    };
    const [ filterBy, setFilterBy ] = useState<FilterBy>(() => {
        const searchParams = new URLSearchParams(window.location.search);
        const filterParam = searchParams.get('filter');
        if (filterParam) {
            return JSON.parse(atob(filterParam)) as FilterBy;
        }
        return filterByInit;
    });
    const [ openFilterBy, setOpenFilterBy ] = useState(false);
    const handleChangeFilterBy = (by: keyof FilterBy, event: ChangeEvent<HTMLInputElement>) => {
        const { value } = event.target;
        setFilterBy((prevState) => ({
            ...prevState,
            [by]: prevState[by].includes(value)
                ? prevState[by].filter((filt) => filt !== value)
                : [ ...prevState[by], value ],
        }));
    };
    const handleSetFilterBy = () => {
        const isEmpty = Object.values(filterBy).every((filters) => filters.length === 0);

        const filterBase64 = btoa(JSON.stringify(filterBy));
        const searchParams = new URLSearchParams(window.location.search);

        if (isEmpty) {
            searchParams.delete('filter');
        } else {
            searchParams.set('filter', filterBase64);
        }

        router.visit(window.location.pathname + '?' + searchParams.toString(), {
            preserveState: true,
            preserveScroll: true,
        });

        setOpenFilterBy(false);
    };

    const [viewPerPage, setViewPerPage] = useState(() => {
        const searchParams = new URLSearchParams(window.location.search);
        const viewParam = searchParams.get('view');
        return viewParam ? parseInt(viewParam, 10) : 10;
    });
    const handleSetViewPerPage = (value: number) => {
        const searchParams = new URLSearchParams(window.location.search);
        if (value === 10) {
            searchParams.delete('view');
        } else {
            searchParams.set('view', String(value));
        }
        setViewPerPage(value);
        router.visit(window.location.pathname + '?' + searchParams.toString(), {
            preserveState: true,
            preserveScroll: true,
        });
    };

    const [ search, setSearch ] = useState('');
    const [ onDownloadPDF, setOnDownloadPDF ] = useState<boolean>(false);
    const [ dragAndDrop, setDragAndDrop ] = useState<{
        open: boolean;
        file: File | null;
    }>({
        open: false,
        file: null
    });
    const [ uploadPreview, setUploadPreview ] = useState<{
        open: boolean;
        data: any[];
    }>({
        open: false,
        data: []
    });
    const handleOpenDragAndDrop = () => setDragAndDrop((prevState) => ({ ...prevState, open: true }));
    const handleOpenUploadPreview = () => setUploadPreview((prevState) => ({ ...prevState }));

    const downloadPDF = async (index: number) => {
        setOnDownloadPDF(true);
        const toastId = toast.loading('Meminta Data dari Server..', { autoClose: 5000 });
        try {
            const pegawai = await axios.post<{ data: PegawaiExportCV }>(route('pegawai.data'), {
                id: pagination.data[index].id
            }, {
                onUploadProgress: (p: AxiosProgressEvent) => {
                    const progress: number = (p.loaded * 0.8) / (p.total ?? 100);
                    toast.update(toastId, { type: "info", isLoading: true, progress: progress });
                },
            });
            toast.update(toastId, { type: "info", isLoading: true, progress: 0.87, render: 'Memproses File..' });
            const blob = await pdf(<CV_PDFGenerator data={pegawai.data.data as PegawaiExportCV} />).toBlob();
            saveAs(blob, `${pagination.data[index].nip}_${pagination.data[index].nama}.pdf`);
            toast.update(toastId, { type: 'success', isLoading: false, progress: 0.99, render: 'Berhasil mengunduh!' });
        } catch (err: unknown) {
            const errMsg = err instanceof AxiosError
                ? 'Server gagal memproses permintaan'
                : 'Gagal memproses permintaan';
            toast.update(toastId, { type: 'error', isLoading: false, render: errMsg });
        } finally {
            setOnDownloadPDF(false);
            setTimeout(() => {
                toast.dismiss(toastId);
            }, 4000);
        }
    };

    return (
        <>
            <Head title="Admin - Pegawai" />
            <AdminLayout auth={auth}>
                <Card className="h-full w-full" shadow={false}>
                    <CardHeader floated={false} shadow={false} className="rounded-none">
                        <div className="mb-8 flex items-center justify-between gap-x-3">
                            <div>
                                <Typography variant="h5" color="blue-gray">
                                    Daftar Pegawai
                                </Typography>
                                <Typography color="gray" className="mt-1 font-normal">
                                    Informasi mengenai Pegawai yang terdaftar
                                </Typography>
                            </div>
                        </div>
                        <div className="w-full flex flex-col md:flex-row items-start justify-between gap-4">
                            <div className="flex-1 h-full max-w-xl space-y-0.5 content-start">
                                <div className="flex flex-row gap-2.5 items-center">
                                    <Typography variant="h5" color="blue-gray">
                                        Filter berdasarkan
                                    </Typography>
                                    <Button
                                        variant="text"
                                        size="sm"
                                        color="blue-gray"
                                        className="!p-2"
                                        onClick={() => setOpenFilterBy(true)}
                                    >
                                        <Pencil width={20} />
                                    </Button>
                                </div>
                                <div className="flex flex-row gap-1.5 text-sm">
                                    <p className="min-w-28">
                                        Unit
                                    </p>
                                    <p>:&nbsp;
                                        { filterBy.unit.length < 1
                                            ? 'Semua'
                                            : filterBy.unit.length === units.length
                                                ? 'Semua'
                                                : filterBy.unit.flat().join(', ')
                                        }
                                    </p>
                                </div>
                                <div className="flex flex-row gap-1.5 text-sm">
                                    <p className="min-w-28">
                                        Marhalah
                                    </p>
                                    <p>:&nbsp;
                                        { filterBy.marhalah.length < 1
                                            ? 'Semua'
                                            : filterBy.marhalah.length === marhalahs.length
                                                ? 'Semua'
                                                : filterBy.marhalah.flat().join(', ')
                                        }
                                    </p>
                                </div>
                                <div className="flex flex-row gap-1.5 text-sm ">
                                    <p className="min-w-28">
                                        Golongan
                                    </p>
                                    <p>:&nbsp;
                                        { filterBy.golongan.length < 1
                                            ? 'Semua'
                                            : filterBy.golongan.length === golongans.length
                                                ? 'Semua'
                                                : filterBy.golongan.flat().join(', ')
                                        }
                                    </p>
                                </div>
                                <div className="flex flex-row gap-1.5 text-sm ">
                                    <p className="min-w-28">
                                        Jenis Kelamin
                                    </p>
                                    <p>:&nbsp;
                                        { filterBy.jenisKelamin.length < 1
                                            ? 'Semua'
                                            : filterBy.jenisKelamin.length === jenisKelamin.length
                                                ? 'Semua'
                                                : filterBy.jenisKelamin.flat().join(', ')
                                        }
                                    </p>
                                </div>
                                <div className="flex flex-row gap-1.5 text-sm ">
                                    <p className="min-w-28">
                                        Status Pegawai
                                    </p>
                                    <p>:&nbsp;
                                        { filterBy.statusPegawai.length < 1
                                            ? 'Semua'
                                            : filterBy.statusPegawai.length === statusPegawais.length
                                                ? 'Semua'
                                                : filterBy.statusPegawai.flat().join(', ')
                                        }
                                    </p>
                                </div>
                            </div>
                            <div className="w-full md:w-72 flex flex-col justify-end gap-2">
                                <div className="w-min text-sm *:!min-w-16 -space-y-1.5">
                                    <Typography variant="h6" color="blue-gray" className="ml-0 md:ml-3">
                                        Data per Halaman
                                    </Typography>
                                    <List className="flex-row">
                                        <ListItem className="p-0 !gap-1" ripple={false}>
                                            <label
                                                htmlFor="show-10"
                                                className="flex w-full cursor-pointer items-center px-3 py-2 *:!text-sm"
                                            >
                                                <ListItemPrefix className="mr-3">
                                                    <Checkbox
                                                        id="show-10"
                                                        ripple={false}
                                                        className="hover:before:opacity-0"
                                                        containerProps={{
                                                            className: "p-0",
                                                        }}
                                                        value={10}
                                                        checked={viewPerPage === 10}
                                                        onChange={() => handleSetViewPerPage(10)}
                                                    />
                                                </ListItemPrefix>
                                                <Typography color="blue-gray" className="font-medium">
                                                    10
                                                </Typography>
                                            </label>
                                        </ListItem>
                                        <ListItem className="p-0" ripple={false}>
                                            <label
                                                htmlFor="show-25"
                                                className="flex w-full cursor-pointer items-center px-3 py-2 *:!text-sm"
                                            >
                                                <ListItemPrefix className="mr-3">
                                                    <Checkbox
                                                        id="show-25"
                                                        ripple={false}
                                                        className="hover:before:opacity-0"
                                                        containerProps={{
                                                            className: "p-0",
                                                        }}
                                                        value={25}
                                                        checked={viewPerPage === 25}
                                                        onChange={() => handleSetViewPerPage(25)}
                                                    />
                                                </ListItemPrefix>
                                                <Typography color="blue-gray" className="font-medium">
                                                    25
                                                </Typography>
                                            </label>
                                        </ListItem>
                                    </List>
                                    <List className="flex-row !gap-1.5">
                                        <ListItem className="p-0" ripple={false}>
                                            <label
                                                htmlFor="show-50"
                                                className="flex w-full cursor-pointer items-center px-3 py-2 *:!text-sm"
                                            >
                                                <ListItemPrefix className="mr-3">
                                                    <Checkbox
                                                        id="show-50"
                                                        ripple={false}
                                                        className="hover:before:opacity-0"
                                                        containerProps={{
                                                            className: "p-0",
                                                        }}
                                                        value={50}
                                                        checked={viewPerPage === 50}
                                                        onChange={() => handleSetViewPerPage(50)}
                                                    />
                                                </ListItemPrefix>
                                                <Typography color="blue-gray" className="font-medium">
                                                    50
                                                </Typography>
                                            </label>
                                        </ListItem>
                                        <ListItem className="p-0" ripple={false}>
                                            <label
                                                htmlFor="show-100"
                                                className="flex w-full cursor-pointer items-center px-3 py-2 *:!text-sm"
                                            >
                                                <ListItemPrefix className="mr-3">
                                                    <Checkbox
                                                        id="show-100"
                                                        ripple={false}
                                                        className="hover:before:opacity-0"
                                                        containerProps={{
                                                            className: "p-0",
                                                        }}
                                                        value={100}
                                                        checked={viewPerPage === 100}
                                                        onChange={() => handleSetViewPerPage(100)}
                                                    />
                                                </ListItemPrefix>
                                                <Typography color="blue-gray" className="font-medium">
                                                    100
                                                </Typography>
                                            </label>
                                        </ListItem>
                                    </List>
                                </div>

                                <Input
                                    label="Pencarian"
                                    placeholder="cari berdasarkan nama"
                                    value={ search }
                                    onChange={ (event) => {
                                        setSearch(event.target.value);
                                    } }
                                    icon={ <Search className="h-5 w-5"/> }
                                />
                            </div>
                        </div>
                    </CardHeader>
                    <CardBody className="overflow-auto px-0">
                    <table className="mt-4 w-full min-w-max table-auto text-left">
                            <thead>
                            <tr>
                                { TABLE_HEAD.map((head, index) => (
                                    <th
                                        key={ head }
                                        onClick={ () => setSortBy(head) }
                                        className="cursor-pointer border-y border-blue-gray-100 bg-blue-gray-50/50 p-4 transition-colors hover:bg-blue-gray-50 last:cursor-auto last:hover:bg-blue-gray-50/50"
                                    >
                                        <Typography
                                            variant="small"
                                            color="blue-gray"
                                            className="flex items-center justify-between gap-2 font-normal leading-none opacity-70"
                                        >
                                            { head }{ " " }
                                            { index !== TABLE_HEAD.length - 1 && (
                                                <ChevronDown strokeWidth={ 2 } className="h-4 w-4"/>
                                            ) }
                                        </Typography>
                                    </th>
                                )) }
                            </tr>
                            </thead>
                        <tbody>
                        {
                            pagination.data.length > 0
                                ? pagination.data.map(
                                    ({
                                         id,
                                         nip,
                                         nama,
                                         jenis_kelamin,
                                         tanggal_promosi,
                                         lama_promosi,
                                         golongan,
                                         marhalah,
                                         status_pegawai,
                                         created_at
                                     }, index) => {
                                        const isLast = index === pagination.data.length - 1;
                                        const classes = isLast
                                            ? "p-4"
                                            : "p-4 border-b border-blue-gray-50";

                                        return (
                                            <tr key={ id }>
                                                <td className={ `${ classes } w-3` }>
                                                    <Typography
                                                        variant="small"
                                                        color="blue-gray"
                                                        className="font-normal text-center"
                                                    >
                                                        { index + 1 }
                                                    </Typography>
                                                </td>
                                                <td className={ `${ classes } min-w-52` }>
                                                    <div className="flex items-center gap-3">
                                                        <div className="flex flex-col">
                                                            <Typography
                                                                variant="small"
                                                                color="blue-gray"
                                                                className="font-normal"
                                                            >
                                                                { nip }
                                                            </Typography>
                                                        </div>
                                                    </div>
                                                </td>
                                                <td className={ `${ classes } min-w-52` }>
                                                    <div className="flex flex-col items-start gap-3">
                                                        <Typography
                                                            variant="small"
                                                            color="blue-gray"
                                                            className="font-normal"
                                                        >
                                                            { nama }
                                                        </Typography>
                                                    </div>
                                                </td>
                                                <td className={ `${ classes } min-w-44` }>
                                                    <div className="flex flex-col items-start gap-3">
                                                        <Typography
                                                            variant="small"
                                                            color="blue-gray"
                                                            className="font-normal"
                                                        >
                                                            { jenis_kelamin }
                                                        </Typography>
                                                    </div>
                                                </td>
                                                <td className={ `${ classes } min-w-52` }>
                                                    <div className="flex flex-col items-start gap-3">
                                                        <Typography
                                                            variant="small"
                                                            color="blue-gray"
                                                            className={ `font-normal ${ !status_pegawai ? 'italic' : '' }` }
                                                        >
                                                            { status_pegawai?.nama ?? 'Tidak terdaftar' }
                                                        </Typography>
                                                    </div>
                                                </td>
                                                <td className={ `${ classes } min-w-52` }>
                                                    <div className="flex flex-col gap-1">
                                                        <Typography
                                                            variant="small"
                                                            color="blue-gray"
                                                            className={ `font-normal ${ !golongan ? 'italic' : '' }` }
                                                        >
                                                            { golongan?.nama ?? 'Golongan tidak terdaftar' }
                                                        </Typography>
                                                        <Typography
                                                            variant="small"
                                                            color="blue-gray"
                                                            className={ `font-normal ${ !marhalah ? 'italic' : '' }` }
                                                        >
                                                            { marhalah?.nama ?? 'Marhalah tidak terdaftar' }
                                                        </Typography>
                                                    </div>
                                                </td>
                                                <td className={ `${ classes } min-w-52` }>
                                                    <div className="flex flex-col gap-1">
                                                        <Typography
                                                            variant="small"
                                                            color="blue-gray"
                                                            className="font-normal"
                                                        >
                                                            { format(tanggal_promosi, 'PPPP', {
                                                                locale: localeID
                                                            }) }
                                                        </Typography>
                                                        <Typography
                                                            variant="small"
                                                            color="blue-gray"
                                                            className="font-medium text-xs italic tracking-wider"
                                                        >
                                                            ({ lama_promosi } hari lalu)
                                                        </Typography>
                                                    </div>
                                                </td>
                                                <td className={ `${ classes } min-w-40` }>
                                                    <Typography
                                                        variant="small"
                                                        color="blue-gray"
                                                        className="font-normal"
                                                    >
                                                        { format(created_at, 'PPPp', {
                                                            locale: localeID
                                                        }) }
                                                    </Typography>
                                                </td>
                                                <td className={ classes }>
                                                    <div className="w-32 flex gap-2.5 items-center justify-start">
                                                        <Tooltip content="Detail" className="bg-blue-600">
                                                            <Link href={ route('admin.pegawai.details', { q: id }) }>
                                                                <IconButton variant="text">
                                                                    <FileSearch className="h-5 w-5 text-blue-800"/>
                                                                </IconButton>
                                                            </Link>
                                                        </Tooltip>
                                                        <Tooltip content="Unduh Data" className="bg-black">
                                                            <IconButton
                                                                variant="text"
                                                                onClick={ (() => downloadPDF(index)) }
                                                                disabled={ onDownloadPDF }
                                                            >
                                                                <Download className="h-5 w-5"/>
                                                            </IconButton>
                                                        </Tooltip>
                                                    </div>
                                                </td>
                                            </tr>
                                        );
                                    },
                                ) : (
                                    <tr>
                                        <td colSpan={ TABLE_HEAD.length }>
                                            <div className="h-16 flex items-center justify-center text-gray-600">
                                                Belum ada data Pegawai
                                            </div>
                                        </td>
                                    </tr>
                                )
                        }
                        </tbody>
                    </table>
                    </CardBody>
                    <CardFooter className="flex items-center justify-between border-t border-blue-gray-50 p-4">
                        <Pagination paginateItems={ pagination }/>
                    </CardFooter>
                </Card>

                <Dialog size="xl" open={ openFilterBy } handler={ () => setOpenFilterBy(true) } className="p-4">
                    <DialogHeader className="relative m-0 block">
                        <Typography variant="h4" color="blue-gray">
                            Filter berdasarkan
                        </Typography>
                        <Typography className="mt-1 font-normal text-gray-600">
                            Dapat memilih lebih dari opsi
                        </Typography>
                        <IconButton
                            size="sm"
                            variant="text"
                            className="!absolute right-3.5 top-3.5"
                            onClick={ () => setOpenFilterBy(false) }
                        >
                            <X className="h-4 w-4 stroke-2"/>
                        </IconButton>
                    </DialogHeader>
                    <DialogBody className="h-80 overflow-auto">
                        <div className="flex flex-col md:flex-row flex-wrap gap-2 justify-around">
                            <div>
                                <Typography variant="h6">
                                    Status Pegawai
                                </Typography>
                                <List>
                                    {
                                        statusPegawais.sort((a, b) => a.nama.localeCompare(b.nama)).map((status, index) => ((
                                            <ListItem className="p-0" key={status.id}>
                                                <label
                                                    htmlFor={ status.id }
                                                    className="flex w-full cursor-pointer items-center px-3 py-2"
                                                >
                                                    <ListItemPrefix className="mr-3">
                                                        <Checkbox
                                                            id={ status.id }
                                                            ripple={ false }
                                                            className="hover:before:opacity-0"
                                                            containerProps={ {
                                                                className: "p-0",
                                                            } }
                                                            value={ status.nama }
                                                            checked={ filterBy.statusPegawai.includes(status.nama) }
                                                            onChange={ (event) => handleChangeFilterBy('statusPegawai', event) }
                                                        />
                                                    </ListItemPrefix>
                                                    <Typography color="blue-gray" className="text-sm font-medium">
                                                        { status.nama }
                                                    </Typography>
                                                </label>
                                            </ListItem>
                                        )))
                                    }
                                </List>

                                <Typography variant="h6">
                                    Jenis Kelamin
                                </Typography>
                                <List>
                                    {
                                        jenisKelamin.map((jenis, index) => ((
                                            <ListItem className="p-0" key={jenis}>
                                                <label
                                                    htmlFor={ jenis }
                                                    className="flex w-full cursor-pointer items-center px-3 py-2"
                                                >
                                                    <ListItemPrefix className="mr-3">
                                                        <Checkbox
                                                            id={ jenis }
                                                            ripple={ false }
                                                            className="hover:before:opacity-0"
                                                            containerProps={ {
                                                                className: "p-0",
                                                            } }
                                                            value={ jenis }
                                                            checked={ filterBy.jenisKelamin.includes(jenis) }
                                                            onChange={ (event) => handleChangeFilterBy('jenisKelamin', event) }
                                                        />
                                                    </ListItemPrefix>
                                                    <Typography color="blue-gray" className="text-sm font-medium">
                                                        { jenis }
                                                    </Typography>
                                                </label>
                                            </ListItem>
                                        )))
                                    }
                                </List>
                            </div>
                            <div>
                                <Typography variant="h6">
                                    Marhalah
                                </Typography>
                                <List>
                                    {
                                        marhalahs.sort((a, b) => a.nama.localeCompare(b.nama)).map((marhalah, index) => ((
                                            <ListItem className="p-0" key={marhalah.id}>
                                                <label
                                                    htmlFor={ marhalah.id }
                                                    className="flex w-full cursor-pointer items-center px-3 py-2"
                                                >
                                                    <ListItemPrefix className="mr-3">
                                                        <Checkbox
                                                            id={ marhalah.id }
                                                            ripple={ false }
                                                            className="hover:before:opacity-0"
                                                            containerProps={ {
                                                                className: "p-0",
                                                            } }
                                                            value={ marhalah.nama }
                                                            checked={ filterBy.marhalah.includes(marhalah.nama) }
                                                            onChange={ (event) => handleChangeFilterBy('marhalah', event) }
                                                        />
                                                    </ListItemPrefix>
                                                    <Typography color="blue-gray" className="text-sm font-medium">
                                                        { marhalah.nama }
                                                    </Typography>
                                                </label>
                                            </ListItem>
                                        )))
                                    }
                                </List>
                                <Typography variant="h6">
                                    Golongan
                                </Typography>
                                <List>
                                    {
                                        golongans.sort((a, b) => a.nama.localeCompare(b.nama)).map((golongan, index) => ((
                                            <ListItem className="p-0" key={golongan.id}>
                                                <label
                                                    htmlFor={ golongan.id }
                                                    className="flex w-full cursor-pointer items-center px-3 py-2"
                                                >
                                                    <ListItemPrefix className="mr-3">
                                                        <Checkbox
                                                            id={ golongan.id }
                                                            ripple={ false }
                                                            className="hover:before:opacity-0"
                                                            containerProps={ {
                                                                className: "p-0",
                                                            } }
                                                            value={ golongan.nama }
                                                            checked={ filterBy.golongan.includes(golongan.nama) }
                                                            onChange={ (event) => handleChangeFilterBy('golongan', event) }
                                                        />
                                                    </ListItemPrefix>
                                                    <Typography color="blue-gray" className="text-sm font-medium">
                                                        { golongan.nama }
                                                    </Typography>
                                                </label>
                                            </ListItem>
                                        )))
                                    }
                                </List>
                            </div>
                        </div>
                    </DialogBody>
                    <DialogFooter>
                        <Button className="ml-auto" onClick={ handleSetFilterBy }>
                            Simpan Filter
                        </Button>
                    </DialogFooter>
                </Dialog>
            </AdminLayout>
        </>
    );
}
