import { Head, router } from "@inertiajs/react";
import { Card, Typography, Button, Tooltip, IconButton } from "@material-tailwind/react";
import { CircleAlert, CircleCheck, MoveLeft, Save } from "lucide-react";
import { ChangeEvent, FormEvent, useState } from "react";
import "react-day-picker/dist/style.css";
import { AdminLayout } from "@/Layouts/AdminLayout";
import { PageProps } from "@/types";
import { notifyToast } from "@/Lib/Utils";
import axios, { AxiosError } from "axios";
import { Input } from "@/Components/Input";
import { TextArea } from "@/Components/TextArea";

type RekapPegawai = {
    id: string;
    amanah: string;
    organisasi: string;
    gaji: number;
    skill_manajerial: string;
    skill_leadership: string;
    raport_profesi: string;
    kedisiplinan: string;
    ketuntasan_kerja: string;
    catatan_negatif: string;
    prestasi: string;
    pegawai_id: string;
    unit_id: string;
    rekap_id: string;
    golongan_id: string;
    status_pegawai_id: string;
    marhalah_id: string;
    periode_rekap_id: string;
    admin_id: string | null;
    terverifikasi: 0 | 1;
    pegawai: {
        id: string;
        nama: string;
    };
    unit: {
        id: string;
        nama: string;
    };
    status_pegawai: {
        id: string;
        nama: string;
    };
    marhalah: {
        id: string;
        nama: string;
    };
    golongan: {
        id: string;
        nama: string;
    };
    periode_rekap: {
        id: string;
        nama: string;
    };
};

export default function ADMIN_RekapPegawaiDetailsPage({ auth, rekap }: PageProps<{
    rekap: RekapPegawai
}>) {

    const [ rekapPegawaiState, setRekapPegawaiState ] = useState(rekap);
    const [ onChangeRekapPegawai, setOnChangeRekapPegawai ] = useState(false);
    const [ onSubmit, setOnSubmit ] = useState(false);

    const handleInputChange = (event: ChangeEvent<HTMLInputElement> | ChangeEvent<HTMLTextAreaElement>) => {
        const payload = {
            [event.target.name as keyof RekapPegawai]: event.target.value,
        };

        setRekapPegawaiState((prevState) => {
            const newState = { ...prevState, ...payload };

            if (JSON.stringify(newState) !== JSON.stringify(rekap)) {
                setOnChangeRekapPegawai(true);
            } else {
                setOnChangeRekapPegawai(false);
            }

            return newState;
        });
    };

    const handleFormSubmit = (event: FormEvent<HTMLFormElement>) => {
        event.preventDefault();
        setOnSubmit(true);

        axios.post(route('rekap-pegawai.update-by-admin'), { ...rekapPegawaiState })
            .then(() => {
                notifyToast('success', 'Rekap Pegawai berhasil diperbarui!');
                setOnChangeRekapPegawai(false);
                router.reload({ only: ['rekap'] })
            })
            .catch((err: unknown) => {
                const errMsg = err instanceof AxiosError
                    ? err?.response?.data.message ?? 'Error tidak diketahui terjadi!'
                    : 'Error tidak diketahui terjadi';

                notifyToast('error', errMsg);
            })
            .finally(() => setOnSubmit(false));
    };

console.log((Boolean(rekap.terverifikasi) || (rekap.admin_id !== auth.user?.id)))
    return (
        <>
            <Head title="Details Rekap Pegawai"/>
            <AdminLayout auth={auth}>
                <main className="w-full min-h-screen bg-gray-50 space-y-4">
                    <header className="px-6 py-2 bg-white rounded-md rounded-b-none border ">
                        <Typography className="flex justify-items-center gap-1.5 font-semibold text-lg">
                            <span>
                                <CircleAlert/>
                            </span>
                            Informasi
                        </Typography>
                        <ul className="list-disc list-inside px-2 font-medium text-sm">
                            <li>Unit, Pegawai, dan Periode Rekap terpilih tidak dapat lagi diubah</li>
                            <li>Informasi Golongan, Marhalah dan Status Pegawai dapat diperbarui oleh admin Personalia</li>
                            <li>Untuk mengubah opsi diatas, silahkan hubungi admin Personalia</li>
                        </ul>
                    </header>
                    <Card className="w-full px-6">
                        <Tooltip content="Kembali">
                            <IconButton variant="text" onClick={() => router.visit(route('admin.rekap-pegawai.index'))} className="mt-2 mb-4">
                                <MoveLeft />
                            </IconButton>
                        </Tooltip>
                        <form onSubmit={ handleFormSubmit } className="grid grid-cols-1 lg:grid-cols-2 gap-x-6 gap-y-4 p-5">
                            <div className="-mt-2">
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
                                    Unit
                                </Typography>
                                <Input
                                    type="text"
                                    label="Unit"
                                    disabled
                                    value={ rekap.unit.nama }
                                />
                            </div>
                            <div className="-mt-2">
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
                                    Periode Rekap
                                </Typography>
                                <Input
                                    type="text"
                                    label="Periode Rekap"
                                    disabled
                                    value={ rekap.periode_rekap.nama }
                                />
                            </div>
                            <div className="-mt-2">
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
                                    Pegawai
                                </Typography>
                                <Input
                                    type="text"
                                    label="Pegawai"
                                    disabled
                                    value={ rekap.pegawai.nama }
                                />
                            </div>
                            <div className="-mt-2">
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
                                    Marhalah
                                </Typography>
                                <Input
                                    type="text"
                                    label="Marhalah"
                                    disabled
                                    value={ rekap.marhalah.nama }
                                />
                            </div>
                            <div className="-mt-2">
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
                                    Golongan
                                </Typography>
                                <Input
                                    type="text"
                                    label="Golongan"
                                    disabled
                                    value={ rekap.golongan.nama }
                                />
                            </div>
                            <div className="-mt-2">
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
                                    Status Pegawai
                                </Typography>
                                <Input
                                    type="text"
                                    label="Status Pegawai"
                                    disabled
                                    value={ rekap.status_pegawai.nama }
                                />
                            </div>
                            <Input
                                type="text"
                                color="teal"
                                label="Amanah Profesi"
                                name="amanah"
                                value={ rekapPegawaiState.amanah }
                                onChange={ handleInputChange }
                                required
                                readOnly={ (Boolean(rekap.terverifikasi) || (rekap.admin_id !== auth.user?.id)) }
                            />
                            <Input
                                type="text"
                                color="teal"
                                label="Amanah Organisasi (tidak wajib diisi)"
                                name="organisasi"
                                value={ rekapPegawaiState.organisasi ?? '' }
                                onChange={ handleInputChange }
                                readOnly={ (Boolean(rekap.terverifikasi) || (rekap.admin_id !== auth.user?.id)) }
                            />
                            <Input
                                type="number"
                                color="teal"
                                label="Gaji"
                                name="gaji"
                                value={ rekapPegawaiState.gaji }
                                onChange={ handleInputChange }
                                required
                                readOnly={ (Boolean(rekap.terverifikasi) || (rekap.admin_id !== auth.user?.id)) }
                            />
                            <Input
                                type="text" color="teal"
                                label="Ketuntasan Kerja"
                                name="ketuntasan_kerja"
                                value={ rekapPegawaiState.ketuntasan_kerja }
                                onChange={ handleInputChange }
                                required
                                readOnly={ (Boolean(rekap.terverifikasi) || (rekap.admin_id !== auth.user?.id)) }
                            />
                            <TextArea
                                color="teal"
                                label="Kedisiplinan"
                                name="kedisiplinan"
                                value={ rekapPegawaiState.kedisiplinan }
                                onChange={ handleInputChange }
                                required
                                readOnly={ (Boolean(rekap.terverifikasi) || (rekap.admin_id !== auth.user?.id)) }
                            />
                            <TextArea
                                color="teal"
                                label="Rapor Profesi"
                                name="raport_profesi"
                                value={ rekapPegawaiState.raport_profesi }
                                onChange={ handleInputChange }
                                required
                                readOnly={ (Boolean(rekap.terverifikasi) || (rekap.admin_id !== auth.user?.id)) }
                            />
                            <TextArea
                                label="Skill Manajerial (tidak wajib diisi)"
                                color="teal"
                                name="skill_manajerial"
                                value={ rekapPegawaiState.skill_manajerial ?? '' }
                                onChange={ handleInputChange }
                                readOnly={ (Boolean(rekap.terverifikasi) || (rekap.admin_id !== auth.user?.id)) }
                            />
                            <TextArea
                                label="Skill Leadership (tidak wajib diisi)"
                                color="teal"
                                name="skill_leadership"
                                value={ rekapPegawaiState.skill_leadership ?? '' }
                                onChange={ handleInputChange }
                                readOnly={ (Boolean(rekap.terverifikasi) || (rekap.admin_id !== auth.user?.id)) }
                            />
                            <TextArea
                                label="Catatan Negatif (tidak wajib diisi)"
                                color="teal"
                                name="catatan_negatif"
                                value={ rekapPegawaiState.catatan_negatif ?? '' }
                                onChange={ handleInputChange }
                                readOnly={ (Boolean(rekap.terverifikasi) || (rekap.admin_id !== auth.user?.id)) }
                            />
                            <TextArea
                                label="Prestasi (tidak wajib diisi)"
                                color="teal"
                                name="prestasi"
                                value={ rekapPegawaiState.prestasi ?? '' }
                                onChange={ handleInputChange }
                                readOnly={ (Boolean(rekap.terverifikasi) || (rekap.admin_id !== auth.user?.id)) }
                            />
                            <Button
                                color="blue"
                                type="submit"
                                loading={onSubmit}
                                className={ `${ (Boolean(rekap.terverifikasi) || (rekap.admin_id !== auth.user?.id)) ? '!hidden' : ''} group *:group-disabled:text-gray-50 col-span-full flex items-center justify-center h-10 gap-1 text-base` }
                                disabled={!onChangeRekapPegawai}
                            >
                                <span className="normal-case">
                                    Simpan
                                </span>
                                <Save />
                            </Button>
                            { Boolean(rekap.terverifikasi) && (
                                <p className="flex gap-1 font-medium text-green-600 italic">
                                    Sudah Terverifikasi
                                    <CircleCheck className="text-green-500"/>
                                </p>
                            ) }
                        </form>
                    </Card>
                </main>
            </AdminLayout>
        </>
    );
}
