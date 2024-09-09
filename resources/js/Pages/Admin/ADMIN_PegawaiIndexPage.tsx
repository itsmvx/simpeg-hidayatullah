import {
    Card,
    CardBody,
    CardFooter,
    CardHeader,
    IconButton,
    Tooltip,
    Typography
} from "@material-tailwind/react";
import { Download, FileSearch } from "lucide-react";
import { IDNamaColumn, JenisKelamin,  PageProps, PaginationData } from "@/types";
import { Head, Link } from "@inertiajs/react";
import { format } from "date-fns";
import { id as localeID } from "date-fns/locale/id";
import { useState } from "react";
import { toast } from "react-toastify";
import axios, { AxiosError, AxiosProgressEvent } from "axios";
import Pagination from "@/Components/Pagination";
import { calculateDatePast } from "@/Lib/Utils";
import CV_PDFGenerator, { PegawaiExportCV } from "@/Lib/Generate_Dokumen/RekapPegawai";
import { pdf } from "@react-pdf/renderer";
import { saveAs } from "file-saver";
import { ViewPerPageList } from "@/Components/ViewPerPageList";
import { SearchInput } from "@/Components/SearchInput";
import { TableFilterBy } from "@/Components/TableFilterBy";
import { AdminLayout } from "@/Layouts/AdminLayout";

type Pegawais = {
    id: string;
    nip: string;
    nama: string;
    jenis_kelamin: JenisKelamin;
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
    const TABLE_HEAD = ['No','NIP', 'Nama', 'Jenis Kelamin', 'Status Pegawai', 'Golongan', 'Marhalah', 'Promosi Terakhir', 'Tanggal daftar', 'Aksi'];

    const [ onDownloadPDF, setOnDownloadPDF ] = useState<boolean>(false);
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
                    <CardHeader floated={ false } shadow={ false } className="rounded-none">
                        <div className="mb-8 flex flex-col lg:flex-row items-start justify-between gap-3">
                            <div>
                                <Typography variant="h5" color="blue-gray">
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
                                <ViewPerPageList/>
                                <SearchInput/>
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
                                             nip,
                                             nama,
                                             jenis_kelamin,
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
                                                            ({ tanggal_promosi ? calculateDatePast(new Date(tanggal_promosi), new Date(currDate)) : 'belum ada keterangan'})
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
            </AdminLayout>
        </>
    );
}
