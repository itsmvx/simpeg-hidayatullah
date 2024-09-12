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
import {
    Check,
    FileSearch,
    Plus,
    Trash2,
    X
} from "lucide-react";
import { IDNamaColumn, PageProps, PaginationData } from "@/types";
import { MasterLayout } from "@/Layouts/MasterLayout";
import { Head, Link, router } from "@inertiajs/react";
import { format } from "date-fns";
import { id as localeID } from "date-fns/locale/id";
import { useState } from "react";
import { toast } from "react-toastify";
import axios, { AxiosError, AxiosProgressEvent } from "axios";
import Pagination from "@/Components/Pagination";
import { notifyToast } from "@/Lib/Utils";
import { TableFilterBy } from "@/Components/TableFilterBy";
import { ViewPerPageList } from "@/Components/ViewPerPageList";
import { SearchInput } from "@/Components/SearchInput";

type RekapPegawai = {
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
    unit: IDNamaColumn;
    pegawai: IDNamaColumn;
    status_pegawai: IDNamaColumn;
    marhalah: IDNamaColumn;
    golongan: IDNamaColumn;
    periode_rekap: IDNamaColumn;
};

export default function MASTER_RekapPegawaiIndexPage({ auth, marhalahs, golongans, statusPegawais, units, pagination, }: PageProps<{
    marhalahs: IDNamaColumn[];
    golongans: IDNamaColumn[];
    statusPegawais: IDNamaColumn[];
    units: IDNamaColumn[];
    pagination: PaginationData<RekapPegawai[]>;
}>) {
    const TABLE_HEAD = ['No', 'Unit', 'Pegawai', 'Periode', 'Amanah', 'Status Pegawai', 'Golongan', 'Marhalah', 'Status Verifikasi', 'Tanggal pelaporan', 'Aksi'];

    const deleteDialogInit = {
        open: false,
        rekapId: '',
    };
    const [ deleteDialog, setDeleteDialog ] = useState<{
        open: boolean;
        rekapId: string;
    }>(deleteDialogInit);
    const [ onSubmitDelete, setOnSubmitDelete ] = useState(false);

    const switchStatusInit = {
        onSubmit: false,
        rekapId: '',
    };
    const [ switchStatus, setSwitchStatus ] = useState<{
        onSubmit: boolean;
        rekapId: string;
    }>(switchStatusInit);

    const handleSwitchStatus = (id: string) => {
        setSwitchStatus((prevState) => ({
            ...prevState,
            onSubmit: true,
            rekapId: id
        }));
        let progress: number = 0;
        const toastId = toast.loading("Mengirim permintaan ke server..");
        axios.post(route('rekap-pegawai.update-status'), {
            id: id
        }, {
            onUploadProgress: (p: AxiosProgressEvent) => {
                progress = p.loaded / (p.total ?? 100);
                toast.update(toastId, { type: "info", isLoading: true, progress: progress - 0.01 });
            }
        })
            .then(() => {
                router.reload({
                    only: ['pagination'],
                    onStart: () => {
                        toast.update(toastId, { type: "info", isLoading: true, progress: progress - 0.01, render: 'Memperbarui data dari Server..' });
                    },
                    onFinish: () => {
                        toast.update(toastId, { type: "success", isLoading: false, progress: 1 });
                        notifyToast('success', 'Berhasil memperbarui status Rekap Pegawai');
                        setSwitchStatus(switchStatusInit);
                    }
                });
            })
            .catch(() => {
                notifyToast('error', 'Server gagal memproses permintaan');
                setSwitchStatus(switchStatusInit);
            });
    };

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
            <Head title="Master - Rekap Pegawai" />
            <MasterLayout auth={auth}>
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
                                        router.visit(route('master.rekap-pegawai.create'));
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
                                { TABLE_HEAD.map((head, index) => (
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
                                         unit,
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
                                                            { unit.nama }
                                                        </Typography>
                                                    </div>
                                                </td>
                                                <td className={ `${ classes } min-w-56` }>
                                                    <div className="flex items-center gap-3">
                                                        <Typography
                                                            variant="small"
                                                            color="blue-gray"
                                                            className="font-normal"
                                                        >
                                                            { pegawai.nama }
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
                                                            { periode_rekap.nama }
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
                                                            { amanah }
                                                        </Typography>
                                                    </div>
                                                </td>
                                                <td className={ `${ classes } min-w-44` }>
                                                    <div className="flex items-center gap-3">
                                                        <Typography
                                                            variant="small"
                                                            color="blue-gray"
                                                            className="font-normal"
                                                        >
                                                            { status_pegawai.nama }
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
                                                <td className={ `${ classes } min-w-36` }>
                                                    <div className="flex items-center justify-center">
                                                        <button
                                                            onClick={ () => handleSwitchStatus(id) }
                                                            className="group w-14 h-4 rounded-full bg-gray-100 flex items-center transition duration-300 focus:outline-none shadow"
                                                            disabled={ switchStatus.onSubmit }
                                                            data-verified={ Boolean(terverifikasi) }
                                                        >
                                                            <div
                                                                className={ `w-8 h-8 relative rounded-full transition duration-150 text-white transform translate-x-0 group-data-[verified=true]:translate-x-full p-1 ${ Boolean(terverifikasi) ? 'bg-green-400' : 'bg-red-500' } border border-gray-200 flex items-center justify-center` }>
                                                                {
                                                                    switchStatus.onSubmit && switchStatus.rekapId === id
                                                                        ? (
                                                                            <div
                                                                                className="w-3.5 h-3.5 rounded-full border-2 border-white animate-spin border-r-transparent"/>
                                                                        )
                                                                        : Boolean(terverifikasi)
                                                                            ? <Check/>
                                                                            : <X/>
                                                                }
                                                            </div>
                                                        </button>
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
                                                                href={ route('master.rekap-pegawai.details', { q: pagination.data[index].id }) }>
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
                                                Tidak ada data Rekap Pegawai untuk ditampilkan
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
            </MasterLayout>
        </>
    );
}
