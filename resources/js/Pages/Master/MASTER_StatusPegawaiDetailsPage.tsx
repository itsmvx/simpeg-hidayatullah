import { Input } from "@/Components/Input";
import { MasterLayout } from "@/Layouts/MasterLayout";
import { Head, router } from "@inertiajs/react";
import { ChangeEvent, FormEvent, useState } from "react";
import { Button, IconButton, Tooltip, Typography } from "@material-tailwind/react";
import { MoveLeft, Save } from "lucide-react";
import { TextArea } from "@/Components/TextArea";
import { ModelWithoutColumns, PageProps } from "@/types";
import axios, { AxiosError } from "axios";
import { notifyToast } from "@/Lib/Utils";
import { StatusPegawai } from "@/types/models";

export default function MASTER_StatusPegawaiDetailsPage({ auth, statusPegawai }: PageProps<{
    statusPegawai: ModelWithoutColumns<StatusPegawai, 'updated_at'>;
}>) {
    const [ statusPegawaiState, setStatusPegawaiState ] = useState(statusPegawai);
    const [ onChangeStatusPegawai, setOnChangeStatusPegawai ] = useState(false);
    const [ onSubmit, setOnSubmit ] = useState(false);

    const handleStatusPegawaiChange = (event: ChangeEvent<HTMLInputElement> | ChangeEvent<HTMLTextAreaElement>) => {
        const payload = {
            [event.target.name as keyof StatusPegawai]: event.target.value,
        };

        setStatusPegawaiState((prevState) => {
            const newState = { ...prevState, ...payload };

            if (JSON.stringify(newState) !== JSON.stringify(statusPegawai)) {
                setOnChangeStatusPegawai(true);
            } else {
                setOnChangeStatusPegawai(false);
            }

            return newState;
        });
    };

    const handleFormSubmit = (event: FormEvent<HTMLFormElement>) => {
        event.preventDefault();
        setOnSubmit(true);
        const payload: Record<string, string> = {
            id: String(statusPegawaiState.id),
            nama: statusPegawaiState.nama,
            keterangan: statusPegawaiState.keterangan || "",
            created_at: String(statusPegawaiState.created_at),
        };

        axios.post(route('status-pegawai.update', {
            id: String(statusPegawaiState.id),
        }), payload)
            .then(() => {
                notifyToast('success', 'Status Pegawai berhasil diperbarui!');
                setOnChangeStatusPegawai(false);
                router.reload({ only: ['statusPegawai'] })
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
            <Head title={ `Master - Details Status Pegawai ${statusPegawai.nama}` } />
            <MasterLayout auth={auth}>
                <Tooltip content="Kembali">
                    <IconButton variant="text" onClick={() => router.visit(route('master.status-pegawai.index'))}>
                        <MoveLeft />
                    </IconButton>
                </Tooltip>

                <div className="space-y-3">
                    <p className="text-3xl text-center text-blue-gray-700 font-semibold line-clamp-4 lg:line-clamp-2 md:px-14 lg:px-20">
                        { statusPegawai.nama }
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
                                ID Status Pegawai
                            </Typography>
                            <Input
                                type="text"
                                label="ID StatusPegawai"
                                disabled
                                value={ statusPegawaiState.id }
                                onChange={ handleStatusPegawaiChange }
                            />
                        </div>
                        <Input
                            type="text"
                            value={ statusPegawaiState.nama }
                            label="Nama Status Pegawai"
                            name="nama"
                            onChange={ handleStatusPegawaiChange }
                        />
                        <TextArea
                            value={ statusPegawaiState.keterangan }
                            label="Keterangan"
                            name="keterangan"
                            onChange={ handleStatusPegawaiChange }
                        />
                        <Button
                            color="blue"
                            type="submit"
                            loading={ onSubmit }
                            className="group *:group-disabled:text-gray-50 flex items-center justify-center h-10 gap-1 text-base"
                            disabled={ !onChangeStatusPegawai }
                        >
                            {
                                onSubmit
                                    ? "Menyimpan.."
                                    : (
                                        <>
                                             <span className="normal-case">
                                                 Simpan
                                             </span>
                                            <Save/>
                                        </>
                                    )
                            }
                        </Button>
                    </form>
                </div>
            </MasterLayout>
        </>
    );
};
