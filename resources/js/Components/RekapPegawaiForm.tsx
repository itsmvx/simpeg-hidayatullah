import { ChangeEvent, Dispatch, FormEvent, memo, SetStateAction, useEffect, useRef, useState } from "react";
import { Option, Select, Typography } from "@material-tailwind/react";
import { Input } from "@/Components/Input";
import { CircleCheck, TriangleAlert } from "lucide-react";
import { FormRekapPegawai, PegawaisToRekap } from "@/Pages/Admin/MASTER_RekapPegawaiCreatePage";
import { TextArea } from "@/Components/TextArea";
import ReactSelect from 'react-select';
import { format } from "date-fns";
import { id } from "date-fns/locale";

const RekapPegawaiForm = ({ formState, setFormState, units, periodes, pegawais, onLoadPegawais, marhalahs, golongans, statusPegawais }: {
    formState: FormRekapPegawai;
    setFormState: Dispatch<SetStateAction<FormRekapPegawai>>
    units: {
        id: string;
        nama: string;
    }[];
    periodes: {
        id: string;
        nama: string;
        awal: string;
        akhir: string;
        available: boolean;
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
    pegawais: PegawaisToRekap;
    onLoadPegawais: boolean;
}) => {
    const [ inputPegawai, setInputPegawai ] = useState<{
        onFocus: boolean;
        onSelected: boolean;
        onError: boolean;
        value: string;
    }>({
        onFocus: false,
        onSelected: false,
        onError: false,
        value: ''
    });
    const handleInputChange = (event: ChangeEvent<HTMLInputElement> | ChangeEvent<HTMLTextAreaElement>) => {
        const { name, value } = event.target;
        setFormState((prevState) => ({
            ...prevState,
            [name]: value,
        }));
    };
    const handleSelectChange = (key: keyof FormRekapPegawai, value: string | null) => {
        setFormState((prevState) => {
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
    useEffect(() => {
        if(!inputPegawai.onFocus) {
            !inputPegawai.onSelected && setInputPegawai((prevState) => ({ ...prevState, onError: true }))
        }
    }, [ inputPegawai.onError ]);

    return (
        <>
            <Select
                label="Unit"
                color="teal"
                name="unit_id"
                value={ formState.unit_id ?? undefined }
                onChange={ (value: string | undefined) => handleSelectChange('unit_id', value ?? '') }
            >
                {
                    units.length > 0
                        ? units.sort((a, b) => a.nama.localeCompare(b.nama)).map(({ id, nama }) => ((
                            <Option key={ id } value={ id }>{ nama }</Option>
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
            <ReactSelect
                placeholder={formState.unit_id ? 'Ketik atau pilih Pegawai' : 'Pegawai'}
                isDisabled={!formState.unit_id}
                isLoading={onLoadPegawais}
                isClearable={true}
                isSearchable
                options={pegawais.map((pegawai) => ({ value: pegawai.id, label: pegawai.nama }))}
                noOptionsMessage={() => (<><p>Tidak ada pegawai di Unit ini</p></>)}
                value={pegawais
                    .map((pegawai) => ({ value: pegawai.id, label: pegawai.nama }))
                    .find(option => option.value === formState.pegawai_id) || null
                }
                onChange={(selectedOption) => handleSelectChange('pegawai_id', selectedOption ? selectedOption.value : null)}
                isOptionDisabled={() => pegawais.length < 1}
                styles={{
                    option: (provided) => ({
                        ...provided,
                        cursor: 'pointer',
                    }),
                }}
            />
            <Select
                label="Marhalah"
                color="teal"
                name="marhalah_id"
                value={formState.marhalah_id ?? undefined }
                onChange={(val) => handleSelectChange('marhalah_id', val ?? '') }
                disabled
            >
                {
                    marhalahs.map(({ id, nama }) => ((
                        <Option key={ id } value={ id } defaultChecked={formState.marhalah_id === id}>{ nama }</Option>
                    )))
                }
            </Select>
            <Select
                label="Golongan"
                color="teal"
                name="golongan_id"
                value={formState.golongan_id ?? undefined }
                onChange={(val) => handleSelectChange('golongan_id', val ?? '') }
                disabled
            >
                {
                    golongans.map(({ id, nama }) => ((
                        <Option key={ id } value={ id } defaultChecked={formState.golongan_id === id}>{ nama }</Option>
                    )))
                }
            </Select>
            <Select
                label="Status Pegawai"
                color="teal"
                name="status_pegawai_id"
                value={formState.status_pegawai_id ?? undefined }
                onChange={(val) => handleSelectChange('status_pegawai_id', val ?? '') }
                disabled
            >
                {
                    statusPegawais.map(({ id, nama }) => ((
                        <Option key={ id } value={ id }>{ nama }</Option>
                    )))
                }
            </Select>
            <Select
                label="Periode Rekap"
                color="teal"
                name="periode_rekap_id"
                onChange={ (value: string | undefined) => handleSelectChange('periode_rekap_id', value ?? '') }
                disabled={!formState.pegawai_id}
            >
                {
                    periodes.length > 0
                        ? periodes.sort((a, b) => a.nama.localeCompare(b.nama)).map((periode) => ((
                            <Option
                                key={ periode.id }
                                value={ periode.id }
                                disabled={ !periode.available }
                            >
                                <div className="flex justify-items-center gap-1">
                                    <p className="flex justify-items-center gap-1.5 truncate">
                                        { periode.nama } &nbsp;
                                        ({ format(periode.awal, 'PPP', { locale: id }) } -&nbsp;
                                        { format(periode.akhir, 'PPP', { locale: id })})
                                    </p>
                                    {
                                        !periode.available && (
                                            <CircleCheck width={25} color="green" className="-mt-0.5 ml-auto"/>
                                        )
                                    }
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
            <Input
                type="text"
                color="teal"
                label="Amanah Profesi"
                name="amanah"
                value={ formState.amanah }
                onChange={ handleInputChange }
                required
            />
            <Input
                type="text"
                color="teal"
                label="Amanah Organisasi (bila ada)"
                name="organisasi"
                value={ formState.organisasi }
                onChange={ handleInputChange }
            />
            <Input
                type="number"
                color="teal"
                label="Gaji"
                name="gaji"
                value={ formState.gaji }
                onChange={ handleInputChange }
                required
            />
            <Input
                type="text" color="teal"
                label="Ketuntasan Kerja"
                name="ketuntasan_kerja"
                value={ formState.ketuntasan_kerja }
                onChange={ handleInputChange }
                required
            />
            <TextArea
                label="Skill Manajerial"
                color="teal"
                name="skill_manajerial"
                value={ formState.skill_manajerial }
                onChange={ handleInputChange }
            />
            <TextArea
                label="Skill Leadership"
                color="teal"
                name="skill_leadership"
                value={ formState.skill_leadership }
                onChange={ handleInputChange }
            />
            <TextArea
                color="teal"
                label="Kedisiplinan"
                name="kedisiplinan"
                value={ formState.kedisiplinan }
                onChange={ handleInputChange }
                required
            />
            <TextArea
                color="teal"
                label="Rapor Profesi"
                name="raport_profesi"
                value={ formState.raport_profesi }
                onChange={ handleInputChange }
                required
            />
            <TextArea
                label="Catatan Negatif (bila ada)"
                color="teal"
                name="catatan_negatif"
                value={ formState.catatan_negatif }
                onChange={ handleInputChange }
            />
            <TextArea
                label="Prestasi"
                color="teal"
                name="prestasi"
                value={ formState.prestasi }
                onChange={ handleInputChange }
            />
        </>
    )
};

export default memo(RekapPegawaiForm);
