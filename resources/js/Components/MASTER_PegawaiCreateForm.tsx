import { ChangeEvent, Dispatch, memo, SetStateAction } from "react";
import { Option, Popover, PopoverContent, PopoverHandler, Select } from "@material-tailwind/react";
import { Input } from "@/Components/Input";
import { format } from "date-fns";
import { id } from "date-fns/locale";
import { DayPicker } from "react-day-picker";
import { TriangleAlert } from "lucide-react";
import { Checkbox } from "@/Components/Checkbox";
import { jenisKelamin, statusAktif, statusPernikahan } from "@/Lib/StaticData";
import { FormPegawai, IDNamaColumn } from "@/types";

const MASTER_PegawaiCreateForm = ({ state, setState, golongans, marhalahs, statusPegawais, units }: {
    state: FormPegawai<{
        onSubmit: boolean;
    }>;
    setState: Dispatch<SetStateAction<FormPegawai<{ onSubmit: boolean }>>>;
    golongans: IDNamaColumn[];
    marhalahs: IDNamaColumn[];
    statusPegawais: IDNamaColumn[];
    units: IDNamaColumn[];
}) => {
    const handleInputChange = (event: ChangeEvent<HTMLInputElement>) => {
        const { name, value } = event.target;
        setState((prevState) => ({
            ...prevState,
            [name]: value,
        }));
    };
    const handleCheckboxChange = (event: ChangeEvent<HTMLInputElement>) => {
        const { name, checked } = event.target;
        setState((prevState) => ({
            ...prevState,
            [name]: checked,
        }));
    }
    const handleSelectChange = (key: keyof FormPegawai, value: string) => {
        setState((prevState) => ({
            ...prevState,
            [key]: value,
        }));
    };
    const handleDateChange = (date: Date | undefined, key: keyof FormPegawai) => {
        setState((prevState) => ({
            ...prevState,
            [key]: date,
        }));
    };

    return (
        <>
            <Input
                type="text"
                color="teal"
                label="Nomor Induk Kewarganegaraan ( NIK )"
                name="nik"
                value={ state.nik }
                onChange={ handleInputChange }
                required
            />
            <Input
                type="text"
                color="teal"
                label="Nomor Induk Pegawai ( NIP )"
                name="nip"
                value={ state.nip }
                onChange={ handleInputChange }
                required
            />
            <Input
                type="text"
                color="teal"
                label="Nama lengkap"
                name="nama"
                value={ state.nama }
                onChange={ handleInputChange }
                required
            />
            <Input
                type="text" color="teal"
                label="Suku bangsa"
                name="suku"
                value={ state.suku }
                onChange={ handleInputChange }
                required
            />
            <Input
                type="text"
                color="teal"
                label="Tempat Lahir"
                name="tempat_lahir"
                value={ state.tempat_lahir }
                onChange={ handleInputChange }
                required
            />
            <Popover placement="bottom">
                <PopoverHandler>
                    <Input
                        color="teal"
                        label="Tanggal Lahir"
                        value={ state.tanggal_lahir ? format(state.tanggal_lahir, "PPP", { locale: id }) : "" }
                        readOnly
                        required
                    />
                </PopoverHandler>
                <PopoverContent className="z-30">
                    <DayPicker
                        mode="single"
                        selected={ state.tanggal_lahir }
                        onSelect={(value: Date | undefined) => handleDateChange(value, 'tanggal_lahir') }
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
                    name="usia_tahun"
                    disabled
                    value={ state.usia_tahun }
                    icon={ <p className="-ml-4 text-xs font-semibold">Tahun</p> }
                    containerProps={ { className: 'min-w-20 w-[10px]' } }
                />
                <Input
                    type="text"
                    color="teal"
                    label="Usia (Bulan)"
                    name="usia_bulan"
                    disabled
                    value={ state.usia_bulan }
                    icon={ <p className="-ml-4 text-xs font-semibold">Bulan</p> }
                    containerProps={ { className: 'min-w-20 w-[10px]' } }
                />
            </div>
            <Select
                label="Jenis kelamin"
                color="teal"
                name="jenis_kelamin"
                value={ state.jenis_kelamin }
                aria-required={true}
                onChange={ (value: string | undefined) => handleSelectChange('jenis_kelamin', value ?? '') }
            >
                {
                    jenisKelamin.map((jenis, index) => ((
                        <Option key={index} value={jenis}>
                            { jenis }
                        </Option>
                    )))
                }
            </Select>
            <Input
                type="text" color="teal"
                label="Alamat"
                name="alamat"
                value={ state.alamat }
                onChange={ handleInputChange }
                required
            />
            <Input
                type="text"
                color="teal"
                label="Agama"
                name="agama"
                value={ state.agama }
                onChange={ handleInputChange }
                required
            />
            <Select
                label="Status pernikahan"
                color="teal"
                name="status_pernikahan"
                value={ state.status_pernikahan }
                onChange={ (value: string | undefined) => handleSelectChange('status_pernikahan', value ?? '') }
            >
                {
                    statusPernikahan.map((status, index) => ((
                        <Option key={index} value={status}>
                            { status }
                        </Option>
                    )))
                }
            </Select>
            <Select
                label="Golongan"
                color="teal"
                name="golongan_id"
                value={ state.golongan_id ?? undefined }
                onChange={ (value: string | undefined) => handleSelectChange('golongan_id', value ?? '') }
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
                name="marhalah_id"
                value={ state.marhalah_id ?? undefined }
                onChange={ (value: string | undefined) => handleSelectChange('marhalah_id', value ?? '') }
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
                name="status_pegawai_id"
                value={ state.status_pegawai_id ?? undefined }
                onChange={ (value: string | undefined) => handleSelectChange('status_pegawai_id', value ?? '') }
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
                name="unit_id"
                value={ state.unit_id ?? undefined }
                onChange={ (value: string | undefined) => handleSelectChange('unit_id', value ?? '') }
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
            <Popover placement="bottom">
                <PopoverHandler>
                    <Input
                        color="teal"
                        label="Tahun Masuk"
                        value={ state.tanggal_masuk ? format(state.tanggal_masuk, "y", { locale: id }) : "" }
                        readOnly
                        required
                    />
                </PopoverHandler>
                <PopoverContent>
                    <DayPicker
                        mode="single"
                        selected={ state.tanggal_masuk }
                        onSelect={ (value: Date | undefined) => handleDateChange(value, 'tanggal_masuk') }
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
                label="Status Aktif"
                color="teal"
                name="status_aktif"
                value={ state.status_aktif }
                onChange={ (value: string | undefined) => handleSelectChange('status_aktif', value ?? '') }
            >
                {
                    statusAktif.map((status, index) => ((
                        <Option key={index} value={status}>
                            { status }
                        </Option>
                    )))
                }
            </Select>
            <Input
                type="text" color="teal"
                label="Kompetensi Qur'an"
                name="kompetensi_quran"
                value={ state.kompetensi_quran }
                onChange={ handleInputChange }
                required
            />
            <Input
                type="text" color="teal"
                label="Amanah"
                name="amanah"
                value={ state.amanah }
                onChange={ handleInputChange }
                required
            />
            <Input
                type="text" color="teal"
                label="Amanah atasan langsung"
                name="amanah_atasan"
                value={ state.amanah_atasan }
                onChange={ handleInputChange }
                required
            />
            <Input
                type="text" color="teal"
                label="Nomor HP/WA"
                name="no_hp"
                value={ state.no_hp }
                onChange={ handleInputChange }
                required
            />
            <Input
                type="text" color="teal"
                label="Sertifikasi (bila ada)"
                name="sertifikasi"
                value={ state.sertifikasi }
                onChange={ handleInputChange }
            />

            <div className="flex flex-row gap-1">
                <Checkbox
                    name="bpjs_kesehatan"
                    label="BPJS Kesehatan"
                    labelProps={{
                        className: 'font-medium'
                    }}
                    checked={ state.bpjs_kesehatan }
                    onChange={ handleCheckboxChange }
                />
                <Checkbox
                    name="bpjs_ketenagakerjaan"
                    label="BPJS Ketenagakerjaan"
                    labelProps={{
                        className: 'font-medium'
                    }}
                    checked={ state.bpjs_ketenagakerjaan }
                    onChange={ handleCheckboxChange }
                />
            </div>
        </>
    )
};

export default memo(MASTER_PegawaiCreateForm);
