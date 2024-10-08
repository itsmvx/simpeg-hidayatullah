import {
    Button,
    Typography, Tabs, TabsHeader, Tab,
} from "@material-tailwind/react";
import { Input } from "@/Components/Input";
import { PPHLogoText } from "@/Lib/StaticImages";
import { CircleUserRound, MoveLeft, UserRound } from "lucide-react";
import { ChangeEvent, FormEvent, ReactElement, useState } from "react";
import Cookies from "js-cookie";
import axios, { AxiosError } from "axios";
import { Head, router } from "@inertiajs/react";
import { notifyToast } from "@/Lib/Utils";
import { ToastContainer } from "react-toastify";
import 'react-toastify/dist/ReactToastify.css';

type LoginAs = 'admin' | 'pegawai';
type FormState = {
    username: string;
    password: string;
    onSubmit: boolean;
    onError: boolean;
    errMsg: string;
};

export default function LoginPage() {

    const tabData: {
        label: string;
        value: LoginAs;
        icon: ReactElement;
    }[] = [
        {
            label: "Admin",
            value: "admin",
            icon: <CircleUserRound width={15} />,
        },
        {
            label: "Pegawai",
            value: "pegawai",
            icon: <UserRound width={15} />,
        }
    ];

    const [ loginAs, setLoginAs ] = useState<LoginAs>(() => {
        const loginAsCookie: string | undefined = Cookies.get('auth_login_as');
        if (loginAsCookie && ['admin', 'pegawai'].includes(loginAsCookie ?? '')) {
            return loginAsCookie as LoginAs;
        }
        Cookies.set('auth_login_as', 'pegawai', { expires: 365 });
        return 'pegawai';
    });

    const formStateInit: FormState = {
        username: '',
        password: '',
        onSubmit: false,
        onError: false,
        errMsg: ''
    };
    const [ formState, setFormState ] = useState<FormState>(formStateInit);

    const handleToggleLoginAs = (val: LoginAs) => {
        Cookies.set('auth_login_as', val, { expires: 365 });
        setLoginAs(val);
        if (formState.onError) {
            setFormState((prevState) => ({
                ...prevState,
                onError: false,
                errMsg: ''
            }));
        }
    };
    const handleFormChange = (event: ChangeEvent<HTMLInputElement>) => {
        const { name, value } = event.target;
        setFormState((prevState) => ({
            ...formState,
            [name]: value,
            onError: value ? false : prevState.onError,
            errMsg: value ? '' : prevState.errMsg
        }));
    };
    const handleFormSubmit = (event: FormEvent<HTMLFormElement>) => {
        event.preventDefault();
        setFormState((prevState) => ({ ...prevState, onSubmit: true, onError: false, errMsg: '' }));
        const { username, password } = formState;

        axios.post<{
            data: {
                id: string;
                nama: string;
                username: string;
                unit: {
                    id: string;
                    nama: string;
                } | null;
                role: LoginAs
            }
        }>(loginAs === 'admin' ? route('auth.admin') : route('auth.pegawai'), {
            username: username,
            password: password
        })
            .then((res) => {
                if ( res.data.data.role === 'admin') {
                    if (res.data.data.unit) {
                        router.visit(route('admin.dashboard'));
                        return;
                    } else if (!res.data.data.unit) {
                        router.visit(route('master.dashboard'));
                        return;
                    }
                } else if (res.data.data.role === 'pegawai') {
                    router.visit(route('pegawai.dashboard'));
                    return;
                }

                notifyToast('error', 'Error tidak diketahui terjadi!');
            })
            .catch((err: unknown) => {
                const errMsg = err instanceof AxiosError
                    ? [401,422].includes(err.response?.status ?? 0)
                        ? err.response?.data.message ?? 'Error tidak diketahui terjadi!'
                        : 'Server gagal memproses permintaan'
                    : 'Error tidak diketahui terjadi!';

                setFormState((prevState) => ({
                    ...prevState, onSubmit: false,
                    onError: true,
                    errMsg: errMsg
                }));
            });
    };

    return (
        <>
            <Head title="Login" />
            <section className="w-screen h-screen relative flex flex-row-reverse">
                <div className="absolute top-0 h-full w-full bg-[url(/public/assets/ponpes-hidayatullah-landing.webp)] bg-cover bg-center bg-fixed"/>
                <div className="absolute top-0 h-full w-full bg-black/75 lg:bg-gray-400/80 bg-cover bg-center transition-colors duration-500 ease-in-out"/>

                <div className="my-auto mx-auto lg:mx-0 lg:ml-auto w-96 lg:w-[28rem] h-fit lg:h-full bg-white z-10 space-y-5 sm:space-y-10 px-8 py-16 rounded-md lg:rounded-none md:content-center transition-all duration-150 ease-in-out">
                    <div className="text-center space-y-3">
                        <Typography variant="h4" className="font-bold mb-2">
                            Selamat Datang
                        </Typography>

                        <Tabs value={ loginAs } className="w-64 lg:w-80 mx-auto">
                            <TabsHeader>
                                { tabData.map(({ label, value, icon }) => (
                                    <Tab key={ value } value={ value } className="text-xs font-medium" onClick={ () => handleToggleLoginAs(value) }>
                                        <div className="flex items-center gap-2">
                                            { icon }
                                            { label }
                                        </div>
                                    </Tab>
                                )) }
                            </TabsHeader>
                        </Tabs>

                        <Typography variant="paragraph" color="blue-gray" className="text-xs font-medium">
                            Anda akan masuk sebagai <span className="capitalize">{ loginAs }</span>
                        </Typography>
                        <Typography color="red" className="text-xs font-medium -mt-3 h-5">
                            { formState.errMsg }
                        </Typography>
                    </div>
                    <form className="mx-auto w-64 lg:w-80 flex flex-col gap-4" onSubmit={ handleFormSubmit }>
                        <Input
                            type="text"
                            label={ loginAs === 'admin' ? 'Username' : 'Username atau NIP' }
                            size="md"
                            color="green"
                            name="username"
                            placeholder="username"
                            error={ formState.onError }
                            value={ formState.username }
                            onChange={ handleFormChange }
                            required
                        />
                        <Input
                            type="password"
                            label="Password"
                            color="green"
                            name="password"
                            placeholder="*****"
                            error={ formState.onError }
                            value={ formState.password }
                            onChange={ handleFormChange }
                            required
                        />
                        <Button
                            type="submit"
                            disabled={ formState.onSubmit || formState.onError }
                            loading={ formState.onSubmit }
                            className="lg:mt-5 flex items-center justify-center !bg-pph-green-deep"
                            fullWidth
                        >
                            Masuk
                        </Button>
                        <Button
                            type="button"
                            variant="text"
                            className="mt-5 flex items-center justify-center gap-1.5 h-9 hover:!bg-pph-green/70"
                            fullWidth
                            onClick={() => router.visit('/')}
                        >
                            <MoveLeft width={15} /> Kembali ke Home
                        </Button>
                    </form>
                </div>
                <div className="z-10 flex-1 hidden lg:flex items-center justify-center">
                    <img
                        src={ PPHLogoText }
                        width={ 450 }
                        alt="pph-logo"
                    />
                </div>
            </section>
            <ToastContainer/>
        </>
    );
}
