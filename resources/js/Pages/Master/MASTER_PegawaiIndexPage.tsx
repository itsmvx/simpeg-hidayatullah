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
    Menu, MenuHandler, MenuItem, MenuList, Option, Progress, Select,
    Tooltip,
    Typography
} from "@material-tailwind/react";
import {
    BookOpen,
    Download,
    FileSearch,
    FileUp,
    Handshake,
    ListChecks,
    NotebookText,
    Plus,
    Trash2, TriangleAlert, X
} from "lucide-react";
import { IDNamaColumn, JenisKelamin,  PageProps, PaginationData } from "@/types";
import { MasterLayout } from "@/Layouts/MasterLayout";
import { Head, Link, router } from "@inertiajs/react";
import { format } from "date-fns";
import { id as localeID } from "date-fns/locale/id";
import { FormEvent, useEffect, useState } from "react";
import { toast } from "react-toastify";
import axios, { AxiosError, AxiosProgressEvent } from "axios";
import Pagination from "@/Components/Pagination";
import { calculateDatePast, notifyToast } from "@/Lib/Utils";
import { z } from "zod";
import { ViewPerPageList } from "@/Components/ViewPerPageList";
import { SearchInput } from "@/Components/SearchInput";
import { TableFilterBy } from "@/Components/TableFilterBy";
import { Checkbox } from "@/Components/Checkbox";
import { generateMultipleDocuments } from "@/Lib/Generate_Dokumen/SuratPerjanjianKontrakKerja";
import { Input } from "@/Components/Input";
import { id } from "date-fns/locale";
import { generateMultipleRekap, generateSingleRekap, PegawaiRekapPrint } from "@/Lib/Generate_Dokumen/RekapPegawai";

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

export default function MASTER_PegawaiIndexPage({ auth, marhalahs, golongans, statusPegawais, units, pagination, currDate, periodes, suratProps }: PageProps<{
    pagination: PaginationData<Pegawais>;
    golongans: IDNamaColumn[];
    marhalahs: IDNamaColumn[];
    statusPegawais: IDNamaColumn[];
    units: IDNamaColumn[];
    currDate: string;
    periodes: {
        id: string;
        nama: string;
        awal: string;
        akhir: string;
    }[] | undefined;
    suratProps: {
        kepalaSDI: string | null;
        currDate: string;
    } | undefined;
}>) {
    const TABLE_HEAD = ['No','NIP', 'Nama', 'Jenis Kelamin', 'Unit', 'Amanah', 'Status Pegawai', 'Golongan', 'Marhalah', 'Promosi Terakhir', 'Tanggal daftar', 'Aksi'];

    const deleteDialogInit = {
        open: false,
        pegawaiId: '',
    };
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
    const massDownloadSuratKontrakInit = {
        openDialog: false,
        periode_rekap_id: '',
        tanggal: format(new Date(currDate), "yyyy-MM-dd"),
        onProcess: false,
        onError: false,
        errMsg: '',
        onSuccess: false,
        fileName: '',
        fileSize: 0,
        fileProgress: 0,
    };

    const [ deleteDialog, setDeleteDialog ] = useState<{
        open: boolean;
        pegawaiId: string;
    }>(deleteDialogInit);
    const [ onSubmitDelete, setOnSubmitDelete ] = useState(false);
    const [ onDownloadPDF, setOnDownloadPDF ] = useState<boolean>(false);
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
    const [ massDownloadSuratKontrak, setMassDownloadSuratKontrak ] = useState<{
        openDialog: boolean,
        onProcess: boolean,
        periode_rekap_id: string,
        tanggal: string;
        onError: boolean;
        errMsg: string;
        onSuccess: boolean;
        fileName: string;
        fileSize: number;
        fileProgress: number;
    }>(massDownloadSuratKontrakInit);

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
    const handleSetCheckPegawai = (id: string, nama: string, amanah: string) => {
        setPegawaisChecked((prevState) => {
            if (!prevState.find((prev) => prev.id === id)) {
                return [ ...prevState, { id: id, nama: nama, amanah: amanah }];
            }
            return prevState.filter((prev) => prev.id !== id);
        });
    };
    const setMassDownloadSuratKontrakFileSize = (size: number) => {
        setMassDownloadSuratKontrak((prevState) => ({
            ...prevState,
            fileSize: size
        }));
    };
    const setMassDownloadSuratKontrakFileProgress = (progress: number) => {
        setMassDownloadSuratKontrak((prevState) => ({
            ...prevState,
            fileProgress: progress
        }));
    };
    const handleMassDownloadSuratKontrak = (event: FormEvent<HTMLFormElement>) => {
        event.preventDefault();
        setMassDownloadSuratKontrak((prevState) => ({
            ...prevState,
            onProcess: true
        }));

        if (periodes && suratProps) {
            const selectedPeriode = periodes.find((periode) => periode.id === massDownloadSuratKontrak.periode_rekap_id);
            const suratKontrakKerjaProps = pegawaisChecked.map((pegawai) => {
                return {
                    pihakPertama: {
                        nama: suratProps.kepalaSDI ?? '{Nama_KA_SDI}'
                    },
                    pihakKedua: {
                        nama: pegawai.nama,
                        amanah: pegawai.amanah
                    },
                    tanggal: massDownloadSuratKontrak.tanggal,
                    periode: {
                        awal: selectedPeriode?.awal ?? new Date().toDateString(),
                        akhir: selectedPeriode?.akhir ?? new Date().toDateString()
                    }
                };
            });
            const fileName = `Surat Perjanjian Kontrak Kerja-${Math.random().toString(36).substring(2, 8)}`;
            setMassDownloadSuratKontrak((prevState) => ({
                ...prevState,
                fileName: fileName
            }));

            generateMultipleDocuments({
                docsData: suratKontrakKerjaProps,
                fileName: fileName,
                setUpdateFileProgress: setMassDownloadSuratKontrakFileProgress,
                setUpdateFileSize: setMassDownloadSuratKontrakFileSize
            })
                .then(() => {
                    setMassDownloadSuratKontrak((prevState) => ({
                        ...prevState,
                        onSuccess: true
                    }));
                })
                .catch((err: Error) => {
                    setMassDownloadSuratKontrak((prevState) => ({
                        ...prevState,
                        onError: true,
                        errMsg: err.message
                    }));
                });
            return;
        }
        notifyToast('error', 'Properti data tidak sesuai');
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

       }

    };
    useEffect(() => {
        if (massDownloadSuratKontrak.openDialog) {
            if (!periodes || !suratProps) {
                router.reload({ only: ['periodes', 'suratProps'] });
            }
        }
    }, [ massDownloadSuratKontrak.openDialog ]);

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
                                        preserveState={false}
                                    />
                                </div>
                            </div>
                            <div className="w-full lg:w-72 flex flex-col justify-end gap-2">
                                <ViewPerPageList preserveState={false} />
                                <SearchInput/>
                            </div>
                        </div>
                        <div className="w-full flex flex-row-reverse justify-between gap-4">
                            <div className="flex flex-col shrink-0 gap-2 lg:flex-row">
                                <Button
                                    onClick={ () => {
                                        router.visit(route('master.pegawai.create-upload'));
                                    } }
                                    className="flex items-center gap-1.5 capitalize font-medium text-base w-44 self-end hover:bg-[linear-gradient(to_top,#38bdf8_10%,#FFFFFF_90%)] hover:text-black" size="sm"
                                >
                                    <FileUp />
                                    Upload File
                                </Button>
                                <div className="flex items-center justify-center gap-2">
                                    <Menu placement="left-start">
                                        <MenuHandler>
                                            <Button
                                                variant="filled"
                                                disabled={ pegawaisChecked.length < 1 }
                                                className="flex items-center gap-1.5 capitalize font-medium text-base order-last !py-2 !px-3.5"
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
                                                onClick={ () => setMassDownloadSuratKontrak((prevState) => ({ ...prevState, openDialog: true })) }
                                            >
                                                <Handshake/>
                                                <span>Kontrak Kerja (zip)</span>
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
                        </div>
                    </CardHeader>
                    <CardBody className="overflow-auto px-0">
                        <table className="mt-4 w-full min-w-max table-auto text-left">
                            <thead>
                            <tr>
                                <th className="border-y border-blue-gray-100 bg-[#1f1e33] px-2">
                                    <div className="flex items-center justify-between gap-2 font-normal leading-none opacity-70">
                                        <Checkbox
                                            size={4}
                                            checked={ pegawaisChecked.length === pagination.data.length }
                                            onChange={ () => {
                                                setPegawaisChecked((prevState) => prevState.length < 1 ? pagination.data.map((data) => ({ id: data.id, nama: data.nama, amanah: data.amanah })) : [])
                                            } }
                                            className="checked:bg-white checked:border-white checked:before:bg-white hover:checked:bg-white focus:checked:bg-white"
                                            containerProps={{
                                                className: '*:!text-black'
                                            }}
                                        />
                                    </div>
                                </th>
                                { TABLE_HEAD.map((head) => (
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
                                                    <td className={ ` w-min ${index === 0 ? '!p-0 !py-4' : ''}` }>
                                                        <Typography
                                                            variant="small"
                                                            color="blue-gray"
                                                            className="font-normal flex items-center justify-center"
                                                            as="div"
                                                        >
                                                            <Checkbox
                                                                checked={ !!pegawaisChecked.find((pegawai) => pegawai.id === id) }
                                                                onChange={ () => handleSetCheckPegawai(id, nama, amanah) }
                                                            />
                                                        </Typography>
                                                    </td>
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
                                                                        onClick={ (() => downloadSingleRekap(index)) }>
                                                                        <NotebookText/>
                                                                        <span>Rekap Pegawai</span>
                                                                    </MenuItem>
                                                                    <MenuItem
                                                                        className="flex flex-row items-center gap-1.5 font-medium text-sm"
                                                                        onClick={ (() => downloadSingleRekap(index)) }>
                                                                        <Handshake/>
                                                                        <span>Kontrak Kerja</span>
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
                    <CardFooter className="flex items-center justify-center border-t border-blue-gray-50 py-3.5 px-2">
                        <Pagination paginateItems={ pagination } preserveState={false} />
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

                <Dialog open={ massDownloadSuratKontrak.openDialog }
                        handler={ () => setMassDownloadSuratKontrak((prevState) => ({
                            ...prevState,
                            openDialog: prevState.openDialog
                        })) } className="p-4"
                >
                    <DialogHeader className="relative m-0 block">
                        <Typography variant="h4" color="blue-gray">
                            Buat Surat Kontrak kerja
                        </Typography>
                        <Typography className="mt-1 font-medium text-gray-700">
                            { massDownloadSuratKontrak.onProcess ? 'Mohon tunggu sebentar, Dokumen sedang dibuat...' : 'Pilih Periode' }
                        </Typography>
                        <IconButton
                            size="sm"
                            variant="text"
                            className="!absolute right-3.5 top-3.5 flex items-center justify-center"
                            onClick={ () => setMassDownloadSuratKontrak(massDownloadSuratKontrakInit) }
                            disabled={ massDownloadSuratKontrak.onProcess }
                        >
                            <X width={ 18 }/>
                        </IconButton>
                    </DialogHeader>
                    <DialogBody>
                        {
                            !massDownloadSuratKontrak.onProcess && (
                                <form onSubmit={ handleMassDownloadSuratKontrak } className="space-y-3.5 !-my-4">
                                    <Select
                                        label="Periode Rekap"
                                        color="teal"
                                        name="periode_rekap_id"
                                        onChange={ (val) => setMassDownloadSuratKontrak((prevState) => ({
                                            ...prevState,
                                            periode_rekap_id: val ?? ''
                                        })) }
                                        disabled={ !periodes }
                                    >
                                        {
                                            periodes
                                                ? periodes.length > 1
                                                    ? periodes.map((periode) => ((
                                                        <Option
                                                            key={ periode.id }
                                                            value={ periode.id }
                                                        >
                                                            <div className="flex justify-items-center gap-1">
                                                                <p className="flex justify-items-center gap-1.5 truncate">
                                                                { periode.nama } &nbsp;
                                                                    ({ format(periode.awal, 'PPP', { locale: id }) } -&nbsp;
                                                                    { format(periode.akhir, 'PPP', { locale: id }) })
                                                                </p>
                                                            </div>
                                                        </Option>
                                                    )))
                                                    : (
                                                        <Option disabled value="">
                                                            <div className="flex items-center gap-2">
                                                                <TriangleAlert className="text-red-600"/>
                                                                <p className="text-gray-900 font-semibold">
                                                                    Belum ada Periode terdaftar atau dibuka
                                                                </p>
                                                            </div>
                                                        </Option>
                                                    )
                                                : (
                                                    <Option disabled value="">
                                                        <div className="flex items-center gap-2">
                                                            Memuat Periode...
                                                            <span
                                                                className="w-3 h-3 rounded-full border-2 border-r-transparent border-gray-700 animate-spin"/>
                                                        </div>
                                                    </Option>
                                                )
                                        }
                                    </Select>
                                    <Input
                                        type="date"
                                        color="teal"
                                        label="Tanggal Tanda Terima"
                                        value={ massDownloadSuratKontrak.tanggal }
                                        onChange={ (event) => setMassDownloadSuratKontrak((prevState) => ({
                                            ...prevState,
                                            tanggal: event.target.value
                                        })) }
                                        required
                                    />
                                    <div className="flex items-center justify-end gap-2">
                                        <Button color="red" className="!shadow-none" onClick={() => setMassDownloadSuratKontrak(massDownloadSuratKontrakInit)}>
                                            Batal
                                        </Button>
                                        <Button type="submit" color="green" className="!shadow-none">
                                            Buat
                                        </Button>
                                    </div>
                                </form>
                            )
                        }

                        {
                            massDownloadSuratKontrak.onProcess && (
                                <>
                                    <div className="w-full">
                                        <div className="mb-2 flex items-center justify-between gap-4">
                                            <Typography
                                                color="blue-gray"
                                                variant="small"
                                                className="font-semibold"
                                            >
                                                memproses...
                                            </Typography>
                                            <Typography
                                                variant="small"
                                                className="font-semibold text-gray-600"
                                            >
                                                {((massDownloadSuratKontrak.fileProgress / pegawaisChecked.length) * 100).toFixed(2)}%
                                            </Typography>
                                        </div>
                                        <Progress
                                            value={ (massDownloadSuratKontrak.fileProgress / pegawaisChecked.length) * 100 }/>
                                    </div>
                                    <div className="mt-6 flex gap-16">
                                        <div>
                                            <Typography className="font-normal text-gray-600">
                                                Nama File
                                            </Typography>
                                            <Typography color="blue-gray" className="font-semibold">
                                                { massDownloadSuratKontrak.fileName }.zip
                                            </Typography>
                                        </div>
                                        <div>
                                            <Typography className="font-normal text-gray-600">
                                                Ukuran File
                                            </Typography>
                                            <Typography color="blue-gray" className="font-semibold">
                                                { (massDownloadSuratKontrak.fileSize / (1024 * 1024)).toFixed(2) } MB
                                            </Typography>
                                        </div>
                                    </div>
                                    <div className="mt-6 -mb-3 flex items-center justify-center">
                                        <Button className="!shadow-none mx-auto" onClick={ () => setMassDownloadSuratKontrak(massDownloadSuratKontrakInit) } disabled={ !massDownloadSuratKontrak.onSuccess || massDownloadSuratKontrak.onError }>
                                            Tutup
                                        </Button>
                                    </div>
                                </>
                            )
                        }
                    </DialogBody>
                </Dialog>
            </MasterLayout>
        </>
    );
}
