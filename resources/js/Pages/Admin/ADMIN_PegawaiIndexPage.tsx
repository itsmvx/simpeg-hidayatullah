import {
    Button,
    Card,
    CardBody,
    CardFooter,
    CardHeader, Dialog, DialogBody, DialogHeader,
    IconButton, Menu, MenuHandler, MenuItem, MenuList, Progress,
    Tooltip,
    Typography
} from "@material-tailwind/react";
import { BookOpen, Download, FileSearch, ListChecks, NotebookText, X } from "lucide-react";
import { IDNamaColumn, JenisKelamin,  PageProps, PaginationData } from "@/types";
import { Head, Link } from "@inertiajs/react";
import { format } from "date-fns";
import { id as localeID } from "date-fns/locale/id";
import { useState } from "react";
import { toast } from "react-toastify";
import axios, { AxiosError, AxiosProgressEvent } from "axios";
import Pagination from "@/Components/Pagination";
import { calculateDatePast, notifyToast } from "@/Lib/Utils";
import { ViewPerPageList } from "@/Components/ViewPerPageList";
import { SearchInput } from "@/Components/SearchInput";
import { TableFilterBy } from "@/Components/TableFilterBy";
import { AdminLayout } from "@/Layouts/AdminLayout";
import { generateMultipleRekap, generateSingleRekap, PegawaiRekapPrint } from "@/Lib/Generate_Dokumen/RekapPegawai";
import { Checkbox } from "@/Components/Checkbox";

type Pegawais = {
    id: string;
    nip: string;
    nama: string;
    jenis_kelamin: JenisKelamin;
    amanah: string;
    tanggal_promosi: string | null;
    tanggal_marhalah: string | null;
    unit: IDNamaColumn | null;
    golongan: IDNamaColumn | null;
    marhalah: IDNamaColumn | null;
    status_pegawai: IDNamaColumn | null;
    created_at: string;
}[];

export default function ADMIN_PegawaiIndexPage({ auth, marhalahs, golongans, statusPegawais, pagination, currDate }: PageProps<{
    pagination: PaginationData<Pegawais>;
    golongans: IDNamaColumn[];
    marhalahs: IDNamaColumn[];
    statusPegawais: IDNamaColumn[];
    currDate: string;
}>) {
    const TABLE_HEAD = ['No','NIP', 'Nama', 'Jenis Kelamin', 'Amanah', 'Status Pegawai', 'Golongan', 'Marhalah', 'Promosi Terakhir', 'Tanggal daftar', 'Aksi'];

    const massDownloadRekapInit = {
        openDialog: false,
        onSubmit: false,
        onProcess: false,
        onError: false,
        errMsg: '',
        onSuccess: false,
        fileName: '',
        fileSize: 0,
        fileProgress: 0
    };

    const [ pegawaisChecked, setPegawaisChecked ] = useState<{
        id: string;
        nama: string;
        amanah: string;
    }[]>([]);
    const [ massDownloadRekap, setMassDownloadRekap ] = useState<{
        openDialog: boolean;
        onSubmit: boolean;
        onProcess: boolean;
        onError: boolean;
        errMsg: string;
        onSuccess: boolean;
        fileName: string;
        fileSize: number;
        fileProgress: number
    }>(massDownloadRekapInit);
    const [ onDownloadPDF, setOnDownloadPDF ] = useState<boolean>(false);
    const handleSetCheckPegawai = (id: string, nama: string, amanah: string) => {
        setPegawaisChecked((prevState) => {
            if (!prevState.find((prev) => prev.id === id)) {
                return [ ...prevState, { id: id, nama: nama, amanah: amanah }];
            }
            return prevState.filter((prev) => prev.id !== id);
        });
    };

    const downloadSingleRekap = async (index: number) => {
        setOnDownloadPDF(true);
        const toastId = toast.loading('Meminta Data dari Server..', { autoClose: 5000 });
        try {
            const pegawai = await axios.post<{ data: PegawaiRekapPrint }>(route('pegawai.data'), {
                id: pagination.data[index].id
            }, {
                onUploadProgress: (p: AxiosProgressEvent) => {
                    const progress: number = (p.loaded * 0.8) / (p.total ?? 100);
                    toast.update(toastId, { type: "info", isLoading: true, progress: progress });
                },
            });
            toast.update(toastId, { type: "info", isLoading: true, progress: 0.87, render: 'Memproses File..' });
            await generateSingleRekap({ data: pegawai.data.data });
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
    const setMassDownloadRekapFileSize = (size: number) => {
        setMassDownloadRekap((prevState) => ({
            ...prevState,
            fileSize: size
        }));
    };
    const setMassDownloadRekapFileProgress = (progress: number) => {
        setMassDownloadRekap((prevState) => ({
            ...prevState,
            fileProgress: progress
        }));
    };
    const handleMassDownloadRekap = async () => {
        setMassDownloadRekap((prevState) => ({
            ...prevState,
            onSubmit: true,
            openDialog: true
        }));
        try {
            const pegawais = await axios.post<{ data: PegawaiRekapPrint[] }>(route('pegawai.data-mass'), {
                id: pegawaisChecked.map((pegawai) => pegawai.id)
            });
            const fileName = `Rekap Pegawai-${Math.random().toString(36).substring(2, 8)}`;
            setMassDownloadRekap((prevState) => ({
                ...prevState,
                onSubmit: false,
                onProcess: true,
                fileName: fileName
            }));
            await generateMultipleRekap({
                data: pegawais.data.data,
                fileName: fileName,
                setUpdateFileSize: setMassDownloadRekapFileSize,
                setUpdateFileProgress: setMassDownloadRekapFileProgress
            })
                .then(() => {
                    setMassDownloadRekap((prevState) => ({
                        ...prevState,
                        onSubmit: false,
                        onProcess: false,
                        onSuccess: true
                    }));
                })
                .catch((err: Error) => {
                    setMassDownloadRekap((prevState) => ({
                        ...prevState,
                        onSubmit: false,
                        onProcess: false,
                        onError: true,
                        errMsg: err.message
                    }));
                });
        } catch (err: unknown) {
            notifyToast('error', 'Gagal menghubungi server');
        }
    };

    return (
        <>
            <Head title="Admin - Manajemen Pegawai" />
            <AdminLayout auth={auth}>
                <Card className="h-full w-full" shadow={false}>
                    <CardHeader floated={ false } shadow={ false } className="rounded-none">
                        <div className="mb-8 flex flex-col lg:flex-row items-start justify-between gap-3">
                            <div>
                                <Typography variant="h5" color="blue-gray" className="text-2xl">
                                    Daftar Pegawai
                                </Typography>
                                <Typography color="gray" className="mt-1 font-normal">
                                    Informasi mengenai Pegawai yang terdaftar
                                </Typography>
                                <div className="my-3">
                                    <TableFilterBy
                                        golongans={golongans}
                                        marhalahs={marhalahs}
                                        statusPegawais={statusPegawais}
                                    />
                                </div>
                            </div>
                            <div className="w-full lg:w-72 flex flex-col justify-end gap-2">
                                <ViewPerPageList preserveState={false}/>
                                <SearchInput/>
                            </div>
                        </div>
                        <Menu placement="left-start">
                            <MenuHandler>
                                <Button
                                    variant="filled"
                                    disabled={ false }
                                    ripple={false}
                                    className="ml-auto flex items-center gap-1.5 capitalize font-medium text-base order-last !py-2 !px-3.5 bg-pph-green-deep hover:!bg-pph-green-deep/80 disabled:!bg-pph-green-deep/80"
                                >
                                    <ListChecks />
                                    Opsi
                                </Button>
                            </MenuHandler>
                            <MenuList>
                                <MenuItem
                                    className="flex flex-row items-center gap-1.5 font-medium text-sm"
                                    onClick={ handleMassDownloadRekap }
                                >
                                    <NotebookText/>
                                    <span>Rekap Pegawai (zip)</span>
                                </MenuItem>
                                <MenuItem
                                    className="flex flex-row items-center gap-1.5 font-medium text-sm"
                                    onClick={ () => console.log('buku') }
                                    disabled={ true }
                                >
                                    <BookOpen/>
                                    <span>Buku Panduan</span>
                                </MenuItem>
                            </MenuList>
                        </Menu>
                    </CardHeader>
                    <CardBody className="overflow-auto px-0">
                        <table className="mt-4 w-full min-w-max table-auto text-left">
                            <thead>
                            <tr>
                                <th className="bg-pph-green-deep px-2 rounded-l-md">
                                    <div
                                        className="flex items-center justify-between gap-2 font-normal leading-none opacity-70">
                                        <Checkbox
                                            size={ 4 }
                                            checked={ pegawaisChecked.length === pagination.data.length }
                                            onChange={ () => {
                                                setPegawaisChecked((prevState) => prevState.length < 1 ? pagination.data.map((data) => ({
                                                    id: data.id,
                                                    nama: data.nama,
                                                    amanah: data.amanah
                                                })) : [])
                                            } }
                                            className="checked:bg-white checked:border-white checked:before:bg-white hover:checked:bg-white focus:checked:bg-white"
                                            containerProps={ {
                                                className: '*:!text-black *:!font-bold'
                                            } }
                                        />
                                    </div>
                                </th>
                                { TABLE_HEAD.map((head) => (
                                    <th
                                        key={ head }
                                        className="first:rounded-l-md last:rounded-r-md bg-pph-green-deep p-4"
                                    >
                                        <Typography
                                            variant="small"
                                            color="white"
                                            className="flex items-center justify-between gap-2 font-semibold leading-none !text-white"
                                        >
                                            { head }
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
                                             amanah,
                                             tanggal_promosi,
                                             tanggal_marhalah,
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
                                                <tr key={ id } className="even:bg-gray-100">
                                                    <td className={ ` w-min ${ index === 0 ? '!p-0 !py-4' : '' }` }>
                                                        <Typography
                                                            variant="small"
                                                            color="blue-gray"
                                                            className="font-normal flex items-center justify-center"
                                                            as="div"
                                                        >
                                                            <Checkbox
                                                                size={ 4 }
                                                                checked={ !!pegawaisChecked.find((pegawai) => pegawai.id === id) }
                                                                onChange={ () => handleSetCheckPegawai(id, nama, amanah) }
                                                                className="checked:bg-green-500 checked:border-green-500 checked:before:bg-green-500 hover:checked:bg-green-500 focus:checked:bg-green-500"
                                                                containerProps={ {
                                                                    className: '*:!text-white *:!font-bold'
                                                                } }
                                                            />
                                                        </Typography>
                                                    </td>
                                                    <td className={ `${ classes } w-3` }>
                                                        <Typography
                                                            variant="small"
                                                            color="blue-gray"
                                                            className="font-normal text-center"
                                                        >
                                                            { pagination.from + index }
                                                        </Typography>
                                                    </td>
                                                    <td className={ `${ classes } min-w-52` }>
                                                        <div className="flex items-center gap-3">
                                                            <Typography
                                                                variant="small"
                                                                color="blue-gray"
                                                                className="font-normal"
                                                            >
                                                                { nip }
                                                            </Typography>
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
                                                    <td className={ `${ classes } min-w-48` }>
                                                        <div className="flex flex-col items-start gap-3">
                                                            <Typography
                                                                variant="small"
                                                                color="blue-gray"
                                                                className="font-normal"
                                                            >
                                                                { amanah }
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
                                                    <td className={ `${ classes } min-w-44` }>
                                                        <div className="flex items-start gap-3">
                                                            <Typography
                                                                variant="small"
                                                                color="blue-gray"
                                                                className="font-normal"
                                                            >
                                                                { golongan?.nama ?? '-' }
                                                            </Typography>
                                                        </div>
                                                    </td>
                                                    <td className={ `${ classes } min-w-44` }>
                                                        <div className="flex flex-col gap-1">
                                                            <Typography
                                                                variant="small"
                                                                color="blue-gray"
                                                                className="font-normal"
                                                            >
                                                                { marhalah?.nama ?? '-' }
                                                            </Typography>
                                                            <Typography
                                                                variant="small"
                                                                color="blue-gray"
                                                                className="font-medium text-xs italic tracking-wider"
                                                            >
                                                                ({ tanggal_marhalah ? calculateDatePast(new Date(tanggal_marhalah), new Date(currDate)) : '-' })
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
                                                                { tanggal_promosi ? format(tanggal_promosi, 'PPPP', { locale: localeID }) : '-' }
                                                            </Typography>
                                                            <Typography
                                                                variant="small"
                                                                color="blue-gray"
                                                                className="font-medium text-xs italic tracking-wider"
                                                            >
                                                                ({ tanggal_promosi ? calculateDatePast(new Date(tanggal_promosi), new Date(currDate)) : 'belum ada keterangan' })
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
                                                                <Link
                                                                    href={ route('admin.pegawai.details', { q: id }) }>
                                                                    <IconButton variant="text">
                                                                        <FileSearch className="h-5 w-5 text-blue-800"/>
                                                                    </IconButton>
                                                                </Link>
                                                            </Tooltip>
                                                            <Menu placement="left-start" allowHover={ true }>
                                                                <MenuHandler>
                                                                    <IconButton
                                                                        variant="text"
                                                                        disabled={ onDownloadPDF }
                                                                    >
                                                                        <Download className="h-5 w-5"/>
                                                                    </IconButton>
                                                                </MenuHandler>
                                                                <MenuList>
                                                                    <MenuItem
                                                                        className="flex flex-row items-center gap-1.5 font-medium text-sm"
                                                                        onClick={ (() => downloadSingleRekap(index)) }>
                                                                        <NotebookText/>
                                                                        <span>Rekap Pegawai</span>
                                                                    </MenuItem>
                                                                    <MenuItem
                                                                        className="flex flex-row items-center gap-1.5 font-medium text-sm"
                                                                        onClick={ (() => downloadSingleRekap(index)) }
                                                                        disabled={ true }>
                                                                        <BookOpen/>
                                                                        <span>Buku Panduan</span>
                                                                    </MenuItem>
                                                                </MenuList>
                                                            </Menu>
                                                        </div>
                                                    </td>
                                                </tr>
                                            );
                                        },
                                    ) : (
                                        <tr>
                                            <td colSpan={ TABLE_HEAD.length }>
                                                <div className="h-16 flex items-center justify-center text-gray-600">
                                                    Tidak ada data Pegawai untuk ditampilkan
                                                </div>
                                            </td>
                                        </tr>
                                    )
                            }
                            </tbody>
                        </table>
                    </CardBody>
                    <CardFooter className="flex items-center justify-center border-t border-blue-gray-50 p-4">
                        <Pagination paginateItems={ pagination }/>
                    </CardFooter>
                </Card>

                <Dialog open={ massDownloadRekap.openDialog } handler={ () => setMassDownloadRekap((prevState) => ({ ...prevState, openDialog: prevState.openDialog })) } className="p-4">
                    <DialogHeader className="relative m-0 block">
                        <Typography variant="h4" color="blue-gray">
                            Buat Rekap Pegawai
                        </Typography>
                        <Typography className="mt-1 font-medium text-gray-700">
                            Mohon tunggu, Dokumen sedang diproses...
                        </Typography>
                        <IconButton
                            size="sm"
                            variant="text"
                            className="!absolute right-3.5 top-3.5 flex items-center justify-center"
                            onClick={ () => setMassDownloadRekap(massDownloadRekapInit) }
                            disabled={ massDownloadRekap.onProcess || massDownloadRekap.onSubmit }
                        >
                            <X width={18} />
                        </IconButton>
                    </DialogHeader>
                    <DialogBody>
                        <div className="w-full">
                            <div className="mb-2 flex items-center justify-between gap-4">
                                <Typography
                                    color="blue-gray"
                                    variant="small"
                                    className="font-semibold"
                                >
                                    { massDownloadRekap.onSubmit ? 'Mengambil data dari server...' : 'Memproses data...' }
                                </Typography>
                                <Typography
                                    variant="small"
                                    className="font-semibold text-gray-600"
                                >
                                    { ((massDownloadRekap.fileProgress / pegawaisChecked.length) * 100).toFixed(2) }%
                                </Typography>
                            </div>
                            <Progress
                                value={ (massDownloadRekap.fileProgress / pegawaisChecked.length) * 100 }/>
                        </div>
                        <div className="mt-6 flex gap-16">
                            <div>
                                <Typography className="font-normal text-gray-600">
                                    Nama File
                                </Typography>
                                <Typography color="blue-gray" className="font-semibold">
                                    { massDownloadRekap.fileName }.zip
                                </Typography>
                            </div>
                            <div>
                                <Typography className="font-normal text-gray-600">
                                    Ukuran File
                                </Typography>
                                <Typography color="blue-gray" className="font-semibold">
                                    { (massDownloadRekap.fileSize / (1024 * 1024)).toFixed(2) } MB
                                </Typography>
                            </div>
                        </div>
                        <div className="mt-6 -mb-3 flex flex-col items-center justify-center">
                            <Typography variant="paragraph" className="font-medium min-h-4" color="red">
                                { massDownloadRekap.errMsg }
                            </Typography>
                            <Button
                                className="!shadow-none mx-auto"
                                onClick={ () => setMassDownloadRekap(massDownloadRekapInit) }
                                disabled={ !massDownloadRekap.onSuccess || massDownloadRekap.onError }
                            >
                                Tutup
                            </Button>
                        </div>
                    </DialogBody>
                </Dialog>
            </AdminLayout>
        </>
    );
}
