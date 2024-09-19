import { AdminNavbar } from "@/Components/Admin/AdminNavbar";
import { MasterNavbar } from "@/Components/Master/MasterNavbar";
import { PegawaiNavbar } from "@/Components/Pegawai/PegawaiNavbar";
import { Button, Navbar as MTNavbar } from "@material-tailwind/react";
import { router } from "@inertiajs/react";
import { LogIn } from "lucide-react";
import { memo } from "react";
import { PageProps } from "@/types";

const Navbar = ({ auth }: PageProps) => {
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
            <MTNavbar className="mx-auto !max-w-full px-4 py-2 sticky top-0 z-50 !rounded-none !backdrop-filter-none !bg-opacity-100">
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
            </MTNavbar>
        </>
    )
};

export default memo(Navbar);
