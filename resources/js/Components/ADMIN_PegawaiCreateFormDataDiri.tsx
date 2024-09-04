import { ChangeEvent, FormEvent, memo } from "react";
import { Option, Popover, PopoverContent, PopoverHandler, Select, Typography } from "@material-tailwind/react";
import { Input } from "@/Components/Input";
import { format } from "date-fns";
import { id } from "date-fns/locale";
import { DayPicker } from "react-day-picker";
import { ADMIN_FormDataDiriPegawai } from "@/Pages/Admin/ADMIN_PegawaiDetailsPage";
import { FormPegawaiDataDiri, IDNamaColumn } from "@/types";

const ADMIN_PegawaiCreateFormDataDiri = ({ formState, changeInput, changeDate, changeSelect, pegawai }: {
    formState: ADMIN_FormDataDiriPegawai;
    changeInput: (event: ChangeEvent<HTMLInputElement>) => void;
    changeDate: (date: Date | undefined, key: keyof FormPegawaiDataDiri) => void;
    changeSelect: (key: keyof FormPegawaiDataDiri, value: string) => void;
    handleSubmit: (event: FormEvent<HTMLFormElement>) => void;
    pegawai: {
        unit: IDNamaColumn;
        status_pegawai: IDNamaColumn;
        marhalah: IDNamaColumn;
        golongan: IDNamaColumn;
    };
}) => {
    return (
        <>
            <Input
                type="text"
                color="teal"
                label="Nomor Induk Kewarganegaraan ( NIK )"
                name="nik"
                value={ formState.nik }
                onChange={ changeInput }
                required
            />
            <Input
                type="text"
                color="teal"
                label="Nomor Induk Pegawai ( NIP )"
                name="nip"
                value={ formState.nip }
                onChange={ changeInput }
                required
            />
            <Input
                type="text"
                color="teal"
                label="Nama lengkap"
                name="namaLengkap"
                value={ formState.namaLengkap }
                onChange={ changeInput }
                required
            />
            <Input
                type="text" color="teal"
                label="Suku bangsa"
                name="sukuBangsa"
                value={ formState.sukuBangsa }
                onChange={ changeInput }
                required
            />
            <Input
                type="text"
                color="teal"
                label="Tempat Lahir"
                name="tempatLahir"
                value={ formState.tempatLahir }
                onChange={ changeInput }
                required
            />
            <Popover placement="bottom">
                <PopoverHandler>
                    <Input
                        color="teal"
                        label="Tanggal Lahir"
                        value={ formState.tanggalLahir ? format(formState.tanggalLahir, "PPP", { locale: id }) : "" }
                        readOnly
                        required
                    />
                </PopoverHandler>
                <PopoverContent className="z-30">
                    <DayPicker
                        mode="single"
                        selected={ formState.tanggalLahir }
                        onSelect={ (value: Date | undefined) => changeDate(value, 'tanggalLahir') }
                        showOutsideDays
                        className="border-0"
                        captionLayout="dropdown-buttons"
                        fromYear={ 1950 }
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
                aria-required={ true }
                onChange={ (value: string | undefined) => changeSelect('jenisKelamin', value ?? '') }
            >
                <Option value="Laki-Laki">Laki-Laki</Option>
                <Option value="Perempuan">Perempuan</Option>
            </Select>
            <Input
                type="text" color="teal"
                label="Alamat"
                name="alamat"
                value={ formState.alamat }
                onChange={ changeInput }
                required
            />
            <Input
                type="text"
                color="teal"
                label="Agama"
                name="agama"
                value={ formState.agama }
                onChange={ changeInput }
                required
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
            <Popover placement="bottom">
                <PopoverHandler>
                    <Input
                        color="teal"
                        label="Tahun Masuk"
                        value={ formState.tahunMasuk ? format(formState.tahunMasuk, "y", { locale: id }) : "" }
                        readOnly
                        required
                    />
                </PopoverHandler>
                <PopoverContent>
                    <DayPicker
                        mode="single"
                        selected={ formState.tahunMasuk }
                        onSelect={ (value: Date | undefined) => changeDate(value, 'tahunMasuk') }
                        showOutsideDays
                        className="border-0"
                        captionLayout="dropdown-buttons"
                        fromYear={ 1950 }
                        toYear={ new Date().getFullYear() }
                        disabled={ { after: new Date() } }
                    />
                </PopoverContent>
            </Popover>
            <div className="-mt-3.5">
                <Typography
                    variant="small"
                    color="gray"
                    className="mt-2 flex items-center gap-1 font-normal"
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
                    Golongan
                </Typography>
                <Input
                    type="text"
                    label="Golongan"
                    disabled
                    value={ pegawai.golongan.nama }
                />
            </div>
            <div className="-mt-3.5">
                <Typography
                    variant="small"
                    color="gray"
                    className="mt-2 flex items-center gap-1 font-normal"
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
                    Marhalah
                </Typography>
                <Input
                    type="text"
                    label="Marhalah"
                    disabled
                    value={ pegawai.marhalah.nama }
                />
            </div>
            <div className="-mt-3.5">
                <Typography
                    variant="small"
                    color="gray"
                    className="mt-2 flex items-center gap-1 font-normal"
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
                    Status Pegawai
                </Typography>
                <Input
                    type="text"
                    label="Status Pegawai"
                    disabled
                    value={ pegawai.status_pegawai.nama }
                />
            </div>
            <div className="-mt-3.5">
                <Typography
                    variant="small"
                    color="gray"
                    className="mt-2 flex items-center gap-1 font-normal"
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
                    Unit
                </Typography>
                <Input
                    type="text"
                    label="ID Unit"
                    disabled
                    value={ pegawai.unit.nama }
                />
            </div>
            <Input
                type="text" color="teal" label="Amanah"
                name="amanah"
                value={ formState.amanah }
                onChange={ changeInput }
                required
            />
            <Input
                type="text" color="teal" label="Amanah atasan langsung"
                name="amanahAtasanLangsung"
                value={ formState.amanahAtasanLangsung }
                onChange={ changeInput }
                required
            />
            <Input
                type="text" color="teal"
                label="Nomor HP/WA" name="nomorHpWa"
                value={ formState.nomorHpWa }
                onChange={ changeInput }
                required
            />
            <Input
                type="text" color="teal" label="BPJS Kesehatan ( jika ada )"
                name="bpjskesehatan"
                value={ formState.bpjskesehatan ?? undefined }
                onChange={ changeInput }
            />
            <Input
                type="text" color="teal" label="BPJS Ketenagakerjaan ( jika ada )"
                name="bpjsketenagakerjaan"
                value={ formState.bpjsketenagakerjaan ?? undefined }
                onChange={ changeInput }
            />
        </>
    )
};

export default memo(ADMIN_PegawaiCreateFormDataDiri);
