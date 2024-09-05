import { Head, router } from "@inertiajs/react";
import { Card, Typography, Tooltip, IconButton } from "@material-tailwind/react";
import { CircleAlert, MoveLeft } from "lucide-react";
import "react-day-picker/dist/style.css";
import { IDNamaColumn, PageProps } from "@/types";
import { Input } from "@/Components/Input";
import { TextArea } from "@/Components/TextArea";
import { PegawaiLayout } from "@/Layouts/PegawaiLayout";

type RekapPegawai = {
    id: string;
    amanah: string;
    organisasi: string;
    gaji: number;
    skill_manajerial: string;
    skill_leadership: string;
    raport_profesi: string;
    kedisiplinan: string;
    ketuntasan_kerja: string;
    catatan_negatif: string;
    prestasi: string;
    pegawai_id: string;
    unit_id: string;
    rekap_id: string;
    golongan_id: string;
    status_pegawai_id: string;
    marhalah_id: string;
    periode_rekap_id: string;
    pegawai: IDNamaColumn | null;
    unit: IDNamaColumn | null;
    status_pegawai: IDNamaColumn | null;
    marhalah: IDNamaColumn | null;
    golongan: IDNamaColumn | null;
    periode_rekap: IDNamaColumn;
};

export default function ADMIN_RekapPegawaiDetailsPage({ auth, rekap }: PageProps<{
    rekap: RekapPegawai
}>) {

    return (
        <>
            <Head title={ `Pegawai - Rekap Pegawai ${rekap.periode_rekap?.nama ?? ''}` }/>
            <PegawaiLayout auth={auth}>
                <main className="w-full min-h-screen bg-gray-50">
                    <header className="px-6 py-2 bg-white border-b-2">
                        <Typography className="flex justify-items-center gap-1.5 font-semibold text-lg">
                            <span>
                                <CircleAlert/>
                            </span>
                            Informasi
                        </Typography>
                        <ul className="list-disc list-inside px-2 font-medium text-sm">
                            <li>Rekap Pegawai dilaporkan oleh Admin Unit ke Personalia</li>
                            <li>Informasi Golongan, Marhalah dan Status Pegawai dapat diperbarui oleh admin Personalia</li>
                            <li>Untuk mengubah opsi diatas, silahkan hubungi admin Personalia</li>
                        </ul>
                    </header>
                    <Card className="w-full px-6 !shadow-none">
                        <Tooltip content="Kembali">
                            <IconButton variant="text" onClick={() => router.visit(route('pegawai.rekap-pegawai.index'))} className="mt-2 mb-4">
                                <MoveLeft />
                            </IconButton>
                        </Tooltip>
                        <form className="grid grid-cols-1 lg:grid-cols-2 gap-x-6 gap-y-4 p-5">
                            <Input
                                type="text"
                                color="teal"
                                label="Periode Rekap"
                                name="periode_rekap"
                                value={ rekap.periode_rekap.nama }
                                readOnly
                            />
                            <Input
                                type="text"
                                color="teal"
                                label="Unit"
                                name="unit"
                                value={ rekap.unit?.nama ?? 'Unit terhapus' }
                                className={ rekap.unit ? 'font-normal' : 'font-semibold italic text-sm' }
                                readOnly
                            />
                            <Input
                                type="text"
                                color="teal"
                                label="Pegawai"
                                name="pegawai"
                                value={ rekap.pegawai?.nama ?? 'Pegawai terhapus' }
                                className={ rekap.pegawai ? 'font-normal' : 'font-semibold italic text-sm' }
                                readOnly
                            />
                            <Input
                                type="text"
                                color="teal"
                                label="Golongan"
                                name="golongan"
                                value={ rekap.golongan?.nama ?? 'Golongan terhapus' }
                                className={ rekap.golongan ? 'font-normal' : 'font-semibold italic text-sm' }
                                readOnly
                            />
                            <Input
                                type="text"
                                color="teal"
                                label="Marhalah"
                                name="marhalah"
                                value={ rekap.marhalah?.nama ?? 'Marhalah terhapus' }
                                className={ rekap.marhalah ? 'font-normal' : 'font-semibold italic text-sm' }
                                readOnly
                            />
                            <Input
                                type="text"
                                color="teal"
                                label="Status Pegawai"
                                name="amanah"
                                value={ rekap.status_pegawai?.nama ?? 'Status Pegawai terhapus' }
                                className={ rekap.status_pegawai ? 'font-normal' : 'font-semibold italic text-sm' }
                                readOnly
                            />
                            <Input
                                type="text"
                                color="teal"
                                label="Amanah Profesi"
                                name="amanah"
                                value={ rekap.amanah }
                                readOnly
                            />
                            <Input
                                type="text"
                                color="teal"
                                label="Amanah Organisasi"
                                name="organisasi"
                                value={ rekap.organisasi ?? '-' }
                                readOnly
                            />
                            <Input
                                type="number"
                                color="teal"
                                label="Gaji"
                                name="gaji"
                                value={ rekap.gaji }
                                readOnly
                            />
                            <Input
                                type="text"
                                color="teal"
                                label="Ketuntasan Kerja"
                                name="ketuntasan_kerja"
                                value={ rekap.ketuntasan_kerja }
                                readOnly
                            />
                            <TextArea
                                color="teal"
                                label="Kedisiplinan"
                                name="kedisiplinan"
                                value={ rekap.kedisiplinan }
                                readOnly
                            />
                            <TextArea
                                color="teal"
                                label="Rapor Profesi"
                                name="raport_profesi"
                                value={ rekap.raport_profesi }
                                readOnly
                            />
                            <TextArea
                                label="Skill Manajerial"
                                color="teal"
                                name="skill_manajerial"
                                value={ rekap.skill_manajerial ?? '-' }
                                readOnly
                            />
                            <TextArea
                                label="Skill Leadership"
                                color="teal"
                                name="skill_leadership"
                                value={ rekap.skill_leadership ?? '' }
                                readOnly
                            />
                            <TextArea
                                label="Catatan Negatif"
                                color="teal"
                                name="catatan_negatif"
                                value={ rekap.catatan_negatif ?? '' }
                                readOnly
                            />
                            <TextArea
                                label="Prestasi (tidak wajib diisi)"
                                color="teal"
                                name="prestasi"
                                value={ rekap.prestasi ?? '' }
                                readOnly
                            />
                        </form>
                    </Card>
                </main>
            </PegawaiLayout>
        </>
    );
}
