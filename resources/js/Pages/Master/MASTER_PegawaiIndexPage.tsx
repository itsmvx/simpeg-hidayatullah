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
    IconButton, Menu, MenuHandler, MenuItem, MenuList,
    Tooltip,
    Typography
} from "@material-tailwind/react";
import { BookOpen, Download, FileSearch, FileUp, Handshake, NotebookText, Plus, Trash2 } from "lucide-react";
import { IDNamaColumn, JenisKelamin,  PageProps, PaginationData } from "@/types";
import { MasterLayout } from "@/Layouts/MasterLayout";
import { Head, Link, router } from "@inertiajs/react";
import { format } from "date-fns";
import { id as localeID } from "date-fns/locale/id";
import { useState } from "react";
import { toast } from "react-toastify";
import axios, { AxiosError, AxiosProgressEvent } from "axios";
import Pagination from "@/Components/Pagination";
import { calculateDatePast, notifyToast } from "@/Lib/Utils";
import { z } from "zod";
import CV_PDFGenerator, { PegawaiExportCV } from "@/Lib/Generate_Dokumen/RekapPegawai";
import { pdf } from "@react-pdf/renderer";
import { saveAs } from "file-saver";
import { ViewPerPageList } from "@/Components/ViewPerPageList";
import { SearchInput } from "@/Components/SearchInput";
import { TableFilterBy } from "@/Components/TableFilterBy";

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

export default function MASTER_PegawaiIndexPage({ auth, marhalahs, golongans, statusPegawais, units, pagination, currDate }: PageProps<{
    pagination: PaginationData<Pegawais>;
    golongans: IDNamaColumn[];
    marhalahs: IDNamaColumn[];
    statusPegawais: IDNamaColumn[];
    units: IDNamaColumn[];
    currDate: string;
}>) {
    const TABLE_HEAD = ['No','NIP', 'Nama', 'Jenis Kelamin', 'Unit', 'Amanah', 'Status Pegawai', 'Golongan', 'Marhalah', 'Promosi Terakhir', 'Tanggal daftar', 'Aksi'];

    const deleteDialogInit = {
        open: false,
        pegawaiId: '',
    };
    const [ deleteDialog, setDeleteDialog ] = useState<{
        open: boolean;
        pegawaiId: string;
    }>(deleteDialogInit);
    const [ onSubmitDelete, setOnSubmitDelete ] = useState(false);
    const [ onDownloadPDF, setOnDownloadPDF ] = useState<boolean>(false);
    const handleOpenDelete = () => setDeleteDialog((prevState) => ({
        ...prevState,
        open: true
    }));

    const handleDeletePegawai = () => {
        setOnSubmitDelete(true);
        const { pegawaiId } = deleteDialog

        setDeleteDialog((prevState) => ({
            ...prevState,
            onSubmit: true
        }));
        const pegawaischema = z.object({
            id: z.string().min(1, { message: "Pegawai belum terpilih" }),
        });
        const zodUnitResult = pegawaischema.safeParse({
            id: pegawaiId,
        });
        if (!zodUnitResult.success) {
            const errorMessages = zodUnitResult.error.issues[0].message;
            notifyToast('error', errorMessages);
        }

        axios.post(route('pegawai.delete'), {
            id: pegawaiId
        })
            .then(() => {
                notifyToast('success', 'Pegawai berhasil dihapus!');
                router.reload({ only: ['pagination'] });
            })
            .catch((err: unknown) => {
                const errMsg: string = err instanceof AxiosError
                    ? err.response?.data.message ?? 'Error tidak diketahui terjadi!'
                    : 'Error tidak diketahui terjadi!'
                notifyToast('error', errMsg);
            })
            .finally(() => {
                setDeleteDialog((prevState) => ({ ...prevState, onSubmit: false, open: false }));
            });
    };

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
            <Head title="Master - Pegawai" />
            <MasterLayout auth={auth}>
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
                                        units={units}
                                    />
                                </div>
                            </div>
                            <div className="w-full lg:w-72 flex flex-col justify-end gap-2">
                                <ViewPerPageList/>
                                <SearchInput/>
                            </div>
                        </div>
                        <div className="w-full flex flex-row-reverse justify-between gap-4">
                            <div className="flex flex-col shrink-0 gap-2 lg:flex-row">
                                <Button
                                    onClick={ () => {
                                        router.visit(route('master.pegawai.create-upload'));
                                    } }
                                    className="flex items-center gap-1.5 capitalize font-medium text-base hover:bg-[linear-gradient(to_top,#38bdf8_10%,#FFFFFF_90%)] hover:text-black" size="sm"
                                >
                                    <FileUp />
                                    Upload File
                                </Button>
                                <Button
                                    onClick={ () => {
                                        router.visit(route('master.pegawai.create'));
                                    } }
                                    className="flex items-center gap-1.5 capitalize font-medium text-base hover:bg-[linear-gradient(to_top,#4CAF50_10%,#FFFFFF_90%)] hover:text-black" size="sm"
                                >
                                    <Plus/>
                                    Tambahkan Pegawai baru
                                </Button>
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
                                        className="border-y border-blue-gray-100 bg-[#1f1e33] p-4"
                                    >
                                        <Typography
                                            variant="small"
                                            color="white"
                                            className="flex items-center justify-between gap-2 font-normal leading-none font-bold"
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
                                             unit,
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
                                                    <td className={ `${ classes } w-3 ` }>
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
                                                    <td className={ `${ classes } min-w-52` }>
                                                        <div className="flex items-center gap-3">
                                                            <Link as="button" href={ route('master.unit.details') }
                                                                  data={ { q: unit?.id ?? '' } }
                                                                  className="text-sm font-normal hover:text-blue-600 disabled:italic"
                                                                  disabled={ !unit }>
                                                                { unit ? unit.nama : 'Tidak terdaftar' }
                                                            </Link>
                                                        </div>
                                                    </td>
                                                    <td className={ `${ classes } min-w-52` }>
                                                        <div className="flex flex-col items-start gap-3">
                                                            <Typography
                                                                variant="small"
                                                                color="blue-gray"
                                                                className={ `font-normal` }
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
                                                                    href={ route('master.pegawai.details', { q: id }) }
                                                                    preserveState>
                                                                    <IconButton variant="text">
                                                                        <FileSearch className="h-5 w-5 text-blue-800"/>
                                                                    </IconButton>
                                                                </Link>
                                                            </Tooltip>
                                                            <Tooltip content="Hapus" className="bg-red-400">
                                                                <IconButton
                                                                    variant="text"
                                                                    onClick={ () => {
                                                                        setDeleteDialog((prevState) => ({
                                                                            ...prevState,
                                                                            open: true,
                                                                            pegawaiId: id,
                                                                        }))
                                                                    } }
                                                                >
                                                                    <Trash2 className="h-5 w-5 text-red-600"/>
                                                                </IconButton>
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
                                                                        onClick={ (() => downloadPDF(index)) }>
                                                                        <NotebookText/>
                                                                        <span>Rekap Pegawai</span>
                                                                    </MenuItem>
                                                                    <MenuItem
                                                                        className="flex flex-row items-center gap-1.5 font-medium text-sm"
                                                                        onClick={ (() => downloadPDF(index)) }>
                                                                        <Handshake/>
                                                                        <span>Kontrak Kerja</span>
                                                                    </MenuItem>
                                                                    <MenuItem
                                                                        className="flex flex-row items-center gap-1.5 font-medium text-sm"
                                                                        onClick={ (() => downloadPDF(index)) }
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
                    <CardFooter className="flex items-center justify-center border-t border-blue-gray-50 py-3.5 px-2">
                        <Pagination paginateItems={ pagination }/>
                    </CardFooter>
                </Card>
                <Dialog open={ deleteDialog.open } handler={ handleOpenDelete }>
                    <DialogHeader className="text-gray-900">
                        Hapus Pegawai terpilih?
                    </DialogHeader>
                    <DialogBody>
                        <div className="p-3 border border-gray-300 rounded bg-gray-100">
                            <Typography variant="h6" className="text-gray-900 truncate">
                                Anda akan menghapus
                                Pegawai Pegawai:&nbsp;
                                <span className="font-bold">
                                    " { pagination.data.find((pegawai) => pegawai.id === deleteDialog.pegawaiId)?.nama ?? '-' } "
                                </span>
                            </Typography>
                            <Typography variant="h6" className="text-gray-900">
                                Semua Rekap Pegawai ini juga akan dihapus
                            </Typography>
                        </div>
                    </DialogBody>
                    <DialogFooter>
                        <Button
                            color="black"
                            onClick={ () => setDeleteDialog(deleteDialogInit) }
                            className="mr-1"
                        >
                            <span>Batal</span>
                        </Button>
                        <Button color="red" onClick={ handleDeletePegawai } loading={onSubmitDelete} className="flex justify-items-center">
                            <span>Hapus</span>
                        </Button>
                    </DialogFooter>
                </Dialog>
            </MasterLayout>
        </>
    );
}
