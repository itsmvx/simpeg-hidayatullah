import { useState, useEffect } from 'react';
import {
    Card,
    CardHeader,
    CardBody,
    CardFooter,
    Button,
    IconButton,
    Typography,
    Avatar,
    Chip,
    Tooltip,
    Tabs,
    TabsHeader,
    Tab, MenuItem, MenuList, MenuHandler, Menu
} from '@material-tailwind/react';
import { Search, UserRoundPlus, ChevronDown, ArrowLeft, ArrowRight, Pencil } from 'lucide-react';
import { Input } from "@/Components/Input";

const TABS = [
    {
        label: "All",
        value: "all",
    },
    {
        label: "Monitored",
        value: "monitored",
    },
    {
        label: "Unmonitored",
        value: "unmonitored",
    },
];

const TABLE_HEAD = ["Member", "Function", "Status", "Employed", ""];

const rawData = [
    {
        img: "https://demos.creative-tim.com/test/corporate-ui-dashboard/assets/img/team-3.jpg",
        name: "John Michael",
        email: "john@creative-tim.com",
        job: "Manager",
        org: "Organization",
        online: true,
        date: "23/04/18",
    },
    {
        img: "https://demos.creative-tim.com/test/corporate-ui-dashboard/assets/img/team-2.jpg",
        name: "Alexa Liras",
        email: "alexa@creative-tim.com",
        job: "Programator",
        org: "Developer",
        online: false,
        date: "23/04/18",
    },
    {
        img: "https://demos.creative-tim.com/test/corporate-ui-dashboard/assets/img/team-1.jpg",
        name: "Laurent Perrier",
        email: "laurent@creative-tim.com",
        job: "Executive",
        org: "Projects",
        online: false,
        date: "19/09/17",
    },
    {
        img: "https://demos.creative-tim.com/test/corporate-ui-dashboard/assets/img/team-4.jpg",
        name: "Michael Levi",
        email: "michael@creative-tim.com",
        job: "Programator",
        org: "Developer",
        online: true,
        date: "24/12/08",
    },
    {
        img: "https://demos.creative-tim.com/test/corporate-ui-dashboard/assets/img/team-5.jpg",
        name: "Richard Gran",
        email: "richard@creative-tim.com",
        job: "Manager",
        org: "Executive",
        online: false,
        date: "04/10/21",
    },
];

export const ManagePegawaiTable = () => {

    const [sortBy, setSortBy] = useState('');
    const [currPage, setCurrPage] = useState(1);
    const [viewPerPage, setViewPerPage] = useState(2);

    const adjustData = (currpage, viewperpage) => {
        const startIndex = (currpage - 1) * viewperpage;
        const lastIndex = startIndex + viewperpage;

        return rawData.slice(startIndex, lastIndex);
    };

    const [data, setData] = useState(adjustData(currPage, viewPerPage));

    useEffect(() => {
        setData(adjustData(currPage, viewPerPage));
    }, [currPage, viewPerPage]);

    const getItemProps = (index) =>
        ({
            variant: currPage === index ? "filled" : "text",
            color: "gray",
            className: "rounded-full",
        } as any);

    const nextPage = () => {
        const totalPages = Math.ceil(rawData.length / viewPerPage);
        currPage < totalPages && setCurrPage(currPage + 1);
    };

    const prevPage = () => {
        currPage > 1 && setCurrPage(currPage - 1);
    };

    return (
        <Card className="h-full w-full">
            <CardHeader floated={false} shadow={false} className="rounded-none">
                <div className="mb-8 flex items-center justify-between gap-8">
                    <div>
                        <Typography variant="h5" color="blue-gray">
                            Members list
                        </Typography>
                        <Typography color="gray" className="mt-1 font-normal">
                            See information about all members
                        </Typography>
                    </div>
                    <div className="flex shrink-0 flex-col gap-2 sm:flex-row">
                        <Button variant="outlined" size="sm">
                            view all
                        </Button>
                        <Button className="flex items-center gap-3" size="sm">
                            <UserRoundPlus strokeWidth={2} className="h-4 w-4" /> Add member
                        </Button>
                    </div>
                </div>
                <div className="flex flex-col items-center justify-between gap-4 md:flex-row">
                    <Menu placement="bottom">
                        <MenuHandler>
                            <Button
                                variant="text"
                                color="black"
                                className="group capitalize !pl-3 flex items-center gap-1"
                            >
                                Jumlah data tiap halaman
                                <span className="w-5 h-5 border border-gray-900 flex content-center justify-center rounded">
                                    { viewPerPage }
                                </span>
                                <ChevronDown className="group-aria-expanded:rotate-0 rotate-180 transition-rotate duration-200" />
                            </Button>
                        </MenuHandler>
                        <MenuList>
                            <MenuItem onClick={() => setViewPerPage(2)}>2</MenuItem>
                            <MenuItem onClick={() => setViewPerPage(10)}>10</MenuItem>
                            <MenuItem onClick={() => setViewPerPage(25)}>25</MenuItem>
                            <MenuItem onClick={() => setViewPerPage(50)}>50</MenuItem>
                        </MenuList>
                    </Menu>
                    <div className="w-full md:w-72">
                        <Input
                            label="Search"
                            icon={<Search className="h-5 w-5" />}
                        />
                    </div>
                </div>
            </CardHeader>
            <CardBody className="overflow-scroll px-0">
                <table className="mt-4 w-full min-w-max table-auto text-left">
                    <thead>
                    <tr>
                        {TABLE_HEAD.map((head, index) => (
                            <th
                                key={head}
                                onClick={() => setSortBy(head)}
                                className="cursor-pointer border-y border-blue-gray-100 bg-blue-gray-50/50 p-4 transition-colors hover:bg-blue-gray-50"
                            >
                                <Typography
                                    variant="small"
                                    color="blue-gray"
                                    className="flex items-center justify-between gap-2 font-normal leading-none opacity-70"
                                >
                                    {head}{" "}
                                    {index !== TABLE_HEAD.length - 1 && (
                                        <ChevronDown strokeWidth={2} className="h-4 w-4" />
                                    )}
                                </Typography>
                            </th>
                        ))}
                    </tr>
                    </thead>
                    <tbody>
                    {data.map(
                        ({ img, name, email, job, org, online, date }, index) => {
                            const isLast = index === rawData.length - 1;
                            const classes = isLast
                                ? "p-4"
                                : "p-4 border-b border-blue-gray-50";

                            return (
                                <tr key={name}>
                                    <td className={classes}>
                                        <div className="flex items-center gap-3">
                                            <Avatar src={img} alt={name} size="sm" />
                                            <div className="flex flex-col">
                                                <Typography
                                                    variant="small"
                                                    color="blue-gray"
                                                    className="font-normal"
                                                >
                                                    {name}
                                                </Typography>
                                                <Typography
                                                    variant="small"
                                                    color="blue-gray"
                                                    className="font-normal opacity-70"
                                                >
                                                    {email}
                                                </Typography>
                                            </div>
                                        </div>
                                    </td>
                                    <td className={classes}>
                                        <div className="flex flex-col">
                                            <Typography
                                                variant="small"
                                                color="blue-gray"
                                                className="font-normal"
                                            >
                                                {job}
                                            </Typography>
                                            <Typography
                                                variant="small"
                                                color="blue-gray"
                                                className="font-normal opacity-70"
                                            >
                                                {org}
                                            </Typography>
                                        </div>
                                    </td>
                                    <td className={classes}>
                                        <div className="w-max">
                                            <Chip
                                                variant="ghost"
                                                size="sm"
                                                value={online ? "online" : "offline"}
                                                color={online ? "green" : "blue-gray"}
                                            />
                                        </div>
                                    </td>
                                    <td className={classes}>
                                        <Typography
                                            variant="small"
                                            color="blue-gray"
                                            className="font-normal"
                                        >
                                            {date}
                                        </Typography>
                                    </td>
                                    <td className={classes}>
                                        <Tooltip content="Edit User">
                                            <IconButton variant="text">
                                                <Pencil className="h-4 w-4" />
                                            </IconButton>
                                        </Tooltip>
                                    </td>
                                </tr>
                            );
                        },
                    )}
                    </tbody>
                </table>
            </CardBody>
            <CardFooter className="flex items-center justify-between border-t border-blue-gray-50 p-4">
                <Typography variant="small" color="blue-gray" className="font-normal">
                    Halaman { currPage } dari { Math.ceil(rawData.length / viewPerPage) }
                </Typography>
                <div className="flex items-center gap-4">
                    <Button
                        variant="text"
                        className="flex items-center gap-2 rounded-full"
                        onClick={ prevPage }
                        disabled={ currPage === 1 }
                    >
                        <ArrowLeft strokeWidth={ 2 } className="h-4 w-4"/> Previous
                    </Button>
                    <div className="flex items-center gap-2">
                        {
                            Array.from({ length: Math.ceil(rawData.length / viewPerPage) }).map((_, index) => (
                                <IconButton
                                    key={index}
                                    { ...getItemProps(index + 1) }
                                    onClick={() => setCurrPage(index + 1)}
                                >
                                    { index + 1 }
                                </IconButton>
                            ))
                        }
                    </div>
                    <Button
                        variant="text"
                        className="flex items-center gap-2 rounded-full"
                        onClick={ nextPage }
                        disabled={ currPage === Math.ceil(rawData.length / viewPerPage) }
                    >
                        Next
                        <ArrowRight strokeWidth={ 2 } className="h-4 w-4"/>
                    </Button>
                </div>
            </CardFooter>
        </Card>
    );
};
