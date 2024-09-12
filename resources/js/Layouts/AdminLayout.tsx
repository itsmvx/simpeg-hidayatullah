import { ReactNode } from "react";
import { Footer } from "@/Components/Footer";
import { Card } from "@material-tailwind/react";
import { ToastContainer } from "react-toastify";
import 'react-toastify/dist/ReactToastify.css';
import { PageProps } from "@/types";
import { AdminNavbar } from "@/Components/Admin/AdminNavbar";

export const AdminLayout = ({ auth, children }: PageProps<{
    children: ReactNode;
}>) => {

    return (
        <>
            <div className="min-h-screen p-5 flex flex-col gap-2 bg-blue-gray-50/50">
                <AdminNavbar auth={auth} />
                <Card className="mt-1 flex-1 p-5">
                    { children }
                </Card>
                <Footer />
            </div>
            <ToastContainer />
        </>
    );
}
