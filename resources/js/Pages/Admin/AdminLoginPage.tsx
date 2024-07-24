import { Card } from "@material-tailwind/react";
import { PageProps } from "@/types";
import { router } from "@inertiajs/react";
import { SyntheticEvent, useState } from "react";
import { useTheme } from "@/Hooks/useTheme";
import { z } from "zod";
import { notifyToast } from "@/Lib/Utils";
import axios, { AxiosError } from "axios";
import AdminLoginForm from "@/Components/Admin/AdminLoginForm";
import AdminSelectionCard from "@/Pages/Admin/AdminSelectionCard";
import { ToastContainer } from "react-toastify";
import 'react-toastify/dist/ReactToastify.css';

export default function AdminLoginPage({ auth, units }: PageProps<{
    units: {
        id: string;
        nama: string;
        keterangan: string;
    }[]
}>) {
    if (units.length < 1) {
        return (
            <>
                <Card className="wfull min-h-screen">
                    MASIH KOSONG EUY
                </Card>
            </>
        );
    }
    console.log(auth);
    const { theme } = useTheme();
    const formInit = {
        username: '',
        password: '',
        passwordView: false,
        onSubmit: false,
        error: {
            username: false,
            password: false
        },
        unit: {
            id: '',
            nama: ''
        }
    }
    const [ form, setForm ] = useState<{
        username: string;
        password: string;
        passwordView: boolean;
        onSubmit: boolean;
        error: {
            username: boolean;
            password: boolean;
        };
        unit: {
            id: string;
            nama: string;
        };
    }>(formInit);

    const handleFormSubmit = (event: SyntheticEvent<HTMLFormElement>) => {
        event.preventDefault();
        setForm((prevState) => ({
            ...prevState,
            onSubmit: true
        }));

        const { username, password, unit } = form;
        const inputSchema = z.object({
            username: z.string().min(1, { message: "Username tidak boleh kosong" }),
            password: z.string().min(1, { message: "Password tidak boleh kosong" }),
            unit: z.string().min(1, { message: "Unit belum dipilih!" }),
        });
        const zodUnitResult = inputSchema.safeParse({
            username: username,
            password: password,
            unit: unit.id
        });
        if (!zodUnitResult.success) {
            const errorMessages = zodUnitResult.error.issues[0].message;
            notifyToast('error', errorMessages, theme as 'light' | 'dark');
            return;
        }

        axios.post(route('auth.admin'), {
            username: username,
            password: password,
            unit: unit.id
        })
            .then(() => {
                router.visit(route('admin.dashboard', { unitId: unit.id }), { replace: true });
            })
            .catch((err: unknown) => {
                const errMsg: string = err instanceof AxiosError
                    ? err.response?.data.message ?? 'Error tidak diketahui terjadi!'
                    : 'Error tidak diketahui terjadi!'
                notifyToast('error', errMsg, theme as 'light' | 'dark');
            })
            .finally(() => {
                setForm((prevState) => ({
                    ...prevState,
                    onSubmit: false
                }));
            });
    }

    return (
        <>
            <main className="relative w-full min-h-screen flex items-center justify-center">
                {
                    !form.unit.id && !form.unit.nama
                        ? (
                            <AdminSelectionCard units={units} setForm={setForm} />
                        ) : (
                            <AdminLoginForm form={ form } setForm={ setForm } handleSubmit={ handleFormSubmit }/>
                        )
                }
            </main>
            <ToastContainer />
        </>
    );
}
