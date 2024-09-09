import { Input } from "@/Components/Input";
import { MasterLayout } from "@/Layouts/MasterLayout";
import { Head, router } from "@inertiajs/react";
import { ChangeEvent, FormEvent, useState } from "react";
import { Button, IconButton, Option, Select, Tooltip, Typography } from "@material-tailwind/react";
import { MoveLeft, Save } from "lucide-react";
import { TextArea } from "@/Components/TextArea";
import axios, { AxiosError } from "axios";
import { notifyToast } from "@/Lib/Utils";
import { JenisPeriodeRekap, ModelWithoutColumns, PageProps } from "@/types";
import { jenisPeriodeRekap } from "@/Lib/StaticData";
import { PeriodeRekap } from "@/types/models";

export default function MASTER_PeriodeRekapDetailsPage({ auth, periode }: PageProps<{
    periode: ModelWithoutColumns<PeriodeRekap, 'updated_at'>
}>) {

    const [ periodeState, setPeriodeState ] = useState(periode);
    const [ onChangePeriode, setOnChangePeriode ] = useState(false);
    const [ onSubmit, setOnSubmit ] = useState(false);

    const handlePeriodeChange = (event: ChangeEvent<HTMLInputElement> | ChangeEvent<HTMLTextAreaElement>) => {
        const payload = {
            [event.target.name as keyof PeriodeRekap]: event.target.value,
        };

        setPeriodeState((prevState) => {
            const newState = { ...prevState, ...payload };

            if (JSON.stringify(newState) !== JSON.stringify(periode)) {
                setOnChangePeriode(true);
            } else {
                setOnChangePeriode(false);
            }

            return newState;
        });
    };

    const handleFormSubmit = (event: FormEvent<HTMLFormElement>) => {
        event.preventDefault();
        setOnSubmit(true);
        const payload: Record<string, string | boolean> = {
            id: String(periodeState.id),
            nama: periodeState.nama,
            keterangan: periodeState.keterangan || "",
            awal: periodeState.awal,
            akhir: periodeState.akhir,
            jenis: periodeState.jenis,
            status: periodeState.status,
        };

        axios.post(route('periode-rekap.update'), payload)
            .then(() => {
                notifyToast('success', 'Periode Rekap berhasil diperbarui!');
                setOnChangePeriode(false);
                router.reload({ only: ['periode'] })
            })
            .catch((err: unknown) => {
                const errMsg = err instanceof AxiosError
                    ? err?.response?.data.message ?? 'Error tidak diketahui terjadi!'
                    : 'Error tidak diketahui terjadi';

                notifyToast('error', errMsg);
            })
            .finally(() => setOnSubmit(false));
    };

    return (
        <>
            <Head title={ `Master - Details Periode Rekap ${periode.nama}` } />
            <MasterLayout auth={auth}>
                <Tooltip content="Kembali">
                    <IconButton variant="text" onClick={() => window.history.back()}>
                        <MoveLeft />
                    </IconButton>
                </Tooltip>

                <div className="space-y-3">
                    <p className="text-3xl text-center text-blue-gray-700 font-semibold line-clamp-4 lg:line-clamp-2 md:px-14 lg:px-20">
                        { periode.nama }
                    </p>

                    <form className="flex flex-col gap-4" onSubmit={ handleFormSubmit }>
                        <div>
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
                                ID Periode
                            </Typography>
                            <Input
                                type="text"
                                label="ID Periode"
                                disabled
                                value={ periodeState.id }
                                onChange={ handlePeriodeChange }
                            />
                        </div>
                        <Input
                            type="text"
                            value={ periodeState.nama }
                            label="Nama Periode"
                            name="nama"
                            onChange={ handlePeriodeChange }
                        />
                        <Select
                            label="Jenis Periode Rekap"
                            value={ periodeState.jenis }
                            onChange={ (val: string | undefined) => {
                                if (jenisPeriodeRekap.includes(val as JenisPeriodeRekap)) {
                                    setPeriodeState((prevState) => ({
                                        ...prevState,
                                        jenis: val as JenisPeriodeRekap
                                    }));
                                }
                            } }
                            className="capitalize"
                        >
                            {
                                jenisPeriodeRekap.map((jenis, index) => ((
                                    <Option key={ index } value={ jenis } className="capitalize">
                                        { jenis }
                                    </Option>
                                )))
                            }
                        </Select>
                        <Input
                            type="date"
                            value={ periodeState.awal }
                            label="Awal Periode Rekap"
                            name="awal"
                            onChange={ handlePeriodeChange }
                        />
                        <Input
                            type="date"
                            value={ periodeState.akhir }
                            label="Akhir Periode Rekap"
                            name="akhir"
                            onChange={ handlePeriodeChange }
                        />
                        <TextArea
                            value={ periodeState.keterangan }
                            label="Keterangan"
                            name="keterangan"
                            onChange={ handlePeriodeChange }
                        />
                        <Button
                            color="blue"
                            type="submit"
                            loading={ onSubmit }
                            className="group *:group-disabled:text-gray-50 flex items-center justify-center h-10 gap-1 text-base"
                            disabled={ !onChangePeriode }
                        >
                            <span className="normal-case">
                                Simpan
                            </span>
                            <Save/>
                        </Button>
                    </form>
                </div>
            </MasterLayout>
        </>
    );
};
