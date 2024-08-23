import { useEffect, useState } from "react";
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
import { X, Menu as MenuIcon, Home, ChevronDown, CircleUserRound, LogOut, LogIn } from "lucide-react";
import { MasterNavbarLists } from "@/Fragments/MasterNavbarLists";
import { Link, router } from "@inertiajs/react";
import { HarunaPP, PPHLogo } from "@/Lib/StaticImages";
import axios, { AxiosError } from "axios";
import { notifyToast } from "@/Lib/Utils";
import { useTheme } from "@/Hooks/useTheme";
import { AdminLoadingOverlay } from "@/Components/Admin/AdminLoadingOverlay";
import { PageProps } from "@/types";

export const MasterNavbar = ({ auth }: PageProps) => {
    const { theme } = useTheme();
    const [ openNavbar, setOpenNavbar ] = useState(false);
    const [ onFetchLogout, setFetchLogout ] = useState(false);
    const pathNames = window.location.pathname.split("/").filter((path) => Boolean(path));
    const handleLogout = () => {
        setFetchLogout(true);
        axios.post(route('auth.logout'))
            .then(() => {
                router.visit('/', { replace: true });
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
            <Navbar className="mx-auto w-full px-4 py-2 sticky top-0 z-50">
                <div className="flex items-center justify-between text-blue-gray-900">
                    <Breadcrumbs className="bg-transparent p-0 transition-all mt-1 capitalize">
                        <IconButton variant="text" disabled={route().current() === 'master.dashboard'} onClick={() => router.visit(route('master.dashboard'))}>
                            <Home width={18} />
                        </IconButton>
                        {pathNames.map((path, index) => {
                            const currentPath = `/${pathNames.slice(0, index + 1).join('/')}`;
                            if (index !== 0) {
                                return (
                                    <Link as="button" key={currentPath} href={currentPath} disabled={currentPath === window.location.pathname}>
                                        {path.charAt(0).toUpperCase() + path.slice(1)}
                                    </Link>
                                );
                            }
                        })}
                    </Breadcrumbs>
                    <div className="hidden lg:block">
                        <MasterNavbarLists />
                    </div>
                    <div className="hidden gap-2 lg:flex">
                        {
                            auth?.user
                                ? (
                                    <Menu placement="bottom-start" offset={{ crossAxis: 18, mainAxis: 10 }}>
                                        <MenuHandler>
                                            <Button
                                                variant="text"
                                                color="blue-gray"
                                                ripple={false}
                                                className="group flex flex-row items-center justify-between"
                                            >
                                                <Typography variant="h6" className="capitalize">
                                                    { auth?.user ? auth.user.nama : 'User' }
                                                </Typography>
                                                <div className="flex items-center">


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
                                ) : (
                                    <Button
                                        variant="filled"
                                        color="gray"
                                        onClick={() => router.visit(route('auth.login'))}
                                        className="!shadow-none flex items-center justify-center gap-1 min-h-3.5"
                                    >
                                        Masuk
                                        <LogIn />
                                    </Button>
                                )
                        }
                    </div>
                    <IconButton variant="text" color="blue-gray" className="lg:hidden" onClick={() => setOpenNavbar(!openNavbar)}>
                        {openNavbar ? <X className="h-6 w-6" strokeWidth={2} /> : <MenuIcon className="h-6 w-6" strokeWidth={2} />}
                    </IconButton>
                </div>
                <Collapse open={openNavbar}>
                    <MasterNavbarLists />
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
