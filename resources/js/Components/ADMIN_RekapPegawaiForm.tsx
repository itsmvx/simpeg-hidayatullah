import { ChangeEvent, Dispatch, memo, SetStateAction } from "react";
import { Option, Select } from "@material-tailwind/react";
import { Input } from "@/Components/Input";
import {  TriangleAlert } from "lucide-react";
import { TextArea } from "@/Components/TextArea";
import ReactSelect from 'react-select';
import { format } from "date-fns";
import { id } from "date-fns/locale";
import { FormRekapPegawaiByAdmin, PegawaiToRekapByAdmin } from "@/Pages/Admin/ADMIN_RekapPegawaiCreatePage";

const ADMIN_RekapPegawaiForm = ({ formState, setFormState, periodes, pegawais }: {
    formState: FormRekapPegawaiByAdmin;
    setFormState: Dispatch<SetStateAction<FormRekapPegawaiByAdmin>>
    periodes: {
        id: string;
        nama: string;
        awal: string;
        akhir: string;
    }[];
    pegawais: {
        data: PegawaiToRekapByAdmin[];
        onError: boolean;
        onLoad: boolean;
        selected: PegawaiToRekapByAdmin | null;
    };
}) => {
    const handleInputChange = (event: ChangeEvent<HTMLInputElement> | ChangeEvent<HTMLTextAreaElement>) => {
        const { name, value } = event.target;
        setFormState((prevState) => ({
            ...prevState,
            [name]: value,
        }));
    };
    const handleSelectChange = (key: keyof FormRekapPegawaiByAdmin, value: string | null) => {
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

    return (
        <>
            <Select
                label="Periode Rekap"
                color="teal"
                name="periode_rekap_id"
                onChange={ (value: string | undefined) => handleSelectChange('periode_rekap_id', value ?? '') }
                value={formState.periode_rekap_id}
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
                isDisabled={(pegawais.data.length < 1 && pegawais.onError) || pegawais.onLoad}
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
                value={ formState.amanah }
                onChange={ handleInputChange }
                required
            />
            <Input
                type="text"
                color="teal"
                label="Amanah Organisasi (tidak wajib diisi)"
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
                value={ formState.skill_manajerial }
                onChange={ handleInputChange }
            />
            <TextArea
                label="Skill Leadership (tidak wajib diisi)"
                color="teal"
                name="skill_leadership"
                value={ formState.skill_leadership }
                onChange={ handleInputChange }
            />
            <TextArea
                label="Catatan Negatif (tidak wajib diisi)"
                color="teal"
                name="catatan_negatif"
                value={ formState.catatan_negatif }
                onChange={ handleInputChange }
            />
            <TextArea
                label="Prestasi (tidak wajib diisi)"
                color="teal"
                name="prestasi"
                value={ formState.prestasi }
                onChange={ handleInputChange }
            />
        </>
    )
};

export default memo(ADMIN_RekapPegawaiForm);
