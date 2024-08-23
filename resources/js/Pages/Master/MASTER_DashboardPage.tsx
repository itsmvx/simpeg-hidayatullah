import { Head, Link, router } from "@inertiajs/react";
import { MasterLayout } from "@/Layouts/MasterLayout";
import { Card, CardHeader, CardBody, Typography, IconButton, CardFooter, Button } from "@material-tailwind/react";
import { PageProps } from "@/types";
import {
    Award,
    Building2,
    CalendarDays,
    CircleUserRound,
    ExternalLink,
    Newspaper,
    ShieldCheck,
    UserRound,
    UsersRound,
} from "lucide-react";
import { format } from "date-fns";
import { id } from "date-fns/locale";

type CountAndLastUpdate = {
    count: number;
    lastUpdate: string | null;
};
type Props = {
    unit: CountAndLastUpdate;
    golongan: CountAndLastUpdate;
    marhalah: CountAndLastUpdate;
    admin: CountAndLastUpdate;
    pegawai: CountAndLastUpdate;
    statusPegawai: CountAndLastUpdate;
    rekapPegawai: CountAndLastUpdate;
    periodeRekap: CountAndLastUpdate;
}
export default function MASTER_DashboardPage({ auth, unit, golongan, marhalah, admin, pegawai, statusPegawai, rekapPegawai, periodeRekap }: PageProps<Props>) {

    const cardData = [
        {
            title: "Unit",
            description: "Unit terdaftar",
            icon: <Building2 />,
            link: route('master.unit.index'),
            count: unit.count,
            lastUpdate: unit.lastUpdate
        },
        {
            title: "Golongan",
            description: "Golongan terdaftar",
            icon: <UsersRound />,
            link: route('master.golongan.index'),
            count: golongan.count,
            lastUpdate: golongan.lastUpdate
        },
        {
            title: "Marhalah",
            description: "Marhalah terdaftar",
            icon: <Award />,
            link: route('master.marhalah.index'),
            count: marhalah.count,
            lastUpdate: marhalah.lastUpdate
        },
        {
            title: "Admin",
            description: "Admin terdaftar",
            icon: <CircleUserRound />,
            link: route('master.admin.index'),
            count: admin.count,
            lastUpdate: admin.lastUpdate
        },
        {
            title: "Pegawai",
            description: "Pegawai terdaftar",
            icon: <UserRound />,
            link: route('master.pegawai.index'),
            count: pegawai.count,
            lastUpdate: pegawai.lastUpdate
        },
        {
            title: "Status Pegawai",
            description: "Status Pegawai terdaftar",
            icon: <ShieldCheck />,
            link: route('master.status-pegawai.index'),
            count: statusPegawai.count,
            lastUpdate: statusPegawai.lastUpdate
        },

        {
            title: "Rekap kepegawaian",
            description: "Rekap Pegawai belum terverifikasi",
            icon: <Newspaper />,
            link: route('master.rekap-pegawai.index'),
            count: rekapPegawai.count,
            lastUpdate: rekapPegawai.lastUpdate
        },
        {
            title: "Periode Rekap",
            description: "Periode Rekap yang dibuka",
            icon: <CalendarDays />,
            link: route('master.periode-rekap.index'),
            count: periodeRekap.count,
            lastUpdate: periodeRekap.lastUpdate
        },
    ];

    return (
        <>
            <Head title="Master - Dashboard" />
            <MasterLayout auth={auth}>
                <section className="mb-1 grid gap-y-10 gap-x-6 md:grid-cols-2 xl:grid-cols-4">
                    { cardData.map(({ icon, title, description, count, lastUpdate, link }) => (
                        <Card key={title} className="border border-blue-gray-100 shadow-sm">
                            <CardHeader
                                variant="gradient"
                                color="gray"
                                floated={ false }
                                shadow={ false }
                                className="absolute grid h-12 w-12 place-items-center"
                            >
                                { icon }
                            </CardHeader>
                            <CardBody className="p-4 text-left ml-20">
                                <Typography variant="small" className="font-normal text-blue-gray-900">
                                    { title }
                                </Typography>
                                <Typography variant="h4" color="blue-gray" className="flex items-center gap-1.5">
                                    { count }
                                    <span className="text-xs text-blue-gray-800 mt-1.5">
                                        { description }
                                    </span>
                                </Typography>
                                <p className="mt-2 flex flex-col text-xs text-blue-gray-900">
                                    Terakhir diperbarui:
                                    <span>
                                        {
                                            lastUpdate
                                                ? format(new Date(lastUpdate), 'PPPp', { locale: id })
                                                : '-'
                                        }
                                    </span>
                                </p>
                            </CardBody>
                            <CardFooter className="-mt-3">
                                <Button
                                    fullWidth
                                    variant="outlined"
                                    size="sm"
                                    className="!py-1.5 !px-3 flex flex-row gap-2.5 items-center justify-center !rounded-xl !shadow-none !text-xs font-semibold font-sans !border-gray-400/90"
                                    onClick={() => router.visit(link)}
                                >
                                    Kelola
                                    <ExternalLink  width={18} />
                                </Button>
                            </CardFooter>
                        </Card>
                    )) }
                </section>
            </MasterLayout>
        </>
    )
}
