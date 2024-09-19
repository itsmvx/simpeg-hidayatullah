import { TriangleAlert } from "lucide-react";

export const AuthProfileSettings = () => {
    return (
        <>
            <p className="my-5 text-2xl font-medium">
                DALAM PENGEMBANGAN
            </p>
            <div className="mb-10">
                <div className="flex items-center gap-1.5">
                    <p className="py-2 text-xl font-semibold">Informasi</p>
                    <TriangleAlert/>
                </div>
                <ul className="space-y-0.5 list-disc list-inside text-sm">
                    <li>
                        Admin tidak pernah meminta informasi mengenai NIP, Username atau Password akun anda
                    </li>
                    <li>
                        Anda dapat menghubungi Admin Personalia apabila anda lupa password akun untuk dilakukan
                        penyetelan ulang password
                    </li>
                </ul>
            </div>
        </>
    );
};
