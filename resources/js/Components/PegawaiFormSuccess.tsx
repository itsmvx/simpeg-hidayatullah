import { Button, Typography } from "@material-tailwind/react";
import { ArrowLeftFromLine, Download } from "lucide-react";
import { router } from "@inertiajs/react";

export default function PegawaiFormSuccess({ nama, nip, password }: {
    nama: string;
    nip: string;
    password: string;
}) {

    return (
        <>
            <div className="h-full my-3 flex flex-col items-start gap-4">
                <Typography
                    variant="h3"
                >
                    Pegawai berhasil ditambahkan ke Sistem!
                </Typography>
                <p className="text-base font-medium">
                    Silahkan unduh dokumen panduan untuk dibagikan ke Pegawai
                </p>
                <div className="flex flex-col lg:flex-row items-start lg:items-center gap-3">
                    <Button
                        className="!shadow-none"
                        size="sm"
                    >
                        <p className="flex items-center justify-center gap-2">
                            Unduh  <Download/>
                        </p>
                    </Button>
                    <p className="text-sm text-gray-600 font-medium">
                        <span className="text-red-600">*</span>
                        Informasi mengenai Kredensial Login ke Sistem ada di halaman terakhir
                    </p>
                </div>
                <Button
                    onClick={() => router.visit(route('master.pegawai.index'))}
                    className="mx-auto flex items-center gap-2 mt-6"
                >
                    Kembali
                    <ArrowLeftFromLine />
                </Button>
            </div>
        </>
    )
}
