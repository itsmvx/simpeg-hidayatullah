import {
    Card,
    CardBody,
    CardHeader,
    Typography,
    Button,
    IconButton, Navbar,
} from "@material-tailwind/react";
import { PageProps } from "@/types";
import {  PPHBackground, PPHLogo } from "@/Lib/StaticImages";
import { Building2, Handshake, LogIn, UserRound } from "lucide-react";
import { Head, router } from "@inertiajs/react";
import { ReactElement } from "react";
import { MasterNavbar } from "@/Components/Master/MasterNavbar";
import { AdminNavbar } from "@/Components/Admin/AdminNavbar";
import { Footer } from "@/Components/Footer";
import { PegawaiNavbar } from "@/Components/Pegawai/PegawaiNavbar";
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
        { title: 'K.A SDI saat ini', description: 'Faishal Abdullah, M.Pd.I', icon: <Handshake /> },
        { title: 'Total Unit Kerja', description: String(data.unit), icon: <Building2 /> },
    ];

    const NavigationBar = () => {
        if(auth.user && auth.role === 'admin') {
            if(auth.user.unit_id) {
                return <AdminNavbar auth={auth} />
            }
            return <MasterNavbar auth={auth} />
        } else if(auth.user && auth.role === 'pegawai') {
            return <PegawaiNavbar auth={auth} />
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
                                        <p className="text-blue-gray-800 font-medium line-clamp-2">
                                            { feature.description }
                                        </p>
                                    </CardBody>
                                </Card>
                            ))
                        }
                    </div>
                    <div className="py-5 flex flex-col lg:flex-row justify-between items-center gap-y-10">
                        <div className="mx-auto w-full lg:w-1/2">
                            <div className="inline-flex h-16 w-16 items-center justify-center rounded-full bg-blue-gray-900 text-center shadow-lg">
                                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" className="w-8 h-8 text-white">
                                    <path fill="currentColor" d="M7 8h10c.3 0 .6.1.8.1c.1-.3.2-.7.2-1c0-1.3-.6-2.5-1.7-3.2L12 1L7.7 3.8c-1 .8-1.7 2-1.7 3.3c0 .4.1.7.2 1c.2 0 .5-.1.8-.1m17-1c0-1.1-2-3-2-3s-2 1.9-2 3c0 .7.4 1.4 1 1.7V13h-2v-2c0-1.1-.9-2-2-2H7c-1.1 0-2 .9-2 2v2H3V8.7c.6-.3 1-1 1-1.7c0-1.1-2-3-2-3S0 5.9 0 7c0 .7.4 1.4 1 1.7V21h9v-4c0-1.1.9-2 2-2s2 .9 2 2v4h9V8.7c.6-.3 1-1 1-1.7"></path>
                                </svg>
                            </div>
                            <Typography
                                variant="h3"
                                className="mb-3 font-bold"
                                color="blue-gray"

                            >
                                Lorem Ipsum
                            </Typography>
                            <Typography className="mb-8 font-normal text-blue-gray-500" >
                                Honestatisinvidunt nibh persequeris appareat vivendo habitasse dico meliore nostrum platonem semper vim harum nulla tincidunt offendit.  Felislibris sententiae latine electram.  Postulantdico salutatus neque possit et iusto appareat appareat efficiantur viris omittantur sale elementum fastidii usu quod.  Ludusconsectetuer inani scripta definiebas proin labores platonem has delectus phasellus eruditi sodales sententiae dignissim nascetur.  Efficiantursem tibique mauris tortor ipsum laoreet oratio eros populo minim minim urna dui duis nonumy nihil mazim dicta dolorem.
                            </Typography>
                            <Button
                                onClick={() => router.visit(route('auth.login'))}
                                className="flex items-center justify-center gap-2 transform scale-100 hover:scale-110 transition-transform ease-in-out duration-200 will-change-transform"
                            >
                                Masuk
                                <LogIn />
                            </Button>
                        </div>
                        <div id="news" className="mx-auto flex w-full justify-center lg:w-96">
                            <Card className="shadow-lg border shadow-gray-500/10 rounded-lg">
                                <CardHeader floated={ false } className="relative aspect-video overflow-hidden flex items-center justify-center">
                                    <img
                                        alt="Card Image"
                                        src={ PPHBackground }
                                        className=" object-cover object-center"
                                    />
                                </CardHeader>
                                <CardBody >
                                    <Typography variant="small" color="blue-gray" className="font-normal">
                                        Lorem ipsum
                                    </Typography>
                                    <Typography
                                        variant="h5"
                                        color="blue-gray"
                                        className="mb-3 mt-2 font-bold"
                                    >
                                        Lorem Ipsum
                                    </Typography>
                                    <Typography className="font-normal text-blue-gray-500" >
                                        lorem vituperatoribus dolorem euripidis sodales scripserit sed suas iuvaret integer tale altera idque vis scelerisque porro autem tortor homero est reformidans
                                    </Typography>
                                </CardBody>
                            </Card>
                        </div>
                    </div>
                </div>
            </section>
            <div className="bg-blue-gray-50/50 min-h-10">
                <Footer />
            </div>
        </>
    );
}

export default Home;
