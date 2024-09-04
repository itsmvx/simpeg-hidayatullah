import { ChangeEvent, FormEvent, memo } from "react";
import { Popover, PopoverContent, PopoverHandler } from "@material-tailwind/react";
import { format } from "date-fns";
import { id } from "date-fns/locale";
import { DayPicker } from "react-day-picker";
import type { FormDataDiri } from "@/types";
import { TriangleAlert } from "lucide-react";

const PegawaiCreateFormDataDiri = ({ formState, changeInput, changeDate, changeSelect, golongans, marhalahs, statusPegawais, units }: {
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
            <div className="relative w-full mb-4">
                <label
                    htmlFor="nik"
                    className="absolute -top-2 left-2.5 bg-white px-1 text-xs text-gray-500"
                >
                    NIK
                </label>
                <input
                    type="text"
                    id="nik"
                    value={formState.nik}
                    disabled
                    className="border border-gray-300 rounded-md w-full py-2 px-3 mt-3 bg-gray-100 text-gray-700"
                />
            </div>

            <div className="relative w-full mb-4">
                <label
                    htmlFor="nip"
                    className="absolute -top-2 left-2.5 bg-white px-1 text-xs text-gray-500"
                >
                    NIP
                </label>
                <input
                    type="text"
                    id="nip"
                    value={formState.nip}
                    disabled
                    className="border border-gray-300 rounded-md w-full py-2 px-3 mt-3 bg-gray-100 text-gray-700"
                />
            </div>

            <div className="relative w-full mb-4">
                <label
                    htmlFor="namaLengkap"
                    className="absolute -top-2 left-2.5 bg-white px-1 text-xs text-gray-500"
                >
                    Nama Lengkap
                </label>
                <input
                    type="text"
                    id="namaLengkap"
                    value={formState.namaLengkap}
                    disabled
                    className="border border-gray-300 rounded-md w-full py-2 px-3 mt-3 bg-gray-100 text-gray-700"
                />
            </div>

            <div className="relative w-full mb-4">
                <label
                    htmlFor="sukuBangsa"
                    className="absolute -top-2 left-2.5 bg-white px-1 text-xs text-gray-500"
                >
                    Suku Bangsa
                </label>
                <input
                    type="text"
                    id="sukuBangsa"
                    value={formState.sukuBangsa}
                    disabled
                    className="border border-gray-300 rounded-md w-full py-2 px-3 mt-3 bg-gray-100 text-gray-700"
                />
            </div>

            <div className="relative w-full mb-4">
                <label
                    htmlFor="tempatLahir"
                    className="absolute -top-2 left-2.5 bg-white px-1 text-xs text-gray-500"
                >
                    Tempat Lahir
                </label>
                <input
                    type="text"
                    id="tempatLahir"
                    value={formState.tempatLahir}
                    disabled
                    className="border border-gray-300 rounded-md w-full py-2 px-3 mt-3 bg-gray-100 text-gray-700"
                />
            </div>

            <Popover placement="bottom">
                <PopoverHandler>
                    <div className="relative w-full mb-4">
                        <label
                            htmlFor="tanggalLahir"
                            className="absolute -top-2 left-2.5 bg-white px-1 text-xs text-gray-500"
                        >
                            Tanggal Lahir
                        </label>
                        <input
                            type="text"
                            id="tanggalLahir"
                            value={formState.tanggalLahir ? format(formState.tanggalLahir, "PPP", { locale: id }) : ""}
                            readOnly
                            disabled
                            className="border border-gray-300 rounded-md w-full py-2 px-3 mt-3 bg-gray-100 text-gray-700"
                        />
                    </div>
                </PopoverHandler>
                <PopoverContent className="z-30">
                    <DayPicker
                        mode="single"
                        selected={formState.tanggalLahir}
                        onSelect={(value: Date | undefined) => changeDate(value, 'tanggalLahir')}
                        showOutsideDays
                        className="border-0"
                        captionLayout="dropdown-buttons"
                        fromYear={1950}
                        toYear={new Date().getFullYear()}
                        disabled={{ after: new Date() }}
                    />
                </PopoverContent>
            </Popover>

            <div className="flex flex-col lg:flex-row gap-4">
                <div className="relative w-full mb-4">
                    <label
                        htmlFor="usiaTahun"
                        className="absolute -top-2 left-2.5 bg-white px-1 text-xs text-gray-500"
                    >
                        Usia (Tahun)
                    </label>
                    <input
                        type="text"
                        id="usiaTahun"
                        value={formState.usiaTahun}
                        disabled
                        className="border border-gray-300 rounded-md w-full py-2 px-3 mt-3 bg-gray-100 text-gray-700"
                    />
                </div>

                <div className="relative w-full mb-4">
                    <label
                        htmlFor="usiaBulan"
                        className="absolute -top-2 left-2.5 bg-white px-1 text-xs text-gray-500"
                    >
                        Usia (Bulan)
                    </label>
                    <input
                        type="text"
                        id="usiaBulan"
                        value={formState.usiaBulan}
                        disabled
                        className="border border-gray-300 rounded-md w-full py-2 px-3 mt-3 bg-gray-100 text-gray-700"
                    />
                </div>
            </div>

            <div className="relative w-full mb-4">
                <label
                    htmlFor="golongan"
                    className="absolute -top-2 left-2.5 bg-white px-1 text-xs text-gray-500"
                >
                    Golongan
                </label>
                <input
                    type="text"
                    id="golongan"
                    value={formState.golonganId ? golongans.find(g => g.id === formState.golonganId)?.nama : "IIIA"}
                    disabled
                    className="border border-gray-300 rounded-md w-full py-2 px-3 mt-3 bg-gray-100 text-gray-700"
                />
            </div>

            <div className="relative w-full mb-4">
                <label
                    htmlFor="jenisKelamin"
                    className="absolute -top-2 left-2.5 bg-white px-1 text-xs text-gray-500"
                >
                    Jenis Kelamin
                </label>
                <input
                    type="text"
                    id="jenisKelamin"
                    value={formState.jenisKelamin}
                    disabled
                    className="border border-gray-300 rounded-md w-full py-2 px-3 mt-3 bg-gray-100 text-gray-700"
                />
            </div>

            <div className="relative w-full mb-4">
                <label
                    htmlFor="alamat"
                    className="absolute -top-2 left-2.5 bg-white px-1 text-xs text-gray-500"
                >
                    Alamat
                </label>
                <input
                    type="text"
                    id="alamat"
                    value={formState.alamat}
                    disabled
                    className="border border-gray-300 rounded-md w-full py-2 px-3 mt-3 bg-gray-100 text-gray-700"
                />
            </div>

            <div className="relative w-full mb-4">
                <label
                    htmlFor="agama"
                    className="absolute -top-2 left-2.5 bg-white px-1 text-xs text-gray-500"
                >
                    Agama
                </label>
                <input
                    type="text"
                    id="agama"
                    value={formState.agama}
                    disabled
                    className="border border-gray-300 rounded-md w-full py-2 px-3 mt-3 bg-gray-100 text-gray-700"
                />
            </div>

            <div className="relative w-full mb-4">
                <label
                    htmlFor="statusPernikahan"
                    className="absolute -top-2 left-2.5 bg-white px-1 text-xs text-gray-500"
                >
                    Status Pernikahan
                </label>
                <input
                    type="text"
                    id="statusPernikahan"
                    value={formState.statusPernikahan}
                    disabled
                    className="border border-gray-300 rounded-md w-full py-2 px-3 mt-3 bg-gray-100 text-gray-700"
                />
            </div>

            <Popover placement="bottom">
                <PopoverHandler>
                    <div className="relative w-full mb-4">
                        <label
                            htmlFor="tahunMasuk"
                            className="absolute -top-2 left-2.5 bg-white px-1 text-xs text-gray-500"
                        >
                            Tahun Masuk
                        </label>
                        <input
                            type="text"
                            id="tahunMasuk"
                            value={formState.tahunMasuk ? format(formState.tahunMasuk, "y", { locale: id }) : ""}
                            readOnly
                            disabled
                            className="border border-gray-300 rounded-md w-full py-2 px-3 mt-3 bg-gray-100 text-gray-700"
                        />
                    </div>
                </PopoverHandler>
                <PopoverContent>
                    <DayPicker
                        mode="single"
                        selected={formState.tahunMasuk}
                        onSelect={(value: Date | undefined) => changeDate(value, 'tahunMasuk')}
                        showOutsideDays
                        className="border-0"
                        captionLayout="dropdown-buttons"
                        fromYear={1950}
                        toYear={new Date().getFullYear()}
                        disabled={{ after: new Date() }}
                    />
                </PopoverContent>
            </Popover>

            <div className="relative w-full mb-4">
                <label
                    htmlFor="marhalahId"
                    className="absolute -top-2 left-2.5 bg-white px-1 text-xs text-gray-500"
                >
                    Marhalah
                </label>
                <input
                    type="text"
                    id="marhalahId"
                    value={formState.marhalahId ? marhalahs.find(m => m.id === formState.marhalahId)?.nama : ""}
                    disabled
                    className="border border-gray-300 rounded-md w-full py-2 px-3 mt-3 bg-gray-100 text-gray-700"
                />
            </div>

            <div className="relative w-full mb-4">
                <label
                    htmlFor="statusPegawaiId"
                    className="absolute -top-2 left-2.5 bg-white px-1 text-xs text-gray-500"
                >
                    Status Pegawai
                </label>
                <input
                    type="text"
                    id="statusPegawaiId"
                    value={formState.statusPegawaiId ? statusPegawais.find(s => s.id === formState.statusPegawaiId)?.nama : ""}
                    disabled
                    className="border border-gray-300 rounded-md w-full py-2 px-3 mt-3 bg-gray-100 text-gray-700"
                />
            </div>

            <div className="relative w-full mb-4">
                <label
                    htmlFor="unitId"
                    className="absolute -top-2 left-2.5 bg-white px-1 text-xs text-gray-500"
                >
                    Unit
                </label>
                <input
                    type="text"
                    id="unitId"
                    value={formState.unitId ? units.find(u => u.id === formState.unitId)?.nama : ""}
                    disabled
                    className="border border-gray-300 rounded-md w-full py-2 px-3 mt-3 bg-gray-100 text-gray-700"
                />
            </div>

            <div className="relative w-full mb-4">
                <label
                    htmlFor="amanah"
                    className="absolute -top-2 left-2.5 bg-white px-1 text-xs text-gray-500"
                >
                    Amanah
                </label>
                <input
                    type="text"
                    id="amanah"
                    value={formState.amanah}
                    disabled
                    className="border border-gray-300 rounded-md w-full py-2 px-3 mt-3 bg-gray-100 text-gray-700"
                />
            </div>

            <div className="relative w-full mb-4">
                <label
                    htmlFor="amanahAtasanLangsung"
                    className="absolute -top-2 left-2.5 bg-white px-1 text-xs text-gray-500"
                >
                    Amanah Atasan Langsung
                </label>
                <input
                    type="text"
                    id="amanahAtasanLangsung"
                    value={formState.amanahAtasanLangsung}
                    disabled
                    className="border border-gray-300 rounded-md w-full py-2 px-3 mt-3 bg-gray-100 text-gray-700"
                />
            </div>

            <div className="relative w-full mb-4">
                <label
                    htmlFor="nomorHpWa"
                    className="absolute -top-2 left-2.5 bg-white px-1 text-xs text-gray-500"
                >
                    Nomor HP/WA
                </label>
                <input
                    type="text"
                    id="nomorHpWa"
                    value={formState.nomorHpWa}
                    disabled
                    className="border border-gray-300 rounded-md w-full py-2 px-3 mt-3 bg-gray-100 text-gray-700"
                />
            </div>

            <div className="relative w-full mb-4">
                <label
                    htmlFor="bpjskesehatan"
                    className="absolute -top-2 left-2.5 bg-white px-1 text-xs text-gray-500"
                >
                    BPJS Kesehatan ( jika ada )
                </label>
                <input
                    type="text"
                    id="bpjskesehatan"
                    value={formState.bpjskesehatan ?? ''}
                    disabled
                    className="border border-gray-300 rounded-md w-full py-2 px-3 mt-3 bg-gray-100 text-gray-700"
                />
            </div>

            <div className="relative w-full mb-4">
                <label
                    htmlFor="bpjsketenagakerjaan"
                    className="absolute -top-2 left-2.5 bg-white px-1 text-xs text-gray-500"
                >
                    BPJS Ketenagakerjaan ( jika ada )
                </label>
                <input
                    type="text"
                    id="bpjsketenagakerjaan"
                    value={formState.bpjsketenagakerjaan ?? ''}
                    disabled
                    className="border border-gray-300 rounded-md w-full py-2 px-3 mt-3 bg-gray-100 text-gray-700"
                />
            </div>
        </>
    )
};

export default memo(PegawaiCreateFormDataDiri);
