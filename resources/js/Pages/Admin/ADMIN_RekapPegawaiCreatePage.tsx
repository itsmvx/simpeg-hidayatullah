import { Head, router } from "@inertiajs/react";
import { Card, Typography, Button } from "@material-tailwind/react";
import { CircleAlert, Save } from "lucide-react";
import { SyntheticEvent, useEffect, useState } from "react";
import "react-day-picker/dist/style.css";
import { AdminLayout } from "@/Layouts/AdminLayout";
import { IDNamaColumn, PageProps } from "@/types";
import { z } from "zod";
import { notifyToast } from "@/Lib/Utils";
import axios, { AxiosError } from "axios";
import RekapPegawaiForm from "@/Components/ADMIN_RekapPegawaiForm";

export type FormRekapPegawaiByAdmin = {
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
    golongan_id: string;
    status_pegawai_id: string;
    marhalah_id: string;
    periode_rekap_id: string;
    onSubmit: boolean;
    onSuccess: boolean;
};
export type PegawaiToRekapByAdmin = {
    id: string;
    nama: string;
    unit: IDNamaColumn;
    golongan: IDNamaColumn;
    marhalah: IDNamaColumn;
    status_pegawai: IDNamaColumn;
};

export default function ADMIN_RekapPegawaiCreatePage({ auth, periodes }: PageProps<{
    periodes: {
        id: string;
        nama: string;
        awal: string;
        akhir: string;
    }[];
}>) {

    const formRekapPegawaiInit: FormRekapPegawaiByAdmin = {
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
        golongan_id: '',
        status_pegawai_id: '',
        marhalah_id: '',
        periode_rekap_id: '',
        onSubmit: false,
        onSuccess: false
    };

    const [ formInput, setFormInput ] = useState<FormRekapPegawaiByAdmin>(formRekapPegawaiInit);
    const [ pegawais, setPegawais ] = useState<{
        data: PegawaiToRekapByAdmin[];
        onError: boolean;
        onLoad: boolean;
        selected: PegawaiToRekapByAdmin | null;
    }>({
        data: [],
        onError: false,
        onLoad: false,
        selected: null
    });
    const formSubmitDisabled = (): boolean => Object.keys(formInput).filter((filt) => !['skill_manajerial', 'skill_leadership', 'catatan_negatif', 'prestasi', 'organisasi', 'onSubmit', 'onSuccess'].includes(filt)).some((key) => !formInput[key]) || formInput.onSubmit;
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
            notifyToast('error', errorMessages);
            return;
        }

        axios.post(route('rekap-pegawai.create'), {
            ...zodRekapResult.data
        })
            .then(() => {
                notifyToast('success', 'Rekap Pegawai berhasil ditambahkan!');
                setFormInput((prevState) => ({
                    ...prevState,
                    onSuccess: true
                }));
                setTimeout(() => {
                    router.visit(route('admin.rekap-pegawai.index'));
                }, 2000);
            })
            .catch((err: unknown) => {
                const errMsg = err instanceof AxiosError
                    ? err.response?.data.message as string ?? 'Error tidak diketahui terjadi!'
                    : 'Error tidak diketahui terjadi!'
                notifyToast('error', errMsg);
                setFormInput((prevState) => ({ ...prevState, onSubmit: false }))
            });
    };

    useEffect(() => {
        if (formInput.periode_rekap_id) {
            setPegawais((prevState) => ({
                ...prevState,
                data: [],
                onError: false,
                onLoad: true,
                selected: null
            }));
            setFormInput((prevState) => ({
                ...formRekapPegawaiInit,
                periode_rekap_id: prevState.periode_rekap_id
            }));
            axios.post<{
                data: PegawaiToRekapByAdmin[]
            }>(route('pegawai.data-to-rekap-by-admin'), {
                periode_id: formInput.periode_rekap_id,
                unit_id: auth.user?.unit_id ?? '0'
            })
                .then((res) => {
                    setPegawais((prevState) => ({
                        ...prevState,
                        data: res.data.data,
                        onLoad: false
                    }));
                    notifyToast('success', 'Data Pegawai berhasil diperbarui');
                })
                .catch((err: unknown) => {
                    const errMsg = err instanceof AxiosError
                        ? err.response?.data.message ?? 'Error tidak diketahui terjadi'
                        : 'Error tidak diketahui terjadi';
                    setPegawais((prevState) => ({
                        ...prevState,
                        onLoad: false,
                        onError: true
                    }))
                    notifyToast('error', errMsg);
                });
        }
    }, [ formInput.periode_rekap_id ]);

    useEffect(() => {
        const selectedPegawai = pegawais.data.find((pegawai) => pegawai.id === formInput.pegawai_id) ?? null;
        setPegawais((prevState) => {
            if (formInput.pegawai_id) {
                return {
                    ...prevState,
                    selected: selectedPegawai
                }
            }
            return {
                ...prevState,
                selected: null
            }
        });
        if (formInput.pegawai_id && selectedPegawai) {
            setFormInput((prevState) => ({
                ...formRekapPegawaiInit,
                periode_rekap_id: prevState.periode_rekap_id,
                pegawai_id: selectedPegawai.id,
                unit_id: selectedPegawai.unit.id,
                golongan_id: selectedPegawai.golongan.id,
                marhalah_id: selectedPegawai.marhalah.id,
                status_pegawai_id: selectedPegawai.status_pegawai.id,
            }));
        }
    }, [ formInput.pegawai_id ]);

    return (
        <>
            <Head title="Buat Rekap Pegawai"/>
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
                                pegawais={pegawais}
                                periodes={periodes}
                            />
                            <Button
                                type="submit"
                                disabled={formSubmitDisabled()}
                                className="col-span-1 lg:col-span-2 w-52 min-h-12 ml-auto flex items-center justify-center gap-3"
                            >
                                {
                                    formInput.onSubmit && !formInput.onSuccess
                                        ? (
                                            <div className="w-4 h-4 border-2 border-r-transparent border-gray-100 rounded-full animate-spin"></div>
                                        ) : (
                                            <Save/>
                                        )
                                }
                                {
                                    formInput.onSubmit && !formInput.onSuccess
                                        ? 'Menyimpan...'
                                        : formInput.onSubmit && formInput.onSuccess
                                            ? 'Tersimpan'
                                            : 'Simpan'
                                }
                            </Button>
                        </form>
                    </Card>
                </main>
            </AdminLayout>
        </>
    );
}
