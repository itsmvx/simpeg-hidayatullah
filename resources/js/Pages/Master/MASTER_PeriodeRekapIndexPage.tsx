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
    Option, Select,
    Tooltip,
    Typography
} from "@material-tailwind/react";
import { FileSearch, LoaderCircle, Plus, Trash2 } from "lucide-react";
import { JenisPeriodeRekap, PageProps, PaginationData } from "@/types";
import { MasterLayout } from "@/Layouts/MasterLayout";
import { Head, Link, router } from "@inertiajs/react";
import { Input } from "@/Components/Input";
import { format } from "date-fns";
import { id as localeID } from "date-fns/locale/id";
import { Checkbox } from "@/Components/Checkbox";
import { Fragment, SyntheticEvent, useEffect, useState } from "react";
import axios, { AxiosError } from "axios";
import Pagination from "@/Components/Pagination";
import { notifyToast } from "@/Lib/Utils";
import { TextArea } from "@/Components/TextArea";
import { z } from "zod";
import { Switch } from "@headlessui/react";
import { ViewPerPageList } from "@/Components/ViewPerPageList";
import { SearchInput } from "@/Components/SearchInput";
import { jenisPeriodeRekap } from "@/Lib/StaticData";

type PeriodeRekap = {
    id: string;
    nama: string;
    keterangan: string;
    awal: string;
    akhir: string;
    status: 0 | 1;
}[];
type FormPeriodeRekap = {
    nama: string;
    jenis: '' | JenisPeriodeRekap;
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
export default function MASTER_PeriodeRekapIndexPage({ auth, pagination }: PageProps<{
    pagination: PaginationData<PeriodeRekap>;
}>) {

    const TABLE_HEAD = ['No', 'Nama Periode', 'Keterangan', 'Masa Periode', 'Status', 'Aksi'];
    const deleteDialogInit = {
        open: false,
        periodeRekapId: '',
    };
    const [ openFormDialog, setOpenFormDialog ] = useState(false);
    const [ deleteDialog, setDeleteDialog ] = useState<{
        open: boolean;
        periodeRekapId: string;
    }>(deleteDialogInit);
    const [ onSubmitDelete, setOnSubmitDelete ] = useState(false);
    const [ onSwitchStatus, setOnSwitchStatus ] = useState({
        status: false,
        index: -1
    });

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
            notifyToast('error', errorMessages);
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
                notifyToast('success', 'Periode Rekap berhasil ditambahkan!');
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
    const handleOpenForm = () => setOpenFormDialog(true);
    const handleOpenDelete = () => setDeleteDialog((prevState) => ({
        ...prevState,
        open: true
    }));

    const handleDeletePeriodeRekap = () => {
        setOnSubmitDelete(true);
        axios.post(route('periode-rekap.delete'), {
            id: deleteDialog.periodeRekapId,
        })
            .then(() => {
                notifyToast('success', 'Periode Rekap terpilih berhasil dihapus!');
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
    const handleSwitchStatus = (val: boolean, index: number) => {
        setOnSwitchStatus({
            status: true,
            index: index
        });
        axios.post(route('periode-rekap.update-status'), {
            id: pagination.data[index].id,
            status: val
        })
            .then(() => {
                notifyToast('success', 'Status Periode Rekap berhasil diperbarui!');
                router.reload({ only: ['pagination'] });
            })
            .catch(() => {
                notifyToast('error', 'Server gagal memproses permintaan');
            })
            .finally(() => setOnSwitchStatus({
                status: false,
                index: -1
            }));
    };

    useEffect(() => {
        if (!openFormDialog) {
            setFormInput(formInputInit);
        }
    }, [openFormDialog]);

    return (
        <>
            <Head title="Master - Periode Rekap" />
            <MasterLayout auth={auth}>
                <Card className="h-full w-full" shadow={false}>
                    <CardHeader floated={false} shadow={false} className="rounded-none">
                        <div className="mb-8 flex flex-col lg:flex-row items-start justify-between gap-3">
                            <div>
                                <Typography variant="h5" color="blue-gray" className="text-2xl">
                                    Daftar Periode Rekap
                                </Typography>
                                <Typography color="gray" className="mt-1 font-normal">
                                    Informasi mengenai Periode Rekap yang terdaftar
                                </Typography>
                            </div>
                            <div className="w-full md:w-72 flex flex-col justify-end gap-2">
                                <ViewPerPageList />
                                <SearchInput />
                            </div>
                        </div>
                        <div className="w-full flex flex-row-reverse justify-between gap-4">
                            <div className="flex flex-col shrink-0 gap-2 lg:flex-row">
                                <Button
                                    onClick={() => setOpenFormDialog(true)}
                                    ripple={false}
                                    className="flex items-center gap-1.5 capitalize font-medium text-base !bg-pph-green-deep hover:!bg-pph-green-deep/80 hover:text-white" size="sm"
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
                                    ?  pagination.data.map(
                                        ({ id, nama, keterangan, awal, akhir, status }, index) => {
                                            const isLast = index === pagination.data.length - 1;
                                            const classes = isLast
                                                ? "p-4"
                                                : "p-4 border-b border-blue-gray-50";

                                            return (
                                                <tr key={ id } className="even:bg-gray-100">
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
                                                            <Switch checked={ Boolean(status) }
                                                                    onChange={ (val) => handleSwitchStatus(val, index) }
                                                                    as={ Fragment }
                                                                    disabled={ onSwitchStatus.status && onSwitchStatus.index === index }>
                                                                { ({ checked }) => (
                                                                    <button
                                                                        className={ `group inline-flex h-6 w-11 items-center rounded-full ${ checked ? 'bg-blue-600' : 'bg-blue-gray-100' } ` }
                                                                    >
                                                                     <span
                                                                         className={ `size-4 flex items-center justify-center rounded-full bg-white transition ${ checked ? 'translate-x-6' : 'translate-x-1' }` }>
                                                                         {
                                                                             onSwitchStatus.status && onSwitchStatus.index === index
                                                                                 ? <LoaderCircle
                                                                                     className="animate-spin font-bold "
                                                                                     width={ 12 }/>
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
                                                                    href={ route('master.periode-rekap.details', { q: id }) }>
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
                                                                            periodeRekapId: id,
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
                                                    Belum ada data Periode Rekap
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
                                    Menambahkan Periode baru
                                </Typography>
                                <Input
                                    label="Nama periode"
                                    size="lg"
                                    required={ true }
                                    value={ formInput.nama }
                                    onChange={ (event) => {
                                        setFormInput((prevState) => ({
                                            ...prevState,
                                            nama: event.target.value,
                                        }));
                                    } }
                                />
                                <Select
                                    label="Jenis Periode Rekap"
                                    value={ formInput.jenis }
                                    onChange={ (val: string | undefined) => {
                                        if (jenisPeriodeRekap.includes(val as JenisPeriodeRekap)) {
                                            setFormInput((prevState) => ({
                                                ...prevState,
                                                jenis: val as JenisPeriodeRekap
                                            }));
                                        }
                                    } }
                                    className="capitalize"
                                >
                                    {
                                        jenisPeriodeRekap.map((jenis, index) => ((
                                            <Option key={ index } value={ jenis } className="capitalize">
                                                { jenis }
                                            </Option>
                                        )))
                                    }
                                </Select>
                                <Input
                                    label="Masa Awal periode"
                                    size="lg"
                                    required={ true }
                                    type="date"
                                    value={ formInput.awal }
                                    onChange={ (event) => {
                                        setFormInput((prevState) => ({
                                            ...prevState,
                                            awal: event.target.value,
                                        }));
                                    } }
                                />
                                <Input
                                    label="Masa Akhir periode"
                                    size="lg"
                                    required={ true }
                                    type="date"
                                    value={ formInput.akhir }
                                    onChange={ (event) => {
                                        setFormInput((prevState) => ({
                                            ...prevState,
                                            akhir: event.target.value,
                                        }));
                                    } }
                                />
                                <TextArea
                                    label="Keterangan"
                                    size="lg"
                                    value={ formInput.keterangan }
                                    required={ true }
                                    onChange={ (event) => {
                                        setFormInput((prevState) => ({
                                            ...prevState,
                                            keterangan: event.target.value,
                                        }));
                                    } }
                                />
                                <Checkbox
                                    checked={ formInput.status }
                                    onChange={ () => {
                                        setFormInput((prevState) => ({
                                            ...prevState,
                                            status: !prevState.status
                                        }));
                                    } }
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
                                    onClick={ () => setOpenFormDialog(false) }
                                    fullWidth
                                >
                                    Batal
                                </Button>
                                <Button
                                    type="submit"
                                    loading={ formInput.onSubmit }
                                    disabled={ formSubmitDisabled() }
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
                        Hapus Periode Rekap terpilih?
                    </DialogHeader>
                    <DialogBody>
                        <div className="p-3 border border-gray-300 rounded bg-gray-100">
                            <Typography variant="h6" className="text-gray-900 truncate">
                                Anda akan menghapus
                                Periode Rekap :&nbsp;
                                <span className="font-bold">
                                    { pagination.data.find((periodeRekap) => periodeRekap.id === deleteDialog.periodeRekapId)?.nama ?? '-' }
                                </span>
                            </Typography>
                            <Typography variant="h6" className="text-gray-900">
                                Semua Rekap yang termasuk di Periode ini akan dihapus!
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
                        <Button color="red" onClick={ handleDeletePeriodeRekap } loading={ onSubmitDelete } className="flex justify-items-center">
                            <span>Hapus</span>
                        </Button>
                    </DialogFooter>
                </Dialog>
            </MasterLayout>
        </>
    );
}
