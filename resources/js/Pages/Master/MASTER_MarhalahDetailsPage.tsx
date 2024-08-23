import { Input } from "@/Components/Input";
import { MasterLayout } from "@/Layouts/MasterLayout";
import { Head, router } from "@inertiajs/react";
import { ChangeEvent, FormEvent, useState } from "react";
import { Button, IconButton, Tooltip, Typography } from "@material-tailwind/react";
import { MoveLeft, Save } from "lucide-react";
import { TextArea } from "@/Components/TextArea";
import { Marhalah, PageProps } from "@/types";
import axios, { AxiosError } from "axios";
import { notifyToast } from "@/Lib/Utils";

export default function MarhalahDetailsPage({ auth, marhalah }: PageProps<{
    marhalah: Marhalah;
}>) {
    const [marhalahState, setMarhalahState] = useState(marhalah);
    const [onChangeMarhalah, setOnChangeMarhalah] = useState(false);
    const [ onSubmit, setOnSubmit ] = useState(false);

    const handleMarhalahChange = (event: ChangeEvent<HTMLInputElement> | ChangeEvent<HTMLTextAreaElement>) => {
        const payload = {
            [event.target.name as keyof Marhalah]: event.target.value,
        };

        setMarhalahState((prevState) => {
            const newState = { ...prevState, ...payload };

            if (JSON.stringify(newState) !== JSON.stringify(marhalah)) {
                setOnChangeMarhalah(true);
            } else {
                setOnChangeMarhalah(false);
            }

            return newState;
        });
    };

    const handleFormSubmit = (event: FormEvent<HTMLFormElement>) => {
        event.preventDefault();
        setOnSubmit(true);
        const payload: Record<string, string> = {
            id: String(marhalahState.id),
            nama: marhalahState.nama,
            keterangan: marhalahState.keterangan || "",
            created_at: String(marhalahState.created_at),
        };

        axios.post(route('marhalah.update'), payload)
            .then(() => {
                notifyToast('success', 'Marhalah berhasil diperbarui!');
                setOnChangeMarhalah(false);
                router.reload({ only: ['marhalah'] })
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
            <Head title="Master - Marhalah Details" />
            <MasterLayout auth={auth}>
                <Tooltip content="Kembali">
                    <IconButton variant="text" onClick={() => router.visit(route('master.marhalah.index'))}>
                        <MoveLeft />
                    </IconButton>
                </Tooltip>

                <div className="space-y-3">
                    <div className="flex flex-col items-center justify-center">
                        <Typography variant="h2">
                            { marhalah.nama }
                        </Typography>
                    </div>

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
                                ID Marhalah
                            </Typography>
                            <Input
                                type="text"
                                label="ID Marhalah"
                                disabled
                                value={ marhalahState.id }
                                onChange={ handleMarhalahChange }
                            />
                        </div>
                        <Input
                            type="text"
                            value={ marhalahState.nama }
                            label="Nama Marhalah"
                            name="nama"
                            onChange={ handleMarhalahChange }
                        />
                        <TextArea
                            value={ marhalahState.keterangan }
                            label="Keterangan"
                            name="keterangan"
                            onChange={ handleMarhalahChange }
                        />
                        <Button
                            color="blue"
                            type="submit"
                            loading={ onSubmit }
                            className="group *:group-disabled:text-gray-50 flex items-center justify-center h-10 gap-1 text-base"
                            disabled={ !onChangeMarhalah }
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
    )
}
