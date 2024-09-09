import { ChangeEvent, Dispatch, memo, SetStateAction } from "react";
import { Option, Select } from "@material-tailwind/react";
import { Input } from "@/Components/Input";
import {  TriangleAlert } from "lucide-react";
import { TextArea } from "@/Components/TextArea";
import ReactSelect from 'react-select';
import { format } from "date-fns";
import { id } from "date-fns/locale";
import { FormRekapPegawai, PegawaiToRekap } from "@/types";

const RekapPegawaiForm = ({ formState, setFormState, units, periodes, pegawais }: {
    formState: FormRekapPegawai;
    setFormState: Dispatch<SetStateAction<FormRekapPegawai<{
        onSubmit: boolean;
    }>>>;
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
    pegawais: {
        data: PegawaiToRekap[];
        onError: boolean;
        onLoad: boolean;
        selected: PegawaiToRekap | null;
    };
}) => {


    return (
        <>
            <Select
                label="Unit"
                color="teal"
                name="unit_id"
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
                disabled={ !formState.unit_id }
                value={ formState.periode_rekap_id }
            >
                {
                    periodes.length > 0
                        ? periodes.sort((a, b) => a.nama.localeCompare(b.nama)).map((periode) => ((
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
                isDisabled={(pegawais.data.length < 1 && pegawais.onError) || pegawais.onLoad || !formState.periode_rekap_id }
                isLoading={pegawais.onLoad}
                isClearable={true}
                isSearchable
                options={pegawais.data.map((pegawai) => ({ value: pegawai.id, label: pegawai.nama }))}
                noOptionsMessage={() => (<><p className="text-sm font-medium">Tidak ada pegawai untuk ditampilkan</p></>)}
                value={pegawais.data
                    .map((pegawai) => ({ value: pegawai.id, label: pegawai.nama }))
                    .find(option => option.value === formState.pegawai_id) || null
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
                value={ formState.amanah }
                onChange={ handleInputChange }
                required
            />
            <Input
                type="text"
                color="teal"
                label="Amanah Organisasi (tidak wajib diisi)"
                name="organisasi"
                value={ formState.organisasi ?? '' }
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
                label="Skill Manajerial (tidak wajib diisi)"
                color="teal"
                name="skill_manajerial"
                value={ formState.skill_manajerial ?? '' }
                onChange={ handleInputChange }
            />
            <TextArea
                label="Skill Leadership (tidak wajib diisi)"
                color="teal"
                name="skill_leadership"
                value={ formState.skill_leadership ?? '' }
                onChange={ handleInputChange }
            />
            <TextArea
                label="Catatan Negatif (tidak wajib diisi)"
                color="teal"
                name="catatan_negatif"
                value={ formState.catatan_negatif ?? '' }
                onChange={ handleInputChange }
            />
            <TextArea
                label="Prestasi (tidak wajib diisi)"
                color="teal"
                name="prestasi"
                value={ formState.prestasi ?? '' }
                onChange={ handleInputChange }
            />
            <TextArea
                label="Pembinaan (tidak wajib diisi)"
                color="teal"
                name="pembinaan"
                value={ formState.pembinaan ?? '' }
                onChange={ handleInputChange }
            />
        </>
    )
};

export default memo(RekapPegawaiForm);
