import { useState } from "react";
import { router } from "@inertiajs/react";
import { List, ListItem, ListItemPrefix, Typography } from "@material-tailwind/react";
import { Checkbox } from "@/Components/Checkbox";

export const ViewPerPageList = ({ className, preserveState }: {
    className?: string;
    preserveState?: boolean;
}) => {
    const [ viewPerPage, setViewPerPage ] = useState(() => {
        const searchParams = new URLSearchParams(window.location.search);
        const viewParam = searchParams.get('view');
        return viewParam ? parseInt(viewParam, 10) : 25;
    });
    const handleSetViewPerPage = (value: number) => {
        const searchParams = new URLSearchParams(window.location.search);
        if (value === 25) {
            searchParams.delete('view');
        } else {
            searchParams.set('view', String(value));
        }
        setViewPerPage(value);
        searchParams.delete('page');
        router.visit(window.location.pathname + '?' + searchParams.toString(), {
            preserveState: preserveState ?? true,
            preserveScroll: true,
        });
    };

    return (
        <>
            <div className={ `w-min text-sm *:!min-w-16 -space-y-1.5 ${className ?? ''}` }>
                <Typography variant="h6" color="blue-gray" className="ml-0 md:ml-3">
                    Data per Halaman
                </Typography>
                <List className="flex-row">
                    <ListItem className="p-0 !gap-1" ripple={ false }>
                        <label
                            htmlFor="show-25"
                            className="flex w-full cursor-pointer items-center px-3 py-2 *:!text-sm"
                        >
                            <ListItemPrefix className="mr-3">
                                <Checkbox
                                    id="show-25"
                                    ripple={ false }
                                    className="hover:before:opacity-0"
                                    containerProps={ {
                                        className: "p-0",
                                    } }
                                    value={ 25 }
                                    checked={ viewPerPage === 25 }
                                    onChange={ () => handleSetViewPerPage(25) }
                                />
                            </ListItemPrefix>
                            <Typography color="blue-gray" className="font-medium">
                                25
                            </Typography>
                        </label>
                    </ListItem>
                    <ListItem className="p-0" ripple={ false }>
                        <label
                            htmlFor="show-50"
                            className="flex w-full cursor-pointer items-center px-3 py-2 *:!text-sm"
                        >
                            <ListItemPrefix className="mr-3">
                                <Checkbox
                                    id="show-50"
                                    ripple={ false }
                                    className="hover:before:opacity-0"
                                    containerProps={ {
                                        className: "p-0",
                                    } }
                                    value={ 50 }
                                    checked={ viewPerPage === 50 }
                                    onChange={ () => handleSetViewPerPage(50) }
                                />
                            </ListItemPrefix>
                            <Typography color="blue-gray" className="font-medium">
                                50
                            </Typography>
                        </label>
                    </ListItem>
                </List>
                <List className="flex-row !gap-1.5">
                    <ListItem className="p-0" ripple={ false }>
                        <label
                            htmlFor="show-100"
                            className="flex w-full cursor-pointer items-center px-3 py-2 *:!text-sm"
                        >
                            <ListItemPrefix className="mr-3">
                                <Checkbox
                                    id="show-100"
                                    ripple={ false }
                                    className="hover:before:opacity-0"
                                    containerProps={ {
                                        className: "p-0",
                                    } }
                                    value={ 100 }
                                    checked={ viewPerPage === 100 }
                                    onChange={ () => handleSetViewPerPage(100) }
                                />
                            </ListItemPrefix>
                            <Typography color="blue-gray" className="font-medium">
                                100
                            </Typography>
                        </label>
                    </ListItem>
                    <ListItem className="p-0" ripple={ false }>
                        <label
                            htmlFor="show-150"
                            className="flex w-full cursor-pointer items-center px-3 py-2 *:!text-sm"
                        >
                            <ListItemPrefix className="mr-3">
                                <Checkbox
                                    id="show-150"
                                    ripple={ false }
                                    className="hover:before:opacity-0"
                                    containerProps={ {
                                        className: "p-0",
                                    } }
                                    value={ 150 }
                                    checked={ viewPerPage === 150 }
                                    onChange={ () => handleSetViewPerPage(150) }
                                />
                            </ListItemPrefix>
                            <Typography color="blue-gray" className="font-medium">
                                150
                            </Typography>
                        </label>
                    </ListItem>
                </List>
            </div>
        </>
    );
};
