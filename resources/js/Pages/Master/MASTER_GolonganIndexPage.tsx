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
    Tooltip,
    Typography
} from "@material-tailwind/react";
import { FileSearch,Plus, Trash2 } from "lucide-react";
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
import { TextArea } from "@/Components/TextArea";
import { z } from "zod";
import { ViewPerPageList } from "@/Components/ViewPerPageList";
import { SearchInput } from "@/Components/SearchInput";

type Golongans = {
    id: string;
    nama: string;
    keterangan: string;
    created_at: string;
}[];

export default function MASTER_GolonganIndexPage({ auth, pagination }: PageProps<{
    pagination: PaginationData<Golongans>;
}>) {
    const TABLE_HEAD = ['No', 'Nama', 'Keterangan', 'Tanggal daftar', 'Aksi'];

    const deleteDialogInit = {
        open: false,
        golonganId: '',
    };
    const [ openFormDialog, setOpenFormDialog ] = useState(false);
    const [ deleteDialog, setDeleteDialog ] = useState<{
        open: boolean;
        golonganId: string;
    }>(deleteDialogInit);
    const [ onSubmitDelete, setOnSubmitDelete ] = useState(false);

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
        const golonganSchema = z.object({
            nama: z.string().min(1, { message: "Nama Golongan tidak boleh kosong" }),
            keterangan: z.string().min(1, { message: "Keterangan Golongan tidak boleh kosong" })
        });
        const zodGolonganResult = golonganSchema.safeParse({
            nama: nama,
            keterangan: keterangan
        });
        if (!zodGolonganResult.success) {
            const errorMessages = zodGolonganResult.error.issues[0].message;
            notifyToast('error', errorMessages);
        }

        axios.post(route('golongan.create'), {
            nama: nama,
            keterangan: keterangan,
        })
            .then(() => {
                notifyToast('success', 'Golongan berhasil ditambahkan!');
                router.reload({ only: ['pagination'] });
                setOpenFormDialog(false);
            })
            .catch((err: unknown) => {
                const errMsg = err instanceof AxiosError
                    ? err.response?.data.message as string ?? 'Error tidak diketahui terjadi!'
                    : 'Error tidak diketahui terjadi!'
                notifyToast('error', errMsg);
            })
            .finally(() => {
                setFormInput((prevState) => ({ ...prevState, onSubmit: false }))
            });
    };
    const handleOpenDelete = () => setDeleteDialog((prevState) => ({
        ...prevState,
        open: true
    }));

    const handleDeleteGolongan = () => {
        setOnSubmitDelete(true);
        axios.post(route('golongan.delete'), {
            id: deleteDialog.golonganId,
        })
            .then(() => {
                notifyToast('success', 'Golongan terpilih berhasil dihapus!');
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
            <Head title="Master - Golongan" />
            <MasterLayout auth={auth}>
                <Card className="h-full w-full" shadow={false}>
                    <CardHeader floated={false} shadow={false} className="rounded-none">
                        <div className="mb-8 flex flex-col lg:flex-row items-start justify-between gap-3">
                            <div>
                                <Typography variant="h5" color="blue-gray">
                                    Daftar Golongan
                                </Typography>
                                <Typography color="gray" className="mt-1 font-normal">
                                    Informasi mengenai Golongan yang terdaftar
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
                                    className="flex items-center gap-1.5 capitalize font-medium text-base" size="sm"
                                >
                                    <Plus />
                                    Tambahkan Golongan baru
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
                                                                { nama }
                                                            </Typography>
                                                        </div>
                                                    </td>
                                                    <td className={ `${ classes } min-w-52` }>
                                                        <div className="flex items-center gap-3">
                                                            <Typography
                                                                variant="small"
                                                                color="blue-gray"
                                                                className="font-normal"
                                                            >
                                                                { keterangan }
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
                                                            <Tooltip content="Detail">
                                                                <Link
                                                                    href={ route('master.golongan.details', { q: pagination.data[index].id }) }>
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
                                                                            golonganId: id,
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
                                                    Belum ada data Golongan
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
                    open={ openFormDialog }
                    handler={ handleOpenForm }
                    className="bg-transparent shadow-none backdrop-blur-none"
                >
                    <form className="mx-auto w-full" onSubmit={ handleFormSubmit }>
                        <Card>
                            <CardBody className="flex flex-col gap-4">
                                <Typography variant="h4" color="blue-gray">
                                    Menambahkan Golongan baru
                                </Typography>
                                <Input
                                    label="Nama golongan"
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
                        Hapus Golongan terpilih?
                    </DialogHeader>
                    <DialogBody>
                        <div className="p-3 border border-gray-300 rounded bg-gray-100">
                            <Typography variant="h6" className="text-gray-900 truncate">
                                Anda akan menghapus
                                Golongan :&nbsp;
                                <span className="font-bold">
                                    { pagination.data.find((golongan) => golongan.id === deleteDialog.golonganId)?.nama ?? '-' }
                                </span>
                            </Typography>
                            <Typography variant="h6" className="text-gray-900 truncate">
                                Semua Pegawai yang terdaftar dalam golongan ini akan kehilangan Golongannya
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
                        <Button color="red" onClick={ handleDeleteGolongan } loading={onSubmitDelete} className="flex justify-items-center">
                            <span>Hapus</span>
                        </Button>
                    </DialogFooter>
                </Dialog>
            </MasterLayout>
        </>
    );
}
