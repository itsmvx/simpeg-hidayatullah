import { useEffect, useState } from "react";
import {
    Breadcrumbs,
    Button,
    Collapse,
    IconButton,
    Menu,
    MenuHandler, MenuItem, MenuList,
    Navbar,
    Typography
} from "@material-tailwind/react";
import { X, Menu as MenuIcon, Home, ChevronDown, LogOut, LogIn, UserRoundCog, LayoutDashboard } from "lucide-react";
import { Link, router } from "@inertiajs/react";
import axios, { AxiosError } from "axios";
import { notifyToast } from "@/Lib/Utils";
import { LoadingOverlay } from "@/Components/LoadingOverlay";
import { PageProps } from "@/types";
import { MasterNavbarLists } from "@/Fragments/MasterNavbarLists";

export const MasterNavbar = ({ auth }: PageProps) => {
    const [ openNavbar, setOpenNavbar ] = useState(false);
    const [ onFetchLogout, setFetchLogout ] = useState(false);
    const pathNames = window.location.pathname.split("/").filter((path) => Boolean(path));
    const handleLogout = () => {
        setFetchLogout(true);
        axios.post(route('auth.logout'))
            .then(() => {
                router.visit('/');
            })
            .catch((err: unknown) => {
                const errMsg = err instanceof AxiosError
                    ? err.response?.data.message
                    : 'Error tidak diketahui terjadi!';
                notifyToast('error', errMsg);
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
            <Navbar className="mx-auto w-full px-4 py-2 sticky top-0 z-50 shadow-xl backdrop-blur-md">
                <div className="flex items-center justify-between text-blue-gray-900">
                    <div className="w-56">
                        <Breadcrumbs className="bg-transparent p-0 transition-all mt-1 capitalize">
                            <IconButton variant="text" disabled={route().current() === 'master.dashboard'} onClick={() => router.visit(route('master.dashboard'))}>
                                <LayoutDashboard width={18} />
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
                    </div>
                    <div className="hidden lg:block">
                        <MasterNavbarLists />
                    </div>
                    <div className="hidden gap-2 lg:flex w-56">
                        {
                            auth?.user
                                ? (
                                    <Menu placement="bottom-start" offset={{ crossAxis: 18, mainAxis: 10 }}>
                                        <MenuHandler>
                                            <Button
                                                variant="text"
                                                color="blue-gray"
                                                ripple={false}
                                                className="group flex flex-row items-center justify-between min-w-40"
                                            >
                                                <Typography variant="h6" className="capitalize truncate">
                                                    { auth?.user ? auth.user.nama : 'User' }
                                                </Typography>
                                                <div className="flex items-center">
                                                    <ChevronDown width={18} className="group-aria-expanded:rotate-0 rotate-180 transition-rotate duration-150" />
                                                </div>
                                            </Button>
                                        </MenuHandler>
                                        <MenuList className="w-max border-0">
                                            <MenuItem className="flex items-center gap-3 w-60">
                                                <div className="w-8 aspect-square flex justify-items-center">
                                                    <UserRoundCog width={35} className="mx-auto mt-0.5" />
                                                </div>
                                                <Typography
                                                    variant="small"
                                                    color="blue-gray"
                                                    className="mb-1 font-normal"
                                                >
                                                    Akun
                                                </Typography>
                                            </MenuItem>
                                            <MenuItem
                                                className="hover:!bg-red-50/80 hover:!text-red-600 group w-full flex items-center gap-3"
                                                onClick={ handleLogout }
                                            >
                                                <div className="w-8 aspect-square flex justify-items-center">
                                                    <LogOut width={ 35 } className="mx-auto mt-0.5"/>
                                                </div>
                                                <Typography
                                                    variant="small"
                                                    className="w-full font-normal -mt-1"
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
                        {
                            auth?.user
                                ? (
                                    <Menu placement="bottom-start" offset={{ crossAxis: 18, mainAxis: 10 }}>
                                        <MenuHandler>
                                            <Button
                                                variant="text"
                                                color="blue-gray"
                                                ripple={false}
                                                className="group flex flex-row items-center justify-between min-w-40"
                                            >
                                                <Typography variant="h6" className="capitalize truncate">
                                                    { auth?.user ? auth.user.nama : 'User' }
                                                </Typography>
                                                <div className="flex items-center">
                                                    <ChevronDown width={18} className="group-aria-expanded:rotate-0 rotate-180 transition-rotate duration-150" />
                                                </div>
                                            </Button>
                                        </MenuHandler>
                                        <MenuList className="w-max border-0">
                                            <MenuItem className="flex items-center gap-3 w-60">
                                                <div className="w-8 aspect-square flex justify-items-center">
                                                    <UserRoundCog width={35} className="mx-auto mt-0.5" />
                                                </div>
                                                <Typography
                                                    variant="small"
                                                    color="blue-gray"
                                                    className="mb-1 font-normal"
                                                >
                                                    Akun
                                                </Typography>
                                            </MenuItem>
                                            <MenuItem
                                                className="hover:!bg-red-50/80 hover:!text-red-600 group w-full flex items-center gap-3"
                                                onClick={ handleLogout }
                                            >
                                                <div className="w-8 aspect-square flex justify-items-center">
                                                    <LogOut width={ 35 } className="mx-auto mt-0.5"/>
                                                </div>
                                                <Typography
                                                    variant="small"
                                                    className="w-full font-normal -mt-1"
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
                </Collapse>
            </Navbar>
            {
                onFetchLogout && (<LoadingOverlay />)
            }
        </>
    );
};
