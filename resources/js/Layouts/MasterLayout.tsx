import { ReactNode } from "react";
import { MasterNavbar } from "@/Components/Admin/MasterNavbar";
import { Footer } from "@/Components/Footer";
import { Card } from "@material-tailwind/react";
import { ToastContainer } from "react-toastify";
import 'react-toastify/dist/ReactToastify.css';
import { PageProps } from "@/types";
import { ErrorBoundary } from "react-error-boundary";

export const MasterLayout = ({ auth, children }: PageProps<{
    children: ReactNode;
}>) => {

    return (
        <>
            <ErrorBoundary fallback={ <div>Something went wrong</div> }>
                <div className="min-h-screen p-5 flex flex-col gap-2 bg-blue-gray-50/50">
                    <MasterNavbar auth={ auth }/>
                    <Card className="mt-1 flex-1 p-5">
                        { children }
                    </Card>
                    <Footer/>
                </div>
            </ErrorBoundary>

            <ToastContainer/>
        </>
    );
}
