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
import { ChevronDown, FileSearch, Pencil, Plus, Search, Trash2, User2, X } from "lucide-react";
import { PageProps, PaginationData } from "@/types";
import { MasterLayout } from "@/Layouts/MasterLayout";
import { Head, Link, router } from "@inertiajs/react";
import { Input } from "@/Components/Input";
import { format } from "date-fns";
import { id as localeID } from "date-fns/locale/id";
import { Checkbox } from "@/Components/Checkbox";
import { useTheme } from "@/Hooks/useTheme";
import { SyntheticEvent, useEffect, useState } from "react";
import axios, { AxiosError } from "axios";
import Pagination from "@/Components/Pagination";
import { notifyToast } from "@/Lib/Utils";
import { TextArea } from "@/Components/TextArea";
import { z } from "zod";

type Marhalahs = {
    id: string;
    nama: string;
    keterangan: string;
    created_at: string;
}[];

export default function MASTER_MarhalahIndexPage({ auth, pagination }: PageProps<{
    pagination: PaginationData<Marhalahs>;
}>) {

    const TABLE_HEAD = ['No', 'Nama', 'Keterangan', 'Tanggal daftar', 'Aksi'];

    const deleteDialogInit = {
        open: false,
        marhalahId: '',
    };
    const { theme } = useTheme();
    const [ openFormDialog, setOpenFormDialog ] = useState(false);
    const [ deleteDialog, setDeleteDialog ] = useState<{
        open: boolean;
        marhalahId: string;
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

    const handleOpenForm = () => setOpenFormDialog(true);
    const formSubmitDisabled = (): boolean => (!formInput.nama || !formInput.keterangan);
    const handleFormSubmit = (event: SyntheticEvent<HTMLFormElement>) => {
        event.preventDefault();
        const { nama, keterangan } = formInput

        setFormInput((prevState) => ({
            ...prevState,
            onSubmit: true
        }));
        const marhalahSchema = z.object({
            nama: z.string().min(1, { message: "Nama Marhalah tidak boleh kosong" }),
            keterangan: z.string().min(1, { message: "Keterangan Marhalah tidak boleh kosong" })
        });
        const zodMarhalahResult = marhalahSchema.safeParse({
            nama: nama,
            keterangan: keterangan
        });
        if (!zodMarhalahResult.success) {
            const errorMessages = zodMarhalahResult.error.issues[0].message;
            notifyToast('error', errorMessages, theme as 'light' | 'dark');
        }

        axios.post(route('marhalah.create'), {
            nama: nama,
            keterangan: keterangan,
        })
            .then(() => {
                notifyToast('success', 'Marhalah berhasil ditambahkan!', theme as 'light' | 'dark');
                router.reload({ only: ['pagination'] });
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
    const handleOpenDelete = () => setDeleteDialog((prevState) => ({
        ...prevState,
        open: true
    }));

    const handleDeleteMarhalah = () => {
        setOnSubmitDelete(true);
        axios.post(route('marhalah.delete'), {
            id: deleteDialog.marhalahId,
        })
            .then(() => {
                notifyToast('success', 'Marhalah terpilih berhasil dihapus!');
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

    useEffect(() => {
        if (!openFormDialog) {
            setFormInput(formInputInit);
        }
    }, [openFormDialog]);

    return (
        <>
            <Head title="Master - Marhalah" />
            <MasterLayout auth={auth}>
                <Card className="h-full w-full" shadow={false}>
                    <CardHeader floated={false} shadow={false} className="rounded-none">
                        <div className="mb-8 flex items-start justify-between gap-x-3">
                            <div>
                                <Typography variant="h5" color="blue-gray">
                                    Daftar Marhalah
                                </Typography>
                                <Typography color="gray" className="mt-1 font-normal">
                                    Informasi mengenai Marhalah yang terdaftar
                                </Typography>
                            </div>
                            <div className="w-full md:w-72 flex flex-col justify-end gap-2">
                                <div className="w-min text-sm *:!min-w-16 -space-y-1.5">
                                    <Typography variant="h6" color="blue-gray" className="ml-0 md:ml-3">
                                        Data per Halaman
                                    </Typography>
                                    <List className="flex-row">
                                        <ListItem className="p-0 !gap-1" ripple={ false }>
                                            <label
                                                htmlFor="show-10"
                                                className="flex w-full cursor-pointer items-center px-3 py-2 *:!text-sm"
                                            >
                                                <ListItemPrefix className="mr-3">
                                                    <Checkbox
                                                        id="show-10"
                                                        ripple={ false }
                                                        className="hover:before:opacity-0"
                                                        containerProps={ {
                                                            className: "p-0",
                                                        } }
                                                        value={ 10 }
                                                        checked={ viewPerPage === 10 }
                                                        onChange={ () => handleSetViewPerPage(10) }
                                                    />
                                                </ListItemPrefix>
                                                <Typography color="blue-gray" className="font-medium">
                                                    10
                                                </Typography>
                                            </label>
                                        </ListItem>
                                        <ListItem className="p-0" ripple={ false }>
                                            <label
                                                htmlFor="show-25"
                                                className="flex w-full cursor-pointer items-center px-3 py-2 *:!text-sm"
                                            >
                                                <ListItemPrefix className="mr-3">
                                                    <Checkbox
                                                        id="show-25"
                                                        ripple={ false }
                                                        className="hover:before:opacity-0"
                                                        containerProps={ {
                                                            className: "p-0",
                                                        } }
                                                        value={ 25 }
                                                        checked={ viewPerPage === 25 }
                                                        onChange={ () => handleSetViewPerPage(25) }
                                                    />
                                                </ListItemPrefix>
                                                <Typography color="blue-gray" className="font-medium">
                                                    25
                                                </Typography>
                                            </label>
                                        </ListItem>
                                    </List>
                                    <List className="flex-row !gap-1.5">
                                        <ListItem className="p-0" ripple={ false }>
                                            <label
                                                htmlFor="show-50"
                                                className="flex w-full cursor-pointer items-center px-3 py-2 *:!text-sm"
                                            >
                                                <ListItemPrefix className="mr-3">
                                                    <Checkbox
                                                        id="show-50"
                                                        ripple={ false }
                                                        className="hover:before:opacity-0"
                                                        containerProps={ {
                                                            className: "p-0",
                                                        } }
                                                        value={ 50 }
                                                        checked={ viewPerPage === 50 }
                                                        onChange={ () => handleSetViewPerPage(50) }
                                                    />
                                                </ListItemPrefix>
                                                <Typography color="blue-gray" className="font-medium">
                                                    50
                                                </Typography>
                                            </label>
                                        </ListItem>
                                        <ListItem className="p-0" ripple={ false }>
                                            <label
                                                htmlFor="show-100"
                                                className="flex w-full cursor-pointer items-center px-3 py-2 *:!text-sm"
                                            >
                                                <ListItemPrefix className="mr-3">
                                                    <Checkbox
                                                        id="show-100"
                                                        ripple={ false }
                                                        className="hover:before:opacity-0"
                                                        containerProps={ {
                                                            className: "p-0",
                                                        } }
                                                        value={ 100 }
                                                        checked={ viewPerPage === 100 }
                                                        onChange={ () => handleSetViewPerPage(100) }
                                                    />
                                                </ListItemPrefix>
                                                <Typography color="blue-gray" className="font-medium">
                                                    100
                                                </Typography>
                                            </label>
                                        </ListItem>
                                    </List>
                                </div>

                                <Input
                                    label="Pencarian"
                                    placeholder="cari berdasarkan nama"
                                    value={ search }
                                    onChange={ (event) => {
                                        setSearch(event.target.value);
                                    } }
                                    icon={ <Search className="h-5 w-5"/> }
                                />
                            </div>
                        </div>
                        <div className="w-full flex flex-row-reverse justify-between gap-4">
                            <div className="flex flex-col shrink-0 gap-2 lg:flex-row">
                                <Button
                                    onClick={() => setOpenFormDialog(true)}
                                    className="flex items-center gap-1.5 capitalize font-medium text-base" size="sm"
                                >
                                    <Plus />
                                    Tambahkan Marhalah baru
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
                                        ({ id, nama, keterangan, created_at }, index) => {
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
                                                            { format(created_at, 'PPpp', {
                                                                locale: localeID
                                                            }) }
                                                        </Typography>
                                                    </td>
                                                    <td className={ classes }>
                                                        <div className="w-32 flex gap-2.5 items-center justify-start">
                                                            <Tooltip content="Detail">
                                                                <Link
                                                                    href={ route('master.marhalah.details', { q: pagination.data[index].id }) }>
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
                                                                            marhalahId: id,
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
                                                    Belum ada data Marhalah
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

                <Dialog
                    size="lg"
                    open={ openFormDialog }
                    handler={ handleOpenForm }
                    className="bg-transparent shadow-none backdrop-blur-none"
                >
                    <form className="mx-auto w-full" onSubmit={ handleFormSubmit }>
                        <Card>
                            <CardBody className="flex flex-col gap-4">
                                <Typography variant="h4" color="blue-gray">
                                    Menambahkan Marhalah baru
                                </Typography>
                                <Input
                                    label="Nama marhalah"
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
                        Hapus Marhalah terpilih?
                    </DialogHeader>
                    <DialogBody>
                        <div className="p-3 border border-gray-300 rounded bg-gray-100">
                            <Typography variant="h6" className="text-gray-900 truncate">
                                Anda akan menghapus
                                Marhalah :&nbsp;
                                <span className="font-bold">
                                    { pagination.data.find((marhalah) => marhalah.id === deleteDialog.marhalahId)?.nama ?? '-' }
                                </span>
                            </Typography>
                            <Typography variant="h6" className="text-gray-900 truncate">
                                Semua Pegawai yang terdaftar dalam marhalah ini akan kehilangan Marhalahnya
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
                        <Button color="red" onClick={ handleDeleteMarhalah } loading={onSubmitDelete} className="flex justify-items-center">
                            <span>Hapus</span>
                        </Button>
                    </DialogFooter>
                </Dialog>
            </MasterLayout>
        </>
    );
}
