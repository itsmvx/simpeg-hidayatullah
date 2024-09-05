import {
    Card,
    CardBody,
    CardFooter,
    CardHeader,
    IconButton,
    Tooltip,
    Typography
} from "@material-tailwind/react";
import { FileSearch } from "lucide-react";
import { IDNamaColumn, PageProps, PaginationData } from "@/types";
import { Head, Link, router } from "@inertiajs/react";
import Pagination from "@/Components/Pagination";
import { ViewPerPageList } from "@/Components/ViewPerPageList";
import { SearchInput } from "@/Components/SearchInput";
import { PegawaiLayout } from "@/Layouts/PegawaiLayout";


type Rekaps = {
    id: string;
    amanah: string;
    pegawai_id: string;
    status_pegawai_id: string;
    marhalah_id: string | null;
    golongan_id: string | null;
    periode_rekap_id: string;
    unit_id: string | null;
    pegawai: IDNamaColumn | null;
    status_pegawai: IDNamaColumn | null;
    marhalah: IDNamaColumn | null;
    golongan: IDNamaColumn | null;
    periode_rekap: IDNamaColumn;
    unit: IDNamaColumn | null;
}[];

export default function ADMIN_RekapPegawaiIndexPage({ auth, pagination }: PageProps<{
    pagination: PaginationData<Rekaps>;
}>) {

    const TABLE_HEAD = ['No', 'Periode', 'Unit', 'Amanah', 'Status Pegawai', 'Golongan', 'Marhalah', 'Aksi'];

    return (
        <>
            <Head title="Pegawai - Rekap Pegawai" />
            <PegawaiLayout auth={auth}>
                <Card className="h-full w-full" shadow={false}>
                    <CardHeader floated={ false } shadow={ false } className="rounded-none">
                        <div className="mb-8 flex flex-col lg:flex-row items-start justify-between gap-3">
                            <div>
                                <Typography variant="h5" color="blue-gray">
                                    Daftar Rekap Pegawai anda
                                </Typography>
                                <Typography color="gray" className="mt-1 font-normal">
                                    Informasi mengenai Rekap Pegawai yang terdaftar
                                </Typography>
                            </div>
                            <div className="w-full lg:w-72 flex flex-col justify-end gap-2">
                                <ViewPerPageList/>
                                <SearchInput placeholder="cari berdasarkan periode"/>
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
                                             golongan,
                                             marhalah,
                                             periode_rekap,
                                             status_pegawai,
                                             unit
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
                                                                    className={ unit ? 'font-normal' : 'font-semibold italic text-sm' }
                                                                >
                                                                    { unit?.nama ?? 'Pegawai yang dihapus' }
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
                                                                    className={ status_pegawai ? 'font-normal' : 'font-semibold italic text-sm' }
                                                                >
                                                                    { status_pegawai?.nama ?? 'Status Pegawai yang dihapus' }
                                                                </Typography>
                                                            </div>
                                                        </div>
                                                    </td>
                                                    <td className={ `${ classes } min-w-40` }>
                                                        <div className="flex items-center gap-3">
                                                            <Typography
                                                                variant="small"
                                                                color="blue-gray"
                                                                className={ golongan ? 'font-normal' : 'font-semibold italic text-sm' }
                                                            >
                                                                { golongan?.nama ?? 'Golongan yang dihapus' }
                                                            </Typography>
                                                        </div>
                                                    </td>
                                                    <td className={ `${ classes } min-w-40` }>
                                                        <div className="flex items-center gap-3">
                                                            <Typography
                                                                variant="small"
                                                                color="blue-gray"
                                                                className={ marhalah ? 'font-normal' : 'font-semibold italic text-sm' }
                                                            >
                                                                { marhalah?.nama ?? 'Marhalah yang dihapus' }
                                                            </Typography>
                                                        </div>
                                                    </td>
                                                    <td className={ classes }>
                                                        <div className="w-32 flex gap-2.5 items-center justify-start">
                                                            <Tooltip content="Detail">
                                                                <Link
                                                                    href={ route('pegawai.rekap-pegawai.details', { q: pagination.data[index].id }) }>
                                                                    <IconButton variant="text">
                                                                        <FileSearch className="h-5 w-5 text-blue-800"/>
                                                                    </IconButton>
                                                                </Link>
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
            </PegawaiLayout>
        </>
    );
}
