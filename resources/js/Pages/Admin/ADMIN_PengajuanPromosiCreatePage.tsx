import { Head, router } from "@inertiajs/react";
import { Card, Typography, Button, Select, Option, Tooltip, IconButton } from "@material-tailwind/react";
import { CircleAlert, MoveLeft, Save } from "lucide-react";
import { ChangeEvent, SyntheticEvent, useEffect, useState } from "react";
import "react-day-picker/dist/style.css";
import { AdminLayout } from "@/Layouts/AdminLayout";
import { IDNamaColumn, JenisPengajuanPromosi, PageProps } from "@/types";
import { z } from "zod";
import { notifyToast } from "@/Lib/Utils";
import axios, { AxiosError } from "axios";
import ReactSelect from "react-select";
import { Input } from "@/Components/Input";
import { TextArea } from "@/Components/TextArea";
import { jenisPengajuanPromosi } from "@/Lib/StaticData";

export type PengajuanPromosiByAdmin = {
    nama: string;
    unit_id: string;
    admin_id: string;
    pegawai_id: string;
    asal_type: JenisPengajuanPromosi | '';
    asal_id: string;
    akhir_type: JenisPengajuanPromosi | '';
    akhir_id: string;
    keterangan: string | null;
    onSubmit: boolean;
    onSuccess: boolean;
};
type Pegawai = {
    id: string;
    nama: string;
    golongan: IDNamaColumn;
    marhalah: IDNamaColumn;
    status_pegawai: IDNamaColumn;
};

export default function ADMIN_PengajuanPromosiCreatePage({ auth, admin, pegawais, golongans, marhalahs, statusPegawais }: PageProps<{
    admin: {
        id: string;
        unit_id: string;
    };
    pegawais: Pegawai[];
    golongans: IDNamaColumn[];
    marhalahs: IDNamaColumn[];
    statusPegawais: IDNamaColumn[];
}>) {

    const formPengajuanPromosiInit: PengajuanPromosiByAdmin = {
        nama: '',
        unit_id: admin.unit_id,
        admin_id: admin.id,
        pegawai_id: '',
        asal_type: '',
        asal_id: '',
        akhir_type: '',
        akhir_id: '',
        keterangan: '',
        onSubmit: false,
        onSuccess: false
    };


    const [ formInput, setFormInput ] = useState<PengajuanPromosiByAdmin>(formPengajuanPromosiInit);
    const [ pegawai, setPegawai ] = useState<Pegawai | null>(null);
    const formSubmitDisabled = (): boolean => Object.keys(formInput).filter((filt) => !['keterangan', 'onSubmit', 'onSuccess'].includes(filt)).some((key) => !formInput[key]) || formInput.onSubmit;
    const handleInputChange = (event: ChangeEvent<HTMLInputElement> | ChangeEvent<HTMLTextAreaElement>) => {
        const { name, value } = event.target;
        setFormInput((prevState) => ({
            ...prevState,
            [name]: value,
        }));
    };
    const handleSelectChange = (key: keyof PengajuanPromosiByAdmin, value: string | null) => {
        setFormInput((prevState) => {
            if (key === 'pegawai_id' && value === null) {
                return {
                    ...prevState,
                    pegawai_id: '',
                    jenis: '',
                    asal_id: '',
                    asal_type: '',
                    akhir_id: '',
                    akhir_type: '',
                };
            } else if (key === 'asal_type' && pegawai) {
                return {
                    ...prevState,
                    asal_type: value as JenisPengajuanPromosi ?? '',
                    asal_id: value ? pegawai[value].id : '',
                    akhir_type: value as JenisPengajuanPromosi ?? ''
                }
            }
            return {
                ...prevState,
                [key]: value ?? '',
            };
        });
    };
    const handleFormSubmit = (event: SyntheticEvent<HTMLFormElement>) => {
        event.preventDefault();
        setFormInput((prevState) => ({
            ...prevState,
            onSubmit: true
        }));
        const pengajuanPromosiSchema = z.object({
            nama: z.string({ message: 'Format Judul tidak valid' }).min(1, { message: 'Judul tidak boleh kosong' }),
            unit_id: z.string({ message: 'Unit belum terpilih' }).uuid({ message: 'Format unit tidak valid' }).min(1, { message: 'Unit tidak boleh kosong' }),
            admin_id: z.string({ message: 'Admin belum dipilih'}).uuid({ message: 'Format Admin tidak valid' }).min(1, { message: 'Admin tidak boleh kosong' }),
            pegawai_id: z.string({ message: 'Admin belum dipilih'}).uuid({ message: 'Format Admin tidak valid' }).min(1, { message: 'Admin tidak boleh kosong' }),
            asal_type: z.string({ message: 'Format Informasi (asal) pengajuan tidak valid' }).min(1, { message: 'Informasi pengajuan (asal) tidak boleh kosong' }),
            asal_id: z.string({ message: 'Format data asal error'}).uuid({ message: 'Format data asal tidak valid' }).min(1, { message: 'Data asal tidak boleh kosong' }),
            akhir_type: z.string({ message: 'Format Informasi(tujuan) pengajuan tidak valid' }).min(1, { message: 'Informasi pengajuan (tujuan) tidak boleh kosong' }),
            akhir_id: z.string({ message: 'Format data tujuan error'}).uuid({ message: 'Format data tujuan tidak valid' }).min(1, { message: 'Data asal tidak boleh kosong' }),
            keterangan: z.string({ message: 'Format keterangan tidak valid ' }).nullable()
        });
        const zodPengajuanPromosiResult = pengajuanPromosiSchema.safeParse({
            ...formInput,
        });
        if (!zodPengajuanPromosiResult.success) {
            const errorMessages = zodPengajuanPromosiResult.error.issues[0].message;
            notifyToast('error', errorMessages);
            setFormInput((prevState) => ({
                ...prevState,
                onSubmit: false
            }));
            return;
        }

        axios.post(route('pengajuan-promosi.create'), {
            ...zodPengajuanPromosiResult.data
        })
            .then(() => {
                notifyToast('success', 'Pengajuan Promosi berhasil ditambahkan!');
                setFormInput((prevState) => ({
                    ...prevState,
                    onSuccess: true
                }));
                setFormInput(formPengajuanPromosiInit);
                // setTimeout(() => {
                //     router.visit(route('admin.pengajuan-promosi.index'));
                // }, 2000);
            })
            .catch((err: unknown) => {
                const errMsg = err instanceof AxiosError
                    ? err.response?.data.message as string ?? 'Error tidak diketahui terjadi!'
                    : 'Error tidak diketahui terjadi!'
                notifyToast('error', errMsg);
                setFormInput((prevState) => ({ ...prevState, onSubmit: false }))
            });
    };

    const HeadingInfo = ({ asal_id, asal_type, akhir_id, akhir_type }: {
        asal_id: string;
        asal_type: string;
        akhir_id: string;
        akhir_type: string;
    }) => {
        if (asal_id && asal_type && akhir_id && akhir_type) {
            const asalData: IDNamaColumn[] = asal_type === 'golongan'
                ? golongans
                : asal_type === 'marhalah'
                    ? marhalahs
                    : statusPegawais;
            const akhirData: IDNamaColumn[] = akhir_type === 'golongan'
                ? golongans
                : akhir_type === 'marhalah'
                    ? marhalahs
                    : statusPegawais;

            const asalVal = asalData.find((item) => item.id === asal_id)?.nama ?? '';
            const akhirVal = akhirData.find((item) => item.id === akhir_id)?.nama ?? '';
            const jenis = jenisPengajuanPromosi.find((jenis) => jenis.label === akhir_type)?.label ?? '';

            return (
                <Typography variant="h6" className="col-span-full text-center min-h-8">
                    Perubahan dari { jenis } { asalVal } ke { akhirVal }
                </Typography>
            )
        }
        return (
            <>
                <Typography variant="h6" className="col-span-full text-center min-h-8">
                    { "" }
                </Typography>
            </>
        )
    };
    const SelectAkhirPengajuan = ({ type }: { type: JenisPengajuanPromosi | '' }) => {
        if (!type) {
            return (
                <ReactSelect
                    placeholder="Menjadi"
                    isDisabled={true}
                    isClearable={true}
                    isSearchable
                    isOptionDisabled={() => true}
                    styles={{
                        option: (provided) => ({
                            ...provided,
                            cursor: 'pointer',
                        }),
                    }}
                />
            );
        }

        const data: IDNamaColumn[] = type === 'golongan'
            ? golongans
            : type === 'marhalah'
                ? marhalahs
                : statusPegawais;

        return (
            <ReactSelect
                placeholder="Ketik atau pilih Opsi Tujuan"
                isDisabled={data.length < 1}
                isClearable={false}
                isSearchable
                options={data.sort((a, b) => a.nama.localeCompare(b.nama)).map((item) => ({ value: item.id, label: item.nama }))}
                noOptionsMessage={() => (<><p className="text-sm font-medium">Tidak ada opsi untuk ditampilkan</p></>)}
                value={data
                    .map((item) => ({ value: item.id, label: item.nama }))
                    .find(option => option.value === formInput.akhir_id) || null
                }
                onChange={(selectedOption) => handleSelectChange('akhir_id', selectedOption ? selectedOption.value : null)}
                isOptionDisabled={(option) => option.value === formInput.asal_id}
                styles={{
                    option: (provided) => ({
                        ...provided,
                        cursor: 'pointer',
                    }),
                }}
            />
        );
    };

    useEffect(() => {
        setPegawai(() => {
            if (formInput.pegawai_id) {
                return pegawais.find((pegawai) => pegawai.id === formInput.pegawai_id) ?? null;
            }
            return null;
        })
    }, [ formInput.pegawai_id ]);

    return (
        <>
            <Head title="Admin - Buat Pengajuan Promosi Create"/>
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
                            <IconButton variant="text" onClick={() => router.visit(route('admin.pengajuan-promosi.index'))}>
                                <MoveLeft />
                            </IconButton>
                        </Tooltip>
                        <form onSubmit={ handleFormSubmit } className="grid grid-cols-1 lg:grid-cols-2 gap-x-6 gap-y-4 p-5">
                           <HeadingInfo
                               asal_id={formInput.asal_id}
                               asal_type={formInput.asal_type}
                               akhir_id={formInput.akhir_id}
                               akhir_type={formInput.akhir_type}
                           />
                            <Input
                                type="text"
                                color="teal"
                                label="Judul"
                                name="nama"
                                value={ formInput.nama }
                                onChange={ handleInputChange }
                                containerProps={ {
                                    className: 'col-span-full'
                                } }
                            />
                            <ReactSelect
                                placeholder="Ketik atau pilih Pegawai"
                                isDisabled={ pegawais.length < 1 }
                                isClearable={ true }
                                isSearchable
                                options={ pegawais.map((pegawai) => ({ value: pegawai.id, label: pegawai.nama })) }
                                noOptionsMessage={ () => (<><p className="text-sm font-medium">Tidak ada pegawai untuk
                                    ditampilkan</p></>) }
                                value={ pegawais
                                    .map((pegawai) => ({ value: pegawai.id, label: pegawai.nama }))
                                    .find(option => option.value === formInput.pegawai_id) || null
                                }
                                onChange={ (selectedOption) => handleSelectChange('pegawai_id', selectedOption ? selectedOption.value : null) }
                                isOptionDisabled={ () => pegawais.length < 1 }
                                styles={ {
                                    option: (provided) => ({
                                        ...provided,
                                        cursor: 'pointer',
                                    }),
                                } }
                            />
                            <Select
                                label="Jenis Promosi"
                                color="teal"
                                name="asal_type"
                                onChange={ (value: string | undefined) => handleSelectChange('asal_type', value ?? '') }
                                disabled={ !formInput.pegawai_id }
                            >
                                {
                                    jenisPengajuanPromosi.map((jenis, index) => ((
                                        <Option
                                            key={ index }
                                            value={ jenis.value }
                                        >
                                            { jenis.label }
                                        </Option>
                                    )))
                                }
                            </Select>
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
                                    name="unit"
                                    value={ pegawai ? pegawai[formInput.asal_type]?.nama ?? '' : '' }
                                    disabled={ !formInput.pegawai_id || !pegawai || !formInput.asal_id }
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
                                <SelectAkhirPengajuan type={ formInput.asal_type }/>
                            </div>
                            <TextArea
                                color="teal"
                                label="Keterangan (tidak wajib diisi)"
                                name="keterangan"
                                value={ formInput.keterangan ?? '' }
                                onChange={ handleInputChange }
                            />
                            <Button
                                type="submit"
                                disabled={ formSubmitDisabled() }
                                className="col-span-1 lg:col-span-2 w-52 min-h-12 ml-auto flex items-center justify-center gap-3"
                            >
                                {
                                    formInput.onSubmit && !formInput.onSuccess
                                        ? (
                                            <div
                                                className="w-4 h-4 border-2 border-r-transparent border-gray-100 rounded-full animate-spin"></div>
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
