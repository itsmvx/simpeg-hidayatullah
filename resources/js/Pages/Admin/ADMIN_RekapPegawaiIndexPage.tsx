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
    Tooltip,
    Typography
} from "@material-tailwind/react";
import { CircleCheck, CircleX, FileSearch, Plus, Trash2 } from "lucide-react";
import { IDNamaColumn, PageProps, PaginationData } from "@/types";
import { Head, Link, router } from "@inertiajs/react";
import { format } from "date-fns";
import { id as localeID } from "date-fns/locale/id";
import { useState } from "react";
import axios, { AxiosError } from "axios";
import Pagination from "@/Components/Pagination";
import { AdminLayout } from "@/Layouts/AdminLayout";
import { notifyToast } from "@/Lib/Utils";
import { TableFilterBy } from "@/Components/TableFilterBy";
import { ViewPerPageList } from "@/Components/ViewPerPageList";
import { SearchInput } from "@/Components/SearchInput";


type Rekaps = {
    id: string;
    amanah: string;
    terverifikasi: 0 | 1;
    unit_id: string;
    pegawai_id: string;
    status_pegawai_id: string;
    marhalah_id: string;
    golongan_id: string;
    periode_rekap_id: string;
    created_at: string;
    pegawai: IDNamaColumn;
    status_pegawai: IDNamaColumn;
    marhalah: IDNamaColumn;
    golongan: IDNamaColumn;
    periode_rekap: IDNamaColumn;
}[];

export default function ADMIN_RekapPegawaiIndexPage({ auth, marhalahs, golongans, statusPegawais, pagination }: PageProps<{
    unverifiedCount: number;
    marhalahs: IDNamaColumn[];
    golongans: IDNamaColumn[];
    statusPegawais: IDNamaColumn[];
    pagination: PaginationData<Rekaps>;
}>) {

    const TABLE_HEAD = ['No', 'Pegawai', 'Periode', 'Amanah', 'Status Pegawai', 'Golongan', 'Marhalah','Status Verifikasi', 'Tanggal pelaporan', 'Aksi'];

    const deleteDialogInit = {
        open: false,
        rekapId: '',
    };
    const [ deleteDialog, setDeleteDialog ] = useState<{
        open: boolean;
        rekapId: string;
    }>(deleteDialogInit);
    const [ onSubmitDelete, setOnSubmitDelete ] = useState(false);
    const handleOpenDelete = () => setDeleteDialog((prevState) => ({
        ...prevState,
        open: true
    }));

    const handleDeleteRekap = () => {
        setOnSubmitDelete(true);
        axios.post(route('rekap-pegawai.delete'), {
            id: deleteDialog.rekapId,
        })
            .then(() => {
                notifyToast('success', 'Rekap Pegawai terpilih berhasil dihapus!');
                setDeleteDialog(deleteDialogInit);
                router.reload({ only: [ 'pagination' ]});
            })
            .catch((err: unknown) => {
                const errMsg = err instanceof AxiosError
                    ? err?.response?.data.message ?? 'Error tidak diketahui terjadi'
                    : 'Error tidak diketahui terjadi';
                notifyToast('error', errMsg);
            })
            .finally(() => setOnSubmitDelete(false));
    };

    return (
        <>
            <Head title="Admin - Rekap Pegawai" />
            <AdminLayout auth={auth}>
                <Card className="h-full w-full" shadow={false}>
                    <CardHeader floated={ false } shadow={ false } className="rounded-none">
                        <div className="mb-8 flex flex-col lg:flex-row items-start justify-between gap-3">
                            <div>
                                <Typography variant="h5" color="blue-gray">
                                    Daftar Rekap Pegawai
                                </Typography>
                                <Typography color="gray" className="mt-1 font-normal">
                                    Informasi mengenai Rekap Pegawai yang terdaftar
                                </Typography>
                                <div className="my-3">
                                    <TableFilterBy
                                        golongans={ golongans }
                                        marhalahs={ marhalahs }
                                        statusPegawais={ statusPegawais }
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
                                        router.visit(route('admin.rekap-pegawai.create'));
                                    } }
                                    className="flex items-center gap-1.5 capitalize font-medium text-base" size="sm"
                                >
                                    <Plus/>
                                    Tambahkan Rekap baru
                                </Button>
                            </div>
                        </div>
                    </CardHeader>
                    <CardBody className="overflow-auto px-0">
                        <table className="mt-4 w-full min-w-max table-auto text-left">
                            <thead>
                            <tr>
                                { TABLE_HEAD.map((head) => (
                                    <th
                                        key={ head }
                                        className="border-y border-blue-gray-100 bg-blue-gray-50/50 p-4"
                                    >
                                        <Typography
                                            variant="small"
                                            color="blue-gray"
                                            className="flex items-center justify-between gap-2 font-normal leading-none opacity-70"
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
                                         amanah,
                                         terverifikasi,
                                         pegawai,
                                         status_pegawai,
                                         golongan,
                                         marhalah,
                                         periode_rekap,
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
                                                <td className={ `${ classes } min-w-56` }>
                                                    <div className="flex items-center gap-3">
                                                        <div className="flex flex-col">
                                                            <Typography
                                                                variant="small"
                                                                color="blue-gray"
                                                                className="font-normal"
                                                            >
                                                                { pegawai.nama }
                                                            </Typography>
                                                        </div>
                                                    </div>
                                                </td>
                                                <td className={ `${ classes } min-w-40` }>
                                                    <div className="flex items-center gap-3">
                                                        <div className="flex flex-col">
                                                            <Typography
                                                                variant="small"
                                                                color="blue-gray"
                                                                className="font-normal"
                                                            >
                                                                { periode_rekap.nama }
                                                            </Typography>
                                                        </div>
                                                    </div>
                                                </td>
                                                <td className={ `${ classes } min-w-40` }>
                                                    <div className="flex items-center gap-3">
                                                        <div className="flex flex-col">
                                                            <Typography
                                                                variant="small"
                                                                color="blue-gray"
                                                                className="font-normal"
                                                            >
                                                                { amanah }
                                                            </Typography>
                                                        </div>
                                                    </div>
                                                </td>
                                                <td className={ `${ classes } min-w-44` }>
                                                    <div className="flex items-center gap-3">
                                                        <div className="flex flex-col">
                                                            <Typography
                                                                variant="small"
                                                                color="blue-gray"
                                                                className="font-normal"
                                                            >
                                                                { status_pegawai.nama }
                                                            </Typography>
                                                        </div>
                                                    </div>
                                                </td>
                                                <td className={ `${ classes } min-w-40` }>
                                                    <div className="flex items-center gap-3">
                                                        <Typography
                                                            variant="small"
                                                            color="blue-gray"
                                                            className="font-normal"
                                                        >
                                                            { golongan.nama }
                                                        </Typography>
                                                    </div>
                                                </td>
                                                <td className={ `${ classes } min-w-40` }>
                                                    <div className="flex items-center gap-3">
                                                        <Typography
                                                            variant="small"
                                                            color="blue-gray"
                                                            className="font-normal"
                                                        >
                                                            { marhalah.nama }
                                                        </Typography>
                                                    </div>
                                                </td>
                                                <td className={ `${ classes } min-w-52` }>
                                                    <div className="flex items-center justify-start text-sm">
                                                        { Boolean(terverifikasi)
                                                            ? (
                                                                <p className="flex gap-1 font-medium text-gray-600/90 italic">
                                                                    Sudah Terverifikasi
                                                                    <CircleCheck className="text-green-500"/>
                                                                </p>
                                                            )
                                                            : (
                                                                <p className="flex gap-1 font-medium text-gray-600/90 italic">
                                                                    Belum Terverifikasi
                                                                    <CircleX className="text-red-600"/>
                                                                </p>
                                                            )
                                                        }
                                                    </div>
                                                </td>
                                                <td className={ `${ classes } min-w-40` }>
                                                    <Typography
                                                        variant="small"
                                                        color="blue-gray"
                                                        className="font-normal"
                                                    >
                                                        { format(created_at, 'PPPPpp', {
                                                            locale: localeID
                                                        }) }
                                                    </Typography>
                                                </td>
                                                <td className={ classes }>
                                                    <div className="w-32 flex gap-2.5 items-center justify-start">
                                                        <Tooltip content="Detail">
                                                            <Link
                                                                href={ route('admin.rekap-pegawai.details', { q: pagination.data[index].id }) }>
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
                                                                        rekapId: id,
                                                                    }))
                                                                } }
                                                            >
                                                                <Trash2 className="h-5 w-5 text-red-600"/>
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
                                                Belum ada data Rekap Pegawai
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

                <Dialog open={ deleteDialog.open } handler={ handleOpenDelete }>
                    <DialogHeader className="text-gray-900">
                        Hapus Rekap terpilih?
                    </DialogHeader>
                    <DialogBody>
                        <div className="p-3 border border-gray-300 rounded bg-gray-100">
                            <Typography variant="h6" className="text-gray-900 truncate">
                                Anda akan menghapus
                                Rekap Pegawai:&nbsp;
                                <span className="font-bold">
                                    " { pagination.data.find((rekap) => rekap.id === deleteDialog.rekapId)?.pegawai.nama ?? '-' } "
                                </span>
                            </Typography>
                            <Typography variant="h6" className="text-gray-900 truncate">
                               Untuk Periode:&nbsp;
                                <span className="font-bold">
                                    { pagination.data.find((rekap) => rekap.id === deleteDialog.rekapId)?.periode_rekap.nama ?? '-' }
                                </span>
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
                        <Button color="red" onClick={ handleDeleteRekap } loading={onSubmitDelete} className="flex justify-items-center">
                            <span>Hapus</span>
                        </Button>
                    </DialogFooter>
                </Dialog>
            </AdminLayout>
        </>
    );
}
