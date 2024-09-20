import { UniversalLayout } from "@/Layouts/UniversalLayout";
import { PageProps } from "@/types";
import { AdminProfile, MenAvatar, WomenAvatar } from "@/Lib/StaticImages";
import { ChevronDown, Pencil } from "lucide-react";
import { ChangeEvent, useState } from "react";
import { notifyToast } from "@/Lib/Utils";
import { toast } from "react-toastify";
import axios, { AxiosProgressEvent } from "axios";
import { Head, router } from "@inertiajs/react";
import HTTP_404Page from "@/Pages/HTTP_404Page";
import { AuthAccountSettings } from "@/Components/AuthAccountSettings";
import { AuthProfileSettings } from "@/Components/AuthProfileSettings";

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
    type ActiveMenu = 'akun' | 'profil';
    const activeMenus: ActiveMenu | string[] = ['akun', 'profil'];
    const [ activeMenu, setActiveMenu ] = useState<ActiveMenu>(() => {
        const queryParams = new URLSearchParams(window.location.search);
        const initialMenu = queryParams.get("menu") ?? '';
        return activeMenus.includes(initialMenu)
            ? initialMenu as ActiveMenu
            : 'akun' as ActiveMenu;
    });
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
                    router.reload({ only: [ 'auth' ] });
                    notifyToast('success', 'Berhasil mengunggah foto');
                })
                .catch(() => {
                    notifyToast('error', 'Gagal mengunggah foto')
                });
        }
    };
    const handleChangeActiveMenu = (menu: ActiveMenu) => {
        setActiveMenu(menu);

        const searchParams = new URLSearchParams(window.location.search);
        searchParams.set('menu', menu);

        router.visit(window.location.pathname + '?' + searchParams.toString(), {
            preserveState: false,
            preserveScroll: true,
            replace: true
        });
    };


    return (
        <>
            <Head title="Pengaturan Akun" />
            <UniversalLayout auth={ auth }>
                <div className="mx-auto relative">
                    <div className="rounded-full flex items-center justify-center w-44 h-44 overflow-hidden border-4">
                        <img
                            src={ authUser.foto ? `/storage/${ authUser.foto }` : authUser.jenis_kelamin === 'Laki-Laki' ? MenAvatar : authUser.jenis_kelamin === 'Perempuan' ? WomenAvatar : AdminProfile }
                            alt={ authUser.foto ? `${ authUser.nama }-profil` : 'no-pict' }
                            width={ authUser.foto ? 200 : 200 }
                            className="object-cover object-center mx-auto"
                            onLoad={ () => setOnLoadImage(false) }
                        />
                        <div className={ `${ onLoadImage ? 'absolute' : 'hidden' } absolute inset-0 flex items-center justify-center bg-gray-300/85 rounded-full` }>
                            <span className="animate-spin border-4 border-l-transparent border-gray-700/80 rounded-full w-10 h-10 inline-block align-middle m-auto"></span>
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
                <div className="min-h-screen max-w-screen-xl mx-4 lg:mx-auto">
                    <h1 className="border-b py-6 text-4xl font-semibold"></h1>
                    <div className="grid grid-cols-8 pt-3 lg:grid-cols-10">
                        {/* Mobile Accounts Menu */ }
                        <div className="relative my-4 w-56 lg:hidden">
                            <input className="peer hidden" type="checkbox" name="select-1" id="select-1"/>
                            <label
                                htmlFor="select-1"
                                className="flex w-full cursor-pointer select-none rounded-lg border p-2 px-3 text-sm text-gray-700 ring-blue-700 peer-checked:ring capitalize"
                            >
                                { activeMenu }
                            </label>
                            <ChevronDown className="pointer-events-none absolute right-0 top-3 ml-auto mr-5 h-4 text-slate-700 transition peer-checked:rotate-180"/>
                            <ul className="max-h-0 select-none flex-col overflow-hidden rounded-b-lg shadow-md transition-all duration-300 peer-checked:max-h-56 peer-checked:py-3">
                                {
                                    activeMenus.map((menu, index) => ((
                                        <li
                                            key={index}
                                            aria-disabled={activeMenu === menu}
                                            className="cursor-pointer aria-disabled:cursor-auto px-3 py-2 text-sm capitalize text-gray-700 aria-disabled:opacity-70 hover:bg-pph-green/80 hover:aria-disabled:bg-white hover:text-white hover:aria-disabled:text-gray-700"
                                            onClick={() => {
                                                if (!(activeMenu === menu)) {
                                                    handleChangeActiveMenu(menu as ActiveMenu)
                                                }
                                                return;
                                            }}
                                        >
                                            { menu }
                                        </li>
                                    )))
                                }
                             </ul>
                        </div>

                        {/* Desktop Sidebar Menu */ }
                        <div className="col-span-2 hidden lg:block">
                            <ul>
                                {
                                    activeMenus.map((menu, index) => ((
                                        <li
                                            key={index}
                                            className={ `mt-5 border-l-2 ${ activeMenu === menu ? 'border-l-pph-green-deep cursor-auto text-pph-green-deep' : 'border-transparent cursor-pointer hover:text-pph-green-deep'} px-2 py-2 capitalize font-semibold transition hover:border-l-pph-green-deep` }
                                            onClick={() => {
                                                if (!(activeMenu === menu)) {
                                                    handleChangeActiveMenu(menu as ActiveMenu)
                                                }
                                            }}
                                        >
                                            { menu }
                                        </li>
                                    )))
                                }
                            </ul>
                        </div>

                        {/* Main Content */ }
                        <div className="col-span-8 overflow-hidden rounded-xl lg:bg-gray-50 lg:px-8 lg:shadow">
                            {
                                activeMenu === 'akun'
                                    ? (
                                        <AuthAccountSettings authUser={authUser} />
                                    ) : (
                                        <AuthProfileSettings />
                                    )
                            }
                        </div>
                    </div>
                </div>
            </UniversalLayout>
        </>
    );
}
