import {
    Button,
    Dialog,
    DialogBody, DialogFooter,
    DialogHeader,
    IconButton,
    List,
    ListItem, ListItemPrefix,
    Typography
} from "@material-tailwind/react";
import { Pencil, X } from "lucide-react";
import { jenisKelamin } from "@/Lib/StaticData";
import { ChangeEvent, useState } from "react";
import { router } from "@inertiajs/react";
import { Checkbox } from "@/Components/Checkbox";
import { FilterBy, IDNamaColumn } from "@/types";

export const TableFilterBy = ({ golongans, marhalahs, statusPegawais, units }: {
    golongans: IDNamaColumn[];
    marhalahs: IDNamaColumn[];
    statusPegawais: IDNamaColumn[];
    units: IDNamaColumn[];
}) => {
    const filterByInit: FilterBy = {
        marhalah: [],
        golongan: [],
        statusPegawai: [],
        jenisKelamin: [],
        unit: []
    };

    const [ filterBy, setFilterBy ] = useState<FilterBy>(() => {
        const searchParams = new URLSearchParams(window.location.search);
        const filterParam = searchParams.get('filter');
        if (filterParam) {
            return JSON.parse(atob(filterParam)) as FilterBy;
        }
        return filterByInit;
    });
    const [ openFilterBy, setOpenFilterBy ] = useState(false);
    const handleChangeFilterBy = (by: keyof FilterBy, event: ChangeEvent<HTMLInputElement>) => {
        const { value } = event.target;
        setFilterBy((prevState) => ({
            ...prevState,
            [by]: prevState[by].includes(value)
                ? prevState[by].filter((filt) => filt !== value)
                : [ ...prevState[by], value ],
        }));
    };
    const handleSetFilterBy = () => {
        const isEmpty = Object.values(filterBy).every((filters) => filters.length === 0);

        const filterBase64 = btoa(JSON.stringify(filterBy));
        const searchParams = new URLSearchParams(window.location.search);

        if (isEmpty) {
            searchParams.delete('filter');
        } else {
            searchParams.set('filter', filterBase64);
        }

        router.visit(window.location.pathname + '?' + searchParams.toString(), {
            preserveState: true,
            preserveScroll: true,
        });

        setOpenFilterBy(false);
    };

    return (
        <>
            <div className="flex flex-row gap-2.5 items-center">
                <Typography variant="h5" color="blue-gray">
                    Filter berdasarkan
                </Typography>
                <Button
                    variant="text"
                    size="sm"
                    color="blue-gray"
                    className="!p-2"
                    onClick={ () => setOpenFilterBy(true) }
                >
                    <Pencil width={ 20 }/>
                </Button>
            </div>
            <div className="flex flex-row gap-1.5 text-sm">
                <p className="min-w-28">
                    Unit
                </p>
                <p>:&nbsp;
                    { filterBy.unit.length < 1
                        ? 'Semua'
                        : filterBy.unit.length === units.length
                            ? 'Semua'
                            : filterBy.unit.flat().join(', ')
                    }
                </p>
            </div>
            <div className="flex flex-row gap-1.5 text-sm">
                <p className="min-w-28">
                    Marhalah
                </p>
                <p>:&nbsp;
                    { filterBy.marhalah.length < 1
                        ? 'Semua'
                        : filterBy.marhalah.length === marhalahs.length
                            ? 'Semua'
                            : filterBy.marhalah.flat().join(', ')
                    }
                </p>
            </div>
            <div className="flex flex-row gap-1.5 text-sm ">
                <p className="min-w-28">
                    Golongan
                </p>
                <p>:&nbsp;
                    { filterBy.golongan.length < 1
                        ? 'Semua'
                        : filterBy.golongan.length === golongans.length
                            ? 'Semua'
                            : filterBy.golongan.flat().join(', ')
                    }
                </p>
            </div>
            <div className="flex flex-row gap-1.5 text-sm ">
                <p className="min-w-28">
                    Jenis Kelamin
                </p>
                <p>:&nbsp;
                    { filterBy.jenisKelamin.length < 1
                        ? 'Semua'
                        : filterBy.jenisKelamin.length === jenisKelamin.length
                            ? 'Semua'
                            : filterBy.jenisKelamin.flat().join(', ')
                    }
                </p>
            </div>
            <div className="flex flex-row gap-1.5 text-sm ">
                <p className="min-w-28">
                    Status Pegawai
                </p>
                <p>:&nbsp;
                    { filterBy.statusPegawai.length < 1
                        ? 'Semua'
                        : filterBy.statusPegawai.length === statusPegawais.length
                            ? 'Semua'
                            : filterBy.statusPegawai.flat().join(', ')
                    }
                </p>
            </div>
            <Dialog size="xl" open={ openFilterBy } handler={ () => setOpenFilterBy(true) } className="p-4">
                <DialogHeader className="relative m-0 block">
                    <Typography variant="h4" color="blue-gray">
                        Filter berdasarkan
                    </Typography>
                    <Typography className="mt-1 font-normal text-gray-600">
                        Dapat memilih lebih dari opsi
                    </Typography>
                    <IconButton
                        size="sm"
                        variant="text"
                        className="!absolute right-3.5 top-3.5"
                        onClick={ () => setOpenFilterBy(false) }
                    >
                        <X className="h-4 w-4 stroke-2"/>
                    </IconButton>
                </DialogHeader>
                <DialogBody className="h-80 overflow-auto">
                    <div className="flex flex-col md:flex-row flex-wrap gap-2 justify-around">
                        <div>
                            <Typography variant="h6">
                                Unit
                            </Typography>
                            <List>
                                {
                                    units.sort((a, b) => a.nama.localeCompare(b.nama)).map((unit, index) => ((
                                        <ListItem className="p-0" key={unit.id}>
                                            <label
                                                htmlFor={ unit.id }
                                                className="flex w-full cursor-pointer items-center px-3 py-2"
                                            >
                                                <ListItemPrefix className="mr-3">
                                                    <Checkbox
                                                        id={ unit.id }
                                                        ripple={ false }
                                                        className="hover:before:opacity-0"
                                                        containerProps={ {
                                                            className: "p-0",
                                                        } }
                                                        value={ unit.nama }
                                                        checked={ filterBy.unit.includes(unit.nama) }
                                                        onChange={ (event) => handleChangeFilterBy('unit', event) }
                                                    />
                                                </ListItemPrefix>
                                                <Typography color="blue-gray" className="text-sm font-medium">
                                                    { unit.nama }
                                                </Typography>
                                            </label>
                                        </ListItem>
                                    )))
                                }
                            </List>
                            <Typography variant="h6">
                                Status Pegawai
                            </Typography>
                            <List>
                                {
                                    statusPegawais.sort((a, b) => a.nama.localeCompare(b.nama)).map((status, index) => ((
                                        <ListItem className="p-0" key={status.id}>
                                            <label
                                                htmlFor={ status.id }
                                                className="flex w-full cursor-pointer items-center px-3 py-2"
                                            >
                                                <ListItemPrefix className="mr-3">
                                                    <Checkbox
                                                        id={ status.id }
                                                        ripple={ false }
                                                        className="hover:before:opacity-0"
                                                        containerProps={ {
                                                            className: "p-0",
                                                        } }
                                                        value={ status.nama }
                                                        checked={ filterBy.statusPegawai.includes(status.nama) }
                                                        onChange={ (event) => handleChangeFilterBy('statusPegawai', event) }
                                                    />
                                                </ListItemPrefix>
                                                <Typography color="blue-gray" className="text-sm font-medium">
                                                    { status.nama }
                                                </Typography>
                                            </label>
                                        </ListItem>
                                    )))
                                }
                            </List>

                            <Typography variant="h6">
                                Jenis Kelamin
                            </Typography>
                            <List>
                                {
                                    jenisKelamin.map((jenis, index) => ((
                                        <ListItem className="p-0" key={jenis}>
                                            <label
                                                htmlFor={ jenis }
                                                className="flex w-full cursor-pointer items-center px-3 py-2"
                                            >
                                                <ListItemPrefix className="mr-3">
                                                    <Checkbox
                                                        id={ jenis }
                                                        ripple={ false }
                                                        className="hover:before:opacity-0"
                                                        containerProps={ {
                                                            className: "p-0",
                                                        } }
                                                        value={ jenis }
                                                        checked={ filterBy.jenisKelamin.includes(jenis) }
                                                        onChange={ (event) => handleChangeFilterBy('jenisKelamin', event) }
                                                    />
                                                </ListItemPrefix>
                                                <Typography color="blue-gray" className="text-sm font-medium">
                                                    { jenis }
                                                </Typography>
                                            </label>
                                        </ListItem>
                                    )))
                                }
                            </List>
                        </div>
                        <div>
                            <Typography variant="h6">
                                Marhalah
                            </Typography>
                            <List>
                                {
                                    marhalahs.sort((a, b) => a.nama.localeCompare(b.nama)).map((marhalah, index) => ((
                                        <ListItem className="p-0" key={marhalah.id}>
                                            <label
                                                htmlFor={ marhalah.id }
                                                className="flex w-full cursor-pointer items-center px-3 py-2"
                                            >
                                                <ListItemPrefix className="mr-3">
                                                    <Checkbox
                                                        id={ marhalah.id }
                                                        ripple={ false }
                                                        className="hover:before:opacity-0"
                                                        containerProps={ {
                                                            className: "p-0",
                                                        } }
                                                        value={ marhalah.nama }
                                                        checked={ filterBy.marhalah.includes(marhalah.nama) }
                                                        onChange={ (event) => handleChangeFilterBy('marhalah', event) }
                                                    />
                                                </ListItemPrefix>
                                                <Typography color="blue-gray" className="text-sm font-medium">
                                                    { marhalah.nama }
                                                </Typography>
                                            </label>
                                        </ListItem>
                                    )))
                                }
                            </List>
                            <Typography variant="h6">
                                Golongan
                            </Typography>
                            <List>
                                {
                                    golongans.sort((a, b) => a.nama.localeCompare(b.nama)).map((golongan, index) => ((
                                        <ListItem className="p-0" key={golongan.id}>
                                            <label
                                                htmlFor={ golongan.id }
                                                className="flex w-full cursor-pointer items-center px-3 py-2"
                                            >
                                                <ListItemPrefix className="mr-3">
                                                    <Checkbox
                                                        id={ golongan.id }
                                                        ripple={ false }
                                                        className="hover:before:opacity-0"
                                                        containerProps={ {
                                                            className: "p-0",
                                                        } }
                                                        value={ golongan.nama }
                                                        checked={ filterBy.golongan.includes(golongan.nama) }
                                                        onChange={ (event) => handleChangeFilterBy('golongan', event) }
                                                    />
                                                </ListItemPrefix>
                                                <Typography color="blue-gray" className="text-sm font-medium">
                                                    { golongan.nama }
                                                </Typography>
                                            </label>
                                        </ListItem>
                                    )))
                                }
                            </List>
                        </div>
                    </div>
                </DialogBody>
                <DialogFooter>
                    <Button className="ml-auto" onClick={ handleSetFilterBy }>
                        Simpan Filter
                    </Button>
                </DialogFooter>
            </Dialog>
        </>
    )
};
