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
import { ChevronDown, CircleCheck, CircleX, FileSearch, Pencil, Plus, Search, Trash2, X } from "lucide-react";
import { IDNamaColumn, JenisPengajuanPromosi, PageProps, PaginationData, StatusPengajuanPromosi } from "@/types";
import { Head, Link, router } from "@inertiajs/react";
import { Input } from "@/Components/Input";
import { format } from "date-fns";
import { id as localeID } from "date-fns/locale/id";
import { Checkbox } from "@/Components/Checkbox";
import { ChangeEvent, useState } from "react";
import axios, { AxiosError } from "axios";
import Pagination from "@/Components/Pagination";
import { AdminLayout } from "@/Layouts/AdminLayout";
import { jenisPengajuanPromosi } from "@/Lib/StaticData";
import { notifyToast } from "@/Lib/Utils";

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

export default function ADMIN_PengajuanPromosiIndexPage({ auth, pagination }: PageProps<{
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
    const [ sortBy, setSortBy ] = useState('');

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
            <Head title="Admin - Pengajuan Promosi Pegawai" />
            <AdminLayout auth={auth}>
                <Card className="h-full w-full" shadow={false}>
                    <CardHeader floated={false} shadow={false} className="rounded-none">
                        <div className="mb-8 flex flex-col md:flex-row items-start justify-between gap-3">
                            <div>
                                <Typography variant="h5" color="blue-gray">
                                    Daftar Pengajuan Promosi
                                </Typography>
                                <Typography color="gray" className="mt-1 font-normal">
                                    Informasi mengenai Pengajuan Promosi yang terdaftar
                                </Typography>
                            </div>
                        </div>
                        <div className="w-full flex flex-col md:flex-row items-start justify-between gap-4">
                            <div className="ml-auto w-full md:w-72 flex flex-col justify-end gap-2">
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

                               <div className="space-y-3">
                                   <Input
                                       label="Pencarian"
                                       placeholder="cari berdasarkan nama"
                                       value={ search }
                                       onChange={ (event) => {
                                           setSearch(event.target.value);
                                       } }
                                       icon={ <Search className="h-5 w-5"/> }
                                   />
                                   <Button
                                       onClick={() => {
                                           router.visit(route('admin.pengajuan-promosi.create'));
                                       }}
                                       className="ml-auto flex items-center gap-1.5 capitalize font-medium text-base" size="sm"
                                   >
                                       <Plus />
                                       Buat Pengajuan baru
                                   </Button>
                               </div>
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
                                         asal,
                                         akhir,
                                         asal_type,
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
                                        const jenisPromosi = jenisPengajuanPromosi.find((jenisPromosi) => jenisPromosi.value === asal_type)?.label ?? '';

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
                                                            Promosi { jenisPromosi } dari&nbsp;
                                                            { asal?.nama ?? `${jenisPromosi} dihapus` } ke&nbsp;
                                                            { akhir?.nama ?? `${jenisPromosi} dihapus` }
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
                                                                href={ route('admin.pengajuan-promosi.details', { q: pagination.data[index].id }) }>
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
                    <CardFooter className="flex items-center justify-between border-t border-blue-gray-50 p-4">
                        <Pagination paginateItems={ pagination }/>
                    </CardFooter>
                </Card>

                <Dialog open={ deleteDialog.open } handler={ handleOpenDelete }>
                    <DialogHeader className="text-gray-900">
                        Hapus PengajuanPromosi terpilih?
                    </DialogHeader>
                    <DialogBody>
                        <div className="p-3 border border-gray-300 rounded bg-gray-100">
                            <Typography variant="h6" className="text-gray-900">
                                Anda akan menghapus
                                Pengajuan Promosi Pegawai:&nbsp;
                                <span className="font-bold">
                                    { pagination.data.find((pengajuanPromosi) => pengajuanPromosi.id === deleteDialog.pengajuanPromosiId)?.pegawai.nama ?? '-' }
                                </span>
                            </Typography>
                            <Typography variant="h6" className="text-gray-900 truncate">
                               Jenis:&nbsp;
                                <span className="font-bold">
                                    Promosi { pagination.data.find((pengajuanPromosi) => pengajuanPromosi.id === deleteDialog.pengajuanPromosiId)?.jenis ?? '-' }
                                </span>
                            </Typography>
                            <Typography variant="h6" className="text-gray-900 truncate">
                               Dari:&nbsp;
                                <span className="font-bold">
                                    { pagination.data.find((pengajuanPromosi) => pengajuanPromosi.id === deleteDialog.pengajuanPromosiId)?.asal?.nama ?? '-' }
                                </span>
                            </Typography>
                            <Typography variant="h6" className="text-gray-900 truncate">
                               Menjadi:&nbsp;
                                <span className="font-bold">
                                    { pagination.data.find((pengajuanPromosi) => pengajuanPromosi.id === deleteDialog.pengajuanPromosiId)?.akhir?.nama ?? '-' }
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
            </AdminLayout>
        </>
    );
}
