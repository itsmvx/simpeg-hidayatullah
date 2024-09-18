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
import { CircleCheck, CircleX, FileSearch, Trash2 } from "lucide-react";
import { IDNamaColumn, JenisPengajuanPromosi, PageProps, PaginationData, StatusPengajuanPromosi } from "@/types";
import { Head, Link, router } from "@inertiajs/react";
import { format } from "date-fns";
import { id as localeID } from "date-fns/locale/id";
import { useState } from "react";
import axios, { AxiosError } from "axios";
import Pagination from "@/Components/Pagination";
import { notifyToast } from "@/Lib/Utils";
import { TableFilterBy } from "@/Components/TableFilterBy";
import { ViewPerPageList } from "@/Components/ViewPerPageList";
import { SearchInput } from "@/Components/SearchInput";
import { MasterLayout } from "@/Layouts/MasterLayout";

type PengajuanPromosis = {
    id: string;
    nama: string;
    jenis: string | null;
    asal: IDNamaColumn | null;
    akhir: IDNamaColumn | null;
    asal_type: JenisPengajuanPromosi;
    akhir_type: JenisPengajuanPromosi;
    pegawai: IDNamaColumn;
    unit: IDNamaColumn;
    admin: IDNamaColumn | null;
    admin_penyetuju: IDNamaColumn | null;
    created_at: string;
    status_pengajuan: StatusPengajuanPromosi
}[];

export default function MASTER_PengajuanPromosiIndexPage({ auth, marhalahs, golongans, statusPegawais, units, pagination }: PageProps<{
    marhalahs: IDNamaColumn[];
    golongans: IDNamaColumn[];
    statusPegawais: IDNamaColumn[];
    units: IDNamaColumn[];
    pagination: PaginationData<PengajuanPromosis>;
}>) {

    const TABLE_HEAD = ['No', 'Unit Pelapor', 'Pegawai', 'Jenis Promosi', 'Admin Pelapor', 'Status Pengajuan', 'Disetujui oleh', 'Tanggal pelaporan', 'Aksi'];

    const deleteDialogInit = {
        open: false,
        pengajuanPromosiId: '',
    };
    const [ deleteDialog, setDeleteDialog ] = useState<{
        open: boolean;
        pengajuanPromosiId: string;
    }>(deleteDialogInit);
    const [ onSubmitDelete, setOnSubmitDelete ] = useState(false);

    const handleOpenDelete = () => setDeleteDialog((prevState) => ({
        ...prevState,
        open: true
    }));
    const handleDeletePengajuanPromosi = () => {
        setOnSubmitDelete(true);
        axios.post(route('pengajuan-promosi.delete'), {
            id: deleteDialog.pengajuanPromosiId,
        })
            .then(() => {
                notifyToast('success', 'Pengajuan Promosi terpilih berhasil dihapus!');
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
            <Head title="Master - Pengajuan Promosi Pegawai" />
            <MasterLayout auth={auth}>
                <Card className="h-full w-full" shadow={false}>
                    <CardHeader floated={ false } shadow={ false } className="rounded-none">
                        <div className="mb-8 flex flex-col lg:flex-row items-start justify-between gap-3">
                            <div>
                                <Typography variant="h5" color="blue-gray" className="text-2xl">
                                    Daftar Pengajuan Promosi Pegawai
                                </Typography>
                                <Typography color="gray" className="mt-1 font-normal">
                                    Informasi mengenai Pengajuan Promosi yang terdaftar
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
                    </CardHeader>
                    <CardBody className="overflow-auto px-0">
                    <table className="mt-4 w-full min-w-max table-auto text-left">
                            <thead>
                            <tr>
                                { TABLE_HEAD.map((head, index) => (
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
                                         asal,
                                         akhir,
                                         jenis,
                                         pegawai,
                                         unit,
                                         admin,
                                         admin_penyetuju,
                                         status_pengajuan,
                                         created_at
                                     }, index) => {
                                        const isLast = index === pagination.data.length - 1;
                                        const classes = isLast
                                            ? "p-4"
                                            : "p-4 border-b border-blue-gray-50";

                                        return (
                                            <tr key={ id } className="even:bg-gray-100">
                                                <td className={ `${ classes } w-3` }>
                                                    <Typography
                                                        variant="small"
                                                        color="blue-gray"
                                                        className="font-normal text-center"
                                                    >
                                                        { pagination.from + index }
                                                    </Typography>
                                                </td>
                                                <td className={ `${ classes } min-w-40` }>
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
                                                        <Typography
                                                            variant="small"
                                                            color="blue-gray"
                                                            className="font-normal"
                                                        >
                                                            Promosi { jenis } dari&nbsp;
                                                            { asal?.nama ?? `${jenis} dihapus` } ke&nbsp;
                                                            { akhir?.nama ?? `${jenis} dihapus` }
                                                        </Typography>
                                                    </div>
                                                </td>
                                                <td className={ `${ classes } min-w-44` }>
                                                    <div className="flex items-center gap-3">
                                                        <Typography
                                                            variant="small"
                                                            color="blue-gray"
                                                            className={ `font-normal ${admin?.nama ? 'italic' : '' }` }
                                                        >
                                                            { admin?.nama ?? 'Admin dihapus' }
                                                        </Typography>
                                                    </div>
                                                </td>
                                                <td className={ `${ classes } min-w-52` }>
                                                    <div className="flex items-center gap-3">
                                                        { status_pengajuan === 'menunggu'
                                                            ? (
                                                                <p className="flex gap-1 font-medium text-gray-600/90 italic">
                                                                    Menunggu
                                                                    <svg xmlns="http://www.w3.org/2000/svg" width="24px" height="24px" viewBox="0 0 24 24"><path fill="currentColor" d="M17 22q-2.075 0-3.537-1.463T12 17t1.463-3.537T17 12t3.538 1.463T22 17t-1.463 3.538T17 22m1.675-2.625l.7-.7L17.5 16.8V14h-1v3.2zM5 21q-.825 0-1.412-.587T3 19V5q0-.825.588-1.412T5 3h4.175q.275-.875 1.075-1.437T12 1q1 0 1.788.563T14.85 3H19q.825 0 1.413.588T21 5v6.25q-.45-.325-.95-.55T19 10.3V5h-2v3H7V5H5v14h5.3q.175.55.4 1.05t.55.95zm7-16q.425 0 .713-.288T13 4t-.288-.712T12 3t-.712.288T11 4t.288.713T12 5"></path></svg>
                                                                </p>
                                                            )
                                                            : status_pengajuan === 'disetujui'
                                                                ? (
                                                                    <p className="flex gap-1 font-medium text-gray-600/90 italic">
                                                                        Disetujui
                                                                        <CircleCheck className="text-green-500"/>
                                                                </p>
                                                                )
                                                                : (
                                                                    <p className="flex gap-1 font-medium text-gray-600/90 italic">
                                                                        Ditolak
                                                                        <CircleX className="text-red-600"/>
                                                                    </p>
                                                                )
                                                        }
                                                    </div>
                                                </td>
                                                <td className={ `${ classes } min-w-52` }>
                                                    <div className="flex items-center gap-3">
                                                        <Typography
                                                            variant="small"
                                                            color="blue-gray"
                                                            className="font-normal"
                                                        >
                                                            { admin_penyetuju?.nama ?? '-' }
                                                        </Typography>
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
                                                                href={ route('master.pengajuan-promosi.details', { q: pagination.data[index].id }) }>
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
                                                                        pengajuanPromosiId: id,
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
                                                Belum ada data Pengajuan Promosi Pegawai
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
                        Hapus Pengajuan Promosi terpilih?
                    </DialogHeader>
                    <DialogBody>
                        <div className="p-3 border border-gray-300 rounded bg-gray-100">
                            <Typography variant="h6" className="text-gray-900 truncate">
                                Anda akan menghapus
                                Pengajuan Promosi Pegawai:&nbsp;
                                <span className="font-bold">
                                    " { pagination.data.find((pengajuanPromosi) => pengajuanPromosi.id === deleteDialog.pengajuanPromosiId)?.pegawai.nama ?? '-' } "
                                </span>
                            </Typography>
                            <Typography variant="h6" className="text-gray-900 truncate">
                               Jenis Promosi:&nbsp;
                                <span className="font-bold">
                                    { pagination.data.find((pengajuanPromosi) => pengajuanPromosi.id === deleteDialog.pengajuanPromosiId)?.asal_type ?? '-' }
                                </span>
                            </Typography>
                            <Typography variant="h6" className="text-gray-900 truncate">
                               Unit Pemohon:&nbsp;
                                <span className="font-bold">
                                    { pagination.data.find((pengajuanPromosi) => pengajuanPromosi.id === deleteDialog.pengajuanPromosiId)?.unit.nama ?? '-' }
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
                        <Button color="red" onClick={ handleDeletePengajuanPromosi } loading={onSubmitDelete} className="flex justify-items-center">
                            <span>Hapus</span>
                        </Button>
                    </DialogFooter>
                </Dialog>
            </MasterLayout>
        </>
    );
}
