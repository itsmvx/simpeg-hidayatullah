import { ErrorBoundary } from "react-error-boundary";
import { Card } from "@material-tailwind/react";
import { Footer } from "@/Components/Footer";
import { ToastContainer } from "react-toastify";
import { PageProps } from "@/types";
import { ReactNode } from "react";
import UniversalNavbar from "@/Components/UniversalNavbar";

export const UniversalLayout = ({ auth, children }: PageProps<{
    children: ReactNode
}>) => {

    return (
        <>
            <ErrorBoundary fallback={ <div>Something went wrong</div> }>
                <div className="min-h-screen p-5 flex flex-col gap-2 bg-blue-gray-50/50">
                    <UniversalNavbar auth={ auth }/>
                    <Card className="mt-1 flex-1 p-5">
                        { children }
                    </Card>
                    <Footer/>
                </div>
            </ErrorBoundary>

            <ToastContainer/>
        </>
    )
};
