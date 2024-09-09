import { Head, router } from "@inertiajs/react";
import { Card, Typography, Button, Tooltip, IconButton, Select, Option } from "@material-tailwind/react";
import { CircleAlert, MoveLeft, Save, TriangleAlert } from "lucide-react";
import { ChangeEvent, SyntheticEvent, useEffect, useState } from "react";
import "react-day-picker/dist/style.css";
import { AdminLayout } from "@/Layouts/AdminLayout";
import { IDNamaColumn, PageProps } from "@/types";
import { z } from "zod";
import { notifyToast } from "@/Lib/Utils";
import axios, { AxiosError } from "axios";
import { format } from "date-fns";
import { id } from "date-fns/locale";
import ReactSelect from "react-select";
import { Input } from "@/Components/Input";
import { TextArea } from "@/Components/TextArea";

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

    const [ formInputs, setFormInputs ] = useState<FormRekapPegawaiByAdmin>(formRekapPegawaiInit);
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
    const formSubmitDisabled = (): boolean => Object.keys(formInputs).filter((filt) => !['skill_manajerial', 'skill_leadership', 'catatan_negatif', 'prestasi', 'organisasi', 'onSubmit', 'onSuccess'].includes(filt)).some((key) => !formInputs[key]) || formInputs.onSubmit;
    const handleInputChange = (event: ChangeEvent<HTMLInputElement> | ChangeEvent<HTMLTextAreaElement>) => {
        const { name, value } = event.target;
        setFormInputs((prevState) => ({
            ...prevState,
            [name]: value,
        }));
    };
    const handleSelectChange = (key: keyof FormRekapPegawaiByAdmin, value: string | null) => {
        setFormInputs((prevState) => {
            if (key === 'pegawai_id' && value === null) {
                return {
                    ...prevState,
                    pegawai_id: '',
                    marhalah_id: '',
                    golongan_id: '',
                    status_pegawai_id: '',
                    periode_rekap_id: '',
                };
            }
            return {
                ...prevState,
                [key]: value ?? '',
            };
        });
    };
    const handleFormSubmit = (event: SyntheticEvent<HTMLFormElement>) => {
        event.preventDefault();
        setFormInputs((prevState) => ({
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
            ...formInputs,
            gaji: Number(formInputs.gaji),
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
                setFormInputs((prevState) => ({
                    ...prevState,
                    onSuccess: true
                }));
                setFormInputs(formRekapPegawaiInit);
            })
            .catch((err: unknown) => {
                const errMsg = err instanceof AxiosError
                    ? err.response?.data.message as string ?? 'Error tidak diketahui terjadi!'
                    : 'Error tidak diketahui terjadi!'
                notifyToast('error', errMsg);
                setFormInputs((prevState) => ({ ...prevState, onSubmit: false }))
            });
    };

    useEffect(() => {
        if (formInputs.periode_rekap_id) {
            setPegawais((prevState) => ({
                ...prevState,
                data: [],
                onError: false,
                onLoad: true,
                selected: null
            }));
            setFormInputs((prevState) => ({
                ...formRekapPegawaiInit,
                periode_rekap_id: prevState.periode_rekap_id
            }));
            axios.post<{
                data: PegawaiToRekapByAdmin[]
            }>(route('pegawai.data-to-rekap-by-admin'), {
                periode_id: formInputs.periode_rekap_id,
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
    }, [ formInputs.periode_rekap_id ]);

    useEffect(() => {
        const selectedPegawai = pegawais.data.find((pegawai) => pegawai.id === formInputs.pegawai_id) ?? null;
        setPegawais((prevState) => {
            if (formInputs.pegawai_id) {
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
        if (formInputs.pegawai_id && selectedPegawai) {
            setFormInputs((prevState) => ({
                ...formRekapPegawaiInit,
                periode_rekap_id: prevState.periode_rekap_id,
                pegawai_id: selectedPegawai.id,
                unit_id: selectedPegawai.unit.id,
                golongan_id: selectedPegawai.golongan.id,
                marhalah_id: selectedPegawai.marhalah.id,
                status_pegawai_id: selectedPegawai.status_pegawai.id,
            }));
        }
    }, [ formInputs.pegawai_id ]);

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
                        <Tooltip content="Kembali">
                            <IconButton variant="text" onClick={() => router.visit(route('admin.rekap-pegawai.index'))}>
                                <MoveLeft />
                            </IconButton>
                        </Tooltip>
                        <form onSubmit={ handleFormSubmit } className="grid grid-cols-1 lg:grid-cols-2 gap-x-6 gap-y-4 p-5">
                            <Select
                                label="Periode Rekap"
                                color="teal"
                                name="periode_rekap_id"
                                onChange={ (value: string | undefined) => handleSelectChange('periode_rekap_id', value ?? '') }
                                value={formInputs.periode_rekap_id}
                            >
                                {
                                    periodes.length > 0
                                        ? periodes.map((periode) => ((
                                            <Option
                                                key={ periode.id }
                                                value={ periode.id }
                                            >
                                                <div className="flex justify-items-center gap-1">
                                                    <p className="flex justify-items-center gap-1.5 truncate">
                                                        { periode.nama } &nbsp;
                                                        ({ format(periode.awal, 'PPP', { locale: id }) } -&nbsp;
                                                        { format(periode.akhir, 'PPP', { locale: id })})
                                                    </p>
                                                </div>
                                            </Option>
                                        )))
                                        : (
                                            <Option disabled value="null">
                                                <p className="flex items-center gap-2">
                                                    <TriangleAlert className="text-red-600"/>
                                                    <span className="text-gray-900 font-semibold">
                                        Belum ada Periode terdaftar atau dibuka
                                    </span>
                                                </p>
                                            </Option>
                                        )
                                }
                            </Select>
                            <ReactSelect
                                placeholder={pegawais.data.length > 0 && !pegawais.onLoad ? 'Ketik atau pilih Pegawai' : pegawais.onLoad ? 'Memuat daftar Pegawai..' : 'Pegawai'}
                                isDisabled={(pegawais.data.length < 1 && pegawais.onError) || pegawais.onLoad}
                                isLoading={pegawais.onLoad}
                                isClearable={true}
                                isSearchable
                                options={pegawais.data.map((pegawai) => ({ value: pegawai.id, label: pegawai.nama }))}
                                noOptionsMessage={() => (<><p className="text-sm font-medium">Tidak ada pegawai untuk ditampilkan</p></>)}
                                value={pegawais.data
                                    .map((pegawai) => ({ value: pegawai.id, label: pegawai.nama }))
                                    .find(option => option.value === formInputs.pegawai_id) || null
                                }
                                onChange={(selectedOption) => handleSelectChange('pegawai_id', selectedOption ? selectedOption.value : null)}
                                isOptionDisabled={() => pegawais.data.length < 1}
                                styles={{
                                    option: (provided) => ({
                                        ...provided,
                                        cursor: 'pointer',
                                    }),
                                }}
                            />
                            <Input
                                type="text"
                                color="teal"
                                label="Unit"
                                name="unit"
                                value={ pegawais?.selected?.unit.nama ?? '' }
                                disabled={ Boolean(!pegawais?.selected?.unit.nama) }
                                readOnly
                            />
                            <Input
                                type="text"
                                color="teal"
                                label="Golongan"
                                name="golongan"
                                value={ pegawais?.selected?.golongan.nama ?? '' }
                                disabled={ Boolean(!pegawais?.selected?.golongan.nama) }
                                readOnly
                            />
                            <Input
                                type="text"
                                color="teal"
                                label="Marhalah"
                                name="marhalah"
                                value={ pegawais?.selected?.marhalah.nama ?? '' }
                                disabled={ Boolean(!pegawais?.selected?.marhalah.nama) }
                                readOnly
                            />
                            <Input
                                type="text"
                                color="teal"
                                label="Status Pegawai"
                                name="status_pegawai"
                                value={ pegawais?.selected?.status_pegawai.nama ?? '' }
                                disabled={ Boolean(!pegawais?.selected?.status_pegawai.nama) }
                                readOnly
                            />
                            <Input
                                type="text"
                                color="teal"
                                label="Amanah"
                                name="amanah"
                                value={ formInputs.amanah }
                                onChange={ handleInputChange }
                                required
                            />
                            <Input
                                type="text"
                                color="teal"
                                label="Amanah Organisasi (tidak wajib diisi)"
                                name="organisasi"
                                value={ formInputs.organisasi }
                                onChange={ handleInputChange }
                            />
                            <Input
                                type="number"
                                color="teal"
                                label="Gaji"
                                name="gaji"
                                value={ formInputs.gaji }
                                onChange={ handleInputChange }
                                required
                            />
                            <Input
                                type="text" color="teal"
                                label="Ketuntasan Kerja"
                                name="ketuntasan_kerja"
                                value={ formInputs.ketuntasan_kerja }
                                onChange={ handleInputChange }
                                required
                            />
                            <TextArea
                                color="teal"
                                label="Kedisiplinan"
                                name="kedisiplinan"
                                value={ formInputs.kedisiplinan }
                                onChange={ handleInputChange }
                                required
                            />
                            <TextArea
                                color="teal"
                                label="Rapor Profesi"
                                name="raport_profesi"
                                value={ formInputs.raport_profesi }
                                onChange={ handleInputChange }
                                required
                            />
                            <TextArea
                                label="Skill Manajerial (tidak wajib diisi)"
                                color="teal"
                                name="skill_manajerial"
                                value={ formInputs.skill_manajerial }
                                onChange={ handleInputChange }
                            />
                            <TextArea
                                label="Skill Leadership (tidak wajib diisi)"
                                color="teal"
                                name="skill_leadership"
                                value={ formInputs.skill_leadership }
                                onChange={ handleInputChange }
                            />
                            <TextArea
                                label="Catatan Negatif (tidak wajib diisi)"
                                color="teal"
                                name="catatan_negatif"
                                value={ formInputs.catatan_negatif }
                                onChange={ handleInputChange }
                            />
                            <TextArea
                                label="Prestasi (tidak wajib diisi)"
                                color="teal"
                                name="prestasi"
                                value={ formInputs.prestasi }
                                onChange={ handleInputChange }
                            />
                            <Button
                                type="submit"
                                disabled={formSubmitDisabled()}
                                className="col-span-1 lg:col-span-2 w-52 min-h-12 ml-auto flex items-center justify-center gap-3"
                            >
                                {
                                    formInputs.onSubmit && !formInputs.onSuccess
                                        ? (
                                            <div className="w-4 h-4 border-2 border-r-transparent border-gray-100 rounded-full animate-spin"></div>
                                        ) : (
                                            <Save/>
                                        )
                                }
                                {
                                    formInputs.onSubmit && !formInputs.onSuccess
                                        ? 'Menyimpan...'
                                        : formInputs.onSubmit && formInputs.onSuccess
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
