import { ReactNode } from "react";

import { AdminFooter } from "@/Components/Admin/AdminFooter";
import { Card } from "@material-tailwind/react";
import { ToastContainer } from "react-toastify";
import 'react-toastify/dist/ReactToastify.css';
import { AdminUnitNavbar } from "@/Components/Admin/AdminUnitNavbar";

export const AdminUnitLayout = ({ children }: {
    children: ReactNode;
}) => {

    return (
        <>
            <div className="min-h-screen p-5 flex flex-col gap-2 bg-blue-gray-50/50">
                <AdminUnitNavbar />
                <Card className="mt-1 flex-1 p-5">
                    {children}
                </Card>
                <AdminFooter brandName="Simpeg" brandLink={import.meta.env.VITE_APP_URL as string} />
            </div>
            <ToastContainer />
        </>
    );
}
