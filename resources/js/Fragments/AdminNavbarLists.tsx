import { Fragment, useState } from "react";
import {
    CalendarDays,
    ChevronDown,
    Newspaper,
    UserRound,
} from "lucide-react";
import {
    Collapse,
    Menu,
    MenuHandler,
    MenuItem,
    MenuList,
    Typography,
    List,
    ListItem
} from "@material-tailwind/react";
import { Link, router } from "@inertiajs/react";

export const AdminNavbarLists = () => {
    const navListMenuItems = [
        {
            title: "Pegawai",
            description: "mengatur  data Pegawai di Unit",
            icon: <UserRound />,
            link: route('admin.pegawai.index')
        },
        {
            title: "Rekap kepegawaian",
            description: "Membuat laporan Rekap Pegawai di Unit",
            icon: <Newspaper />,
            link: route('admin.rekap-pegawai.index')
        },
        // {
        //     title: "Periode Rekap",
        //     description: "mengatur Periode rekap pegawai",
        //     icon: <CalendarDays />,
        //     link: route('master.periode-rekap.index')
        // }
    ];

    const [ isMenuOpen, setIsMenuOpen ] = useState(false);
    const [ isMobileMenuOpen, setIsMobileMenuOpen ] = useState(false);

    const renderItems = navListMenuItems.map(({ icon, title, description, link }, key) => (
        <Link href={link} key={ key }>
            <MenuItem className="flex items-center gap-3 rounded-lg">
                <div className="flex items-center justify-center rounded-lg !bg-blue-gray-50 p-2">
                    { icon }
                </div>
                <div className="capitalize">
                    <Typography variant="h6" color="blue-gray" className="flex items-center text-sm font-bold">
                        { title }
                    </Typography>
                    <Typography variant="paragraph" className="text-xs !font-medium text-blue-gray-500">
                        { description }
                    </Typography>
                </div>
            </MenuItem>
        </Link>
    ));

    return (
        <List className="mt-4 mb-6 p-0 lg:mt-0 lg:mb-0 lg:flex-row lg:p-1">
            <Typography as="div" variant="small" color="blue-gray" className="font-medium">
                <ListItem data-disabled={window.location.pathname === '/'} className="flex items-center gap-2 py-2 pr-4 data-[disabled=true]:cursor-auto" onClick={() => router.visit('/')} disabled={window.location.pathname === '/'}>
                    Home
                </ListItem>
            </Typography>

            <Fragment>
                <Menu open={ isMenuOpen } handler={ setIsMenuOpen } offset={ { mainAxis: 20 } } placement="bottom" allowHover={ true }>
                    <MenuHandler>
                        <Typography as="div" variant="small" className="font-medium">
                            <ListItem
                                className="flex items-center gap-2 py-2 pr-4 font-medium text-gray-900"
                                selected={ isMenuOpen || isMobileMenuOpen }
                                onClick={ () => setIsMobileMenuOpen((cur) => !cur) }
                            >
                                Manajemen
                                <ChevronDown strokeWidth={ 2.5 } className={ `hidden h-3 w-3 transition-transform lg:block ${ isMenuOpen ? "rotate-180" : "" }` }/>
                                <ChevronDown strokeWidth={ 2.5 } className={ `block h-3 w-3 transition-transform lg:hidden ${ isMobileMenuOpen ? "rotate-180" : "" }` }/>
                            </ListItem>
                        </Typography>
                    </MenuHandler>
                    <MenuList className="hidden max-w-screen-xl rounded-xl lg:block">
                        <ul className="grid grid-cols-3 gap-y-2 outline-none outline-0">
                            { renderItems }
                        </ul>
                    </MenuList>
                </Menu>
                <div className="block lg:hidden">
                    <Collapse open={ isMobileMenuOpen }>{ renderItems }</Collapse>
                </div>
            </Fragment>

            <Typography as="a" href="#" variant="small" color="blue-gray" className="font-medium">
                <ListItem className="flex items-center gap-2 py-2 pr-4">Bantuan</ListItem>
            </Typography>
        </List>
    );
};
