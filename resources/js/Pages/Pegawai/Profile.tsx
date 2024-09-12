import { Head, router } from "@inertiajs/react";
import { Card, IconButton, Typography, Tooltip } from "@material-tailwind/react";
import { MoveLeft, Pencil } from "lucide-react";
import { ChangeEvent, useState } from "react";
import "react-day-picker/dist/style.css";
import type { PageProps } from "@/types";
import { calculateDatePast, notifyToast } from "@/Lib/Utils";
import axios, { AxiosProgressEvent } from "axios";
import { toast } from "react-toastify";
import { MenAvatar, WomenAvatar } from "@/Lib/StaticImages";
import { id } from "date-fns/locale";
import { format } from "date-fns";
import { PegawaiLayout } from "@/Layouts/PegawaiLayout";
import UpdatePasswordForm from "@/Components/Pegawai/UpdatePasswordForm";
import { Pegawai } from "@/types/models";

export default function Profile({ auth, pegawai, currDate }: PageProps<{
    pegawai: Pegawai;
    currDate: string;
}>) {
    const [onLoadImage, setOnLoadImage] = useState(false);

    const handleImageChange = (e: ChangeEvent<HTMLInputElement>) => {
        if (e.target.files && e.target.files.length > 0) {
            const file = e.target.files[0];
            if (file && file.size > 2 * 1024 * 1024) {
                notifyToast('error', 'Ukuran file maksimal adalah 2MB!');
                return;
            }
            const formData = new FormData();
            formData.append('image', file);
            formData.append('id', pegawai.id);
            const id = toast.loading("Mengunggah Foto...");
            axios.post(route('pegawai.upload-foto'), formData, {
                onUploadProgress: (p: AxiosProgressEvent) => {
                    const progress: number = p.loaded / (p.total ?? 100);
                    toast.update(id, { type: "info", isLoading: true, progress: progress });
                }
            })
                .then(() => {
                    setOnLoadImage(true);
                    router.reload({ only: ['pegawai'] });
                    notifyToast('success', 'Berhasil mengunggah foto');
                })
                .catch(() => {
                    notifyToast('error', 'Gagal mengunggah foto')
                });
        }
    };

    return (
        <>
            <Head title="Form Pegawai" />
            <PegawaiLayout auth={auth}>
                <main className="w-full min-h-screen bg-gray-50 space-y-4">
                    <Card className="w-full px-6 pt-5">
                        <Tooltip content="Kembali">
                            <IconButton variant="text" onClick={() => router.visit(route('pegawai.dashboard'))}>
                                <MoveLeft />
                            </IconButton>
                        </Tooltip>
                        <div className="mx-auto relative">
                            <div className="rounded-full flex items-center justify-center w-44 h-44 overflow-hidden border-4 border-pph-black/70">
                                <img
                                    src={pegawai.foto ? `/storage/${pegawai.foto}` : pegawai.jenis_kelamin === 'Laki-Laki' ? MenAvatar : WomenAvatar}
                                    alt={pegawai.foto ? `${pegawai.nama}-profil` : 'no-pict'}
                                    width={pegawai.foto ? 200 : 200}
                                    className="object-cover object-center mx-auto"
                                    onLoad={() => setOnLoadImage(false)}
                                />
                                <div
                                    className={`${onLoadImage ? 'absolute' : 'hidden'} absolute inset-0 flex items-center justify-center bg-gray-300/85 rounded-full`}>
                                    <span className="animate-spin border-4 border-l-transparent border-gray-700/80 rounded-full w-10 h-10 inline-block align-middle m-auto"></span>
                                </div>
                            </div>
                            <div className="absolute w-7 h-7 top-0 -right-8">
                                <div className="relative">
                                    <label htmlFor="file-input" className="w-full h-full cursor-pointer">
                                        <Pencil width={25} />
                                    </label>
                                    <input
                                        id="file-input"
                                        type="file"
                                        accept="image/*"
                                        className="absolute hidden inset-0 w-7 h-7 opacity-0 !cursor-pointer z-30 text-sm text-stone-500 file:mr-5 file:py-1 file:px-3 file:border-[1px] file:text-xs file:font-medium file:bg-stone-50 file:text-stone-700 hover:file:cursor-pointer hover:file:bg-blue-50 hover:file:text-blue-700"
                                        onChange={handleImageChange}
                                    />
                                </div>
                            </div>
                        </div>
                        <Typography className="mt-5 flex flex-col text-sm text-center font-medium">
                            Promosi terakhir : { pegawai.tanggal_promosi ? format(pegawai.tanggal_promosi, 'PPP', { locale: id }) : '-' }
                            <span className="italic">
                                &nbsp;( { pegawai.tanggal_promosi ? `${calculateDatePast(new Date(pegawai.tanggal_promosi), new Date())} hari lalu` : 'belum ada keterangan' } )
                            </span>
                        </Typography>
                    </Card>
                    <Card className="w-full px-7 pt-5 mt-5 mb-5">
                        <UpdatePasswordForm />
                    </Card>
                </main>
            </PegawaiLayout>
        </>
    );
}
