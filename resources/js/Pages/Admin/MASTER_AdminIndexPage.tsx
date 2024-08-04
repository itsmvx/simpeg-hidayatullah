import {
    Button,
    Card,
    CardBody,
    CardFooter,
    CardHeader, Dialog, DialogBody, DialogFooter, DialogHeader,
    IconButton, Select, Option,
    Tooltip,
    Typography, Chip
} from "@material-tailwind/react";
import {
    ArrowLeft, ArrowRight,
    ChevronDown, CircleUserRound, FileSearch,
    Plus,
    Search, Trash2,
} from "lucide-react";
import { MTColor, PageProps } from "@/types";
import { AdminLayout } from "@/Layouts/AdminLayout";
import { Head, Link, router } from "@inertiajs/react";
import { Input } from "@/Components/Input";
import { format } from "date-fns";
import { id as localeID } from "date-fns/locale/id";
import { useTheme } from "@/Hooks/useTheme";
import { SyntheticEvent, useEffect, useMemo, useState } from "react";
import { Bounce, toast } from "react-toastify";
import {  z } from "zod";
import axios, { AxiosError } from "axios";

export default function MasterManageAdminPage({ auth, admins, units }: PageProps<{
    admins: {
        id: string;
        nama: string;
        username: string;
        unit: {
            id: string;
            nama: string;
            keterangan: string;
        };
        created_at: string;
    }[];
    units: {
        id: string;
        nama: string;
    }[]
}>) {

    const TABLE_HEAD = ['No', 'Nama', 'Username', 'Unit', 'Tanggal daftar', 'Aksi'];
    const cardData = [
        {
            color: "gray",
            icon: <CircleUserRound />,
            title: "Jumlah Admin terdaftar",
            value: admins.length,
        }
    ];
    const { theme } = useTheme();
    const [ openFormDialog, setOpenFormDialog ] = useState(false);
    const [ deleteDialog, setDeleteDialog ] = useState<{
        open: boolean;
        id: string;
        nama: string;
        onSubmit: boolean;
    }>({
        open: false,
        id: '',
        nama: '',
        onSubmit: false
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

        return admins.slice(startIndex, lastIndex);
    }, [ admins, viewPerPage ]);

    const [ data, setData ] = useState(adjustData);
    const [ search, setSearch ] = useState('');
    const getItemProps = (index: number) =>
        ({
            variant: currPage === index ? "filled" : "text",
            color: "gray",
            className: "rounded-full",
        } as any);

    const nextPage = () => {
        const totalPages = Math.ceil(admins.length / viewPerPage);
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
        username: '',
        password: '',
        unitId: '',
        passwordView: false,
        error: {
            nama: false,
            username: false,
            password: false,
            unitId: false
        },
        onSubmit: false
    };
    const [ formInput, setFormInput ] = useState<{
        nama: string;
        username: string;
        password: string;
        unitId: string | null;
        passwordView: boolean;
        error: {
            nama: boolean;
            username: boolean;
            password: boolean;
            unitId: boolean;
        };
        onSubmit: boolean;
    }>(formInputInit);
    const resetPasswordInit = {
        onOpen: false,
        onFetch: false,
        id: '',
        nama: '',
        newPassword: '',
        newPassword1: ''
    }
    const [ resetPassword, setResetPassword ] = useState<{
        onOpen: boolean;
        onFetch: boolean;
        id: string;
        nama: string;
        newPassword: string;
        newPassword1: string;
    }>(resetPasswordInit);

    // @ts-ignore
    const formSubmitDisabled = (): boolean => (!formInput.nama || !formInput.username || !formInput.password || (typeof formInput.unitId !== null ? formInput.unitId?.length < 1 : false));
    const handleFormSubmit = (event: SyntheticEvent<HTMLFormElement>) => {
        event.preventDefault();
        const { nama, username, password, unitId } = formInput

        setFormInput((prevState) => ({
            ...prevState,
            onSubmit: true
        }));
        const adminschema = z.object({
            nama: z.string().min(1, { message: "Nama Admin tidak boleh kosong" }),
            username: z.string().min(1, { message: "Username Admin tidak boleh kosong" }),
            password: z.string().min(1, { message: "Password tidak boleh kosong" }),
            unitId: z.string().min(1, { message: "Unit belum dipilih" }).nullable(),
        });
        const zodUnitResult = adminschema.safeParse({
            nama: nama,
            username: username,
            password: password,
            unitId: unitId
        });
        if (!zodUnitResult.success) {
            const errorMessages = zodUnitResult.error.issues[0].message;
            notifyToast('error', errorMessages, theme as 'light' | 'dark');
        }

        axios.post(route('admin.create'), {
            nama: nama,
            username: username,
            password: password,
            unit_id: unitId
        })
            .then(() => {
                notifyToast('success', 'Admin berhasil ditambahkan!', theme as 'light' | 'dark');
                router.reload({ only: ['admins'] });
            })
            .catch((err: unknown) => {
                const errMsg: string = err instanceof AxiosError
                    ? err.response?.data.message ?? 'Error tidak diketahui terjadi!'
                    : 'Error tidak diketahui terjadi!'
                notifyToast('error', errMsg, theme as 'light' | 'dark');
            })
            .finally(() => {
                setOpenFormDialog(false);
                setFormInput((prevState) => ({ ...prevState, onSubmit: false }))
            });
    };
    const handleDeleteSubmit = () => {
        const { id } = deleteDialog

        setDeleteDialog((prevState) => ({
            ...prevState,
            onSubmit: true
        }));
        const adminschema = z.object({
            id: z.string().min(1, { message: "Admin belum terpilih" }),
        });
        const zodUnitResult = adminschema.safeParse({
            id: id,
        });
        if (!zodUnitResult.success) {
            const errorMessages = zodUnitResult.error.issues[0].message;
            notifyToast('error', errorMessages, theme as 'light' | 'dark');
        }

        axios.post(route('admin.delete'), {
            id: id,
        })
            .then(() => {
                notifyToast('success', 'Admin berhasil dihapus!', theme as 'light' | 'dark');
                router.reload({ only: ['admins'] });
            })
            .catch((err: unknown) => {
                const errMsg: string = err instanceof AxiosError
                    ? err.response?.data.message ?? 'Error tidak diketahui terjadi!'
                    : 'Error tidak diketahui terjadi!'
                notifyToast('error', errMsg, theme as 'light' | 'dark');
            })
            .finally(() => {
                setDeleteDialog((prevState) => ({ ...prevState, onSubmit: false, open: false }));
            });
    };
    const handleResetPassword = (event: SyntheticEvent<HTMLFormElement>) => {
        event.preventDefault();
        const { id, newPassword } = resetPassword;
        const resetSchema = z.object({
            id: z.string().min(1, { message: "Admin belum dipilih!" }),
            newPassword: z.string().min(1, { message: "Password Admin tidak boleh kosong" }),
        });
        const zodUnitResult = resetSchema.safeParse({
            id: id,
            newPassword: newPassword
        });
        if (!zodUnitResult.success) {
            const errorMessages = zodUnitResult.error.issues[0].message;
            notifyToast('error', errorMessages, theme as 'light' | 'dark');
            return;
        }
        setResetPassword((prevState) => ({ ...prevState, onFetch: true }))
        axios.post(route('admin.reset'), {
            id: id,
            password: newPassword
        })
            .then(() => {
                notifyToast('success', 'Atur ulang password berhasil!', theme as 'light' | 'dark');
                router.reload({ only: ['admins'] });
            })
            .catch((err: unknown) => {
                const errMsg: string = err instanceof AxiosError
                    ? err.response?.data.message ?? 'Error tidak diketahui terjadi!'
                    : 'Error tidak diketahui terjadi!'
                notifyToast('error', errMsg, theme as 'light' | 'dark');
            })
            .finally(() => {
                setResetPassword((prevState) => ({
                    ...prevState,
                    onOpen: false,
                    onFetch: false
                }));
            })
    };
    useEffect(() => {
        if (!openFormDialog) {
            setFormInput(formInputInit);
        }
    }, [ openFormDialog ]);
    useEffect(() => {
        if (!resetPassword.onOpen) {
            setResetPassword(resetPasswordInit);
        }
    }, [ resetPassword.onOpen ])
    useEffect(() => {
        setData(adjustData);
    }, [ admins, viewPerPage ]);
    useEffect(() => {
        if (search.length < 1) {
            setData(adjustData);
        } else {
            setCurrPage(1);
            const matchadmins = admins.filter((Admin) => Admin.nama.toLowerCase().includes(search.toLowerCase()));
            setData(matchadmins);
        }
    }, [ search ]);

    return (
        <>
            <Head title="Master - Admin" />
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
                                    Daftar Admin
                                </Typography>
                                <Typography color="gray" className="mt-1 font-normal">
                                    Informasi mengenai Admin yang terdaftar
                                </Typography>
                            </div>
                            <div className="flex flex-row-reverse shrink-0 gap-2">
                                <Button
                                    onClick={() => setOpenFormDialog(true)}
                                    className="flex items-center gap-1.5 capitalize font-medium text-base" size="sm"
                                >
                                    <Plus />
                                    Tambahkan Admin baru
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
                                    ({ id, nama, username, unit, created_at }, index) => {
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
                                                    <Typography
                                                        variant="small"
                                                        color="blue-gray"
                                                        className="font-normal"
                                                    >
                                                        { nama }
                                                    </Typography>
                                                </td>
                                                <td className={ `${ classes } min-w-52` }>
                                                    <div className="flex items-center gap-3">
                                                        <div className="flex flex-col">
                                                            <Typography
                                                                variant="small"
                                                                color="blue-gray"
                                                                className="font-normal"
                                                            >
                                                                { username }
                                                            </Typography>
                                                        </div>
                                                    </div>
                                                </td>
                                                <td className={ `${ classes } min-w-52` }>
                                                    <div className="flex items-center gap-3">
                                                        <Link href={route('master.unit.details')} data={{ q: unit.id }} className="text-sm font-normal hover:text-blue-600">
                                                            { unit.nama }
                                                        </Link>
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
                                                    <div className="w-44 flex gap-2.5 items-center justify-start">
                                                        <Tooltip content="Atur ulang Password">
                                                            <IconButton variant="text" onClick={ () => {
                                                                setResetPassword((prevState) => ({
                                                                    ...prevState,
                                                                    onOpen: true,
                                                                    id: id,
                                                                    nama: nama
                                                                }))
                                                            } }>
                                                                <svg xmlns="http://www.w3.org/2000/svg" width="1em" height="1em" viewBox="0 0 24 24" className="h-5 w-5">
                                                                    <path fill="currentColor" d="m19.75 22.575l-7.55-7.55q-.8 1.35-2.175 2.163T7 18q-2.5 0-4.25-1.75T1 12q0-1.65.813-3.025T3.975 6.8l-2.55-2.55l1.425-1.4l18.3 18.325zM21 9l3 3l-4.575 4.575l-3.175-3.15l1.25-.925l1.8 1.35L21.175 12l-1-1h-6.35l-2-2zM7 16q1.275 0 2.263-.687t1.437-1.788l-1.4-1.4l-1.213-1.213L6.876 9.7l-1.4-1.4q-1.1.45-1.787 1.438T3 12q0 1.65 1.175 2.825T7 16m0-2q-.825 0-1.412-.587T5 12t.588-1.412T7 10t1.413.588T9 12t-.587 1.413T7 14"/>
                                                                </svg>
                                                            </IconButton>
                                                        </Tooltip>
                                                        <Tooltip content="Detail" className="bg-blue-600">
                                                            <IconButton variant="text" onClick={ () => {
                                                                router.visit(route('master.admin.details'), { data: { q: id } })
                                                            } }>
                                                                <FileSearch className="h-5 w-5 text-blue-800"/>
                                                            </IconButton>
                                                        </Tooltip>
                                                        <Tooltip content="Hapus" className="bg-red-400">
                                                            <IconButton
                                                                variant="text"
                                                                onClick={() => {
                                                                    setDeleteDialog((prevState) => ({
                                                                        ...prevState,
                                                                        open: true,
                                                                        id: id,
                                                                        nama: admins.find((Admin) => Admin.id === id)?.nama ?? '-'
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
                                    Menambahkan Admin baru
                                </Typography>
                                <Input
                                    label="Nama Admin"
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
                                <Input
                                    label="Username"
                                    size="lg"
                                    value={formInput.username}
                                    required={true}
                                    error={formInput.error.username}
                                    onChange={(event) => {
                                        setFormInput((prevState) => ({
                                            ...prevState,
                                            username: event.target.value,
                                            error: {
                                                ...prevState.error,
                                                username: event.target.value.length < 1
                                            }
                                        }));
                                    }}
                                />
                                <div className="flex gap-1 items-center">
                                    <Input
                                        type="password"
                                        label="Password"
                                        size="lg"
                                        value={formInput.password}
                                        required={true}
                                        error={formInput.error.password}
                                        onChange={(event) => {
                                            setFormInput((prevState) => ({
                                                ...prevState,
                                                password: event.target.value,
                                                error: {
                                                    ...prevState.error,
                                                    password: event.target.value.length < 1
                                                }
                                            }));
                                        }}
                                    />
                                </div>
                                <Select
                                    label="Hak Akses Admin" size="lg"
                                    onChange={(value) => {
                                        setFormInput((prevState) => ({
                                            ...prevState,
                                            unitId: value === "null" ? null : value ?? '',
                                        }))
                                    }}
                                >
                                    {
                                        units.length > 0
                                            ? [
                                                { id: 'null', nama: '| UNIT MASTER |' },
                                                ...units.sort((a, b) => a.nama.localeCompare(b.nama))
                                            ].map((unit, index) => ((
                                                <Option key={unit.id} value={unit.id}>
                                                    <div className="flex items-center justify-between ">
                                                        { index === 0 ? (
                                                            <>
                                                                <p className="font-bold">
                                                                    | UNIT MASTER |
                                                                </p>
                                                                <span>
                                                                    <Chip size="sm" variant="ghost" value="Master" color="green" className="ml-3"/>
                                                                </span>
                                                            </>
                                                        ) : unit.nama
                                                        }
                                                    </div>
                                                </Option>
                                            ))) : (
                                                <Option disabled>
                                                    <p className="!text-gray-900 !text-sm">
                                                        { units.length < 1
                                                            ? 'Belum ada Unit yang didaftarkan'
                                                            : 'Pilih Akses Unit'
                                                        }
                                                    </p>
                                                </Option>
                                            )
                                    }
                                </Select>
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
                        Hapus Admin terpilih?
                    </DialogHeader>
                    <DialogBody>
                        <Typography variant="h6" className="text-gray-900 truncate">
                            Anda akan menghapus
                            Admin: &nbsp;
                            <span className="font-semibold">
                                " { deleteDialog.nama } "
                            </span>
                        </Typography>
                        <p className="text-sm text-gray-900 font-medium">
                                <span className="text-red-600 font-bold">
                                    *
                                </span>
                            Pegawai yang terhubung akan akan kehilangan status Admin
                        </p>
                    </DialogBody>
                    <DialogFooter>
                        <Button
                            color="black"
                            onClick={ () => setDeleteDialog((prevState) => ({ ...prevState, open: false })) }
                            className="mr-1"
                        >
                            <span>Batal</span>
                        </Button>
                        <Button color="red" onClick={handleDeleteSubmit} loading={deleteDialog.onSubmit}>
                            <span>Hapus</span>
                        </Button>
                    </DialogFooter>
                </Dialog>
                <Dialog
                    size="md"
                    open={resetPassword.onOpen}
                    handler={() => setResetPassword((prevState) => ({ ...prevState, onOpen: true }))}
                    className="bg-transparent shadow-none backdrop-blur-none"
                >
                    <form className="mx-auto w-full" onSubmit={handleResetPassword}>
                        <Card>
                            <CardBody className="flex flex-col gap-4">
                                <Typography variant="h4" color="blue-gray">
                                    Mengupdate Password Admin
                                </Typography>
                                <p className="text-sm font-medium text-gray-900">
                                    <span className="text-red-600">*</span>
                                    Mengubah password untuk&nbsp;
                                    { resetPassword.nama }
                                </p>
                                <div className="flex gap-1 items-center">
                                    <Input
                                        type="password"
                                        label="Password baru"
                                        size="lg"
                                        value={ resetPassword.newPassword }
                                        required={ true }
                                        onChange={ (event) => {
                                            setResetPassword((prevState) => ({
                                                ...prevState,
                                                newPassword: event.target.value
                                            }));
                                        } }
                                    />
                                </div>
                                <div className="flex gap-1 items-center">
                                    <Input
                                        type="password"
                                        label="Ulangi Password baru"
                                        size="lg"
                                        value={ resetPassword.newPassword1 }
                                        required={ true }
                                        onChange={ (event) => {
                                            setResetPassword((prevState) => ({
                                                ...prevState,
                                                newPassword1: event.target.value
                                            }));
                                        } }
                                    />
                                </div>
                            </CardBody>
                            <CardFooter className="pt-0 flex gap-3 justify-between">
                                <Button
                                    color="red"
                                    onClick={ () => setResetPassword((prevState) => ({ ...prevState, onOpen: false })) }
                                    fullWidth
                                >
                                    Batal
                                </Button>
                                <Button
                                    type="submit"
                                    loading={ resetPassword.onFetch }
                                    disabled={ !resetPassword.newPassword || resetPassword.onFetch || (resetPassword.newPassword !== resetPassword.newPassword1) }
                                    fullWidth
                                >
                                    Simpan
                                </Button>
                            </CardFooter>
                        </Card>
                    </form>
                </Dialog>
            </AdminLayout>
        </>
    );
}
