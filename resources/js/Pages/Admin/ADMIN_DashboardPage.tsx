import { Head, Link, router } from "@inertiajs/react";
import { MasterLayout } from "@/Layouts/MasterLayout";
import { Card, CardHeader, CardBody, Typography, IconButton, CardFooter, Button } from "@material-tailwind/react";
import { PageProps } from "@/types";
import {
    ExternalLink,
    Newspaper,
    UserRound,
} from "lucide-react";
import { format } from "date-fns";
import { id } from "date-fns/locale";
import { AdminLayout } from "@/Layouts/AdminLayout";

type CountAndLastUpdate = {
    count: number;
    lastUpdate: string | null;
};
type Props = {
    pegawai: CountAndLastUpdate;
    rekapPegawai: CountAndLastUpdate;
}
export default function ADMIN_DashboardPage({ auth, pegawai, rekapPegawai }: PageProps<Props>) {

    const cardData = [
        {
            title: "Pegawai",
            description: "Pegawai terdaftar",
            icon: <UserRound />,
            link: route('admin.pegawai.index'),
            count: pegawai.count,
            lastUpdate: pegawai.lastUpdate
        },
        {
            title: "Rekap kepegawaian",
            description: "Rekap Pegawai belum terverifikasi",
            icon: <Newspaper />,
            link: route('admin.rekap-pegawai.index'),
            count: rekapPegawai.count,
            lastUpdate: rekapPegawai.lastUpdate
        },
    ];

    return (
        <>
            <Head title="Admin - Dashboard" />
            <AdminLayout auth={auth}>
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
            </AdminLayout>
        </>
    )
}
