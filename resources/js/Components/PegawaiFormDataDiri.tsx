import { ChangeEvent, memo } from "react";
import { Option, Popover, PopoverContent, PopoverHandler, Select, Typography } from "@material-tailwind/react";
import { CircleUser } from "lucide-react";
import { Input } from "@/Components/Input";
import { format } from "date-fns";
import { id } from "date-fns/locale";
import { DayPicker } from "react-day-picker";
import type { FormDataDiri } from "@/Pages/Admin/Master/PegawaiCreatePage";

const PegawaiFormDataDiri = ({ formState, changeInput, changeDate, changeSelect }: {
    formState: FormDataDiri;
    changeInput: (event: ChangeEvent<HTMLInputElement>) => void;
    changeDate: (date: Date | undefined) => void;
    changeSelect: (key: keyof FormDataDiri, value: string) => void;
}) => {
    return (
        <>
            <Input
                type="text"
                color="teal"
                label="Nama lengkap"
                name="namaLengkap"
                value={ formState.namaLengkap }
                onChange={ changeInput }
            />
            <Input
                type="text" color="teal"
                label="Suku bangsa"
                name="sukuBangsa"
                value={ formState.sukuBangsa }
                onChange={ changeInput }
            />
            <Input
                type="text"
                color="teal"
                label="Tempat Lahir"
                name="tempatLahir"
                value={ formState.tempatLahir }
                onChange={ changeInput }
            />
            <Popover placement="bottom">
                <PopoverHandler>
                    <Input
                        color="teal"
                        label="Tanggal Lahir"
                        value={ formState.tanggalLahir ? format(formState.tanggalLahir, "PPP", { locale: id }) : "" }
                        readOnly
                    />
                </PopoverHandler>
                <PopoverContent>
                    <DayPicker
                        mode="single"
                        selected={ formState.tanggalLahir }
                        onSelect={ changeDate }
                        showOutsideDays
                        className="border-0"
                        captionLayout="dropdown-buttons"
                        fromYear={ 1970 }
                        toYear={ new Date().getFullYear() }
                        disabled={ { after: new Date() } }
                    />
                </PopoverContent>
            </Popover>
            <div className="flex flex-row gap-4">
                <Input
                    type="text"
                    color="teal"
                    label="Usia (Tahun)"
                    name="usiaTahun"
                    disabled
                    value={ formState.usiaTahun }
                    icon={ <p className="-ml-4 text-xs font-semibold">Tahun</p> }
                    containerProps={ { className: 'min-w-24 w-[10px]' } }
                />
                <Input
                    type="text"
                    color="teal"
                    label="Usia (Bulan)"
                    name="usiaBulan"
                    disabled
                    value={ formState.usiaBulan }
                    icon={ <p className="-ml-4 text-xs font-semibold">Bulan</p> }
                    containerProps={ { className: 'min-w-24 w-[10px]' } }
                />
            </div>
            <Select
                label="Jenis kelamin"
                color="teal"
                name="jenisKelamin"
                value={ formState.jenisKelamin }
                onChange={ (value: string | undefined) => changeSelect('jenisKelamin', value ?? '') }
            >
                <Option value="Laki-laki">Laki-laki</Option>
                <Option value="Perempuan">Perempuan</Option>
            </Select>
            <Input
                type="text" color="teal"
                label="Alamat"
                name="alamat"
                value={ formState.alamat }
                onChange={ changeInput }
            />
            <Input
                type="text"
                color="teal"
                label="Agama"
                name="agama"
                value={ formState.agama }
                onChange={ changeInput }
            />
            <Select
                label="Status pernikahan"
                color="teal" name="statusPernikahan"
                value={ formState.statusPernikahan }
                onChange={ (value: string | undefined) => changeSelect('statusPernikahan', value ?? '') }
            >
                <Option value="Belum menikah">Belum menikah</Option>
                <Option value="Menikah">Menikah</Option>
                <Option value="Cerai hidup">Cerai hidup</Option>
                <Option value="Cerai mati">Cerai mati</Option>
            </Select>
            <Input
                type="text" color="teal" label="Jabatan saat ini"
                name="jabatanSaatIni"
                value={ formState.jabatanSaatIni }
                onChange={ changeInput }
            />
            <Input
                type="text" color="teal" label="Pangkat dan golongan"
                name="pangkatGolongan"
                value={ formState.pangkatGolongan }
                onChange={ changeInput }
            />
            <Input
                type="text"
                color="teal"
                label="Instansi"
                name="instansi"
                value={ formState.instansi }
                onChange={ changeInput }
            />
            <Input
                type="text" color="teal" label="Jabatan atasan langsung"
                name="jabatanAtasanLangsung"
                value={ formState.jabatanAtasanLangsung }
                onChange={ changeInput }
            />
            <Input
                type="text" color="teal"
                label="Nomor HP/WA" name="nomorHpWa"
                value={ formState.nomorHpWa }
                onChange={ changeInput }
            />
        </>
    )
};

export default memo(PegawaiFormDataDiri);
