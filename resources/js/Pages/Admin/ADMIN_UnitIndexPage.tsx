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

export default function MasterManageUnitPage({ auth, units, adminCount }: PageProps<{
    units: {
        id: string;
        nama: string;
        keterangan: string;
        created_at: string;
        admin: {
            id: string;
            username: string;
            unit_id: string;
        }[] | []
    }[] | [];
    adminCount: number;
}>) {
    const TABLE_HEAD = ['No', 'Nama', 'Admin', 'Tanggal daftar', 'Aksi'];
    const cardData = [
        {
            color: "gray",
            icon: <Building2 />,
            title: "Jumlah Unit terdaftar",
            value: units.length,
        },
        {
            color: "gray",
            icon: <User2 />,
            title: "Jumlah Akun Unit aktif",
            value: adminCount,
        },
        {
            color: "gray",
            icon: <NotebookText />,
            title: "Pengajuan Promosi Unit",
            value: "1",
        },
        {
            color: "gray",
            icon: <BarChartBig />,
            title: "Lorem ipsum",
            value: "704",
        },
    ];
    const deleteDialogInit = {
        open: false,
        unitId: '',
        admins: []
    };
    const { theme } = useTheme();
    const [ openFormDialog, setOpenFormDialog ] = useState(false);
    const [ deleteDialog, setDeleteDialog ] = useState<{
        open: boolean;
        unitId: string;
        admins: {
            id: string;
            username: string;
            unit_id: string;
        }[]
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

        return units.slice(startIndex, lastIndex);
    }, [ units, viewPerPage ]);

    const [data, setData] = useState(adjustData);
    const [ search, setSearch ] = useState('');
    const getItemProps = (index: number) =>
        ({
            variant: currPage === index ? "filled" : "text",
            color: "gray",
            className: "rounded-full",
        } as any);

    const nextPage = () => {
        const totalPages = Math.ceil(units.length / viewPerPage);
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
    const formInputInit = {
        nama: '',
        keterangan: '',
        error: {
            nama: false,
            keterangan: false
        },
        onSubmit: false
    };
    const [ formInput, setFormInput ] = useState<{
        nama: string;
        keterangan: string;
        error: {
            nama: boolean;
            keterangan: boolean;
        };
        onSubmit: boolean;
    }>(formInputInit);

    const handleXLSXDownload = () => {
        const workbook = XLSX.utils.book_new();
        const data = units.map((unit) => ({
            nama: unit.nama,
            keterangan: unit.keterangan,
            tanggal_daftar: format(unit.created_at, 'PPPP', {
                locale: id
            })
        }))
        const sheet = XLSX.utils.json_to_sheet(data, {
            header: ['nama', 'keterangan', 'tanggal_daftar'],
        });
        XLSX.utils.book_append_sheet(workbook, sheet, 'Sheet1');

        const wbout = XLSX.write(workbook, { bookType: 'xlsx', type: 'array' });
        const blob = new Blob([wbout], { type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' });
        const url = URL.createObjectURL(blob);
        const link = document.createElement('a');
        link.href = url;
        link.download = 'data.xlsx';
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
    };
    const formSubmitDisabled = (): boolean => (!formInput.nama || !formInput.keterangan);
    const handleFormSubmit = (event: SyntheticEvent<HTMLFormElement>) => {
        event.preventDefault();
        const { nama, keterangan } = formInput

        setFormInput((prevState) => ({
            ...prevState,
            onSubmit: true
        }));
        const unitSchema = z.object({
            nama: z.string().min(1, { message: "Nama Unit tidak boleh kosong" }),
            keterangan: z.string().min(1, { message: "Keterangan Unit tidak boleh kosong" })
        });
        const zodUnitResult = unitSchema.safeParse({
            nama: nama,
            keterangan: keterangan
        });
        if (!zodUnitResult.success) {
            const errorMessages = zodUnitResult.error.issues[0].message;
            notifyToast('error', errorMessages, theme as 'light' | 'dark');
        }

        axios.post(route('unit.create'), {
            nama: nama,
            keterangan: keterangan,
        })
            .then(() => {
                notifyToast('success', 'Unit berhasil ditambahkan!', theme as 'light' | 'dark');
                router.reload({ only: ['units'] });
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
    const handleDeleteUnit = () => {
        axios.post(route('unit.delete'), {
            id: deleteDialog.unitId,
            admins: deleteDialog.admins.length > 0
                ? deleteDialog.admins.map((admin) => admin.id)
                : []
        })
            .then(() => {
                notifyToast('success', 'Unit terpilih berhasil dihapus!');
                setData((prevState) => prevState.filter((filt) => filt.id !== deleteDialog.unitId));
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
    }, [ units, viewPerPage ]);
    useEffect(() => {
        if (search.length < 1) {
            setData(adjustData);
        } else {
            setCurrPage(1);
            const matchUnits = units.filter(unit =>
                unit.nama.toLowerCase().includes(search.toLowerCase()) ||
                unit.admin.some(admin => admin.username.toLowerCase().includes(search.toLowerCase()))
            );
            setData(matchUnits);
        }
    }, [ search ]);

    return (
        <>
            <Head title="Master - Unit" />
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
                                    Daftar Unit
                                </Typography>
                                <Typography color="gray" className="mt-1 font-normal">
                                    Informasi mengenai Unit yang terdaftar
                                </Typography>
                            </div>
                            <div className="flex flex-col shrink-0 gap-2 lg:flex-row">
                                <Button
                                    onClick={() => setOpenFormDialog(true)}
                                    className="flex items-center gap-1.5 capitalize font-medium text-base" size="sm"
                                >
                                    <Plus />
                                    Tambahkan Unit baru
                                </Button>
                                <Button
                                    onClick={handleXLSXDownload}
                                    className="flex items-center gap-1.5 capitalize font-medium text-base" size="sm"
                                >
                                    <Download />
                                    Unduh Data (XLSX)
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
                                                                        Belum ada Admin untuk unit ini
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
                                                            <Link href={route('master.unit.details', { q: units[index].id })}>
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
                                                                        unitId: id,
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
                                    Menambahkan Unit baru
                                </Typography>
                                <Input
                                    label="Nama unit"
                                    size="lg"
                                    required={true}
                                    error={formInput.error.nama}
                                    value={formInput.nama}
                                    onChange={(event) => {
                                        setFormInput((prevState) => ({
                                            ...prevState,
                                            nama: event.target.value,
                                            error: {
                                                ...prevState.error,
                                                nama: event.target.value.length < 1
                                            }
                                        }));
                                    }}
                                />
                                <TextArea
                                    label="Keterangan"
                                    size="lg"
                                    value={formInput.keterangan}
                                    required={true}
                                    error={formInput.error.keterangan}
                                    onChange={(event) => {
                                        setFormInput((prevState) => ({
                                            ...prevState,
                                            keterangan: event.target.value,
                                            error: {
                                                ...prevState.error,
                                                keterangan: event.target.value.length < 1
                                            }
                                        }));
                                    }}
                                />
                                {/*<Checkbox*/}
                                {/*    checked={formInput.isMaster}*/}
                                {/*    onChange={() => {*/}
                                {/*        setFormInput((prevState) => ({*/}
                                {/*            ...prevState, isMaster: !prevState.isMaster*/}
                                {/*        }));*/}
                                {/*    }}*/}
                                {/*    label={*/}
                                {/*        <Typography color="blue-gray" className="flex font-medium">*/}
                                {/*            Berikan Hak Master. Apa itu Hak master?*/}
                                {/*            <Typography*/}
                                {/*                as="a"*/}
                                {/*                href="#"*/}
                                {/*                color="blue"*/}
                                {/*                className="font-medium transition-colors hover:text-blue-700"*/}
                                {/*            >*/}
                                {/*                &nbsp;Pelajari selengkapnya*/}
                                {/*            </Typography>*/}
                                {/*            .*/}
                                {/*        </Typography>*/}
                                {/*    }*/}
                                {/*/>*/}
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
                        Hapus Unit terpilih?
                    </DialogHeader>
                    <DialogBody>
                        <Typography variant="h6" className="text-gray-900 truncate">
                            Anda akan menghapus
                            Unit:&nbsp;
                            <span className="font-bold">
                                " { units.find((unit) => unit.id === deleteDialog.unitId)?.nama ?? '-' } "
                            </span>
                        </Typography>
                        <p className="mt-1.5 text-sm text-gray-900 font-medium">
                                <span className="text-red-600 font-bold">
                                    *
                                </span>
                            Admin yang terhubung dengan Unit akan ikut dihapus:
                        </p>
                        <ul className="flex flex-col gap-1.5 h-40 overflow-auto p-2 border-2 text-gray-800 font-medium">
                            {
                                deleteDialog.admins.map((admin) => ((
                                    <li key={admin.id}>
                                        <span>-</span> { admin.username }
                                    </li>
                                )))
                            }
                            {
                                deleteDialog.admins.length < 1 && ( <p className="text-sm italic font-medium">Unit belum memiliki Admin</p>)
                            }
                        </ul>
                    </DialogBody>
                    <DialogFooter>
                        <Button
                            color="black"
                            onClick={ () => setDeleteDialog(deleteDialogInit)}
                            className="mr-1"
                        >
                        <span>Batal</span>
                        </Button>
                        <Button color="red" onClick={handleDeleteUnit}>
                            <span>Hapus</span>
                        </Button>
                    </DialogFooter>
                </Dialog>
            </AdminLayout>
        </>
    );
}
