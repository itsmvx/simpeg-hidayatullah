import { ReactNode, useEffect, useState } from "react";
import { Home } from "lucide-react";
import { AdminSideNav } from "@/Components/Admin/AdminSideNav";
import { AdminNavbar } from "@/Components/Admin/AdminNavbar";
import { AdminFooter } from "@/Components/Admin/AdminFooter";
import { Card } from "@material-tailwind/react";
import { ToastContainer } from "react-toastify";
import 'react-toastify/dist/ReactToastify.css';

export const AdminLayout = ({ children }: {
    children: ReactNode;
}) => {

    const [ openSideNav, setOpenSideNav ] = useState<boolean>(false);
    const icon = {
        className: "w-5 h-5 text-inherit",
    };
    const routes = [
        {
            layout: "dashboard",
            pages: [
                {
                    icon: <Home {...icon} />,
                    name: "dashboard",
                    path: "/home",
                    element: <Home />,
                },
                {
                    icon: <Home {...icon} />,
                    name: "profile",
                    path: "/profile",
                    element: <Home />,
                },
                {
                    icon: <Home {...icon} />,
                    name: "tables",
                    path: "/tables",
                    element: <Home />,
                },
                {
                    icon: <Home {...icon} />,
                    name: "notifications",
                    path: "/notifications",
                    element: <Home />,
                },
            ],
        },
        {
            title: "auth pages",
            layout: "auth",
            pages: [
                {
                    icon: <Home {...icon} />,
                    name: "sign in",
                    path: "/sign-in",
                },
                {
                    icon: <Home {...icon} />,
                    name: "sign up",
                    path: "/sign-up",
                },
            ],
        },
    ];

    useEffect(() => {
        const handleResize = () => {
            window.innerWidth >= 960 && setOpenSideNav(false);
        };
        window.addEventListener('resize', handleResize);

        return () => window.removeEventListener('resize', handleResize);
    }, []);

    return (
        <>
            <div className="min-h-screen p-5 flex flex-col gap-2 bg-blue-gray-50/50">
                <AdminNavbar openSideNav={ openSideNav } setOpenSideNav={ setOpenSideNav }/>
                <Card className="mt-1 flex-1 p-5">
                    { children }
                </Card>
                <AdminFooter brandName="Simpeg" brandLink={import.meta.env.VITE_APP_URL as string}/>
            </div>
            <ToastContainer />
        </>
    );
}
