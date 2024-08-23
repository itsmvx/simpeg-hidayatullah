import {
    Card,
    Button,
    Typography, IconButton,
} from "@material-tailwind/react";
import { Input } from "@/Components/Input";
import { SyntheticEvent, useState } from "react";
import { ToastContainer } from "react-toastify";
import { notifyToast } from "@/Lib/Utils";
import 'react-toastify/dist/ReactToastify.css';
import { Head, router } from "@inertiajs/react";
import { z } from "zod";
import { useTheme } from "@/Hooks/useTheme";
import axios, { AxiosError } from "axios";
import { Eye, EyeOff } from "lucide-react";

export default function MASTER_LoginPage() {
    const { theme } = useTheme();
    const formInit = {
        username: '',
        password: '',
        passwordView: false,
        onSubmit: false,
        error: {
            username: false,
            password: false
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
    }>(formInit);

    const handleFormSubmit = (event: SyntheticEvent<HTMLFormElement>) => {
        event.preventDefault();
        setForm((prevState) => ({
            ...prevState,
            onSubmit: true
        }));

        const { username, password } = form;
        const inputSchema = z.object({
            username: z.string().min(1, { message: "Username tidak boleh kosong" }),
            password: z.string().min(1, { message: "Password tidak boleh kosong" }),
        });
        const zodUnitResult = inputSchema.safeParse({
            username: username,
            password: password,
        });
        if (!zodUnitResult.success) {
            const errorMessages = zodUnitResult.error.issues[0].message;
            notifyToast('error', errorMessages, theme as 'light' | 'dark');
            setForm((prevState) => ({
                ...prevState,
                onSubmit: false
            }))
            return;
        }

        axios.post(route('auth.master'), {
            username: username,
            password: password
        })
            .then(() => {
                router.visit(route('master.dashboard'), { replace: true });
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
            <Head title="Master - Login" />
            <main className="relative w-full min-h-screen flex items-center justify-center">
                {/*<div className="absolute inset-0" style={{*/ }
                {/*    backgroundImage: `url(${PPHBackground})`,*/ }
                {/*    backgroundSize: 'cover',*/ }
                {/*    backgroundPosition: 'center',*/ }
                {/*    backgroundRepeat: 'no-repeat',*/ }
                {/*    backgroundAttachment: 'fixed'*/ }
                {/*}} />*/ }
                {/*<div className="absolute inset-0 bg-black/65" />*/ }
                <Card
                    className="w-[25rem] md:w-[28rem] lg:w-[30rem] flex flex-col gap-4 border-2 border-zinc-900/40 p-11 transition-all duration-200 ease-in-out">
                    <div className="text-center -mt-5">
                        <Typography variant="h3" className="font-bold my-3">
                            Master Login
                        </Typography>
                        <Typography variant="h5">
                            Selamat Datang
                        </Typography>
                        {/*<p className="font-medium text-sm">*/}
                        {/*    Ijinkan Sistem mengidentifikasi anda*/}
                        {/*</p>*/}
                    </div>
                    <form className="space-y-10" onSubmit={handleFormSubmit}>
                        <div className="mb-1 flex flex-col gap-4">
                            <Typography variant="small" color="blue-gray" className="-mb-3 font-medium">
                                Username
                            </Typography>
                            <Input
                                size="lg"
                                placeholder="masukkan username"
                                value={form.username}
                                error={form.error.username}
                                onChange={(event) => {
                                    setForm((prevState) => ({
                                        ...prevState,
                                        username: event.target.value,
                                        error: {
                                            ...prevState.error,
                                            username: event.target.value.length < 1
                                        }
                                    }))
                                }}
                                className="!border-t-blue-gray-200 focus:!border-t-gray-900"
                                labelProps={ {
                                    className: "before:content-none after:content-none",
                                } }
                            />
                            <Typography variant="small" color="blue-gray" className="-mb-3 font-medium">
                                Password
                            </Typography>
                            <div className="flex items-center justify-center gap-1">
                                <Input
                                    type={form.passwordView ? 'text' : 'password'}
                                    size="lg"
                                    placeholder="********"
                                    error={form.error.password}
                                    onChange={(event) => {
                                        setForm((prevState) => ({
                                            ...prevState,
                                            password: event.target.value,
                                            error: {
                                                ...prevState.error,
                                                password: event.target.value.length < 1
                                            }
                                        }))
                                    }}
                                    className="!border-t-blue-gray-200 focus:!border-t-gray-900"
                                    labelProps={ {
                                        className: "before:content-none after:content-none",
                                    } }
                                />
                                <IconButton
                                    type="button"
                                    onClick={() => {
                                        setForm((prevState) => ({
                                            ...prevState,
                                            passwordView: !prevState.passwordView
                                        }));
                                    }}
                                    className="w-12 aspect-square flex items-center justify-center"
                                >
                                    { form.passwordView
                                        ? (
                                            <Eye />
                                        ) : (
                                            <EyeOff />
                                        )
                                    }
                                </IconButton>
                            </div>
                        </div>
                        <Button
                            type="submit"
                            className="mt-6 flex items-center justify-center"
                            loading={form.onSubmit}
                            disabled={!form.username || !form.password}
                            fullWidth
                        >
                            Masuk
                        </Button>
                    </form>
                </Card>
            </main>
            <ToastContainer/>
        </>
    );
}
