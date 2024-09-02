import {
    Typography,
    List,
    ListItem
} from "@material-tailwind/react";
import { router } from "@inertiajs/react";

export const PegawaiNavbarLists = () => {
    return (
        <List className="mt-4 mb-6 p-0 lg:mt-0 lg:mb-0 lg:flex-row lg:p-1">
            <Typography as="div" variant="small" color="blue-gray" className="font-medium">
                <ListItem data-disabled={window.location.pathname === '/'} className="flex items-center gap-2 py-2 pr-4 data-[disabled=true]:cursor-auto" onClick={() => router.visit('/')} disabled={window.location.pathname === '/'}>
                    Home
                </ListItem>
            </Typography>

            <Typography as="a" href="#" variant="small" color="blue-gray" className="font-medium">
                <ListItem className="flex items-center gap-2 py-2 pr-4">Bantuan</ListItem>
            </Typography>
        </List>
    );
};
