import { Head, router } from "@inertiajs/react";
import {
    Card,
    Collapse,
    IconButton, List, ListItem,
    Typography, Button
} from "@material-tailwind/react";
import {
    CircleAlert,
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
import { MasterLayout } from "@/Layouts/MasterLayout";
import PegawaiFormDataDiri from "@/Components/PegawaiCreateFormDataDiri";
import PegawaiFormDataKeluarga from "@/Components/PegawaiCreateFormDataKeluarga";
import PegawaiFormDataPendidikanFormal from "@/Components/PegawaiCreateFormDataPendidikanFormal";
import PegawaiFormDataPendidikanNonFormal from "@/Components/PegawaiCreateFormDataPendidikanNonFormal";
import PegawaiFormDataOrganisasi from "@/Components/PegawaiCreateFormDataOrganisasi";
import PegawaiFormDataPengalamanPPH from "@/Components/PegawaiCreateFormDataPengalamanPPH";
import PegawaiFormDataPengalamanNonPPH from "@/Components/PegawaiCreateFormDataPengalamanNonPPH";
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
export type PeriodesToRekap = {
    id: string;
    nama: string;
    awal: string;
    akhir: string;
    available: boolean;
}[];

export default function MASTER_RekapPegawaiCreatePage({ auth, units, marhalahs, golongans, statusPegawais }: PageProps<{
    units: {
        id: string;
        nama: string;
    }[];
    marhalahs: {
        id: string;
        nama: string;
    }[];
    golongans: {
        id: string;
        nama: string;
    }[];
    statusPegawais: {
        id: string;
        nama: string;
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
    const [ periodes, setPeriodes ] = useState<PeriodesToRekap>([]);
    const [ onLoadPegawais, setOnLoadPegawais ] = useState(false);
    const [ onLoadPeriodes, setOnLoadPeriodes ] = useState(false);
    const formSubmitDisabled = (): boolean => Object.keys(formInput).filter((filt) => !['skill_manajerial', 'skill_leadership', 'catatan_negatif', 'prestasi'].includes(filt)).some((key) => !formInput[key]);
    const handleFormSubmit = (event: SyntheticEvent<HTMLFormElement>) => {
        event.preventDefault();
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
                setTimeout(() => {
                    router.visit(route('master.rekap-pegawai.index'));
                }, 1500);
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
            setOnLoadPegawais(true);
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
                .finally(() => setOnLoadPegawais(false));
        }
    }, [ formInput.unit_id ]);
    useEffect(() => {
        if (formInput.pegawai_id) {
            setOnLoadPeriodes(true);
            axios.post<{ data: PeriodesToRekap }>(route('periode-rekap.periodes-to-rekap'), {
                pegawai_id: formInput.pegawai_id,
            })
                .then((res) => {
                    setPeriodes(res.data.data);
                    if (res.data.data.length < 1) {
                        toast.warn('Tidak ada Periode yang tersedia!', {
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
                .finally(() => setOnLoadPeriodes(false));
        }
    }, [ formInput.pegawai_id ]);

    useEffect(() => {
        if (!formInput.pegawai_id) {
            setFormInput((prevState) => ({
                ...prevState,
                marhalah_id: '',
                golongan_id: '',
                status_pegawai_id: '',
                periode_rekap_id: ''
            }));
        } else {
            const selectedPegawai = pegawais.find((pegawai) => pegawai.id === formInput.pegawai_id);
            setFormInput((prevState) => ({
                ...prevState,
                marhalah_id: selectedPegawai?.marhalah?.id || '',
                golongan_id: selectedPegawai?.golongan?.id || '',
                status_pegawai_id: selectedPegawai?.status_pegawai?.id || '',
            }));
        }
    }, [formInput.pegawai_id, pegawais]);

    return (
        <>
            <Head title="Buat Rekap Pegawai"/>
            <MasterLayout auth={auth}>
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
                            <li>Marhalah, Golongan dan Status Pegawai otomatis menyinkron dengan data pegawai terpilih</li>
                            <li>Untuk mengubah informasi Marhalah, Golongan, atau Status Pegawai dapat diubah di manajemen Pegawai</li>
                        </ul>
                    </header>
                    <Card className="w-full px-6">
                    <form onSubmit={ handleFormSubmit } className="grid grid-cols-1 lg:grid-cols-2 gap-x-6 gap-y-4 p-5 dark:bg-gray-900">
                            <RekapPegawaiForm
                                formState={ formInput }
                                setFormState={setFormInput}
                                units={ units }
                                pegawais={pegawais}
                                periodes={periodes}
                                marhalahs={marhalahs}
                                golongans={golongans}
                                statusPegawais={statusPegawais}
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

            </MasterLayout>
        </>
    );
}
