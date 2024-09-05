import { router } from '@inertiajs/react'
import { memo } from "react";
import { ArrowLeft, ArrowRight } from "lucide-react";
import { Button, IconButton } from "@material-tailwind/react";
const Pagination = ({ paginateItems, className }: {
    className?: string
    paginateItems: {
        current_page: number;
        last_page: number;
        per_page: number;
        total: number;
        next_page_url: string | null;
        prev_page_url: string | null;
        links: {
            url: string | null;
            label: string;
            active: boolean;
        }[];
    };
}) => {

    if (paginateItems.last_page == 1) {
        return (
            <></>
        )
    }
    const handleNavigate = (url: string | null) => {
        router.visit(url ?? '', {
            preserveScroll: true,
            preserveState: true
        });
    };
    const getItemProps = (isActive: boolean) =>
        ({
            variant: isActive ? "filled" : "text",
            color: "gray",
            className: "rounded-full",
        } as any);

    return (
        <nav className={className} >
            <ul className="flex flex-row items-center gap-1">
                <Button
                    variant="text"
                    className="flex items-center gap-2 rounded-full"
                    onClick={ () => handleNavigate(paginateItems.prev_page_url) }
                    disabled={ !paginateItems.prev_page_url }
                >
                    <ArrowLeft strokeWidth={ 2 } className="h-4 w-4"/> Prev
                </Button>
                <div className="flex items-center gap-2">
                    {
                        paginateItems.links.slice(1, -1).map((link, index) => (
                            <IconButton
                                key={ index }
                                { ...getItemProps(link.active) }
                                onClick={ () => handleNavigate(link.url) }
                            >
                                { index + 1 }
                            </IconButton>
                        ))
                    }
                </div>
                <Button
                    variant="text"
                    className="flex items-center gap-2 rounded-full"
                    onClick={ () => handleNavigate(paginateItems.next_page_url) }
                    disabled={ !paginateItems.next_page_url }
                >
                    Next
                    <ArrowRight strokeWidth={ 2 } className="h-4 w-4"/>
                </Button>
            </ul>
        </nav>
    )
}
export default memo(Pagination);
