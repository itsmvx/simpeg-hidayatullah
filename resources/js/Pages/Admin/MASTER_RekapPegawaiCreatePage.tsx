import { Head, router } from "@inertiajs/react";
import {
    Card,
    Collapse,
    IconButton, List, ListItem,
    Typography, Button
} from "@material-tailwind/react";
import {
    CircleUser,
    GraduationCap, Medal,
    Menu as MenuIcon, Moon, Save,
    Star, Sun,
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
import { FormDataDiri, PageProps } from "@/types";
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

export type FormRekapPegawai = {
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
};
export type PegawaisToRekap = {
    id: string;
    nama: string;
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
}[];

export default function MASTER_RekapPegawaiCreatePage({ auth, units, periodes }: PageProps<{
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
}>) {

    const formRekapPegawaiInit: FormRekapPegawai= {
        amanah: '',
        organisasi: '',
        gaji: 0,
        skill_manajerial: '',
        skill_leadership: '',
        raport_profesi: '',
        kedisiplinan: '',
        ketuntasan_kerja: '',
        catatan_negatif: '',
        prestasi: '',
        pegawai_id: '',
        unit_id: '',
        rekap_id: '',
        golongan_id: '',
        status_pegawai_id: '',
        marhalah_id: '',
        periode_rekap_id: ''
    };
    const { theme, setTheme } = useTheme();

    const [ formInput, setFormInput ] = useState<FormRekapPegawai>(formRekapPegawaiInit);
    const [ pegawais, setPegawais ] = useState<PegawaisToRekap>([]);
    const [ onLoadPegawais, setOnloadPegawais ] = useState(false);
    const formSubmitDisabled = (): boolean => Object.keys(formInput).filter((filt) => !['skill_manajerial', 'skill_leadership', 'catatan_negatif', 'prestasi'].includes(filt)).some((key) => !formInput[key]);
    const handleFormSubmit = (event: SyntheticEvent<HTMLFormElement>) => {
        event.preventDefault();
        console.log(formInput);
        setFormInput((prevState) => ({
            ...prevState,
            onSubmit: true
        }));
        const rekapSchema = z.object({
            pegawai_id: z.string({ message: 'Pegawai belum dipilih' }).uuid({ message: 'Format Pegawai tidak valid' }),
            unit_id: z.string({ message: 'Unit belum dipilih' }).uuid({ message: 'Format Unit tidak valid' }),
            golongan_id: z.string({ message: 'Golongan belum dipilih' }).uuid({ message: 'Format Golongan tidak valid' }),
            status_pegawai_id: z.string({ message: 'Status Pegawai belum dipilih' }).uuid({ message: 'Format Status Pegawai tidak valid' }),
            marhalah_id: z.string({ message: 'Marhalah belum dipilih' }).uuid({ message: 'Format Marhalah tidak valid' }),
            periode_rekap_id: z.string({ message: 'Periode rekap belum dipilih' }).uuid({ message: 'Format Periode rekap tidak valid' }),
            amanah: z.string({ message: 'Amanah tidak boleh kosong' }),
            organisasi: z.string({ message: 'Format Amanah Organisasi tidak valid' }).nullable(),
            gaji: z.number({ message: 'Gaji harus berupa angka' }).int({ message: 'Gaji harus berupa angka bulat' }),
            skill_manajerial: z.string({ message: 'Skill Manajerial tidak boleh kosong' }).nullable(),
            skill_leadership: z.string({ message: 'Skill Leadership tidak boleh kosong' }).nullable(),
            raport_profesi: z.string({ message: 'Raport Profesi tidak boleh kosong' }),
            kedisiplinan: z.string({ message: 'Kedisiplinan tidak boleh kosong' }),
            ketuntasan_kerja: z.string({ message: 'Ketuntasan Kerja tidak boleh kosong' }),
            catatan_negatif: z.string({ message: 'Catatan Negatif tidak boleh kosong' }).nullable(),
            prestasi: z.string({ message: 'Prestasi tidak boleh kosong' }).nullable(),
        });
        const zodRekapResult = rekapSchema.safeParse({
            ...formInput,
            gaji: Number(formInput.gaji),
        });
        if (!zodRekapResult.success) {
            const errorMessages = zodRekapResult.error.issues[0].message;
            notifyToast('error', errorMessages, theme as 'light' | 'dark');
        }

        axios.post(route('rekap-pegawai.create'), {
            ...zodRekapResult.data
        })
            .then(() => {
                notifyToast('success', 'Rekap Pegawai berhasil ditambahkan!', theme as 'light' | 'dark');
                router.reload({ only: ['rekaps'] });
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

    useEffect(() => {
        if (formInput.unit_id) {
            setOnloadPegawais(true);
            setFormInput((prevState) => ({
                ...prevState,
                marhalah_id: '',
                golongan_id: '',
                status_pegawai_id: ''
            }));
            axios.post<{ data: PegawaisToRekap }>(route('pegawai.data-to-rekap'), {
                unit_id: formInput.unit_id,
            })
                .then((res) => {
                    setPegawais(res.data.data);
                    if (res.data.data.length < 1) {
                        toast.warn('Tidak ada Pegawai ditemukan di Unit ini!', {
                            position: "top-right",
                            autoClose: 5000,
                            hideProgressBar: false,
                            closeOnClick: true,
                            pauseOnHover: true,
                            draggable: true,
                            progress: undefined,
                            theme: "light",
                            transition: Bounce,
                        });
                    }
                })
                .catch((err: unknown) => {
                    const errMsg = err instanceof AxiosError && err.status !== 500
                        ? err?.response?.data.message ?? 'Server gagal memproses permintaan'
                        : 'Server gagal memproses permintaan';
                    notifyToast('error', errMsg);
                })
                .finally(() => setOnloadPegawais(false));
        }
    }, [ formInput.unit_id ]);

    console.log(pegawais);
    useEffect(() => {
        if (formInput.pegawai_id) {
            const selectedPegawai = pegawais.find((pegawai) => pegawai.id === formInput.pegawai_id);
            setFormInput((prevState) => ({
                ...prevState,
                marhalah_id: selectedPegawai ? selectedPegawai.marhalah.id : '',
                golongan_id: selectedPegawai ? selectedPegawai.golongan.id : '',
                status_pegawai_id: selectedPegawai ? selectedPegawai.status_pegawai.id : ''
            }));
        }
    }, [ formInput.pegawai_id ]);

    return (
        <>
            <Head title="Form Pegawai"/>
            <AdminLayout>
                <main className="w-full min-h-screen bg-gray-50 space-y-4">
                    <header
                        className="my-5 px-6 sticky top-16 z-10 py-2 bg-white rounded-md rounded-b-none border ">
                        <div className="flex items-center justify-between text-blue-gray-900">
                            <Typography
                                className="cursor-pointer py-1.5 font-medium w-40"
                            >
                                Form Rekap Pegawai PPH Surabaya
                            </Typography>
                        </div>
                    </header>
                    <Card className="w-full px-6">
                        <form onSubmit={ handleFormSubmit }
                              className="grid grid-cols-1 lg:grid-cols-2 gap-x-6 gap-y-4 p-5 dark:bg-gray-900">
                            <RekapPegawaiForm
                                formState={ formInput }
                                setFormState={setFormInput}
                                units={ units }
                                periodes={periodes}
                                pegawais={pegawais}
                                onLoadPegawais={onLoadPegawais}
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
