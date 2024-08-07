import { Dispatch, SetStateAction, useEffect, useState } from "react";
import {
    Avatar,
    Breadcrumbs,
    Button,
    Collapse,
    IconButton,
    Menu,
    MenuHandler, MenuItem, MenuList,
    Navbar,
    Typography
} from "@material-tailwind/react";
import { X, Menu as MenuIcon, Home, ChevronDown, CircleUserRound, LogOut } from "lucide-react";
import { Link, router } from "@inertiajs/react";
import { HarunaPP, PPHLogo } from "@/Lib/StaticImages";
import axios, { AxiosError } from "axios";
import { notifyToast } from "@/Lib/Utils";
import { useTheme } from "@/Hooks/useTheme";
import { AdminLoadingOverlay } from "@/Components/Admin/AdminLoadingOverlay";
import { AdminUnitNavbarLists } from "@/Fragments/AdminUnitNavbarList";

export const AdminUnitNavbar = () => {
    const { theme } = useTheme();
    const [openNavbar, setOpenNavbar] = useState(false);
    const [onFetchLogout, setFetchLogout] = useState(false);
    const pathNames = window.location.pathname.split("/").filter((path) => Boolean(path));
    const handleLogout = () => {
        setFetchLogout(true);
        axios.post(route('auth.logout'))
            .then(() => {
                router.visit(route('master.login'));
            })
            .catch((err: unknown) => {
                const errMsg = err instanceof AxiosError
                    ? err.response?.data.message
                    : 'Error tidak diketahui terjadi!';
                notifyToast('error', errMsg, theme as 'light' | 'dark');
                setFetchLogout(false);
            });
    };
    useEffect(() => {
        const handleResize = () => {
            window.innerWidth >= 960 && setOpenNavbar(false);
        };
        window.addEventListener("resize", handleResize);

        return () => window.removeEventListener("resize", handleResize);
    }, []);

    return (
        <>
            <Navbar className="mx-auto w-full px-4 py-2 sticky top-0 z-20">
                <div className="flex items-center justify-between text-blue-gray-900">
                    <Breadcrumbs className="bg-transparent p-0 transition-all mt-1 capitalize">
                        <Home width={18} />
                        {
                            pathNames.map((path) => ((
                                <Link key={path} href={path}>
                                    {path}
                                </Link>
                            )))
                        }
                    </Breadcrumbs>
                    <div className="hidden lg:block">
                        <AdminUnitNavbarLists />
                    </div>
                    <div className="hidden gap-2 lg:flex">
                        <Menu>
                            <MenuHandler>
                                <Button
                                    variant="text"
                                    color="blue-gray"
                                    ripple={false}
                                    className="group flex flex-row items-center justify-between min-w-40"
                                >
                                    <Typography variant="h6" className="capitalize">
                                        Orang
                                    </Typography>
                                    <div className="flex items-center">
                                        <CircleUserRound className="h-5 w-5 text-blue-gray-500" />
                                        <ChevronDown width={18} className="group-aria-expanded:rotate-0 rotate-180 transition-rotate duration-150" />
                                    </div>
                                </Button>
                            </MenuHandler>
                            <MenuList className="w-max border-0">
                                <MenuItem className="flex items-center gap-3 w-60">
                                    <Avatar src={PPHLogo} size="sm" />
                                    <Typography
                                        variant="small"
                                        color="blue-gray"
                                        className="mb-1 font-normal"
                                    >
                                        Akun
                                    </Typography>
                                </MenuItem>
                                <MenuItem
                                    className="hover:!bg-red-50/80 hover:!text-red-600 group w-full h-full flex items-center gap-1 p-3"
                                    onClick={handleLogout}
                                >
                                    <LogOut />
                                    <Typography
                                        variant="small"
                                        className="w-full font-normal"
                                    >
                                        Keluar
                                    </Typography>
                                </MenuItem>
                            </MenuList>
                        </Menu>
                    </div>
                    <IconButton variant="text" color="blue-gray" className="lg:hidden" onClick={() => setOpenNavbar(!openNavbar)}>
                        {openNavbar ? <X className="h-6 w-6" strokeWidth={2} /> : <MenuIcon className="h-6 w-6" strokeWidth={2} />}
                    </IconButton>
                </div>
                <Collapse open={openNavbar}>
                    <AdminUnitNavbarLists />
                    <div className="flex w-full flex-nowrap items-center justify-end gap-2 lg:hidden">
                        <Menu>
                            <MenuHandler>
                                <Button
                                    variant="text"
                                    color="blue-gray"
                                    ripple={false}
                                    className="group flex flex-row items-center justify-end w-40 gap-2"
                                >
                                    <span>
                                        ORANG
                                    </span>
                                    <div className="flex">
                                        <Avatar src={HarunaPP} size="sm" />
                                        <ChevronDown width={18} className="group-aria-expanded:rotate-180 rotate-0 transition-rotate duration-150" />
                                    </div>
                                </Button>
                            </MenuHandler>
                            <MenuList className="w-max border-0">
                                <MenuItem className="flex items-center gap-3">
                                    <Avatar src={HarunaPP} size="sm" />
                                    <Typography
                                        variant="small"
                                        color="blue-gray"
                                        className="mb-1 font-normal"
                                    >
                                        Akun
                                    </Typography>
                                </MenuItem>
                                <MenuItem className="flex items-center gap-3 group hover:!bg-red-50/80" onClick={handleLogout}>
                                    <LogOut className="group-hover:text-red-600" />
                                    <Typography
                                        variant="small"
                                        color="blue-gray"
                                        className="mb-1 font-normal group-hover:text-red-600"
                                    >
                                        Keluar
                                    </Typography>
                                </MenuItem>
                            </MenuList>
                        </Menu>
                    </div>
                </Collapse>
            </Navbar>
            {
                onFetchLogout && (<AdminLoadingOverlay />)
            }
        </>
    );
};
