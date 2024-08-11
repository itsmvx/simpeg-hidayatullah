import {
    Button,
    Card,
    CardBody,
    CardFooter,
    CardHeader, Dialog, DialogBody, DialogFooter, DialogHeader,
    IconButton,
    Tooltip,
    Typography
} from "@material-tailwind/react";
import {
    ArrowLeft, ArrowRight,
    BarChartBig,
    Building2,
    ChevronDown, Download, FileSearch,
    NotebookText,
    Plus,
    Search, Trash2,
    User2
} from "lucide-react";
import { MTColor, PageProps } from "@/types";
import { AdminLayout } from "@/Layouts/AdminLayout";
import { Head, Link, router } from "@inertiajs/react";
import { Input } from "@/Components/Input";
import { format } from "date-fns";
import { id as localeID } from "date-fns/locale/id";
import { TextArea } from "@/Components/TextArea";
import { Checkbox } from "@/Components/Checkbox";
import { useTheme } from "@/Hooks/useTheme";
import { SyntheticEvent, useEffect, useMemo, useState } from "react";
import { Bounce, toast } from "react-toastify";
import {  z } from "zod";
import axios, { AxiosError } from "axios";
import * as XLSX from "xlsx";
import { id } from "date-fns/locale";


export default function MASTER_RekapPegawaiIndexPage({ auth, rekaps, adminCount }: PageProps<{
    rekaps: {
        id: string;
        nama: string;
        keterangan: string;
        created_at: string;
        admin: {
            id: string;
            username: string;
            rekap_id: string;
        }[] | []
    }[] | [];
    adminCount: number;
}>) {

    const TABLE_HEAD = ['No', 'Rekap', 'Pegawai', 'Periode', 'Tanggal', 'Aksi'];
    const cardData = [
        {
            color: "gray",
            icon: <Building2 />,
            title: "Total Jumlah Laporan Rekap",
            value: rekaps.length,
        },
        {
            color: "gray",
            icon: <User2 />,
            title: "Jumlah Rekap belum diverifikasi",
            value: adminCount,
        }
    ];

    const deleteDialogInit = {
        open: false,
        rekapId: '',
    };
    const { theme } = useTheme();
    const [ deleteDialog, setDeleteDialog ] = useState<{
        open: boolean;
        rekapId: string;
    }>(deleteDialogInit);
    const [ sortBy, setSortBy ] = useState('');
    const [ currPage, setCurrPage ] = useState(1);
    const [ viewPerPage, setViewPerPage ] = useState(10);

    const notifyToast = (type: 'success' | 'error', message: string, theme: 'light' | 'dark' = 'light') => {
        toast[type](message, {
            position: "top-right",
            autoClose: 5000,
            hideProgressBar: false,
            closeOnClick: true,
            pauseOnHover: true,
            draggable: true,
            theme: theme,
            transition: Bounce,
        });
    }
    const adjustData = useMemo(() => {
        const startIndex = (currPage - 1) * viewPerPage;
        const lastIndex = startIndex + viewPerPage;

        return rekaps.slice(startIndex, lastIndex);
    }, [ rekaps, viewPerPage ]);

    const [ data, setData ] = useState(adjustData);
    const [ search, setSearch ] = useState('');
    const getItemProps = (index: number) =>
        ({
            variant: currPage === index ? "filled" : "text",
            color: "gray",
            className: "rounded-full",
        } as any);

    const nextPage = () => {
        const totalPages = Math.ceil(rekaps.length / viewPerPage);
        currPage < totalPages && setCurrPage(currPage + 1);
    };
    const prevPage = () => {
        currPage > 1 && setCurrPage(currPage - 1);
    };
    const handleOpenDelete = () => setDeleteDialog((prevState) => ({
        ...prevState,
        open: true
    }));

    const handleDeleteRekap = () => {
        axios.post(route('rekap.delete'), {
            id: deleteDialog.rekapId,
        })
            .then(() => {
                notifyToast('success', 'Rekap Pegawai terpilih berhasil dihapus!');
                setData((prevState) => prevState.filter((filt) => filt.id !== deleteDialog.rekapId));
                setDeleteDialog(deleteDialogInit);
            })
            .catch((err: unknown) => {
                const errMsg = err instanceof AxiosError
                    ? err?.response?.data.message ?? 'Error tidak diketahui terjadi'
                    : 'Error tidak diketahui terjadi';
                notifyToast('error', errMsg);
            });
    };

    useEffect(() => {
        setData(adjustData);
    }, [ rekaps, viewPerPage ]);
    useEffect(() => {
        if (search.length < 1) {
            setData(adjustData);
        } else {
            setCurrPage(1);
            const matchRekaps = rekaps.filter(rekap =>
                rekap.nama.toLowerCase().includes(search.toLowerCase()) ||
                rekap.admin.some(admin => admin.username.toLowerCase().includes(search.toLowerCase()))
            );
            setData(matchRekaps);
        }
    }, [ search ]);

    return (
        <>
            <Head title="Master - Rekap" />
            <AdminLayout>
                <section className="mb-1 grid gap-y-10 gap-x-6 md:grid-cols-2 xl:grid-cols-4">
                    { cardData.map(({ icon, title, color, value }) => (
                        <Card key={title} className="border border-blue-gray-100 shadow-sm">
                            <CardHeader
                                variant="gradient"
                                color={ color as MTColor }
                                floated={ false }
                                shadow={ false }
                                className="absolute grid h-12 w-12 place-items-center"
                            >
                                { icon }
                            </CardHeader>
                            <CardBody className="p-4 text-left ml-20">
                                <Typography variant="small" className="font-normal text-blue-gray-600">
                                    { title }
                                </Typography>
                                <Typography variant="h4" color="blue-gray">
                                    { value }
                                </Typography>
                            </CardBody>
                        </Card>
                    )) }
                </section>

                <Card className="h-full w-full" shadow={false}>
                    <CardHeader floated={false} shadow={false} className="rounded-none">
                        <div className="mb-8 flex items-center justify-between gap-x-3">
                            <div>
                                <Typography variant="h5" color="blue-gray">
                                    Daftar Rekap
                                </Typography>
                                <Typography color="gray" className="mt-1 font-normal">
                                    Informasi mengenai Rekap yang terdaftar
                                </Typography>
                            </div>
                            <div className="flex flex-col shrink-0 gap-2 lg:flex-row">
                                <Button
                                    onClick={() => {
                                        router.visit(route('master.rekap-pegawai.create'));
                                    }}
                                    className="flex items-center gap-1.5 capitalize font-medium text-base" size="sm"
                                >
                                    <Plus />
                                    Buat Rekap Pegawai baru
                                </Button>
                            </div>
                        </div>
                        <div className="flex flex-col items-center justify-end gap-4 md:flex-row">
                            <div className="w-full md:w-72">
                                <Input
                                    label="Pencarian"
                                    placeholder="cari berdasarkan nama"
                                    value={search}
                                    onChange={(event) => {
                                        setSearch(event.target.value);
                                    }}
                                    icon={<Search className="h-5 w-5"/>}
                                />
                            </div>
                        </div>
                    </CardHeader>
                    <CardBody className="overflow-auto px-0">
                        <table className="mt-4 w-full min-w-max table-auto text-left">
                            <thead>
                            <tr>
                                {TABLE_HEAD.map((head, index) => (
                                    <th
                                        key={head}
                                        onClick={() => setSortBy(head)}
                                        className="cursor-pointer border-y border-blue-gray-100 bg-blue-gray-50/50 p-4 transition-colors hover:bg-blue-gray-50 last:cursor-auto last:hover:bg-blue-gray-50/50"
                                    >
                                        <Typography
                                            variant="small"
                                            color="blue-gray"
                                            className="flex items-center justify-between gap-2 font-normal leading-none opacity-70"
                                        >
                                            {head}{" "}
                                            {index !== TABLE_HEAD.length - 1 && (
                                                <ChevronDown strokeWidth={2} className="h-4 w-4" />
                                            )}
                                        </Typography>
                                    </th>
                                ))}
                            </tr>
                            </thead>
                            <tbody>
                            {
                                data.map(
                                    ({ id, nama, admin, created_at }, index) => {
                                        const isLast = index === data.length - 1;
                                        const classes = isLast
                                            ? "p-4"
                                            : "p-4 border-b border-blue-gray-50";

                                        return (
                                            <tr key={ id }>
                                                <td className={ `${ classes } w-3`}>
                                                    <Typography
                                                        variant="small"
                                                        color="blue-gray"
                                                        className="font-normal text-center"
                                                    >
                                                        { index + 1}
                                                    </Typography>
                                                </td>
                                                <td className={ `${ classes } min-w-52` }>
                                                    <div className="flex items-center gap-3">
                                                        {/*<Avatar src={img} alt={name} size="sm" />*/ }
                                                        <div className="flex flex-col">
                                                            <Typography
                                                                variant="small"
                                                                color="blue-gray"
                                                                className="font-normal"
                                                            >
                                                                { nama }
                                                            </Typography>
                                                        </div>
                                                    </div>
                                                </td>
                                                <td className={ `${ classes } min-w-52` }>
                                                    <div className="flex flex-col gap-1">
                                                        {
                                                            admin.length < 1
                                                                ? (
                                                                    <div
                                                                        className="flex items-center justify-start text-xs text-gray-400">
                                                                        Belum ada Admin untuk rekap ini
                                                                    </div>
                                                                )
                                                                : admin.map((admn, index) => ((
                                                                    <Link
                                                                        href={route('master.admin.details')}
                                                                        data={{ q: admn.id }}
                                                                        key={ index }
                                                                        className="font-normal text-sm hover:text-blue-600"
                                                                    >
                                                                        { admn.username }
                                                                    </Link>
                                                                )))
                                                        }
                                                    </div>
                                                </td>
                                                <td className={ `${ classes } min-w-40` }>
                                                    <Typography
                                                        variant="small"
                                                        color="blue-gray"
                                                        className="font-normal"
                                                    >
                                                        { format(created_at, 'PPpp', {
                                                            locale: localeID
                                                        }) }
                                                    </Typography>
                                                </td>
                                                <td className={ classes }>
                                                    <div className="w-32 flex gap-2.5 items-center justify-start">
                                                        <Tooltip content="Detail">
                                                            <Link href={route('master.rekap.details', { q: rekaps[index].id })}>
                                                                <IconButton variant="text">
                                                                    <FileSearch className="h-5 w-5 text-blue-800"/>
                                                                </IconButton>
                                                            </Link>
                                                        </Tooltip>
                                                        <Tooltip content="Hapus" className="bg-red-400">
                                                            <IconButton
                                                                variant="text"
                                                                onClick={() => {
                                                                    setDeleteDialog((prevState) => ({
                                                                        ...prevState,
                                                                        open: true,
                                                                        periodeId: id,
                                                                        admins: admin
                                                                    }))
                                                                }}
                                                            >
                                                                <Trash2 className="h-5 w-5 text-red-600"/>
                                                            </IconButton>
                                                        </Tooltip>
                                                    </div>
                                                </td>
                                            </tr>
                                        );
                                    },
                                )
                            }
                            </tbody>
                        </table>
                    </CardBody>
                    <CardFooter className="flex items-center justify-between border-t border-blue-gray-50 p-4">
                        <Typography variant="small" color="blue-gray" className="font-normal">
                            Halaman { currPage } dari { Math.ceil(data.length / viewPerPage) }
                        </Typography>
                        <div className="flex items-center gap-4">
                            <Button
                                variant="text"
                                className="flex items-center gap-2 rounded-full"
                                onClick={ prevPage }
                                disabled={ currPage === 1 }
                            >
                                <ArrowLeft strokeWidth={ 2 } className="h-4 w-4"/> Previous
                            </Button>
                            <div className="flex items-center gap-2">
                                {
                                    Array.from({ length: Math.ceil(data.length / viewPerPage) }).map((_, index) => (
                                        <IconButton
                                            key={index}
                                            { ...getItemProps(index + 1) }
                                            onClick={() => setCurrPage(index + 1)}
                                        >
                                            { index + 1 }
                                        </IconButton>
                                    ))
                                }
                            </div>
                            <Button
                                variant="text"
                                className="flex items-center gap-2 rounded-full"
                                onClick={ nextPage }
                                disabled={ currPage === Math.ceil(data.length / viewPerPage) || data.length < 1 }
                            >
                                Next
                                <ArrowRight strokeWidth={ 2 } className="h-4 w-4"/>
                            </Button>
                        </div>
                    </CardFooter>
                </Card>

                <Dialog open={deleteDialog.open} handler={handleOpenDelete}>
                    <DialogHeader className="text-gray-900">
                        Hapus Rekap terpilih?
                    </DialogHeader>
                    <DialogBody>
                        <Typography variant="h6" className="text-gray-900 truncate">
                            Anda akan menghapus
                            Rekap:&nbsp;
                            <span className="font-bold">
                                " { rekaps.find((rekap) => rekap.id === deleteDialog.rekapId)?.nama ?? '-' } "
                            </span>
                        </Typography>
                    </DialogBody>
                    <DialogFooter>
                        <Button
                            color="black"
                            onClick={ () => setDeleteDialog(deleteDialogInit)}
                            className="mr-1"
                        >
                        <span>Batal</span>
                        </Button>
                        <Button color="red" onClick={handleDeleteRekap}>
                            <span>Hapus</span>
                        </Button>
                    </DialogFooter>
                </Dialog>
            </AdminLayout>
        </>
    );
}
