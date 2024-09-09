import { Head, router } from "@inertiajs/react";
import { Card, Typography, Tooltip, IconButton, Button, Chip, CardBody } from "@material-tailwind/react";
import { CircleAlert, CircleCheck, CircleX, MoveLeft, SquareArrowOutUpRight, X } from "lucide-react";
import "react-day-picker/dist/style.css";
import { PageProps } from "@/types";
import { format } from "date-fns";
import { id } from "date-fns/locale";
import { Input } from "@/Components/Input";
import { TextArea } from "@/Components/TextArea";
import { MasterLayout } from "@/Layouts/MasterLayout";
import { useState } from "react";
import Dialog from "@material-tailwind/react/components/Dialog";
import { notifyToast } from "@/Lib/Utils";
import axios, { AxiosError } from "axios";

export default function MASTER_PengajuanPromosiCreatePage({ auth, pengajuanPromosi }: PageProps<{
    pengajuanPromosi: any
}>) {
    type ReviewPengajuan = {
        openDialog: boolean;
        isAccepted: boolean | null;
        validationInput: string;
    };
    const reviewPengajuanInit: ReviewPengajuan = {
        openDialog: false,
        isAccepted: null,
        validationInput: '',
    };
    const [ reviewPengajuan, setReviewPengajuan ] = useState<ReviewPengajuan>(reviewPengajuanInit);
    const handleOpenReviewDialog = (type: 'disetujui' | 'ditolak') => {
        setReviewPengajuan((prevState) => ({
            ...prevState,
            openDialog: true,
            isAccepted: type === 'disetujui'
        }));
    };
    const handleActionReviewPengajuan = () => {
        const authUserPenyetuju = auth.user;
        if (!authUserPenyetuju) {
            notifyToast('error', 'Admin Penyetuju tidak diketahui');
            return;
        }

        const payload = {
            id: pengajuanPromosi.id,
            asal_id: pengajuanPromosi.asal_id,
            asal_type: pengajuanPromosi.asal_type,
            akhir_id: pengajuanPromosi.akhir_id,
            akhir_type: pengajuanPromosi.akhir_type,
            admin_penyetuju_id: authUserPenyetuju.id,
            diterima: !!reviewPengajuan.isAccepted,
            pegawai_id: pengajuanPromosi.pegawai_id
        };

        axios.post(route('pengajuan-promosi.review'), {
            ...payload
        })
            .then(() => {
                notifyToast('success', 'Pengajuan promosi berhasil ditanggapi!');
                router.reload({ only: [ 'pengajuanPromosi '] });
            })
            .catch((err: unknown) => {
                const errMsg = err instanceof AxiosError
                    ? err?.response?.data.message ?? 'Server gagal memproses permintaan'
                    : 'Error tidak diketahui terjadi';
                notifyToast('error', errMsg);
            })
            .finally(() => setReviewPengajuan(reviewPengajuanInit));
    };

    return (
        <>
            <Head title={ `Master - Pengajuan Promosi : ${ pengajuanPromosi.pegawai?.nama ?? '' }` }/>
            <MasterLayout auth={auth}>
                <Tooltip content="Kembali">
                    <IconButton variant="text" onClick={() => router.visit(route('master.pengajuan-promosi.index'))}>
                        <MoveLeft />
                    </IconButton>
                </Tooltip>
                <main className="w-full min-h-screen bg-gray-50 mt-2">
                    <header className="px-6 py-2 bg-white rounded-md rounded-b-none border ">
                        <Typography className="flex justify-items-center gap-1.5 font-semibold text-lg">
                            <span>
                                <CircleAlert/>
                            </span>
                            Informasi
                        </Typography>
                        <ul className="list-disc list-inside px-2 font-medium text-sm">
                            <li>Personalia dapat menyetujui atau menolak pengajuan Promosi yang diajukan</li>
                            <li>Data yang sudah dikirim tidak dapat lagi diubah untuk keperluan peninjauan dari Personalia</li>
                            <li>Apabila ada kesalahan dalam pemilihan pengajuan anda dapat menghapus pengajuan lalu membuat pengajuan lagi</li>
                        </ul>
                    </header>
                    <Card className="w-full px-6 !shadow-none">
                        <div className="grid grid-cols-1 lg:grid-cols-2 gap-x-6 gap-y-4 p-5 pb-7">
                            <div className="col-span-full flex items-center justify-end -mt-2 -mb-4">
                                <a
                                    href={route('master.rekap-pegawai.index', { search: `id:${pengajuanPromosi.pegawai.id}`})}
                                    target="_blank"
                                    className="!capitalize !font-medium text-base flex items-center justify-center cursor-pointer gap-2 bg-transparent hover:!bg-gray-200 py-3.5 px-5 rounded-md transition-all duration-200 ease-in-out"
                                >
                                    Tinjau Rekap Pegawai
                                    <SquareArrowOutUpRight />
                                </a>
                            </div>
                            <div className="col-span-full">
                                <Typography
                                    variant="small"
                                    color="gray"
                                    className="mt-2 flex items-center gap-1 font-normal"
                                >
                                    <svg
                                        xmlns="http://www.w3.org/2000/svg"
                                        viewBox="0 0 24 24"
                                        fill="currentColor"
                                        className="-mt-px h-4 w-4"
                                    >
                                        <path
                                            fillRule="evenodd"
                                            d="M2.25 12c0-5.385 4.365-9.75 9.75-9.75s9.75 4.365 9.75 9.75-4.365 9.75-9.75 9.75S2.25 17.385 2.25 12zm8.706-1.442c1.146-.573 2.437.463 2.126 1.706l-.709 2.836.042-.02a.75.75 0 01.67 1.34l-.04.022c-1.147.573-2.438-.463-2.127-1.706l.71-2.836-.042.02a.75.75 0 11-.671-1.34l.041-.022zM12 9a.75.75 0 100-1.5.75.75 0 000 1.5z"
                                            clipRule="evenodd"
                                        />
                                    </svg>
                                    ID Pengajuan Promosi
                                </Typography>
                                <Input
                                    type="text"
                                    label="ID Pengajuan Promosi"
                                    disabled
                                    value={ pengajuanPromosi.id }
                                />
                            </div>
                            <Input
                                type="text"
                                color="teal"
                                label="Judul"
                                name="nama"
                                value={ pengajuanPromosi.nama }
                                readOnly
                                containerProps={ {
                                    className: 'col-span-full'
                                } }
                            />
                            <Input
                                type="text"
                                color="teal"
                                label="Pegawai"
                                name="pegawai"
                                value={ pengajuanPromosi.pegawai.nama }
                                readOnly
                            />
                            <Input
                                type="text"
                                color="teal"
                                label="Jenis Pengajuan"
                                name="nama"
                                value={ pengajuanPromosi.jenis }
                                readOnly
                            />
                            <div>
                                <Typography
                                    variant="small"
                                    color="gray"
                                    className="flex items-center gap-1 font-normal"
                                >
                                    <svg
                                        xmlns="http://www.w3.org/2000/svg"
                                        viewBox="0 0 24 24"
                                        fill="currentColor"
                                        className="-mt-px h-4 w-4"
                                    >
                                        <path
                                            fillRule="evenodd"
                                            d="M2.25 12c0-5.385 4.365-9.75 9.75-9.75s9.75 4.365 9.75 9.75-4.365 9.75-9.75 9.75S2.25 17.385 2.25 12zm8.706-1.442c1.146-.573 2.437.463 2.126 1.706l-.709 2.836.042-.02a.75.75 0 01.67 1.34l-.04.022c-1.147.573-2.438-.463-2.127-1.706l.71-2.836-.042.02a.75.75 0 11-.671-1.34l.041-.022zM12 9a.75.75 0 100-1.5.75.75 0 000 1.5z"
                                            clipRule="evenodd"
                                        />
                                    </svg>
                                    Dari
                                </Typography>
                                <Input
                                    type="text"
                                    color="teal"
                                    name="Asal"
                                    value={ pengajuanPromosi.asal.nama }
                                    readOnly
                                />
                            </div>
                            <div>
                                <Typography
                                    variant="small"
                                    color="gray"
                                    className="flex items-center gap-1 font-normal"
                                >
                                    <svg
                                        xmlns="http://www.w3.org/2000/svg"
                                        viewBox="0 0 24 24"
                                        fill="currentColor"
                                        className="-mt-px h-4 w-4"
                                    >
                                        <path
                                            fillRule="evenodd"
                                            d="M2.25 12c0-5.385 4.365-9.75 9.75-9.75s9.75 4.365 9.75 9.75-4.365 9.75-9.75 9.75S2.25 17.385 2.25 12zm8.706-1.442c1.146-.573 2.437.463 2.126 1.706l-.709 2.836.042-.02a.75.75 0 01.67 1.34l-.04.022c-1.147.573-2.438-.463-2.127-1.706l.71-2.836-.042.02a.75.75 0 11-.671-1.34l.041-.022zM12 9a.75.75 0 100-1.5.75.75 0 000 1.5z"
                                            clipRule="evenodd"
                                        />
                                    </svg>
                                    Menjadi
                                </Typography>
                                <Input
                                    type="text"
                                    color="teal"
                                    name="Menjadi"
                                    value={ pengajuanPromosi.akhir.nama }
                                    readOnly
                                />
                            </div>
                            <TextArea
                                color="teal"
                                label="Keterangan"
                                name="keterangan"
                                value={ pengajuanPromosi.keterangan ?? 'Tidak ada keterangan' }
                                readOnly
                                className={ `${ pengajuanPromosi.keterangan ? 'not-italic' : 'italic font-semibold text-gray-700' }` }
                            />
                            <TextArea
                                color="teal"
                                label="Komentar dari Personalia"
                                name="komentar"
                                value={ pengajuanPromosi.komentar ?? 'Belum ada komentar' }
                                readOnly
                                className={ `${ pengajuanPromosi.komentar ? 'not-italic' : 'italic font-semibold text-gray-700' }` }
                            />
                            <Typography as="div"
                                        className="col-span-full flex items-center gap-1 font-semibold font-sans text-gray-900 capitalize">
                                Status Pengajuan:
                                <span>
                                    { pengajuanPromosi.status_pengajuan === 'menunggu'
                                        ? (
                                            <p className="flex gap-1 font-medium text-gray-800/90 italic">
                                                Menunggu
                                                <svg xmlns="http://www.w3.org/2000/svg" width="24px" height="24px"
                                                     viewBox="0 0 24 24">
                                                    <path fill="currentColor"
                                                          d="M17 22q-2.075 0-3.537-1.463T12 17t1.463-3.537T17 12t3.538 1.463T22 17t-1.463 3.538T17 22m1.675-2.625l.7-.7L17.5 16.8V14h-1v3.2zM5 21q-.825 0-1.412-.587T3 19V5q0-.825.588-1.412T5 3h4.175q.275-.875 1.075-1.437T12 1q1 0 1.788.563T14.85 3H19q.825 0 1.413.588T21 5v6.25q-.45-.325-.95-.55T19 10.3V5h-2v3H7V5H5v14h5.3q.175.55.4 1.05t.55.95zm7-16q.425 0 .713-.288T13 4t-.288-.712T12 3t-.712.288T11 4t.288.713T12 5"></path>
                                                </svg>
                                            </p>
                                        )
                                        : pengajuanPromosi.status_pengajuan === 'disetujui'
                                            ? (
                                                <p className="flex gap-1 font-medium text-green-600/90 italic">
                                                    Disetujui
                                                    <CircleCheck className="text-green-500"/>
                                                </p>
                                            )
                                            : (
                                                <p className="flex gap-1 font-medium text-red-600/90 italic">
                                                    Ditolak
                                                    <CircleX className="text-red-600"/>
                                                </p>
                                            )
                                    }
                                </span>
                            </Typography>
                            <Typography
                                className="-mt-2 col-span-full flex items-center gap-1 font-semibold font-sans text-sm text-gray-800 capitalize">
                                Tanggal dan waktu Pengajuan:
                                <span>
                                    { format(pengajuanPromosi.created_at, 'PPPp', { locale: id }) }
                                </span>
                            </Typography>
                            {
                                pengajuanPromosi.status_pengajuan === 'menunggu' ? (
                                    <>
                                        <Button color="red" onClick={() => handleOpenReviewDialog('ditolak')}>
                                            Tolak
                                        </Button>
                                        <Button color="green" onClick={() => handleOpenReviewDialog('disetujui')}>
                                            Setujui
                                        </Button>
                                    </>
                                ) : (
                                    pengajuanPromosi.status_pengajuan === 'ditolak'
                                        ? (
                                            <Chip value="Ditolak" color="red" size="lg"
                                                  className="w-min !py-3 px-6 ml-auto col-span-full"/>
                                        ) : (
                                            <Chip value="Disetujui" color="green" size="lg"
                                                  className="w-min !py-3 px-6 ml-auto col-span-full"/>
                                        )
                                )
                            }
                        </div>
                    </Card>
                </main>
                <Dialog
                    size="md"
                    open={reviewPengajuan.openDialog}
                    handler={() => setReviewPengajuan((prevState) => ({ ...prevState, openDialog: true }))}
                    className="bg-transparent shadow-none"
                >
                    <Card className="mx-auto w-full">
                        <CardBody className="flex flex-col gap-3 text-gray-900">
                            <div className="flex items-center justify-between gap-2">
                                <Typography variant="h4" color={ reviewPengajuan.isAccepted ? 'green' : 'red' }>
                                    { `Anda akan ${ reviewPengajuan.isAccepted ? 'menyetujui' : 'menolak' }` }
                                </Typography>
                                <Button className="rounded-full !w-11 !h-11 !p-0 flex items-center justify-center" variant="text" color="red" onClick={() => setReviewPengajuan(reviewPengajuanInit)}>
                                    <X />
                                </Button>
                            </div>
                            <Typography
                                className="text-sm font-medium"
                                variant="paragraph"
                            >
                                Pengajuan promosi { pengajuanPromosi.jenis } { pengajuanPromosi.pegawai.nama }
                            </Typography>
                            <Typography
                                className="text-sm font-medium"
                                variant="paragraph"
                            >
                                dari { pengajuanPromosi.jenis } <span
                                className="font-bold">{ pengajuanPromosi.asal.nama }</span>
                            </Typography>
                            <Typography
                                className="text-sm font-medium"
                                variant="paragraph"
                            >
                                menjadi { pengajuanPromosi.jenis } <span
                                className="font-bold">{ pengajuanPromosi.akhir.nama }</span>
                            </Typography>
                            <Typography variant="h6">
                                Konfirmasi Aksi anda
                            </Typography>
                            <p className="text-sm font-medium -my-1.5">
                                Ketik "<span className="font-bold">Ponpes Hidayatullah Surabaya</span>"
                            </p>
                            <div className="flex justify-end mt-auto">
                                <input
                                    className="mr-2.5 w-full rounded-md border bg-white px-4 py-1 text-sm font-medium text-gray-900 placeholder:text-gray-700 focus:outline-0"
                                    placeholder="Ponpes Hidayatullah Surabaya"
                                    value={ reviewPengajuan.validationInput }
                                    onChange={(event) => {
                                        setReviewPengajuan((prevState) => ({
                                            ...prevState,
                                            validationInput: event.target.value,
                                        }));
                                    }}
                                />
                                <Button
                                    color="green"
                                    disabled={ reviewPengajuan.validationInput !== "Ponpes Hidayatullah Surabaya"}
                                    onClick={handleActionReviewPengajuan}
                                >
                                    Proses
                                </Button>
                            </div>
                        </CardBody>
                    </Card>
                </Dialog>
            </MasterLayout>
        </>
    );
}
