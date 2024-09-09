import { MasterLayout } from "@/Layouts/MasterLayout";
import { Head, router } from "@inertiajs/react";
import { ChangeEvent, FormEvent, useState } from "react";
import { IDNamaColumn, ModelWithoutColumns, PageProps } from "@/types";
import axios, { AxiosError } from "axios";
import { notifyToast } from "@/Lib/Utils";
import { Button, Chip, IconButton, Option, Select, Tooltip, Typography } from "@material-tailwind/react";
import { Input } from "@/Components/Input";
import { MoveLeft, Save } from "lucide-react";
import { Admin } from "@/types/models";

export default function AdminDetailsPage({ auth, admin, units }: PageProps<{
    admin: ModelWithoutColumns<Admin, 'password' | 'updated_at'>
    units: IDNamaColumn[];
}>) {
    const [ adminState, setAdminState] = useState(admin);
    const [ onChangeAdmin, setOnChangeAdmin] = useState(false);
    const [ onSubmit, setOnSubmit ] = useState(false);

    const handleAdminChange = (event: ChangeEvent<HTMLInputElement> | ChangeEvent<HTMLTextAreaElement>) => {
        const payload = {
            [event.target.name as keyof Admin]: event.target.value,
        };

        setAdminState((prevState) => {
            const newState = { ...prevState, ...payload };

            if (JSON.stringify(newState) !== JSON.stringify(admin)) {
                setOnChangeAdmin(true);
            } else {
                setOnChangeAdmin(false);
            }

            return newState;
        });
    };

    const handleFormSubmit = (event: FormEvent<HTMLFormElement>) => {
        event.preventDefault();
        setOnSubmit(true);
        const payload: Record<string, string | null> = {
            id: String(adminState.id),
            nama: adminState.nama,
            username: adminState.username,
            unit_id: adminState.unit_id === 'null' ? null : adminState.unit_id,
        };

        axios.post(route('admin.update'), payload)
            .then(() => {
                notifyToast('success', 'Admin berhasil diperbarui!');
                setOnChangeAdmin(false);
                router.reload({ only: ['admin'] })
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
            <Head title={ `Master - Detail Admin ${admin.nama}` } />
            <MasterLayout auth={auth}>
                <Tooltip content="Kembali">
                    <IconButton variant="text" onClick={() => window.history.back()}>
                        <MoveLeft />
                    </IconButton>
                </Tooltip>

                <div className="space-y-3">
                    <p className="text-3xl text-center text-blue-gray-700 font-semibold line-clamp-4 lg:line-clamp-2 md:px-14 lg:px-20">
                        { admin.nama }
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
                                ID Admin
                            </Typography>
                            <Input
                                type="text"
                                label="ID Admin"
                                disabled
                                value={ adminState.id }
                                onChange={ handleAdminChange }
                            />
                        </div>
                        <Input
                            type="text"
                            value={ adminState.nama }
                            label="Nama Admin"
                            name="nama"
                            onChange={ handleAdminChange }
                        />
                        <Input
                            type="text"
                            value={ adminState.username }
                            label="Username Admin"
                            name="username"
                            onChange={ handleAdminChange }
                        />
                        <Select
                            label="Hak Akses Admin" size="lg"
                            onChange={(value) => {
                                if (value === undefined) {
                                    return;
                                }
                                setAdminState((prevState) => {
                                    const newState = { ...prevState, unit_id: value ?? 'null' };

                                    if (JSON.stringify(newState) !== JSON.stringify(admin)) {
                                        setOnChangeAdmin(true);
                                    } else {
                                        setOnChangeAdmin(false);
                                    }

                                    return newState;
                                })
                            }}
                            value={adminState.unit_id ?? 'null'}
                        >
                            {
                                units.length > 0
                                    ? [
                                        { id: 'null', nama: '| UNIT MASTER |' },
                                        ...units.sort((a, b) => a.nama.localeCompare(b.nama))
                                    ].map((unit, index) => ((
                                        <Option key={unit.id} value={unit.id}>
                                            <div className="flex items-center justify-between ">
                                                { index === 0 ? (
                                                    <>
                                                        <p className="font-bold">
                                                            | UNIT MASTER |
                                                        </p>
                                                        <span>
                                                            <Chip size="sm" variant="ghost" value="Master" color="green" className="ml-3"/>
                                                        </span>
                                                    </>
                                                ) : unit.nama
                                                }
                                            </div>
                                        </Option>
                                    ))) : (
                                        <Option disabled>
                                            <p className="!text-gray-900 !text-sm">
                                                { units.length < 1
                                                    ? 'Belum ada Unit yang didaftarkan'
                                                    : 'Pilih Akses Unit'
                                                }
                                            </p>
                                        </Option>
                                    )
                            }
                        </Select>
                        <Button
                            color="blue"
                            type="submit"
                            loading={ onSubmit }
                            className="group *:group-disabled:text-gray-50 flex items-center justify-center h-10 gap-1 text-base"
                            disabled={ !onChangeAdmin }
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
