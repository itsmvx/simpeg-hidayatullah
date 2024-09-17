import { Head, router } from "@inertiajs/react";
import { Card, CardHeader, CardBody, Typography, CardFooter, Button } from "@material-tailwind/react";
import { PageProps } from "@/types";
import {
    ExternalLink,
    Newspaper,
    UserRound,
} from "lucide-react";
import { format } from "date-fns";
import { id } from "date-fns/locale";
import { AdminLayout } from "@/Layouts/AdminLayout";
import { WorkSpaceIcon } from "@/Lib/StaticIcons";

type CountAndLastUpdate = {
    count: number;
    lastUpdate: string | null;
};
type Props = {
    pegawai: CountAndLastUpdate;
    pengajuanPromosi: CountAndLastUpdate;
    rekapPegawai: CountAndLastUpdate;
}
export default function ADMIN_DashboardPage({ auth, pegawai, pengajuanPromosi, rekapPegawai }: PageProps<Props>) {

    const cardData = [
        {
            title: "Pegawai",
            description: "Pegawai terdaftar",
            icon: <UserRound color="black"/>,
            link: route('admin.pegawai.index'),
            count: pegawai.count,
            lastUpdate: pegawai.lastUpdate
        },
        {
            title: "Rekap kepegawaian",
            description: "Rekap Pegawai belum terverifikasi",
            icon: <Newspaper color="black"/>,
            link: route('admin.rekap-pegawai.index'),
            count: rekapPegawai.count,
            lastUpdate: rekapPegawai.lastUpdate
        },
        {
            title: "Pengajuan Promosi",
            description: "Pengajuan Promosi masih menunggu",
            icon: <WorkSpaceIcon width={25} color="black"/>,
            link: route('admin.pengajuan-promosi.index'),
            count: pengajuanPromosi.count,
            lastUpdate: pengajuanPromosi.lastUpdate
        },
    ];

    return (
        <>
            <Head title="Admin - Dashboard" />
            <AdminLayout auth={auth}>
                <section className="mb-1 grid gap-y-10 gap-x-6 md:grid-cols-2 xl:grid-cols-4">
                    { cardData.map(({ icon, title, description, count, lastUpdate, link }) => (
                        <Card key={title} className="border border-green-200 shadow-lg">
                            <CardHeader
                                variant="gradient"
                                color="gray"
                                floated={ false }
                                shadow={ false }
                                className="absolute grid h-12 w-12 place-items-center bg-gradient-to-tr from-green-500 via-green-300 to-white shadow-xl"
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
                                    className="!py-1.5 !px-3 flex flex-row gap-2.5 items-center justify-center !rounded-xl !shadow-none !text-xs font-semibold font-sans !border-gray-400/90 hover:!border-green-500 hover:!border-2 transition-none"
                                    onClick={() => router.visit(link)}
                                >
                                    Kelola
                                    <ExternalLink  width={18} />
                                </Button>
                            </CardFooter>
                        </Card>
                    )) }
                </section>
            </AdminLayout>
        </>
    )
}
