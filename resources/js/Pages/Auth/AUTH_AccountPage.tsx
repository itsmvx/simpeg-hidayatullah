import { UniversalLayout } from "@/Layouts/UniversalLayout";
import { PageProps } from "@/types";
import { HarunaPP, MenAvatar, WomenAvatar } from "@/Lib/StaticImages";
import { Pencil } from "lucide-react";
import { ChangeEvent, useState } from "react";
import { notifyToast } from "@/Lib/Utils";
import { toast } from "react-toastify";
import axios, { AxiosProgressEvent } from "axios";
import { router } from "@inertiajs/react";
import HTTP_404Page from "@/Pages/HTTP_404Page";

export default function AUTH_AccountPage({ auth }: PageProps) {
    const authUser = auth.user;
    const authRole = auth.role;
    if (!authUser) {
        return (
            <>
                <HTTP_404Page />
            </>
        );
    } else if (!authRole) {
        return (
            <>
                <HTTP_404Page />
            </>
        );
    }
    const [ onLoadImage, setOnLoadImage ] = useState(false);
    const handleImageChange = (e: ChangeEvent<HTMLInputElement>) => {
        if (e.target.files && e.target.files.length > 0) {
            const file = e.target.files[0];
            if (file && file.size > 2 * 1024 * 1024) {
                notifyToast('error','Ukuran file maksimal adalah 2MB!');
                return;
            }
            const formData = new FormData();
            formData.append('image', file);
            formData.append('id', authUser.id);
            const id = toast.loading("Mengunggah Foto...");
            axios.post(route('pegawai.upload-foto'), formData, {
                onUploadProgress: (p: AxiosProgressEvent) => {
                    const progress: number = p.loaded / (p.total ?? 100);
                    toast.update(id, { type: "info", isLoading: true, progress: progress });
                }
            })
                .then(() => {
                    setOnLoadImage(true);
                    router.reload({ only: [ 'pegawai' ] });
                    notifyToast('success', 'Berhasil mengunggah foto');
                })
                .catch(() => {
                    notifyToast('error', 'Gagal mengunggah foto')
                });
        }
    };

    return (
        <>
            <UniversalLayout auth={ auth }>
                <div className="mx-auto relative">
                    <div
                        className="rounded-full flex items-center justify-center w-44 h-44 overflow-hidden border-4 border-pph-black/70">
                        <img
                            src={ authUser.foto ? `/storage/${ authUser.foto }` : authUser.jenis_kelamin === 'Laki-Laki' ? MenAvatar : authUser.jenis_kelamin === 'Perempuan' ? WomenAvatar : HarunaPP }
                            alt={ authUser.foto ? `${ authUser.nama }-profil` : 'no-pict' }
                            width={ authUser.foto ? 200 : 200 }
                            className="object-cover object-center mx-auto"
                            onLoad={ () => setOnLoadImage(false) }
                        />
                        <div
                            className={ `${ onLoadImage ? 'absolute' : 'hidden' } absolute inset-0 flex items-center justify-center bg-gray-300/85 rounded-full` }>
                            <span
                                className="animate-spin border-4 border-l-transparent border-gray-700/80 rounded-full w-10 h-10 inline-block align-middle m-auto"></span>
                        </div>
                    </div>
                    <div className={ `${ authRole === 'admin' ? 'hidden' : 'absolute' } w-7 h-7 top-0 -right-8` }>
                        <div className="relative">
                            <label htmlFor="file-input" className="w-full h-full cursor-pointer">
                                <Pencil width={ 25 }/>
                            </label>
                            <input
                                id="file-input"
                                type="file"
                                accept="image/*"
                                className="absolute hidden inset-0 w-7 h-7 opacity-0 !cursor-pointer z-30 text-sm text-stone-500 file:mr-5 file:py-1 file:px-3 file:border-[1px] file:text-xs file:font-medium file:bg-stone-50 file:text-stone-700 hover:file:cursor-pointer hover:file:bg-blue-50 hover:file:text-blue-700"
                                onChange={ handleImageChange }
                            />
                        </div>
                    </div>
                </div>
                <p className="text-2xl text-center text-blue-gray-800 font-semibold line-clamp-4 lg:line-clamp-2 md:px-14 lg:px-20">
                    { authUser.nama }
                </p>
                <div className="mx-4 min-h-screen max-w-screen-xl sm:mx-8 xl:mx-auto">
                    <h1 className="border-b py-6 text-4xl font-semibold">Settings</h1>
                    <div className="grid grid-cols-8 pt-3 sm:grid-cols-10">
                        {/* Mobile Accounts Menu */ }
                        <div className="relative my-4 w-56 sm:hidden">
                            <input className="peer hidden" type="checkbox" name="select-1" id="select-1"/>
                            <label
                                htmlFor="select-1"
                                className="flex w-full cursor-pointer select-none rounded-lg border p-2 px-3 text-sm text-gray-700 ring-blue-700 peer-checked:ring"
                            >
                                Accounts
                            </label>
                            <svg
                                xmlns="http://www.w3.org/2000/svg"
                                className="pointer-events-none absolute right-0 top-3 ml-auto mr-5 h-4 text-slate-700 transition peer-checked:rotate-180"
                                fill="none"
                                viewBox="0 0 24 24"
                                stroke="currentColor"
                                strokeWidth="2"
                            >
                                <path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7"/>
                            </svg>
                            <ul className="max-h-0 select-none flex-col overflow-hidden rounded-b-lg shadow-md transition-all duration-300 peer-checked:max-h-56 peer-checked:py-3">
                                <li className="cursor-pointer px-3 py-2 text-sm text-slate-600 hover:bg-blue-700 hover:text-white">Accounts</li>
                                <li className="cursor-pointer px-3 py-2 text-sm text-slate-600 hover:bg-blue-700 hover:text-white">Team</li>
                                <li className="cursor-pointer px-3 py-2 text-sm text-slate-600 hover:bg-blue-700 hover:text-white">Others</li>
                            </ul>
                        </div>

                        {/* Desktop Sidebar Menu */ }
                        <div className="col-span-2 hidden sm:block">
                            <ul>
                                <li className="mt-5 cursor-pointer border-l-2 border-transparent px-2 py-2 font-semibold transition hover:border-l-blue-700 hover:text-blue-700">Teams</li>
                                <li className="mt-5 cursor-pointer border-l-2 border-l-blue-700 px-2 py-2 font-semibold text-blue-700 transition hover:border-l-blue-700 hover:text-blue-700">Accounts</li>
                                <li className="mt-5 cursor-pointer border-l-2 border-transparent px-2 py-2 font-semibold transition hover:border-l-blue-700 hover:text-blue-700">Users</li>
                                <li className="mt-5 cursor-pointer border-l-2 border-transparent px-2 py-2 font-semibold transition hover:border-l-blue-700 hover:text-blue-700">Profile</li>
                                <li className="mt-5 cursor-pointer border-l-2 border-transparent px-2 py-2 font-semibold transition hover:border-l-blue-700 hover:text-blue-700">Billing</li>
                                <li className="mt-5 cursor-pointer border-l-2 border-transparent px-2 py-2 font-semibold transition hover:border-l-blue-700 hover:text-blue-700">Notifications</li>
                                <li className="mt-5 cursor-pointer border-l-2 border-transparent px-2 py-2 font-semibold transition hover:border-l-blue-700 hover:text-blue-700">Integrations</li>
                            </ul>
                        </div>

                        {/* Main Content */ }
                        <div className="col-span-8 overflow-hidden rounded-xl sm:bg-gray-50 sm:px-8 sm:shadow">
                            <div className="pt-4">
                                <h1 className="py-2 text-2xl font-semibold">Account settings</h1>
                            </div>
                            <hr className="mt-4 mb-8"/>

                            {/* Email Section */ }
                            <p className="py-2 text-xl font-semibold">Email Address</p>
                            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between">
                                <p className="text-gray-600">Your email address is <strong>john.doe@company.com</strong>
                                </p>
                                <button
                                    className="inline-flex text-sm font-semibold text-blue-600 underline decoration-2">Change
                                </button>
                            </div>
                            <hr className="mt-4 mb-8"/>

                            {/* Password Section */ }
                            <p className="py-2 text-xl font-semibold">Password</p>
                            <div className="flex items-center">
                                <div className="flex flex-col space-y-2 sm:flex-row sm:space-y-0 sm:space-x-3">
                                    <label htmlFor="login-password">
                                        <span className="text-sm text-gray-500">Current Password</span>
                                        <div
                                            className="relative flex overflow-hidden rounded-md border-2 transition focus-within:border-blue-600">
                                            <input
                                                type="password"
                                                id="login-password"
                                                className="w-full flex-shrink appearance-none border-gray-300 bg-white py-2 px-4 text-base text-gray-700 placeholder-gray-400 focus:outline-none"
                                                placeholder="***********"
                                            />
                                        </div>
                                    </label>
                                    <label htmlFor="new-password">
                                        <span className="text-sm text-gray-500">New Password</span>
                                        <div
                                            className="relative flex overflow-hidden rounded-md border-2 transition focus-within:border-blue-600">
                                            <input
                                                type="password"
                                                id="new-password"
                                                className="w-full flex-shrink appearance-none border-gray-300 bg-white py-2 px-4 text-base text-gray-700 placeholder-gray-400 focus:outline-none"
                                                placeholder="***********"
                                            />
                                        </div>
                                    </label>
                                </div>
                                <svg
                                    xmlns="http://www.w3.org/2000/svg"
                                    className="mt-5 ml-2 h-6 w-6 cursor-pointer text-sm font-semibold text-gray-600 underline decoration-2"
                                    fill="none"
                                    viewBox="0 0 24 24"
                                    stroke="currentColor"
                                    strokeWidth="2"
                                >
                                    <path strokeLinecap="round" strokeLinejoin="round"
                                          d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.88 9.88l-3.29-3.29m7.532 7.532l3.29 3.29M3 3l3.59 3.59m0 0A9.953 9.953 0 0112 5c4.478 0 8.268 2.943 9.543 7a10.025 10.025 0 01-4.132 5.411m0 0L21 21"/>
                                </svg>
                            </div>
                            <p className="mt-2">Can't remember your current password. <a
                                className="text-sm font-semibold text-blue-600 underline decoration-2" href="#">Recover
                                Account</a></p>
                            <button className="mt-4 rounded-lg bg-blue-600 px-4 py-2 text-white">Save Password</button>
                            <hr className="mt-4 mb-8"/>

                            {/* Delete Account Section */ }
                            <div className="mb-10">
                                <p className="py-2 text-xl font-semibold">Delete Account</p>
                                <p className="inline-flex items-center rounded-full bg-rose-100 px-4 py-1 text-rose-600">
                                    <svg
                                        xmlns="http://www.w3.org/2000/svg"
                                        className="mr-2 h-5 w-5"
                                        viewBox="0 0 20 20"
                                        fill="currentColor"
                                    >
                                        <path
                                            fillRule="evenodd"
                                            d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z"
                                            clipRule="evenodd"
                                        />
                                    </svg>
                                    Proceed with caution
                                </p>
                                <p className="mt-2">Make sure you have taken backup of your account in case you ever
                                    need to get access to your data. We will completely wipe your data. There is no way
                                    to access your account after this action.</p>
                                <button
                                    className="ml-auto text-sm font-semibold text-rose-600 underline decoration-2">Continue
                                    with deletion
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            </UniversalLayout>
        </>
    );
}
