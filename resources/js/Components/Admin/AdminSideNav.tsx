import {
    Button,
    IconButton,
    Typography,
} from "@material-tailwind/react";
import { Link, usePage } from "@inertiajs/react";
import { X } from "lucide-react";
import { Dispatch, ReactNode, SetStateAction } from "react";

export const AdminSideNav = ({ open, setOpen, brandImg, brandName, routes }: {
    open: boolean;
    setOpen: Dispatch<SetStateAction<boolean>>;
    brandImg?: ImageData;
    brandName: string;
    routes: any;
}) => {
    const { url }: { url: string } = usePage();

    return (
        <aside className={`bg-white dark:bg-gradient-to-br from-gray-800 to-gray-900 shadow-sm ${ open ? "translate-x-0" : "-translate-x-80" } fixed inset-0 z-50 my-4 ml-4 h-[calc(100vh-32px)] w-64 rounded-xl transition-transform duration-300 xl:translate-x-0 border border-blue-gray-100`}>
            <div className={`relative`}>
                <Typography
                    variant="h6"
                    color={"blue-gray"}
                    className="py-6 px-8 text-center select-none"
                >
                    {brandName}
                </Typography>
                <Button
                    variant="text"
                    size="sm"
                    color="red"
                    ripple={false}
                    className="group absolute z-10 right-0 top-0 grid rounded-br-none rounded-tl-none lg:hidden"
                    onClick={() => setOpen(false)}
                >
                    <X className="h-5 w-5 text-gray-500 group-hover:text-red-600" />
                </Button>
            </div>
            <div className="m-4">
                {routes.map(({ layout, title, pages }: {
                    layout: string;
                    title: string;
                    pages: { icon: string,  name: string, path: string, element: ReactNode }[]
                }, key: number) => (
                    <ul key={key} className="mb-4 flex flex-col gap-1">
                        {title && (
                            <li className="mx-3.5 mt-4 mb-2">
                                <Typography variant="small" color={"blue-gray"} className="font-black uppercase opacity-75">
                                    {title}
                                </Typography>
                            </li>
                        )}
                        {pages.map(({ icon, name, path }) => (
                            <li key={name}>
                                <Link href={ `/${ layout }${ path}`} className={url === '/users' ? 'active' : ''}>
                                    <Button>Filled</Button>
                                </Link>
                            </li>
                        ))}
                    </ul>
                ))}
            </div>
        </aside>
    );
}
