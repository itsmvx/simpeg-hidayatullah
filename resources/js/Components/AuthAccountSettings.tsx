import { AuthUser } from "@/types";
import { Pencil, TriangleAlert } from "lucide-react";
import { FormEvent, useState } from "react";
import { Button } from "@material-tailwind/react";
import { z } from "zod";
import { isInputPasswordValid, isInputUsernameValid, notifyToast } from "@/Lib/Utils";
import axios, { AxiosError } from "axios";
import { router } from "@inertiajs/react";

export const AuthAccountSettings = ({ authUser }: {
    authUser: AuthUser | null;
}) => {
    const editUsernameInit = {
        onEdit: false,
        onError: false,
        isValid: true,
        errMsg: '',
        value: '',
        onSubmit: false
    };
    const editPasswordInit = {
        currPassword: {
            value: '',
            onError: false,
            isValid: true
        },
        newPassword: {
            value: '',
            onError: false,
            isValid: true
        },
        showPassword: false,
        onSubmit: false
    };

    const [ editUsername, setEditUsername ] = useState<{
        onEdit: boolean;
        onError: boolean;
        isValid: boolean;
        errMsg: string;
        value: string;
        onSubmit: boolean;
    }>(editUsernameInit);
    const [ editPassword, setEditPassword ] = useState<{
        currPassword: {
            value: string;
            onError: boolean;
            isValid: boolean;
        };
        newPassword: {
            value: string;
            onError: boolean;
            isValid: boolean;
        };
        showPassword: boolean;
        onSubmit: boolean;
    }>(editPasswordInit);

    const handleEditPasswordSubmit = (event: FormEvent<HTMLFormElement>) => {
        event.preventDefault();
        if (!authUser?.id) {
            notifyToast('error', 'Belum terautentikasi, Harap login ulang');
            return;
        }
        setEditPassword((prevState) => ({
            ...prevState,
            onSubmit: true
        }));
        const { currPassword, newPassword } = editPassword;

        const editPasswordSchema = z.object({
            currPassword: z.string({ message: 'Password saat ini tidak boleh kosong' }),
            newPassword: z.string({ message: 'Password baru tidak boleh kosong' }).min(7, { message: 'Panjang minimal password baru 7 karakter' }),
        });

        const editPasswordParse = editPasswordSchema.safeParse({
            currPassword: currPassword.value,
            newPassword: newPassword.value,
        });

        if (!editPasswordParse.success) {
            const errorMessages = editPasswordParse.error.errors.map(error => error.message).join(', ');
            notifyToast('error', errorMessages);
            return;
        }

        axios.post(route('pegawai.update-password'), {
            id: authUser.id,
            old_password: currPassword.value,
            new_password: newPassword.value
        })
            .then(() => {
                notifyToast('success', 'Password berhasil diperbarui!');
                setEditPassword(editPasswordInit);
            })
            .catch((err: unknown) => {
                if (err instanceof AxiosError) {
                    const errMsg = err instanceof AxiosError
                        ? err?.response?.data.message ?? 'Error tidak diketahui terjadi'
                        : 'Error tidak diketahui terjadi';
                    setEditPassword((prevState) => ({
                        ...prevState,
                        currPassword: {
                            ...prevState.currPassword,
                            onError: (err?.response?.status === 400)
                        },
                        onSubmit: false
                    }))
                    notifyToast('error', errMsg);
                    return;
                }
                setEditPassword((prevState) => ({ ...prevState, onSubmit: false }));
                notifyToast('error', 'Error tidak diketahui terjadi');
            });
    };

    const handleEditUsernameSubmit = (event: FormEvent<HTMLFormElement>) => {
        event.preventDefault();
        if (!authUser) {
            notifyToast('error', 'Anda belum terautentikasi, coba login kembali');
            return;
        }
        const { value } = editUsername;

        const editUsernameSchema = z.string({ message: 'Format username tidak valid '}).min(5, { message: 'Panjang minimal username adalah 5 karakter '});
        const editUsernameParse = editUsernameSchema.safeParse(value);
        if (!editUsernameParse.success) {
            const errorMessages = editUsernameParse.error.errors.map(error => error.message).join(', ');
            notifyToast('error', errorMessages);
            return;
        }

        axios.post(route('pegawai.update-username'), {
            id: authUser.id,
            new_username: value
        })
            .then(() => {
                notifyToast('success', 'Username berhasil diperbarui');
                setEditUsername(editUsernameInit);
                router.reload({ only: ['auth'] });
                return;
            })
            .catch((err: unknown) => {
                if (err instanceof AxiosError) {
                    const errMsg = err?.response?.data.message ?? 'Error tidak diketahui terjadi';
                    setEditUsername((prevState) => ({
                        ...prevState,
                        onError: (err?.response?.status === 409)
                    }));
                    notifyToast('error', errMsg);
                    return;
                }

                notifyToast('error', 'Error tidak diketahui terjadi');
            });
    };

    return (
        <>
            <div className="pt-4">
                <h1 className="py-2 text-2xl font-semibold">Pengaturan Akun</h1>
            </div>
            <hr className="mt-4 mb-8"/>

            <p className="py-2 text-xl font-semibold">Username</p>
            <div className="flex flex-col items-start justify-start">
                {
                    authUser?.username
                        ? (
                            <p className="text-gray-600">
                                Username anda saat ini: <strong>{ authUser.username }</strong>
                            </p>
                        ) : (
                            <p className="text-gray-600">Anda belum mengatur username</p>
                        )
                }
                <button
                    className={ `${ !authUser?.jenis_kelamin || editUsername.onEdit ? 'hidden' : 'inline-flex' } w-min items-center gap-0.5 text-sm font-semibold text-blue-600 underline decoration-2` }
                    onClick={ () => setEditUsername((prevState) => ({ ...prevState, onEdit: true })) }
                >
                    Ubah<Pencil width={ 13 }/>
                </button>
                <form className={ `mt-5 ${ editUsername.onEdit ? 'block' : 'hidden' } space-y-4 min-w-80` } onSubmit={handleEditUsernameSubmit}>
                    <label htmlFor="edit-username">
                        <span className="text-sm text-gray-500">Username baru</span>
                        <div className={ `relative flex overflow-hidden rounded-md border-2 transition border-transparent ${ editUsername.onError || !editUsername.isValid ? 'border-red-600 focus-within:border-red-600' : 'focus-within:border-blue-600' } ` }>
                            <input
                                type="text"
                                id="edit-username"
                                className="w-full flex-shrink appearance-none border-gray-300 bg-white py-2 px-4 text-base text-gray-700 placeholder-gray-400 focus:outline-none focus:border-transparent"
                                value={ editUsername.value }
                                onChange={ (event) => {
                                    const inputValue =  event.target.value;
                                    const isInputValid = isInputUsernameValid(inputValue);

                                    setEditUsername((prevState) => ({
                                        ...prevState,
                                        value: inputValue,
                                        isValid: inputValue.length < 1 ? true : isInputValid,
                                        onError: (inputValue === authUser?.username)
                                    }));
                                } }
                            />
                        </div>
                    </label>
                    <p className="!mt-0.5 !mb-0.5 min-h-5 text-sm font-medium text-red-600">
                        { editUsername.errMsg }
                    </p>
                    <div className="!-mt-3 space-y-0.5">
                        <p className="text-xs">
                            <span className="text-red-600">*</span>
                            Panjang Username minimal 5 karakter
                        </p>
                        <p className="text-xs">
                            <span className="text-red-600">*</span>
                            Username dapat terdiri dari kombinasi huruf dan angka tanpa spasi
                        </p>
                        <p className="text-xs">
                            <span className="text-red-600">*</span>
                            Username tidak boleh mengandung simbol berikut:&nbsp;
                            <span className="font-semibold">
                                { `!@#$%^&*()_+{}[]:;"'<>,.?~\`|\\/-` }
                            </span>
                        </p>
                    </div>
                    <div className="flex items-center justify-start gap-3">
                        <Button size="sm" color="red" className="!shadow-none w-24" onClick={ () => setEditUsername(editUsernameInit) } disabled={editUsername.onSubmit}>
                            Batal
                        </Button>
                        <Button
                            type="submit"
                            size="sm"
                            color="green"
                            className="!shadow-none w-24"
                            disabled={!editUsername.isValid || editUsername.value.length < 5 || editUsername.onError}
                            loading={editUsername.onSubmit}
                        >
                            Simpan
                        </Button>
                    </div>
                </form>
            </div>

            <hr className="mt-4 mb-8"/>

            <p className="py-2 text-xl font-semibold">
                Password
            </p>
            <form className="space-y-3" onSubmit={ handleEditPasswordSubmit }>
                <div className="flex items-center">
                    <div className="flex flex-col space-y-2 lg:flex-row lg:space-y-0 lg:space-x-3">
                        <label htmlFor="login-password">
                            <span className="text-sm text-gray-500">Password saat ini</span>
                            <div
                                className={ `relative flex overflow-hidden rounded-md border-2 transition border-transparent ${ editPassword.currPassword.onError ? 'border-red-600 focus-within:border-red-600' : 'focus-within:border-blue-600'} ` }>
                                <input
                                    type={ editPassword.showPassword ? 'text' : 'password' }
                                    id="login-password"
                                    value={ editPassword.currPassword.value }
                                    onChange={ (event) => {
                                        setEditPassword((prevState) => ({
                                            ...prevState,
                                            currPassword: {
                                                ...prevState.currPassword,
                                                value: event.target.value,
                                                onError: false
                                            }
                                        }))
                                    } }
                                    className="w-full flex-shrink appearance-none border-gray-300 bg-white py-2 px-4 text-base text-gray-700 placeholder-gray-400 focus:outline-none focus:border-transparent"
                                    placeholder="*******"
                                />
                            </div>
                        </label>
                        <label htmlFor="new-password">
                            <span className="text-sm text-gray-500">Password baru</span>
                            <div className={ `relative flex overflow-hidden rounded-md border-2 transition border-transparent ${ editPassword.newPassword.onError || (!editPassword.newPassword.isValid && editPassword.newPassword.value.length > 0) ? 'border-red-600 focus-within:border-red-600' : 'focus-within:border-blue-600' } ` }>
                                <input
                                    type={ editPassword.showPassword ? 'text' : 'password' }
                                    id="new-password"
                                    value={ editPassword.newPassword.value }
                                    onChange={ (event) => {
                                        const inputValue = event.target.value;
                                        const isInputValid = isInputPasswordValid(inputValue);
                                        setEditPassword((prevState) => ({
                                            ...prevState,
                                            newPassword: {
                                                ...prevState.newPassword,
                                                value: inputValue,
                                                isValid: isInputValid,
                                                onError: false
                                            }
                                        }))
                                    } }
                                    className="w-full flex-shrink appearance-none border-gray-300 bg-white py-2 px-4 text-base text-gray-700 placeholder-gray-400 focus:outline-none focus:border-transparent"
                                    placeholder="*******"
                                />
                            </div>
                        </label>
                    </div>
                    <svg
                        xmlns="http://www.w3.org/2000/svg"
                        className="mt-5 ml-2 h-6 w-6 cursor-pointer text-sm font-semibold text-gray-600 underline decoration-2"
                        onClick={ () => {
                            setEditPassword((prevState) => ({
                                ...prevState,
                                showPassword: !prevState.showPassword
                            }))
                        } }
                        fill="none"
                        viewBox="0 0 24 24"
                        stroke="currentColor"
                        strokeWidth="2"
                    >
                        <path strokeLinecap="round" strokeLinejoin="round"
                              d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.88 9.88l-3.29-3.29m7.532 7.532l3.29 3.29M3 3l3.59 3.59m0 0A9.953 9.953 0 0112 5c4.478 0 8.268 2.943 9.543 7a10.025 10.025 0 01-4.132 5.411m0 0L21 21"/>
                    </svg>
                </div>
                <div className="flex flex-col lg:flex-row items-start gap-2.5">
                    <Button
                        type="submit"
                        size="sm"
                        disabled={ !editPassword.currPassword.value || !editPassword.newPassword.value || editPassword.newPassword.value.length < 7 || !editPassword.newPassword.isValid || editPassword.onSubmit }
                        loading={ editPassword.onSubmit }
                        className="w-24"
                    >
                        Simpan
                    </Button>
                    <div className="space-y-0.5 order-first lg:order-last">
                        <p className="text-xs">
                            <span className="text-red-600">*</span>
                            Panjang password baru minimal 7 karakter
                        </p>
                        <p className="text-xs">
                            <span className="text-red-600">*</span>
                            Password harus terdiri dari setidaknya satu simbol berikut:&nbsp;
                            <span className="font-semibold">
                                {`!@#$%^&*()_+{}[]:;"'<>,.?~\`|\\/-`}
                            </span>
                        </p>
                        <p className="text-xs">
                            <span className="text-red-600">*</span>
                            Password harus terdiri dari setidaknya satu angka:&nbsp;
                            <span className="font-semibold">
                                0-9
                            </span>
                        </p>
                        <p className="text-xs">
                            <span className="text-red-600">*</span>
                            Password harus terdiri dari setidaknya satu huruf besar dan kecil
                        </p>
                    </div>
                </div>
            </form>
            <hr className="mt-4 mb-8"/>

            {/* Delete Account Section */ }
            <div className="mb-10">
                <div className="flex items-center gap-1.5">
                    <p className="py-2 text-xl font-semibold">Informasi</p>
                    <TriangleAlert/>
                </div>
                <ul className="space-y-0.5 list-disc list-inside text-sm">
                <li>
                        Admin tidak pernah meminta informasi mengenai NIP, Username atau Password akun anda
                    </li>
                    <li>
                        Anda dapat menghubungi Admin Personalia apabila anda lupa password akun untuk dilakukan
                        penyetelan ulang password
                    </li>
                </ul>
            </div>
        </>
    );
};
