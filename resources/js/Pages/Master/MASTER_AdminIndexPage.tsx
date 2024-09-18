import {
    Button,
    Card,
    CardBody,
    CardFooter,
    CardHeader, Chip,
    Dialog,
    DialogBody,
    DialogFooter,
    DialogHeader,
    IconButton,
    Option, Select,
    Tooltip,
    Typography
} from "@material-tailwind/react";
import { FileSearch, Plus,Trash2 } from "lucide-react";
import { PageProps, PaginationData } from "@/types";
import { MasterLayout } from "@/Layouts/MasterLayout";
import { Head, Link, router } from "@inertiajs/react";
import { Input } from "@/Components/Input";
import { format } from "date-fns";
import { id as localeID } from "date-fns/locale/id";
import { SyntheticEvent, useEffect, useState } from "react";
import axios, { AxiosError } from "axios";
import Pagination from "@/Components/Pagination";
import { notifyToast } from "@/Lib/Utils";
import { z } from "zod";
import { SearchInput } from "@/Components/SearchInput";
import { ViewPerPageList } from "@/Components/ViewPerPageList";

type Admins = {
    id: string;
    nama: string;
    username: string;
    created_at: string;
    unit: {
        id: string;
        nama: string;
        keterangan: string;
    } | null;
}[];
type Units = {
    id: string;
    nama: string;
}[];

export default function MASTER_AdminIndexPage({ auth, pagination, units }: PageProps<{
    pagination: PaginationData<Admins>;
    units: Units;
}>) {
    const TABLE_HEAD = ['No', 'Nama', 'Username', 'Unit', 'Tanggal daftar', 'Aksi'];

    const deleteDialogInit = {
        open: false,
        adminId: '',
    };
    const [ openFormDialog, setOpenFormDialog ] = useState(false);
    const [ deleteDialog, setDeleteDialog ] = useState<{
        open: boolean;
        adminId: string;
    }>(deleteDialogInit);
    const [ onSubmitDelete, setOnSubmitDelete ] = useState(false);
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
            adminId: false
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
            adminId: boolean;
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
    };
    const [ resetPassword, setResetPassword ] = useState<{
        onOpen: boolean;
        onFetch: boolean;
        id: string;
        nama: string;
        newPassword: string;
        newPassword1: string;
    }>(resetPasswordInit);

    const handleOpenForm = () => setOpenFormDialog(true);
    const formSubmitDisabled = (): boolean => (!formInput.nama || !formInput.username || !formInput.password );
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
            adminId: z.string().min(1, { message: "Unit belum dipilih" }).nullable(),
        });
        const zodUnitResult = adminschema.safeParse({
            nama: nama,
            username: username,
            password: password,
            adminId: unitId
        });
        if (!zodUnitResult.success) {
            const errorMessages = zodUnitResult.error.issues[0].message;
            notifyToast('error', errorMessages);
        }

        axios.post(route('admin.create'), {
            nama: nama,
            username: username,
            password: password,
            unit_id: unitId
        })
            .then(() => {
                notifyToast('success', 'Admin berhasil ditambahkan!');
                router.reload({ only: ['pagination'] });
            })
            .catch((err: unknown) => {
                const errMsg: string = err instanceof AxiosError
                    ? err.response?.data.message ?? 'Error tidak diketahui terjadi!'
                    : 'Error tidak diketahui terjadi!'
                notifyToast('error', errMsg);
            })
            .finally(() => {
                setOpenFormDialog(false);
                setFormInput((prevState) => ({ ...prevState, onSubmit: false }))
            });
    };
    const handleOpenDelete = () => setDeleteDialog((prevState) => ({
        ...prevState,
        open: true
    }));

    const handleDeleteAdmin = () => {
        setOnSubmitDelete(true);
        axios.post(route('admin.delete'), {
            id: deleteDialog.adminId,
        })
            .then(() => {
                notifyToast('success', 'Admin terpilih berhasil dihapus!');
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
            notifyToast('error', errorMessages);
            return;
        }
        setResetPassword((prevState) => ({ ...prevState, onFetch: true }))
        axios.post(route('admin.reset'), {
            id: id,
            password: newPassword
        })
            .then(() => {
                notifyToast('success', 'Atur ulang password berhasil!');
                router.reload({ only: ['pagination'] });
            })
            .catch((err: unknown) => {
                const errMsg: string = err instanceof AxiosError
                    ? err.response?.data.message ?? 'Error tidak diketahui terjadi!'
                    : 'Error tidak diketahui terjadi!'
                notifyToast('error', errMsg);
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
    }, [openFormDialog]);
    useEffect(() => {
        if (!resetPassword.onOpen) {
            setResetPassword(resetPasswordInit);
        }
    }, [resetPassword.onOpen])

    return (
        <>
            <Head title="Master - Admin" />
            <MasterLayout auth={auth}>
                <Card className="h-full w-full" shadow={false}>
                    <CardHeader floated={false} shadow={false} className="rounded-none">
                        <div className="mb-8 flex flex-col lg:flex-row items-start justify-between gap-3">
                            <div>
                                <Typography variant="h5" color="blue-gray">
                                    Daftar Admin
                                </Typography>
                                <Typography color="gray" className="mt-1 font-normal">
                                    Informasi Admin yang terdaftar
                                </Typography>
                            </div>
                            <div className="w-full lg:w-72 flex flex-col justify-end gap-2">
                                <ViewPerPageList />
                                <SearchInput />
                            </div>
                        </div>
                        <div className="w-full flex flex-row-reverse justify-between gap-4">
                            <div className="flex flex-col shrink-0 gap-2 lg:flex-row">
                                <Button
                                    onClick={() => setOpenFormDialog(true)}
                                    className="flex items-center gap-1.5 capitalize font-medium text-base bg-pph-green-deep hover:bg-pph-green-deep/80 hover:text-white" size="sm"
                                >
                                    <Plus />
                                    Tambahkan
                                </Button>
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
                                        ({ id, nama, username, unit, created_at }, index) => {
                                            const isLast = index === pagination.data.length - 1;
                                            const classes = isLast
                                                ? "p-4"
                                                : "p-4 border-b border-blue-gray-50";

                                            return (
                                                <tr key={id} className="even:bg-gray-100">
                                                    <td className={`${classes} w-3`}>
                                                        <Typography
                                                            variant="small"
                                                            color="blue-gray"
                                                            className="font-normal text-center"
                                                        >
                                                            {pagination.from + index}
                                                        </Typography>
                                                    </td>
                                                    <td className={`${classes} min-w-52`}>
                                                        <Typography
                                                            variant="small"
                                                            color="blue-gray"
                                                            className="font-normal"
                                                        >
                                                            {nama}
                                                        </Typography>
                                                    </td>
                                                    <td className={`${classes} min-w-52`}>
                                                        <div className="flex items-center gap-3">
                                                            <Typography
                                                                variant="small"
                                                                color="blue-gray"
                                                                className="font-normal"
                                                            >
                                                                {username}
                                                            </Typography>
                                                        </div>
                                                    </td>
                                                    <td className={`${classes} min-w-52`}>
                                                        <div className="flex items-center gap-3">
                                                            <Link as="button" href={route('master.unit.details')} data={{ q: unit?.id ?? '' }} className="text-sm font-normal hover:text-blue-600" disabled={!unit}>
                                                                {unit ? unit.nama : 'MASTER'}
                                                            </Link>
                                                        </div>
                                                    </td>
                                                    <td className={`${classes} min-w-40`}>
                                                        <Typography
                                                            variant="small"
                                                            color="blue-gray"
                                                            className="font-normal"
                                                        >
                                                            {format(created_at, 'PPPp', {
                                                                locale: localeID
                                                            })}
                                                        </Typography>
                                                    </td>
                                                    <td className={classes}>
                                                        <div className="w-44 flex gap-2.5 items-center justify-start">
                                                            <Tooltip content="Atur ulang Password">
                                                                <IconButton variant="text" onClick={() => {
                                                                    setResetPassword((prevState) => ({
                                                                        ...prevState,
                                                                        onOpen: true,
                                                                        id: id,
                                                                        nama: nama
                                                                    }))
                                                                }}>
                                                                    <svg xmlns="http://www.w3.org/2000/svg" width="1em" height="1em" viewBox="0 0 24 24" className="h-5 w-5">
                                                                        <path fill="currentColor" d="m19.75 22.575l-7.55-7.55q-.8 1.35-2.175 2.163T7 18q-2.5 0-4.25-1.75T1 12q0-1.65.813-3.025T3.975 6.8l-2.55-2.55l1.425-1.4l18.3 18.325zM21 9l3 3l-4.575 4.575l-3.175-3.15l1.25-.925l1.8 1.35L21.175 12l-1-1h-6.35l-2-2zM7 16q1.275 0 2.263-.687t1.437-1.788l-1.4-1.4l-1.213-1.213L6.876 9.7l-1.4-1.4q-1.1.45-1.787 1.438T3 12q0 1.65 1.175 2.825T7 16m0-2q-.825 0-1.412-.587T5 12t.588-1.412T7 10t1.413.588T9 12t-.587 1.413T7 14" />
                                                                    </svg>
                                                                </IconButton>
                                                            </Tooltip>
                                                            <Tooltip content="Detail" className="bg-blue-600">
                                                                <IconButton variant="text" onClick={() => {
                                                                    router.visit(route('master.admin.details'), { data: { q: id } })
                                                                }}>
                                                                    <FileSearch className="h-5 w-5 text-blue-800" />
                                                                </IconButton>
                                                            </Tooltip>
                                                            <Tooltip content="Hapus" className="bg-red-400">
                                                                <IconButton
                                                                    variant="text"
                                                                    onClick={() => {
                                                                        setDeleteDialog((prevState) => ({
                                                                            ...prevState,
                                                                            open: true,
                                                                            adminId: id,
                                                                        }))
                                                                    }}
                                                                >
                                                                    <Trash2 className="h-5 w-5 text-red-600" />
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
                                                    Belum ada data Admin
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
                                            error: {
                                                ...prevState.error,
                                                unitId: value === "null" || !value,
                                            }
                                        }));
                                    }}
                                >
                                    {
                                        units.length > 0
                                            ? [
                                                { id: 'null', nama: '| UNIT MASTER |' },
                                                ...units.sort((a, b) => a.nama.localeCompare(b.nama))
                                            ].map((admin, index) => (
                                                <Option key={admin.id} value={admin.id}>
                                                    <div className="flex items-center justify-between ">
                                                        {index === 0 ? (
                                                            <>
                                                                <p className="font-bold">
                                                                    | UNIT MASTER |
                                                                </p>
                                                                <span>
                                                                    <Chip size="sm" variant="ghost" value="Master" color="green" className="ml-3" />
                                                                </span>
                                                            </>
                                                        ) : admin.nama
                                                        }
                                                    </div>
                                                </Option>
                                            )) : (
                                                <Option disabled>
                                                    <p className="!text-gray-900 !text-sm">
                                                        {units.length < 1
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
                                    className="flex items-center justify-center"
                                >
                                    Buat
                                </Button>
                            </CardFooter>
                        </Card>
                    </form>
                </Dialog>
                <Dialog open={ deleteDialog.open } handler={ handleOpenDelete }>
                    <DialogHeader className="text-gray-900">
                        Hapus Admin terpilih?
                    </DialogHeader>
                    <DialogBody>
                        <div className="p-3 border border-gray-300 rounded bg-gray-100">
                            <Typography variant="h6" className="text-gray-900 truncate">
                                Anda akan menghapus
                                Admin :&nbsp;
                                <span className="font-bold">
                                    { pagination.data.find((admin) => admin.id === deleteDialog.adminId)?.nama ?? '-' }
                                </span>
                            </Typography>
                            <Typography variant="h6" className="text-gray-900 truncate">
                                Admin akan dihapus
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
                        <Button color="red" onClick={ handleDeleteAdmin } loading={onSubmitDelete} className="flex items-center justify-center">
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
                                    {resetPassword.nama}
                                </p>
                                <div className="flex gap-1 items-center">
                                    <Input
                                        type="password"
                                        label="Password baru"
                                        size="lg"
                                        value={resetPassword.newPassword}
                                        required={true}
                                        onChange={(event) => {
                                            setResetPassword((prevState) => ({
                                                ...prevState,
                                                newPassword: event.target.value
                                            }));
                                        }}
                                    />
                                </div>
                                <div className="flex gap-1 items-center">
                                    <Input
                                        type="password"
                                        label="Ulangi Password baru"
                                        size="lg"
                                        value={resetPassword.newPassword1}
                                        required={true}
                                        onChange={(event) => {
                                            setResetPassword((prevState) => ({
                                                ...prevState,
                                                newPassword1: event.target.value
                                            }));
                                        }}
                                    />
                                </div>
                            </CardBody>
                            <CardFooter className="pt-0 flex gap-3 justify-between">
                                <Button
                                    color="red"
                                    onClick={() => setResetPassword((prevState) => ({ ...prevState, onOpen: false }))}
                                    fullWidth
                                >
                                    Batal
                                </Button>
                                <Button
                                    type="submit"
                                    loading={resetPassword.onFetch}
                                    disabled={!resetPassword.newPassword || resetPassword.onFetch || (resetPassword.newPassword !== resetPassword.newPassword1)}
                                    fullWidth
                                    className="flex items-center justify-center"
                                >
                                    Simpan
                                </Button>
                            </CardFooter>
                        </Card>
                    </form>
                </Dialog>
            </MasterLayout>
        </>
    );
}
