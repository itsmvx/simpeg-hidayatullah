import {
    Card,
    CardBody,
    Typography, Button,
} from "@material-tailwind/react";
import { Dispatch, memo, SetStateAction } from "react";
import { ExternalLink, Home } from "lucide-react";
import { PPHBackground, PPHLogo } from "@/Lib/StaticImages";

const AdminLoginSelection = ({ units, setForm }: {
    units: {
        id: string;
        nama: string;
        keterangan: string;
    }[];
    setForm: Dispatch<SetStateAction<{
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
        }
    }>>
}) => {
    const handleSelectUnit = (unit: { id: string; nama: string; }) => {
        setForm((prevState) => ({
            ...prevState,
            unit: {
                ...prevState,
                id: unit.id,
                nama: unit.nama
            }
        }));
    };
    return (
        <section className="relative w-full min-h-screen ">
            <div
                style={{
                    backgroundImage: `url(${PPHBackground})`,
                }}
                className="absolute -z-10 bg-center bg-cover bg-repeat w-full h-full"
            />
            <div
                className="bg-black/70 absolute -z-10 w-full h-full"
            />
            <div className="py-8 px-8 lg:py-16">
                <div className="container mx-auto space-y-8">
                    <div className="text-center">
                        <Typography
                            variant="h6"
                            className="text-lg text-gray-300"
                        >
                            Selamat Datang di
                        </Typography>
                        <div className="mx-auto flex items-center justify-center w-32 h-32 rounded-full">
                            <img src={ PPHLogo } width={ 110 } className="my-auto mx-auto" alt="pph-logo"/>
                        </div>
                        <Typography
                            variant="h1"
                            className="my-2 !text-2xl lg:!text-4xl text-gray-300"
                        >
                            Sistem Kepegawaian Ponpes Hidayatullah Surabaya
                        </Typography>
                        <Typography
                            variant="lead"
                            className="mx-auto w-full max-w-4xl text-gray-300"
                        >
                            Silahkan pilih Unit yang akan dikelola
                        </Typography>
                    </div>
                    <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-4">
                        { units.map(({ id, nama, keterangan }, index) => (
                            <Card key={ index } className="rounded-lg bg-[#FAFAFA] border" shadow={ true }>
                                <CardBody className="h-full text-center flex flex-col gap-y-1.5">
                                    <div
                                        className="w-14 h-14 flex items-center justify-center mx-auto mb-6 border-4 border-gray-900 rounded-full">
                                        <Home className="text-gray-900"/>
                                    </div>
                                    <Typography variant="h5" color="blue-gray" className="!font-medium text-lg">
                                        { nama }
                                    </Typography>
                                    <Typography
                                        color="blue-gray"
                                        className="mb-2 !text-base !font-semibold text-gray-600"
                                    >
                                        { keterangan }
                                    </Typography>

                                    <Button
                                        onClick={ () => handleSelectUnit({ id, nama }) }
                                        className="mt-auto flex items-center justify-center gap-x-1.5 !shadow-none scale-100 hover:scale-105"
                                    >
                                        <p className="will-change-transform transform">
                                            Login
                                        </p>
                                        <ExternalLink width={ 18 }/>
                                    </Button>
                                </CardBody>
                            </Card>
                        )) }
                    </div>
                </div>
            </div>
        </section>
    );
}

export default memo(AdminLoginSelection);
