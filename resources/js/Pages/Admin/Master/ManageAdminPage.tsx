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
    Pencil,
    Plus,
    Search, Trash2,
} from "lucide-react";
import { MTColor, PageProps } from "@/types";
import { AdminLayout } from "@/Layouts/AdminLayout";
import { Head, router } from "@inertiajs/react";
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
        isMaster: number;
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
        unitId: string;
        passwordView: boolean;
        error: {
            nama: boolean;
            username: boolean;
            password: boolean;
            unitId: boolean;
        };
        onSubmit: boolean;
    }>(formInputInit);

    const formSubmitDisabled = (): boolean => (!formInput.nama || !formInput.username || !formInput.password || !formInput.unitId);
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
            unitId: z.string().min(1, { message: "Unit belum dipilih" }),
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
    useEffect(() => {
        if (!openFormDialog) {
            setFormInput(formInputInit);
        }
    }, [ openFormDialog ]);
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
                            <div className="flex shrink-0 flex-col gap-2 sm:flex-row">
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
                                                    <div className="flex items-center gap-3">
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
                                                        <div className="flex flex-col">
                                                            <Typography
                                                                variant="small"
                                                                color="blue-gray"
                                                                className="font-normal"
                                                            >
                                                                { unit.nama }
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
                                                        { format(created_at, 'PPpp', {
                                                            locale: localeID
                                                        }) }
                                                    </Typography>
                                                </td>
                                                <td className={ classes }>
                                                    <div className="w-32 flex gap-2.5 items-center justify-start">
                                                        <Tooltip content="Detail">
                                                            <IconButton variant="text">
                                                                <FileSearch className="h-5 w-5 text-blue-800"/>
                                                            </IconButton>
                                                        </Tooltip>
                                                        <Tooltip content="Edit">
                                                            <IconButton variant="text">
                                                                <Pencil className="h-5 w-5"/>
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
                                    label="Hak Akses Unit" size="lg"
                                    onChange={(value) => {
                                        setFormInput((prevState) => ({
                                            ...prevState,
                                            unitId: value ?? '',
                                        }))
                                    }}
                                >

                                    {
                                        units.length > 0
                                            ? units.sort((a, b) => {
                                                if (a.isMaster !== b.isMaster) {
                                                    return b.isMaster - a.isMaster;
                                                }
                                                return a.nama.localeCompare(b.nama);
                                            }).map((unit) => ((
                                                <Option key={unit.id} value={unit.id}>
                                                    <div className="flex items-center justify-between ">
                                                        { unit.nama }
                                                        <span>
                                                            { Boolean(unit.isMaster) && (
                                                                <Chip size="sm" variant="ghost" value="Master" color="green" className="ml-3"/>
                                                            )}
                                                        </span>
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
            </AdminLayout>
        </>
    );
}
