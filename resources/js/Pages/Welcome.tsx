import {
    Card,
    CardBody,
    CardHeader,
    Typography,
    Button,
    IconButton, Navbar, Menu, MenuHandler, MenuList, MenuItem, Avatar,
} from "@material-tailwind/react";
import { PageProps } from "@/types";
import { HarunaPP, PPHLogo } from "@/Lib/StaticImages";
import { Building2, ChevronDown, Coffee, Handshake, LogIn, LogOut, Menu as MenuIcon, UserRound, X } from "lucide-react";
import { Head, router } from "@inertiajs/react";
import { AdminLoadingOverlay } from "@/Components/Admin/AdminLoadingOverlay";
import { ReactElement, useState } from "react";
import axios, { AxiosError } from "axios";
import { notifyToast } from "@/Lib/Utils";
import { MasterNavbar } from "@/Components/Admin/MasterNavbar";
import { AdminNavbar } from "@/Components/Admin/AdminNavbar";
const Home = ({ auth, data }: PageProps<{
    data: {
        unit: number;
        pegawai: number;
    };
}>) => {
    const FeaturedData: {
        title: string;
        description: string;
        icon?: ReactElement;
        iconWidth?: number;
    }[] = [
        { title: 'Total Pegawai', description: String(data.pegawai), icon: <UserRound />  },
        { title: 'Ketua Ponpes saat ini', description: 'Pak Faisal', icon: <Handshake /> },
        { title: 'Total Unit Kerja', description: String(data.unit), icon: <Building2 /> },
    ];

    const [ onFetchLogout, setFetchLogout ] = useState(false);
    const handleLogout = () => {
        setFetchLogout(true);
        axios.post(route('auth.logout'))
            .then(() => {
                router.visit('/');
            })
            .catch((err: unknown) => {
                const errMsg = err instanceof AxiosError
                    ? err.response?.data.message
                    : 'Error tidak diketahui terjadi!';
                notifyToast('error', errMsg);
                setFetchLogout(false);
            });
    };
    const NavigationBar = () => {
        if(auth.user && auth.role === 'admin') {
            if(auth.user.unit_id) {
                return <MasterNavbar auth={auth} />
            }
            return <AdminNavbar auth={auth} />
        } else if(auth.user && auth.role === 'pegawai') {
            return <AdminNavbar auth={auth} />
        }

        return (
            <>
                <Navbar className="mx-auto !max-w-full px-4 py-2 sticky top-0 z-50 !rounded-none !backdrop-filter-none !bg-opacity-100">
                    <div className="flex items-center justify-end text-blue-gray-900">
                        <div className="flex gap-2">
                            <Button
                                variant="filled"
                                color="gray"
                                onClick={() => router.visit(route('auth.login'))}
                                className="!shadow-none flex items-center justify-center gap-1 min-h-3.5"
                            >
                                Masuk
                                <LogIn />
                            </Button>
                        </div>
                    </div>
                </Navbar>

            </>
        )
    };

    return (
        <>
            <Head title="Home" />
            <NavigationBar />
            {
                onFetchLogout && (<AdminLoadingOverlay />)
            }
            <div className="relative flex h-screen content-center items-center justify-center pt-16 pb-32">
                <div className="absolute top-0 h-full w-full bg-[url(/public/assets/ponpes-hidayatullah-landing.webp)] bg-cover bg-center bg-fixed"/>
                <div className="absolute top-0 h-full w-full bg-black/75 bg-cover bg-center"/>

                <div className="max-w-8xl container relative mx-auto">
                    <div className="flex flex-wrap items-center">
                        <div className="ml-auto mr-auto w-full px-4 text-center lg:w-8/12 text-gray-200">
                            <Typography
                                variant="h6"
                                className="text-lg text-gray-200"
                            >
                                Selamat Datang di
                            </Typography>
                            <div className="mx-auto flex items-center justify-center w-32 h-32 rounded-full">
                                <img src={ PPHLogo } width={ 110 } className="my-auto mx-auto" alt="pph-logo"/>
                            </div>
                            <Typography
                                variant="h1"
                                className="my-2 !text-2xl lg:!text-4xl text-gray-200"
                            >
                                Sistem Kepegawaian Ponpes Hidayatullah Surabaya
                            </Typography>
                        </div>
                    </div>
                </div>
            </div>
            <section className="-mt-32 bg-white px-4 pb-20 pt-4">
                <div className="container mx-auto space-y-10">
                    <div className="grid grid-cols-1 gap-x-6 md:grid-cols-2 lg:grid-cols-3 gap-y-7">
                        {
                            FeaturedData.map((feature, index) => (
                                <Card key={ index } className={ `rounded-lg shadow-md shadow-zinc-500 ${ index === 1 ? 'order-last lg:order-none md:translate-x-1/2 lg:translate-x-0' : '' }` }>
                                    <CardBody className="px-8 text-center">
                                        <IconButton
                                            variant="gradient"
                                            size="lg"
                                            className="pointer-events-none mb-6 rounded-full"
                                        >
                                            { feature.icon }
                                        </IconButton>
                                        <Typography variant="h5" className="mb-2" color="blue-gray">
                                            { feature.title }
                                        </Typography>
                                        <Typography className="text-blue-gray-800 font-medium">
                                            { feature.description }
                                        </Typography>
                                    </CardBody>
                                </Card>
                            ))
                        }
                    </div>
                    <div className="py-5 flex flex-col lg:flex-row justify-between items-center gap-y-10">
                        <div className="mx-auto w-full lg:w-1/2">
                            <div
                                className="inline-flex h-16 w-16 items-center justify-center rounded-full bg-blue-gray-900 text-center shadow-lg">
                                <Coffee
                                    className="w-8 h-8"
                                    color="white"
                                />
                            </div>
                            <Typography
                                variant="h3"
                                className="mb-3 font-bold"
                                color="blue-gray"
                                placeholder=""
                            >
                                Orang dagang
                            </Typography>
                            <Typography className="mb-8 font-normal text-blue-gray-500" placeholder="">
                                The president of the Gourmet Research Society and 3rd year student enrolled at
                                Gehenna
                                Academy.
                                <br/>
                                Upon first glance, one might think she is a rich princess with an aloof elegance,
                                but
                                get her involved in talks of food and all sense of distinction is lost by this
                                zealous
                                epicure.
                                <br/>
                                In contrast to such gluttony, she is actually not one with a massive appetite,
                                unlike
                                the other club members. Her favorite foods are greasy and meaty ones such as
                                taiyaki,
                                motsunabe, and horumonyaki.
                            </Typography>
                            <Button
                                className="transform scale-100 hover:scale-110 transition-transform ease-in-out duration-200 will-change-transform"
                                variant="filled" placeholder="">read more</Button>
                        </div>
                        <div id="news" className="mx-auto flex w-full justify-center lg:w-96">
                            <Card className="shadow-lg border shadow-gray-500/10 rounded-lg" placeholder="">
                                <CardHeader floated={ false } className="relative aspect-video overflow-hidden"
                                            placeholder="">
                                    <img
                                        alt="Card Image"
                                        src={ HarunaPP }
                                        className=" object-cover object-center"
                                    />
                                </CardHeader>
                                <CardBody placeholder="">
                                    <Typography variant="small" color="blue-gray" className="font-normal"
                                                placeholder="">
                                        Praktikum
                                    </Typography>
                                    <Typography
                                        variant="h5"
                                        color="blue-gray"
                                        className="mb-3 mt-2 font-bold"
                                        placeholder=""
                                    >
                                        Haruna buntut ewe
                                    </Typography>
                                    <Typography className="font-normal text-blue-gray-500" placeholder="">
                                        The Arctic Ocean freezes every winter and much of the
                                        sea-ice then thaws every summer, and that process will
                                        continue whatever happens.
                                    </Typography>
                                </CardBody>
                            </Card>
                        </div>
                    </div>
                </div>
            </section>
        </>
    );
}

export default Home;
