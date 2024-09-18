import { AuthUser } from "@/types";
import { Pencil, TriangleAlert } from "lucide-react";
import { useState } from "react";
import { Button } from "@material-tailwind/react";

export const AuthAccountSettings = ({ authUser }: {
    authUser: AuthUser | null;
}) => {
    const editUsernameInit = {
        onEdit: false,
        onError: false,
        errMsg: '',
        value: ''
    };
    const editPasswordInit = {
        currPassword: '',
        newPassword: '',
        showPassword: false,
    };

    const [ editUsername, setEditUsername ] = useState<{
        onEdit: boolean;
        onError: boolean;
        errMsg: string;
        value: string;
    }>(editUsernameInit);
    const [ editPassword, setEditPassword ] = useState<{
        currPassword: string;
        newPassword: string;
        showPassword: boolean;
    }>(editPasswordInit);

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
                <form className={ `mt-5 ${ editUsername.onEdit ? 'block' : 'hidden' } space-y-4 min-w-80` }>
                    <label htmlFor="edit-username">
                        <span className="text-sm text-gray-500">Username baru</span>
                        <div className="relative flex overflow-hidden rounded-md border-2 transition focus-within:border-blue-600">
                            <input
                                type="text"
                                id="edit-username"
                                className="w-full flex-shrink appearance-none border-gray-300 bg-white py-2 px-4 text-base text-gray-700 placeholder-gray-400 focus:outline-none"
                                value={ editUsername.value }
                                onChange={ (event) => {
                                    setEditUsername((prevState) => ({
                                        ...prevState,
                                        value: event.target.value
                                    }))
                                } }
                            />
                        </div>
                    </label>
                    <p className="!mt-0.5 !mb-0.5 min-h-5 text-sm font-medium text-red-600">
                        { editUsername.errMsg }
                    </p>
                    <div className="flex items-center justify-start gap-3">
                        <Button size="sm" color="red" className="!shadow-none" onClick={() => setEditUsername(editUsernameInit)}>
                            Batal
                        </Button>
                        <Button size="sm" color="green" className="!shadow-none">
                            Simpan
                        </Button>
                    </div>
                </form>
            </div>
            <hr className="mt-4 mb-8"/>

            <p className="py-2 text-xl font-semibold">
                Password
            </p>
            <form className="space-y-3">
                <div className="flex items-center">
                    <div className="flex flex-col space-y-2 lg:flex-row lg:space-y-0 lg:space-x-3">
                        <label htmlFor="login-password">
                            <span className="text-sm text-gray-500">Password saat ini</span>
                            <div
                                className="relative flex overflow-hidden rounded-md border-2 transition focus-within:border-blue-600">
                                <input
                                    type={ editPassword.showPassword ? 'text' : 'password' }
                                    id="login-password"
                                    value={ editPassword.currPassword }
                                    onChange={ (event) => {
                                        setEditPassword((prevState) => ({
                                            ...prevState,
                                            currPassword: event.target.value
                                        }))
                                    } }
                                    className="w-full flex-shrink appearance-none border-gray-300 bg-white py-2 px-4 text-base text-gray-700 placeholder-gray-400 focus:outline-none"
                                    placeholder="***********"
                                />
                            </div>
                        </label>
                        <label htmlFor="new-password">
                            <span className="text-sm text-gray-500">Password baru</span>
                            <div
                                className="relative flex overflow-hidden rounded-md border-2 transition focus-within:border-blue-600">
                                <input
                                    type={ editPassword.showPassword ? 'text' : 'password' }
                                    id="new-password"
                                    value={ editPassword.newPassword }
                                    onChange={ (event) => {
                                        setEditPassword((prevState) => ({
                                            ...prevState,
                                            newPassword: event.target.value
                                        }))
                                    } }
                                    className="w-full flex-shrink appearance-none border-gray-300 bg-white py-2 px-4 text-base text-gray-700 placeholder-gray-400 focus:outline-none"
                                    placeholder="***********"
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
                <Button size="sm" disabled={ !editPassword.currPassword || !editPassword.newPassword }>
                    Simpan
                </Button>
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
