import {
    Card,
    CardBody,
    CardHeader,
    Typography,
    Button,
    IconButton,
} from "@material-tailwind/react";
import { PageProps } from "@/types";
import { HarunaPP } from "@/Lib/StaticImages";
import { Coffee } from "lucide-react";
import { AdminLayout } from "@/Layouts/AdminLayout";
const Home = ({ auth }: PageProps) => {
    const FeaturedData: {
        title: string;
        description: string;
        icon?: string;
        iconWidth?: number;
    }[] = [
        { title: 'Total Praktikan', description: '99', icon: 'bi:person-heart', iconWidth: 25 },
        { title: 'Praktikum saat ini', description: 'Struktur Data XV', icon: 'fa:mortar-board', iconWidth: 25 },
        { title: 'Total Aslab', description: '10', icon: 'mdi:person-heart', iconWidth: 25 },
    ];



    return (
        <>
            <AdminLayout>
                <div className="relative flex h-screen content-center items-center justify-center pt-16 pb-32">
                    <div
                        className="absolute top-0 h-full w-full bg-[url(/public/assets/ponpes-hidayatullah-landing.webp)] bg-cover bg-center"/>
                    <div className="absolute top-0 h-full w-full bg-black/75 bg-cover bg-center"/>
                    <div className="max-w-8xl container relative mx-auto">
                        <div className="flex flex-wrap items-center">
                            <div className="ml-auto mr-auto w-full px-4 text-center lg:w-8/12">
                                <Typography
                                    variant="h1"
                                    color="white"
                                    className="mb-6 font-black"
                                    placeholder=""
                                >
                                    "Strive for Progress, not Perfection."
                                </Typography>
                                <Typography variant="lead" color="white" className="opacity-80" placeholder="">
                                    - Dave Gray Teach Codes
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
                                    <Card key={ index }
                                          className={ `rounded-lg shadow-md shadow-zinc-500 ${ index === 1 ? 'order-last lg:order-none md:translate-x-1/2 lg:translate-x-0' : '' }` }
                                          placeholder="">
                                        <CardBody className="px-8 text-center" placeholder="">
                                            <IconButton
                                                variant="gradient"
                                                size="lg"

                                                className="pointer-events-none mb-6 rounded-full"
                                                placeholder=""
                                            >
                                                <Coffee width={ feature.iconWidth ?? 25 }/>
                                            </IconButton>
                                            <Typography variant="h5" className="mb-2" color="blue-gray" placeholder="">
                                                { feature.title }
                                            </Typography>
                                            <Typography className="font-normal text-blue-gray-600" placeholder="">
                                                { feature.description }
                                            </Typography>
                                        </CardBody>
                                    </Card>
                                ))
                            }
                        </div>  <div className="grid grid-cols-1 gap-x-6 md:grid-cols-2 lg:grid-cols-3 gap-y-7">
                            {
                                FeaturedData.map((feature, index) => (
                                    <Card key={ index }
                                          className={ `rounded-lg shadow-md shadow-zinc-500 ${ index === 1 ? 'order-last lg:order-none md:translate-x-1/2 lg:translate-x-0' : '' }` }
                                          placeholder="">
                                        <CardBody className="px-8 text-center" placeholder="">
                                            <IconButton
                                                variant="gradient"
                                                size="lg"

                                                className="pointer-events-none mb-6 rounded-full"
                                                placeholder=""
                                            >
                                                <Coffee width={ feature.iconWidth ?? 25 }/>
                                            </IconButton>
                                            <Typography variant="h5" className="mb-2" color="blue-gray" placeholder="">
                                                { feature.title }
                                            </Typography>
                                            <Typography className="font-normal text-blue-gray-600" placeholder="">
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
            </AdminLayout>
        </>
    );
}

export default Home;
