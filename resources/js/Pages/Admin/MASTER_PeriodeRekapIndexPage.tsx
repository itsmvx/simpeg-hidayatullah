import {
    Button,
    Card,
    CardBody,
    CardFooter,
    CardHeader, Dialog, DialogBody, DialogFooter, DialogHeader,
    IconButton, Option, Select,
    Tooltip,
    Typography
} from "@material-tailwind/react";
import {
    ArrowLeft, ArrowRight,
    CalendarDays, Check,
    ChevronDown, FileSearch, LoaderCircle, LockKeyholeOpen,
    Plus,
    Search, Trash2, X,
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
import { Fragment, SyntheticEvent, useEffect, useMemo, useState } from "react";
import { Bounce, toast } from "react-toastify";
import {  z } from "zod";
import axios, { AxiosError } from "axios";
import { Switch } from "@headlessui/react";

export type FormPeriodeRekap = {
    nama: string;
    jenis: ''|'mingguan'|'bulanan'|'semesteran'|'tahunan';
    keterangan: string;
    awal: string;
    akhir: string;
    status: boolean;
    error: {
        nama: boolean;
        keterangan: boolean;
    };
    onSubmit: boolean;
};
export type JenisPeriodeRekap = 'mingguan'|'bulanan'|'semesteran'|'tahunan';
export const jenisPeriodeRekap: JenisPeriodeRekap[] = ['mingguan', 'bulanan', 'semesteran', 'tahunan'];

export default function MASTER_PeriodeRekapIndexPage({ auth, periodes, opensCount }: PageProps<{
    periodes: {
        id: string;
        nama: string;
        keterangan: string;
        awal: string;
        akhir: string;
        status: 0 | 1;
    }[] | [];
    opensCount: number;
}>) {
    const TABLE_HEAD = ['No', 'Nama Periode', 'Keterangan', 'Masa Periode', 'Status', 'Aksi'];
    const cardData = [
        {
            color: "gray",
            icon: <CalendarDays />,
            title: "Jumlah Periode Terdaftar",
            value: periodes.length,
        },
        {
            color: "gray",
            icon: <LockKeyholeOpen />,
            title: "Jumlah Periode status",
            value: opensCount,
        },
    ];
    const deleteDialogInit = {
        open: false,
        periodeId: '',
    };
    const { theme } = useTheme();
    const [ openFormDialog, setOpenFormDialog ] = useState(false);
    const [ deleteDialog, setDeleteDialog ] = useState<{
        open: boolean;
        periodeId: string;
    }>(deleteDialogInit);
    const [ onSwitchStatus, setOnSwitchStatus ] = useState({
        status: false,
        index: -1
    });

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

        return periodes.slice(startIndex, lastIndex);
    }, [ periodes, viewPerPage ]);

    const [ data, setData ] = useState(adjustData);
    const [ search, setSearch ] = useState('');
    const getItemProps = (index: number) =>
        ({
            variant: currPage === index ? "filled" : "text",
            color: "gray",
            className: "rounded-full",
        } as any);

    const nextPage = () => {
        const totalPages = Math.ceil(periodes.length / viewPerPage);
        currPage < totalPages && setCurrPage(currPage + 1);
    };
    const prevPage = () => {
        currPage > 1 && setCurrPage(currPage - 1);
    };

    const handleOpenForm = () => setOpenFormDialog(true);
    const handleOpenDelete = () => setDeleteDialog((prevState) => ({
        ...prevState,
        open: true
    }));
    const handleSwitchStatus = (val: boolean, index: number) => {
        setOnSwitchStatus({
            status: true,
            index: index
        });
        axios.post(route('periode-rekap.update-status'), {
            id: data[index].id,
            status: val
        })
            .then(() => {
                notifyToast('success', 'Periode Rekap berhasil diperbarui!');
                setData((prevState) => {
                    return prevState.map((prev, idx) => {
                        return idx === index
                            ? { ...prev, status: Number((!prev.status)) as 0 | 1 }
                            : prev;
                    });
                });
            })
            .catch(() => {
                notifyToast('error', 'Server gagal memproses permintaan');
            })
            .finally(() => setOnSwitchStatus({
                status: false,
                index: -1
            }));
    };

    const formInputInit: FormPeriodeRekap = {
        nama: '',
        jenis: '',
        keterangan: '',
        awal: '',
        akhir: '',
        status: false,
        error: {
            nama: false,
            keterangan: false,
        },
        onSubmit: false
    };
    const [ formInput, setFormInput ] = useState<FormPeriodeRekap>(formInputInit);
    const formSubmitDisabled = (): boolean => (!formInput.nama || !formInput.jenis || !formInput.keterangan || !formInput.awal || !formInput.akhir);
    const handleFormSubmit = (event: SyntheticEvent<HTMLFormElement>) => {
        event.preventDefault();
        const { nama, keterangan, awal, akhir, jenis, status } = formInput

        setFormInput((prevState) => ({
            ...prevState,
            onSubmit: true
        }));
        const periodeSchema = z.object({
            nama: z.string().min(1, { message: "Nama Periode tidak boleh kosong" }),
            jenis: z.enum(['mingguan', 'bulanan', 'semesteran', 'tahunan'], { message: "Jenis Periode tidak valid" }),
            keterangan: z.string().min(1, { message: "Keterangan Periode tidak boleh kosong" }),
            awal: z.string({ message: "Awal Periode tidak boleh kosong euy" }),
            akhir: z.string({ message: "Awal Periode tidak boleh kosong" }),
            status: z.boolean({ message: 'Indikator status error' })
        });
        const zodPeriodeResult = periodeSchema.safeParse({
            nama: nama,
            jenis: jenis,
            keterangan: keterangan,
            awal: awal,
            akhir: akhir,
            status: status
        });
        if (!zodPeriodeResult.success) {
            const errorMessages = zodPeriodeResult.error.issues[0].message;
            notifyToast('error', errorMessages, theme as 'light' | 'dark');
            return;
        }

        axios.post(route('periode-rekap.create'), {
            nama: nama,
            jenis: jenis,
            keterangan: keterangan,
            awal: awal,
            akhir: akhir,
            status: status
        })
            .then(() => {
                notifyToast('success', 'Periode Rekap berhasil ditambahkan!', theme as 'light' | 'dark');
                router.reload({ only: ['periodes'] });
                setOpenFormDialog(false);
            })
            .catch((err: unknown) => {
                const errMsg = err instanceof AxiosError
                    ? err.response?.data.message as string ?? 'Error tidak diketahui terjadi!'
                    : 'Error tidak diketahui terjadi!'
                notifyToast('error', errMsg, theme as 'light' | 'dark');
            })
            .finally(() => {
                setFormInput((prevState) => ({ ...prevState, onSubmit: false }))
            });
    };
    const handleDeletePeriode = () => {
        axios.post(route('periode-rekap.delete'), {
            id: deleteDialog.periodeId,
        })
            .then(() => {
                notifyToast('success', 'Periode Rekap terpilih berhasil dihapus!');
                router.reload({ only: [ 'periodes ']});
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
        if (!openFormDialog) {
            setFormInput(formInputInit);
        }
    }, [ openFormDialog ]);
    useEffect(() => {
        setData(adjustData);
    }, [ periodes, viewPerPage ]);
    useEffect(() => {
        if (search.length < 1) {
            setData(adjustData);
        } else {
            setCurrPage(1);
            const matchPeriodes = periodes.filter(unit =>
                unit.nama.toLowerCase().includes(search.toLowerCase())
            );
            setData(matchPeriodes);
        }
    }, [ search ]);

    return (
        <>
            <Head title="Master - Periode Rekap" />
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
                                    Daftar Periode
                                </Typography>
                                <Typography color="gray" className="mt-1 font-normal">
                                    Informasi mengenai Periode yang terdaftar
                                </Typography>
                            </div>
                            <div className="flex flex-col shrink-0 gap-2 lg:flex-row">
                                <Button
                                    onClick={() => setOpenFormDialog(true)}
                                    className="flex items-center gap-1.5 capitalize font-medium text-base" size="sm"
                                >
                                    <Plus />
                                    Tambahkan Periode baru
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
                                    ({ id, nama, keterangan, awal, akhir, status }, index) => {
                                        const isLast = index === data.length - 1;
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
                                                    <div className="flex items-center gap-3">
                                                        {/*<Avatar src={img} alt={name} size="sm" />*/ }
                                                        <div className="flex flex-col">
                                                            <Typography
                                                                variant="small"
                                                                color="blue-gray"
                                                                className="font-normal"
                                                            >
                                                                { keterangan }
                                                            </Typography>
                                                        </div>
                                                    </div>
                                                </td>
                                                <td className={ `${ classes } min-w-40` }>
                                                    <Typography
                                                        variant="small"
                                                        color="blue-gray"
                                                        className="font-normal"
                                                    >
                                                        { format(awal, 'PPP', {
                                                            locale: localeID
                                                        }) } - { format(akhir, 'PPP', {
                                                        locale: localeID
                                                    }) }
                                                    </Typography>
                                                </td>
                                                <td className={ `${ classes } min-w-32` }>
                                                    <Typography
                                                        variant="small"
                                                        color="blue-gray"
                                                        className="font-normal flex items-center justify-center gap-x-1.5"
                                                    >
                                                        <Switch checked={Boolean(status)} onChange={(val) => handleSwitchStatus(val, index)} as={Fragment} disabled={onSwitchStatus.status && onSwitchStatus.index === index}>
                                                            {({ checked }) => (
                                                                <button
                                                                    className={ `group inline-flex h-6 w-11 items-center rounded-full ${ checked ? 'bg-blue-600' : 'bg-gray-200' } ` }
                                                                >
                                                                     <span className={ `size-4 flex items-center justify-center rounded-full bg-white transition ${ checked ? 'translate-x-6' : 'translate-x-1' }` }>
                                                                         {
                                                                             onSwitchStatus.status && onSwitchStatus.index === index
                                                                                 ? <LoaderCircle className="animate-spin font-bold " width={12} />
                                                                                 : ''
                                                                         }
                                                                     </span>
                                                                </button>
                                                            ) }
                                                        </Switch>
                                                        <span
                                                            className="text-gray-600 font-mono text-xs italic font-bold">
                                                            { Boolean(status) ? 'Dibuka' : 'Ditutup' }
                                                        </span>
                                                    </Typography>
                                                </td>
                                                <td className={ classes }>
                                                    <div className="w-32 flex gap-2.5 items-center justify-start">
                                                        <Tooltip content="Detail">
                                                            <Link
                                                                href={ route('master.periode-rekap.details', { q: data[index].id }) }>
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
                                                                        periodeId: id,
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
                <Dialog
                    size="lg"
                    open={openFormDialog}
                    handler={handleOpenForm}
                    className="bg-transparent shadow-none backdrop-blur-none"
                >
                    <form className="mx-auto w-full" onSubmit={handleFormSubmit}>
                        <Card>
                            <CardBody className="flex flex-col gap-4">
                                <Typography variant="h4" color="blue-gray">
                                    Menambahkan Periode baru
                                </Typography>
                                <Input
                                    label="Nama periode"
                                    size="lg"
                                    required={true}
                                    value={formInput.nama}
                                    onChange={(event) => {
                                        setFormInput((prevState) => ({
                                            ...prevState,
                                            nama: event.target.value,
                                        }));
                                    }}
                                />
                                <Select
                                    label="Jenis Periode Rekap"
                                    value={formInput.jenis}
                                    onChange={(val: string | undefined) => {
                                        if (jenisPeriodeRekap.includes(val as JenisPeriodeRekap)) {
                                            setFormInput((prevState) => ({
                                                ...prevState,
                                                jenis: val as JenisPeriodeRekap
                                            }));
                                        }
                                    }}
                                    className="capitalize"
                                >
                                    {
                                        jenisPeriodeRekap.map((jenis, index) => ((
                                            <Option key={index} value={jenis} className="capitalize">
                                                { jenis }
                                            </Option>
                                        )))
                                    }
                                </Select>
                                <Input
                                    label="Masa Awal periode"
                                    size="lg"
                                    required={true}
                                    type="date"
                                    value={formInput.awal}
                                    onChange={(event) => {
                                        setFormInput((prevState) => ({
                                            ...prevState,
                                            awal: event.target.value,
                                        }));
                                    }}
                                />
                                <Input
                                    label="Masa Akhir periode"
                                    size="lg"
                                    required={true}
                                    type="date"
                                    value={formInput.akhir}
                                    onChange={(event) => {
                                        setFormInput((prevState) => ({
                                            ...prevState,
                                            akhir: event.target.value,
                                        }));
                                    }}
                                />
                                <TextArea
                                    label="Keterangan"
                                    size="lg"
                                    value={formInput.keterangan}
                                    required={true}
                                    onChange={(event) => {
                                        setFormInput((prevState) => ({
                                            ...prevState,
                                            keterangan: event.target.value,
                                        }));
                                    }}
                                />
                                <Checkbox
                                    checked={formInput.status}
                                    onChange={() => {
                                        setFormInput((prevState) => ({
                                            ...prevState,
                                            status: !prevState.status
                                        }));
                                    }}
                                    label={
                                        <Typography color="blue-gray" className="flex font-medium">
                                            Langsung buka periode
                                        </Typography>
                                    }
                                />
                            </CardBody>
                            <CardFooter className="pt-0 flex gap-3 justify-between">
                                <Button
                                    color="red"
                                    onClick={() => setOpenFormDialog(false)}
                                    fullWidth
                                >
                                    Batal
                                </Button>
                                <Button
                                    type="submit"
                                    loading={formInput.onSubmit}
                                    disabled={formSubmitDisabled()}
                                    onClick={handleOpenForm}
                                    fullWidth
                                >
                                    Buat
                                </Button>
                            </CardFooter>
                        </Card>
                    </form>
                </Dialog>

                <Dialog open={deleteDialog.open} handler={handleOpenDelete}>
                    <DialogHeader className="text-gray-900">
                        Hapus Periode terpilih?
                    </DialogHeader>
                    <DialogBody>
                        <Typography variant="h6" className="text-gray-900 truncate">
                            Anda akan menghapus
                            Periode:&nbsp;
                            <span className="font-bold">
                                " { periodes.find((periode) => periode.id === deleteDialog.periodeId)?.nama ?? '-' } "
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
                        <Button color="red" onClick={handleDeletePeriode}>
                            <span>Hapus</span>
                        </Button>
                    </DialogFooter>
                </Dialog>
            </AdminLayout>
        </>
    );
}
