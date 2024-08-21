import { Head, router } from "@inertiajs/react";
import {
    Card,
    Collapse,
    IconButton, List, ListItem,
    Typography, Button, Select, Option
} from "@material-tailwind/react";
import {
    CircleAlert,
    CircleUser,
    GraduationCap, Medal,
    Menu as MenuIcon, Moon, Save,
    Star, Sun, TriangleAlert,
    Users,
    X
} from "lucide-react";
import { ChangeEvent, FormEvent, lazy, Suspense, SyntheticEvent, useEffect, useRef, useState } from "react";
import "react-day-picker/dist/style.css";
import { useTheme } from "@/Hooks/useTheme";
import { AdminLayout } from "@/Layouts/AdminLayout";
import PegawaiFormDataDiri from "@/Components/PegawaiFormDataDiri";
import PegawaiFormDataKeluarga from "@/Components/PegawaiFormDataKeluarga";
import PegawaiFormDataPendidikanFormal from "@/Components/PegawaiFormDataPendidikanFormal";
import PegawaiFormDataPendidikanNonFormal from "@/Components/PegawaiFormDataPendidikanNonFormal";
import PegawaiFormDataOrganisasi from "@/Components/PegawaiFormDataOrganisasi";
import PegawaiFormDataPengalamanPPH from "@/Components/PegawaiFormDataPengalamanPPH";
import PegawaiFormDataPengalamanNonPPH from "@/Components/PegawaiFormDataPengalamanNonPPH";
import { FormDataDiri, Golongan, PageProps } from "@/types";
import { z } from "zod";
import { notifyToast } from "@/Lib/Utils";
import axios, { AxiosError } from "axios";
import {
    formDataKeluargaDefault,
    formDataOrganisasiDefault,
    formDataPendidikanFormalDefault,
    formDataPendidikanNonFormalDefault,
    formDataPengalamanNonPPHDefault,
    formDataPengalamanPPHDefault
} from "@/Lib/StaticData";
import RekapPegawaiForm from "@/Components/RekapPegawaiForm";
import { Bounce, toast } from "react-toastify";
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

export default function MASTER_RekapPegawaiDetailsPage({ auth, units, periodes, rekap }: PageProps<{
    units: {
        id: string;
        nama: string;
    }[];
    periodes: {
        id: string;
        nama: string;
        awal: string;
        akhir: string;
    }[];
    rekap: RekapPegawai
}>) {

    console.log(rekap);
    const { theme, setTheme } = useTheme();
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

        axios.post(route('rekap-pegawai.update'), { ...rekapPegawaiState })
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

    return (
        <>
            <Head title="Details Rekap Pegawai"/>
            <AdminLayout>
                <main className="w-full min-h-screen bg-gray-50 space-y-4">
                    <header className="px-6 py-2 bg-white rounded-md rounded-b-none border ">
                        <Typography className="flex justify-items-center gap-1.5 font-semibold text-lg">
                            <span>
                                <CircleAlert/>
                            </span>
                            Informasi
                        </Typography>
                        <ul className="list-disc list-inside px-2 font-medium text-sm">
                            <li>Opsi Pegawai disediakan berdasarkan unit yang dipilih</li>
                            <li>Opsi Marhalah, Golongan, Status Pegawai dan Periode terpilih tidak dapat diubah</li>
                            <li>Untuk mengubah informasi Marhalah, Golongan, atau Status Pegawai dapat diubah di
                                manajemen Pegawai
                            </li>
                        </ul>
                    </header>
                    <Card className="w-full px-6">
                        <form onSubmit={ handleFormSubmit } className="grid grid-cols-1 lg:grid-cols-2 gap-x-6 gap-y-4 p-5 dark:bg-gray-900">
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
                                    label="ID Unit"
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
                                    label="ID Unit"
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
                                    label="ID Unit"
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
                                    label="ID Unit"
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
                                    label="ID Unit"
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
                                    label="ID Unit"
                                    disabled
                                    value={ rekap.status_pegawai.nama }
                                />
                            </div>
                            <Input
                                type="text"
                                color="teal"
                                label="Amanah Profesi"
                                name="amanah"
                                value={ rekap.amanah }
                                onChange={ handleInputChange }
                                required
                            />
                            <Input
                                type="text"
                                color="teal"
                                label="Amanah Organisasi"
                                name="organisasi"
                                value={ rekap.organisasi ?? '' }
                                onChange={ handleInputChange }
                            />
                            <Input
                                type="number"
                                color="teal"
                                label="Gaji"
                                name="gaji"
                                value={ rekap.gaji }
                                onChange={ handleInputChange }
                                required
                            />
                            <Input
                                type="text" color="teal"
                                label="Ketuntasan Kerja"
                                name="ketuntasan_kerja"
                                value={ rekap.ketuntasan_kerja }
                                onChange={ handleInputChange }
                                required
                            />
                            <TextArea
                                label="Skill Manajerial"
                                color="teal"
                                name="skill_manajerial"
                                value={ rekap.skill_manajerial ?? '' }
                                onChange={ handleInputChange }
                            />
                            <TextArea
                                label="Skill Leadership"
                                color="teal"
                                name="skill_leadership"
                                value={ rekap.skill_leadership ?? '' }
                                onChange={ handleInputChange }
                            />
                            <TextArea
                                color="teal"
                                label="Kedisiplinan"
                                name="kedisiplinan"
                                value={ rekap.kedisiplinan }
                                onChange={ handleInputChange }
                                required
                            />
                            <TextArea
                                color="teal"
                                label="Rapor Profesi"
                                name="raport_profesi"
                                value={ rekap.raport_profesi }
                                onChange={ handleInputChange }
                                required
                            />
                            <TextArea
                                label="Catatan Negatif"
                                color="teal"
                                name="catatan_negatif"
                                value={ rekap.catatan_negatif ?? '' }
                                onChange={ handleInputChange }
                            />
                            <TextArea
                                label="Prestasi"
                                color="teal"
                                name="prestasi"
                                value={ rekap.prestasi ?? '' }
                                onChange={ handleInputChange }
                            />
                            <Button
                                type="submit"
                                className="col-span-1 lg:col-span-2 w-52 ml-auto flex items-center justify-center gap-3"
                            >
                                <Save/>
                                Simpan
                            </Button>
                        </form>
                    </Card>
                </main>

            </AdminLayout>
        </>
    );
}
