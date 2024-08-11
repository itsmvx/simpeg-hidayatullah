import { ChangeEvent, Dispatch, FormEvent, memo, SetStateAction, useEffect, useRef, useState } from "react";
import { Option, Popover, PopoverContent, PopoverHandler, Select, Typography } from "@material-tailwind/react";
import { Input } from "@/Components/Input";
import { format } from "date-fns";
import { id } from "date-fns/locale";
import { DayPicker } from "react-day-picker";
import type { FormDataDiri } from "@/types";
import { TriangleAlert } from "lucide-react";
import { FormRekapPegawai, PegawaisToRekap } from "@/Pages/Admin/MASTER_RekapPegawaiCreatePage";
import { TextArea } from "@/Components/TextArea";

const RekapPegawaiForm = ({ formState, setFormState, units, periodes, pegawais, onLoadPegawais }: {
    formState: FormRekapPegawai;
    setFormState: Dispatch<SetStateAction<FormRekapPegawai>>
    units: {
        id: string;
        nama: string;
    }[];
    periodes: {
        id: string;
        nama: string;
    }[];
    pegawais: PegawaisToRekap;
    onLoadPegawais: boolean;
}) => {
    const [ pegawaiData, setPegawaiData ] = useState(pegawais);
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
    const handleSelectChange = (key: keyof FormRekapPegawai, value: string) => {
        setFormState((prevState) => ({
            ...prevState,
            [key]: value,
        }));
    };

    useEffect(() => {
        setPegawaiData(pegawais.filter((pegawai) => pegawai.nama.toLowerCase().includes(inputPegawai.value.toLowerCase())));
    }, [ inputPegawai.value ]);
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
            <div className="relative">
                <Input
                    type="text"
                    label="Pegawai"
                    name="pegawai_id"
                    value={inputPegawai.value}
                    disabled={!formState.unit_id || pegawais.length < 1}
                    error={inputPegawai.onError && Boolean(inputPegawai.value)}
                    onFocus={() => setInputPegawai((prevState) => ({
                        ...prevState,
                        onFocus: true
                    }))}
                    onBlur={() => setInputPegawai((prevState) => ({
                        ...prevState,
                        onFocus: false,
                    }))}
                    icon={onLoadPegawais && (
                        <svg xmlns="http://www.w3.org/2000/svg" width="1em" height="1em" viewBox="0 0 24 24">
                            <path fill="currentColor"
                                  d="M12 2A10 10 0 1 0 22 12A10 10 0 0 0 12 2Zm0 18a8 8 0 1 1 8-8A8 8 0 0 1 12 20Z"
                                  opacity="0.5"/>
                            <path fill="currentColor" d="M20 12h2A10 10 0 0 0 12 2V4A8 8 0 0 1 20 12Z">
                                <animateTransform attributeName="transform" dur="1s" from="0 12 12"
                                                  repeatCount="indefinite" to="360 12 12" type="rotate"/>
                            </path>
                        </svg>
                    )}
                    onChange={(event) => {
                        setInputPegawai((prevState) => ({
                            ...prevState,
                            value: prevState.onSelected && event.target.value.length < prevState.value.length
                                ? ''
                                : event.target.value
                        }));
                    }}
                />
                <div className={ `${inputPegawai.onFocus && inputPegawai.value ? 'z-10 opacity-100' : '-z-30 opacity-0' } absolute shadow bg-white top-full mt-0.5 z-40 w-full lef-0 rounded max-h-60 overflow-y-auto` }>
                    {
                        pegawaiData.map((pegawai) => ((
                            <div key={pegawai.id} className="flex flex-col w-full">
                                <div onClick={() => {
                                    setFormState((prevState) => ({
                                        ...prevState,
                                        pegawai_id: pegawai.id
                                    }));
                                    setInputPegawai((prevState) => ({
                                        ...prevState,
                                        onSelected: true,
                                        value: pegawai.nama,
                                        onError: false
                                    }));
                                }} className="cursor-pointer w-full border-gray-100 rounded-t border-b hover:bg-teal-200/80">
                                    <div className="flex w-full items-center p-2 pl-2 border-transparent border-l-2 relative hover:border-teal-100">
                                        <div className="w-6 flex flex-col items-center">
                                            <div className="flex relative w-5 h-5 bg-orange-500 justify-center items-center m-1 mr-2  mt-1 rounded-full ">
                                                <img className="rounded-full" alt="A" src="https://randomuser.me/api/portraits/men/62.jpg"/></div>
                                        </div>
                                        <div className="w-full items-center flex">
                                            <div className="mx-2 -mt-1  ">
                                                { pegawai.nama }
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        )))
                    }
                </div>
            </div>
            <Select
                label="Periode Rekap"
                color="teal"
                name="periode_rekap_id"
                value={ formState.periode_rekap_id ?? '' }
                onChange={ (value: string | undefined) => handleSelectChange('periode_rekap_id', value ?? '') }
            >
                {
                    periodes.length > 0
                        ? periodes.sort((a, b) => a.nama.localeCompare(b.nama)).map(({ id, nama }) => ((
                            <Option key={ id } value={ id }>{ nama }</Option>
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
            <Input
                type="text" color="teal"
                label="Ketuntasan Kerja"
                name="ketuntasan_kerja"
                value={ formState.ketuntasan_kerja }
                onChange={ handleInputChange }
                required
            />
            <Input
                type="text"
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
