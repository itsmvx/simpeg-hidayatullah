import { useState, useEffect, SyntheticEvent } from 'react';
import {
    Card,
    CardHeader,
    CardBody,
    CardFooter,
    Button,
    IconButton,
    Typography,
    Tooltip,
    MenuItem, MenuList, MenuHandler, Menu,
    Dialog
} from '@material-tailwind/react';
import {
    Search,
    ChevronDown,
    ArrowLeft,
    ArrowRight,
    Pencil,
    Plus
} from 'lucide-react';
import { Input } from "@/Components/Input";
import { z } from "zod";
import { id as localeID } from "date-fns/locale";
import axios from "axios";
import { format } from "date-fns";
import { TextArea } from "@/Components/TextArea";

const TABLE_HEAD = ["Kader", "Keterangan", "Tanggal dibuat", ""];

export const ManageKaderTable = ({ kadersData }: {
    kadersData: {
        id: string;
        nama: string;
        keterangan: string;
        created_at: string;
    }[] | [];
}) => {

    const [ openCreateKader, setOpenCreateKader ] = useState(false);
    const [ sortBy, setSortBy ] = useState('');
    const [ currPage, setCurrPage ] = useState(1);
    const [ viewPerPage, setViewPerPage ] = useState(2);

    const adjustData = (currpage: number, viewperpage: number) => {
        const startIndex = (currpage - 1) * viewperpage;
        const lastIndex = startIndex + viewperpage;

        return kadersData.slice(startIndex, lastIndex);
    };

    const [data, setData] = useState(adjustData(currPage, viewPerPage));

    useEffect(() => {
        setData(adjustData(currPage, viewPerPage));
    }, [currPage, viewPerPage]);

    const getItemProps = (index: number) =>
        ({
            variant: currPage === index ? "filled" : "text",
            color: "gray",
            className: "rounded-full",
        } as any);

    const nextPage = () => {
        const totalPages = Math.ceil(kadersData.length / viewPerPage);
        currPage < totalPages && setCurrPage(currPage + 1);
    };

    const prevPage = () => {
        currPage > 1 && setCurrPage(currPage - 1);
    };

    const handleOpen = () => setOpenCreateKader(true);
    const formInputInit = {
        nama: '',
        keterangan: '',
    };
    const formEventInit = {
        onErr: null,
        errMsg: '',
        onSubmit: false,
        onSuccess: false
    };
    const [ formInput, setFormInput ] = useState<{
        nama: string;
        keterangan: string;
    }>(formInputInit);
    const [ formEvent, setFormEvent ] = useState<{
        onErr: boolean | null;
        errMsg: string;
        onSubmit: boolean;
        onSuccess: boolean;
    }>(formEventInit)

    const setNama = (val: string) => {
        setFormInput((prevState) => ({
            ...prevState,
            nama: val
        }));
    };
    const setKeterangan = (val: string) => {
        setFormInput((prevState) => ({
            ...prevState,
            username: val
        }));
    };
    const handleFormSubmit = (event: SyntheticEvent<HTMLFormElement>) => {
        event.preventDefault();
        const { nama, keterangan } = formInput

        setFormEvent((prevState) => ({
            ...prevState,
            onSubmit: true
        }));
        const formSchema = z.object({
            nama: z.string().min(1, { message: "Nama tidak boleh kosong" }),
            keterangan: z.string().min(1, { message: "Nama tidak boleh kosong" }),
        });
        const zodResult = formSchema.safeParse({ nama });
        if (!zodResult.success) {
            const errorMessages = zodResult.error.issues[0].message;
            setFormEvent((prevState) => ({
                ...prevState,
                onErr: true,
                errMsg: errorMessages
            }))
        }
        axios.post(route('kader.create'), {
            nama, keterangan
        })
            .then((res) => {
                console.log(res)
            })
            .catch((err) => {
                console.log(err)
            })
            .finally(() => {
                setFormEvent((prevState) => ({ ...prevState, onSubmit: false }))
            });
    };
    useEffect(() => {
        if (!open) {
            setFormInput(formInputInit);
            setFormEvent(formEventInit);
        }
    }, [ open ]);


    return (
        <>
            <Card className="h-full w-full">
                <CardHeader floated={false} shadow={false} className="rounded-none">
                    <div className="mb-8 flex items-center justify-between gap-x-3">
                        <div>
                            <Typography variant="h5" color="blue-gray">
                                Daftar Kader
                            </Typography>
                            <Typography color="gray" className="mt-1 font-normal">
                                Informasi mengenai Kader yang terdaftar
                            </Typography>
                        </div>
                        <div className="flex shrink-0 flex-col gap-2 sm:flex-row">
                            <Button
                                onClick={() => setOpenCreateKader(true)}
                                className="flex items-center gap-1.5 capitalize font-medium text-base" size="sm"
                            >
                                <Plus />
                                Tambahkan Kader baru
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
                                label="Pencarian"
                                placeholder="cari berdasarkan nama"
                                icon={<Search className="h-5 w-5"/>}
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
                            ({ id, nama, keterangan, created_at }, index) => {
                                const isLast = index === kadersData.length - 1;
                                const classes = isLast
                                    ? "p-4"
                                    : "p-4 border-b border-blue-gray-50";

                                return (
                                    <tr key={id}>
                                        <td className={classes}>
                                            <div className="flex items-center gap-3">
                                                {/*<Avatar src={img} alt={name} size="sm" />*/}
                                                <div className="flex flex-col">
                                                    <Typography
                                                        variant="small"
                                                        color="blue-gray"
                                                        className="font-normal"
                                                    >
                                                        {nama}
                                                    </Typography>
                                                    <Typography
                                                        variant="small"
                                                        color="blue-gray"
                                                        className="font-normal"
                                                    >
                                                        {keterangan}
                                                    </Typography>
                                                </div>
                                            </div>
                                        </td>
                                        <td className={classes}>
                                            <Typography
                                                variant="small"
                                                color="blue-gray"
                                                className="font-normal"
                                            >
                                                {format(created_at, 'PPpp', {
                                                    locale: localeID
                                                })}
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
                        Halaman { currPage } dari { Math.ceil(kadersData.length / viewPerPage) }
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
                                Array.from({ length: Math.ceil(kadersData.length / viewPerPage) }).map((_, index) => (
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
                            disabled={ currPage === Math.ceil(kadersData.length / viewPerPage) }
                        >
                            Next
                            <ArrowRight strokeWidth={ 2 } className="h-4 w-4"/>
                        </Button>
                    </div>
                </CardFooter>
            </Card>
            <Dialog
                size="sm"
                open={openCreateKader}
                handler={handleOpen}
                className="bg-transparent shadow-none"
            >
                <form className="mx-auto w-full max-w-[24rem]" onSubmit={handleFormSubmit}>
                    <Card>
                        <CardBody className="flex flex-col gap-4">
                            <Typography variant="h4" color="blue-gray">
                                Menambahkan Kader baru
                            </Typography>
                            <Input
                                label="Nama unit"
                                value={formInput.nama}
                                onChange={(event) => {
                                    setNama(event.target.value);
                                }}
                            />
                            <TextArea
                                label="Keterangan"
                                value={formInput.keterangan}
                                onChange={(event) => {
                                    setKeterangan(event.target.value);
                                }}
                            />
                        </CardBody>
                        <CardFooter className="pt-0 flex gap-3 justify-between">
                            <Button
                                color="red"
                                variant="text"
                                onClick={() => setOpenCreateKader(false)}
                                fullWidth
                            >
                                Batal
                            </Button>
                            <Button
                                type="submit"
                                variant="gradient"
                                loading={formEvent.onSubmit}
                                onClick={handleOpen} fullWidth
                            >
                                Daftar
                            </Button>
                        </CardFooter>
                    </Card>
                </form>
            </Dialog>
        </>
    );
};
