import { Head, router } from "@inertiajs/react";
import { Card, Typography, Button, Tooltip, IconButton, Select, Option } from "@material-tailwind/react";
import { CircleAlert, MoveLeft, Save, TriangleAlert } from "lucide-react";
import { ChangeEvent, SyntheticEvent, useEffect, useState } from "react";
import "react-day-picker/dist/style.css";
import { FormRekapPegawai, IDNamaColumn, PageProps } from "@/types";
import { notifyToast } from "@/Lib/Utils";
import axios, { AxiosError } from "axios";
import { toast } from "react-toastify";
import { MasterLayout } from "@/Layouts/MasterLayout";
import { format } from "date-fns";
import { id } from "date-fns/locale";
import ReactSelect from "react-select";
import { Input } from "@/Components/Input";
import { generateSingleSuratKontrakKerja } from "@/Lib/Generate_Dokumen/SuratPerjanjianKontrakKerja";

type FormSuratKontrakKerja = {
    unit_id: string;
    periode_rekap_id: string;
    pegawai_id: string;
    amanah: string;
    onProcess: boolean;
};
type PegawaiToKontrak = {
    id: string;
    nama: string;
    amanah: string;
    unit: IDNamaColumn;
    golongan: IDNamaColumn;
    marhalah: IDNamaColumn;
    status_pegawai: IDNamaColumn
};
export default function MASTER_SuratKontrakKerjaPage({ auth, units, periodes, suratProps }: PageProps<{
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
    suratProps: {
        kepalaSDI: string | null;
        currDate: string;
    };
}>) {

    const formSuratKontrakKerjaInit: FormSuratKontrakKerja = {
        unit_id: '',
        periode_rekap_id: '',
        pegawai_id: '',
        amanah: '',
        onProcess: false
    };

    const [ formInputs, setFormInputs ] = useState<FormSuratKontrakKerja>(formSuratKontrakKerjaInit);
    const [ pegawais, setPegawais ] = useState<{
        data: PegawaiToKontrak[];
        input: string;
        onError: boolean;
        onLoad: boolean;
        selected: PegawaiToKontrak | null;
    }>({
        data: [],
        input: '',
        onError: false,
        onLoad: false,
        selected: null
    });
    const formSubmitDisabled = (): boolean => Object.keys(formInputs).filter((filt) => !['onProcess'].includes(filt)).some((key) => !formInputs[key]) || formInputs.onProcess;
    const handleInputChange = (event: ChangeEvent<HTMLInputElement> | ChangeEvent<HTMLTextAreaElement>) => {
        const { name, value } = event.target;
        setFormInputs((prevState) => ({
            ...prevState,
            [name]: value,
        }));
    };
    const handleSelectChange = (key: keyof FormRekapPegawai, value: string | null) => {
        setFormInputs((prevState) => {
            if (key === 'pegawai_id' && value === null) {
                return {
                    ...prevState,
                    pegawai_id: '',
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
            onProcess: true
        }));
        try {
            const selectedPeriode = periodes.find((periode) => periode.id === formInputs.periode_rekap_id);
            const suratKontrakProps = {
                pihakPertama: {
                    nama: suratProps.kepalaSDI ?? '{Nama_KA_SDI}',
                },
                pihakKedua: {
                    nama: pegawais.selected?.nama ?? '{Nama Pegawai}',
                    amanah: formInputs.amanah
                },
                periode: {
                    awal: selectedPeriode?.awal ?? new Date().toDateString(),
                    akhir: selectedPeriode?.akhir ?? new Date().toDateString()
                },
                tanggal: new Date().toDateString()
            }
            generateSingleSuratKontrakKerja({
                ...suratKontrakProps
            });
            notifyToast('success', 'Berhasil membuat Dokumen!');
            setFormInputs(formSuratKontrakKerjaInit);
        } catch (err) {
            notifyToast('error', 'Gagal membuat Dokumen');
        }
    };

    useEffect(() => {
        if (formInputs.unit_id) {
            setPegawais(() => ({
                data: [],
                input: '',
                onError: false,
                onLoad: false,
                selected: null
            }));
            setFormInputs((prevState) => ({
                ...formSuratKontrakKerjaInit,
                unit_id: prevState.unit_id
            }));
        }
    }, [ formInputs.unit_id ]);

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
                ...formSuratKontrakKerjaInit,
                unit_id: prevState.unit_id,
                periode_rekap_id: prevState.periode_rekap_id
            }));
            axios.post<{
                data: PegawaiToKontrak[]
            }>(route('pegawai.data-to-kontrak'), {
                periode_id: formInputs.periode_rekap_id,
                unit_id: formInputs.unit_id
            })
                .then((res) => {
                    setPegawais((prevState) => ({
                        ...prevState,
                        data: res.data.data,
                        onLoad: false
                    }));
                    if (res.data.data.length < 1) {
                        toast.warn('Tidak ada Pegawai tersedia dari Unit terpilih dan untuk Periode terpilih');
                        return;
                    }
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
                ...formSuratKontrakKerjaInit,
                periode_rekap_id: prevState.periode_rekap_id,
                pegawai_id: selectedPegawai.id,
                unit_id: selectedPegawai.unit.id,
                amanah: selectedPegawai.amanah
            }));
        }
    }, [ formInputs.pegawai_id ]);

    return (
        <>
            <Head title="Master - Surat Kontrak Kerja"/>
            <MasterLayout auth={auth}>
                <main className="w-full min-h-screen bg-gray-50">
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
                    <Card className="w-full px-6 !shadow-none">
                        <Tooltip content="Kembali">
                            <IconButton variant="text" onClick={() => router.visit(route('master.rekap-pegawai.index'))} className="mt-2">
                                <MoveLeft />
                            </IconButton>
                        </Tooltip>
                        <form onSubmit={ handleFormSubmit } className="grid grid-cols-1 lg:grid-cols-2 gap-x-6 gap-y-4 p-5">
                            <Select
                                label="Unit"
                                color="teal"
                                name="unit_id"
                                value={ formInputs.unit_id }
                                onChange={ (value: string | undefined) => handleSelectChange('unit_id', value ?? '') }
                            >
                                {
                                    units.length > 0
                                        ? units.sort((a, b) => a.nama.localeCompare(b.nama)).map((unit) => ((
                                            <Option
                                                key={ unit.id }
                                                value={ unit.id }
                                            >
                                                { unit.nama }
                                            </Option>
                                        )))
                                        : (
                                            <Option disabled value="null">
                                                <p className="flex items-center gap-2">
                                                    <TriangleAlert className="text-red-600"/>
                                                    <span className="text-gray-900 font-semibold">
                                                        Belum ada Unit terdaftar
                                                    </span>
                                                </p>
                                            </Option>
                                        )
                                }
                            </Select>
                            <Select
                                label="Periode Rekap"
                                color="teal"
                                name="periode_rekap_id"
                                onChange={ (value: string | undefined) => handleSelectChange('periode_rekap_id', value ?? '') }
                                disabled={ !formInputs.unit_id }
                                value={ formInputs.periode_rekap_id }
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
                                isDisabled={(pegawais.data.length < 1 && pegawais.onError) || pegawais.onLoad || !formInputs.periode_rekap_id }
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
                                disabled={ !formInputs.pegawai_id }
                                required
                            />
                            <Button
                                type="submit"
                                className="col-span-1 lg:col-span-2 w-52 ml-auto flex items-center justify-center gap-3"
                                disabled={formSubmitDisabled()}
                                loading={formInputs.onProcess}
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
