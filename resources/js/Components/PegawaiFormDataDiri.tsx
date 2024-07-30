import { ChangeEvent, FormEvent, memo } from "react";
import { Option, Popover, PopoverContent, PopoverHandler, Select, Typography } from "@material-tailwind/react";
import { Input } from "@/Components/Input";
import { format } from "date-fns";
import { id } from "date-fns/locale";
import { DayPicker } from "react-day-picker";
import type { FormDataDiri } from "@/Pages/Admin/ADMIN_PegawaiCreatePage";
import { TriangleAlert } from "lucide-react";

const PegawaiFormDataDiri = ({ formState, changeInput, changeDate, changeSelect, golongans, marhalahs, statusPegawais, units }: {
    formState: FormDataDiri;
    changeInput: (event: ChangeEvent<HTMLInputElement>) => void;
    changeDate: (date: Date | undefined, key: keyof FormDataDiri) => void;
    changeSelect: (key: keyof FormDataDiri, value: string) => void;
    golongans: {
        id: string;
        nama: string;
    }[];
    marhalahs: {
        id: string;
        nama: string;
    }[];
    statusPegawais: {
        id: string;
        nama: string;
    }[];
    units: {
        id: string;
        nama: string;
    }[];
    handleSubmit: (event: FormEvent<HTMLFormElement>) => void;
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
                <PopoverContent>
                    <DayPicker
                        mode="single"
                        selected={ formState.tanggalLahir }
                        onSelect={(value: Date | undefined) => changeDate(value, 'tanggalLahir') }
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
                aria-required={true}
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
            <Select
                label="Golongan"
                color="teal"
                name="golonganId"
                value={ formState.golonganId }
                onChange={ (value: string | undefined) => changeSelect('golonganId', value ?? '') }
            >
                {
                    golongans.length > 0
                        ? golongans.sort((a, b) => a.nama.localeCompare(b.nama)).map(({ id, nama }) => ((
                            <Option key={id} value={id}>{nama}</Option>
                        )))
                        : (
                            <Option disabled value="null">
                                <p className="flex items-center gap-2">
                                    <TriangleAlert className="text-red-600" />
                                    <span className="text-gray-900 font-semibold">
                                        Belum ada Golongan terdaftar
                                    </span>
                                </p>

                            </Option>
                        )
                }
            </Select>
            <Select
                label="Marhalah"
                color="teal"
                name="marhalahId"
                value={ formState.marhalahId }
                onChange={ (value: string | undefined) => changeSelect('marhalahId', value ?? '') }
            >
                {
                    marhalahs.length > 0
                        ? marhalahs.sort((a, b) => a.nama.localeCompare(b.nama)).map(({ id, nama }) => ((
                            <Option key={id} value={id}>{nama}</Option>
                        )))
                        : (
                            <Option disabled value="null">
                                <p className="flex items-center gap-2">
                                    <TriangleAlert className="text-red-600" />
                                    <span className="text-gray-900 font-semibold">
                                        Belum ada Marhalah terdaftar
                                    </span>
                                </p>

                            </Option>
                        )
                }
            </Select>
            <Select
                label="Status Pegawai"
                color="teal"
                name="statusPegawaiId"
                value={ formState.statusPegawaiId }
                onChange={ (value: string | undefined) => changeSelect('statusPegawaiId', value ?? '') }
            >
                {
                    statusPegawais.length > 0
                        ? statusPegawais.sort((a, b) => a.nama.localeCompare(b.nama)).map(({ id, nama }) => ((
                            <Option key={id} value={id}>{nama}</Option>
                        )))
                        : (
                            <Option disabled value="null">
                                <p className="flex items-center gap-2">
                                    <TriangleAlert className="text-red-600" />
                                    <span className="text-gray-900 font-semibold">
                                        Belum ada Status Pegawai terdaftar
                                    </span>
                                </p>

                            </Option>
                        )
                }
            </Select>
            <Select
                label="Unit"
                color="teal"
                name="unitId"
                value={ formState.unitId }
                onChange={ (value: string | undefined) => changeSelect('unitId', value ?? '') }
            >
                {
                    units.length > 0
                        ? units.sort((a, b) => a.nama.localeCompare(b.nama)).map(({ id, nama }) => ((
                            <Option key={id} value={id}>{nama}</Option>
                        )))
                        : (
                            <Option disabled value="null">
                                <p className="flex items-center gap-2">
                                    <TriangleAlert className="text-red-600" />
                                    <span className="text-gray-900 font-semibold">
                                        Belum ada Unit terdaftar
                                    </span>
                                </p>

                            </Option>
                        )
                }
            </Select>
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
                value={ formState.bpjskesehatan }
                onChange={ changeInput }
            />
            <Input
                type="text" color="teal" label="BPJS Ketenagakerjaan ( jika ada )"
                name="bpjsketenagakerjaan"
                value={ formState.bpjsketenagakerjaan }
                onChange={ changeInput }
            />
        </>
    )
};

export default memo(PegawaiFormDataDiri);
