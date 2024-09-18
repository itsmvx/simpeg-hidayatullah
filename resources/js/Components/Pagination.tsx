import { router } from '@inertiajs/react'
import { memo } from "react";
import { ArrowLeft, ArrowRight } from "lucide-react";
import { Button, IconButton } from "@material-tailwind/react";
const Pagination = ({ paginateItems, className, preserveState }: {
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
    preserveState?: boolean;
}) => {

    if (paginateItems.last_page == 1) {
        return (
            <></>
        )
    }
    const handleNavigate = (url: string | null) => {
        router.visit(url ?? '', {
            preserveScroll: true,
            preserveState: preserveState ?? true,
        });
    };
    const getItemProps = (isActive: boolean, url: string | null) =>
        ({
            variant: isActive ? "filled" : "text",
            color: "green",
            className: `rounded-full font-medium ${isActive ? 'text-white' : 'text-black'} ${url ? 'cursor-pointer' : 'cursor-auto'}`,
            disabled: !url
        } as any);

    return (
        <nav className={className} >
            <ul className="mx-auto flex flex-col md:flex-row items-center justify-center gap-1">
                <Button
                    variant="text"
                    className="hidden md:flex items-center gap-2 rounded-full"
                    onClick={ () => handleNavigate(paginateItems.prev_page_url) }
                    disabled={ !paginateItems.prev_page_url }
                >
                    <ArrowLeft strokeWidth={ 2 } className="h-4 w-4"/>
                </Button>
                <div className="flex flex-wrap items-center gap-1.5">
                    {
                        paginateItems.links.slice(1, -1).map((link, index) => (
                            <IconButton
                                key={ index }
                                { ...getItemProps(link.active, link.url) }
                                onClick={ () => handleNavigate(link.url) }
                            >
                                { link.label }
                            </IconButton>
                        ))
                    }
                </div>
                <Button
                    variant="text"
                    className="hidden md:flex items-center gap-2 rounded-full"
                    onClick={ () => handleNavigate(paginateItems.next_page_url) }
                    disabled={ !paginateItems.next_page_url }
                >
                    <ArrowRight strokeWidth={ 2 } className="h-4 w-4"/>
                </Button>
                <div className="mt-2 w-full flex md:hidden flex-row justify-between">
                    <Button
                        variant="text"
                        className="flex items-center gap-2 rounded-full"
                        onClick={ () => handleNavigate(paginateItems.prev_page_url) }
                        disabled={ !paginateItems.prev_page_url }
                    >
                        <ArrowLeft strokeWidth={ 2 } className="h-4 w-4"/>
                        Sebelumnya
                    </Button>
                    <Button
                        variant="text"
                        className="flex items-center gap-2 rounded-full"
                        onClick={ () => handleNavigate(paginateItems.next_page_url) }
                        disabled={ !paginateItems.next_page_url }
                    >
                        Selanjutnya
                        <ArrowRight strokeWidth={ 2 } className="h-4 w-4"/>
                    </Button>
                </div>
            </ul>
        </nav>
    )
}
export default memo(Pagination);
