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
import { AdminNavbarLists } from "@/Fragments/AdminNavbarLists";
import { Link } from "@inertiajs/react";
import { HarunaPP } from "@/Lib/StaticImages";

export const AdminNavbar = ({ openSideNav, setOpenSideNav }: {
    openSideNav: boolean;
    setOpenSideNav: Dispatch<SetStateAction<boolean>>;
}) => {
    const [ openNavbar, setOpenNavbar ] = useState(false);
    const pathNames = window.location.pathname.split("/").filter((path) => Boolean(path));

    useEffect(() => {
        const handleResize = () => {
            window.innerWidth >= 960 && setOpenNavbar(false);
        };
        window.addEventListener("resize", handleResize);

        return () => window.removeEventListener("resize", handleResize);
    }, []);

    return (
        <Navbar className="mx-auto w-full px-4 py-2 sticky top-0 z-20">
            <div className="flex items-center justify-between text-blue-gray-900">
                <Breadcrumbs className="bg-transparent p-0 transition-all mt-1 capitalize">
                    <Home width={18} />
                    {
                        pathNames.map((path) => ((
                            <Link key={path} href={path}>
                                { path }
                            </Link>
                        )))
                    }
                </Breadcrumbs>
                <div className="hidden lg:block">
                    <AdminNavbarLists />
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
                            <MenuItem className="flex items-center gap-3 group hover:!bg-red-50/80">
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
                <IconButton variant="text" color="blue-gray" className="lg:hidden" onClick={() => setOpenNavbar(!openNavbar)}>
                    {openNavbar ? <X className="h-6 w-6" strokeWidth={2} /> : <MenuIcon className="h-6 w-6" strokeWidth={2} />}
                </IconButton>
            </div>
            <Collapse open={openNavbar}>
                <AdminNavbarLists />
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
                                <Avatar
                                    src="https://demos.creative-tim.com/material-dashboard/assets/img/team-2.jpg"
                                    alt="item-1"
                                    size="sm"
                                    variant="circular"
                                />
                                <div>
                                    <Typography
                                        variant="small"
                                        color="blue-gray"
                                        className="mb-1 font-normal"
                                    >
                                        <strong>New message</strong> from Laur
                                    </Typography>
                                    <Typography
                                        variant="small"
                                        color="blue-gray"
                                        className="flex items-center gap-1 text-xs font-normal opacity-60"
                                    >
                                        <Home className="h-3.5 w-3.5" /> 13 minutes ago
                                    </Typography>
                                </div>
                            </MenuItem>
                            <MenuItem className="flex items-center gap-4">
                                <Avatar
                                    src="https://demos.creative-tim.com/material-dashboard/assets/img/small-logos/logo-spotify.svg"
                                    alt="item-1"
                                    size="sm"
                                    variant="circular"
                                />
                                <div>
                                    <Typography
                                        variant="small"
                                        color="blue-gray"
                                        className="mb-1 font-normal"
                                    >
                                        <strong>New album</strong> by Travis Scott
                                    </Typography>
                                    <Typography
                                        variant="small"
                                        color="blue-gray"
                                        className="flex items-center gap-1 text-xs font-normal opacity-60"
                                    >
                                        <Home className="h-3.5 w-3.5" /> 1 day ago
                                    </Typography>
                                </div>
                            </MenuItem>
                            <MenuItem className="flex items-center gap-4">
                                <div className="grid h-9 w-9 place-items-center rounded-full bg-gradient-to-tr from-blue-gray-800 to-blue-gray-900">
                                    <Home className="h-4 w-4 text-white" />
                                </div>
                                <div>
                                    <Typography
                                        variant="small"
                                        color="blue-gray"
                                        className="mb-1 font-normal"
                                    >
                                        Payment successfully completed
                                    </Typography>
                                    <Typography
                                        variant="small"
                                        color="blue-gray"
                                        className="flex items-center gap-1 text-xs font-normal opacity-60"
                                    >
                                        <Home className="h-3.5 w-3.5" /> 2 days ago
                                    </Typography>
                                </div>
                            </MenuItem>
                        </MenuList>
                    </Menu>
                </div>
            </Collapse>
        </Navbar>
    );
};
