import { Input } from "@/Components/Input";
import { Search } from "lucide-react";
import { FormEvent, useRef, useState } from "react";
import { router } from "@inertiajs/react";
import { Button, Typography } from "@material-tailwind/react";

export const SearchInput = () => {
    const [ search, setSearch ] = useState<{
        input: string;
        result: string;
        onSearch: boolean;
    }>(() => {
        const searchParams = new URLSearchParams(window.location.search);
        return {
            input: searchParams.get('search') ?? '',
            result: searchParams.get('search') ?? '',
            onSearch: !!searchParams.get('search')
        };
    });
    const searchFormRef = useRef<HTMLFormElement | null>(null);
    const handleCancelSearch = () => {
        const searchParams = new URLSearchParams(window.location.search);
        searchParams.delete('search');
        router.visit(window.location.pathname + '?' + searchParams.toString(), {
            preserveState: true,
            preserveScroll: true,
            onFinish: () => {
                setSearch((prevState) => ({
                    ...prevState,
                    input: '',
                    result: '',
                    onSearch: false
                }));
            }
        });
    };
    const handleFormSubmit = (event: FormEvent<HTMLFormElement>) => {
        event.preventDefault();
        const { input, result, onSearch } = search;
        const searchParams = new URLSearchParams(window.location.search);

        if (input) {
            searchParams.set('search', search.input);
            router.visit(window.location.pathname + '?' + searchParams.toString(), {
                preserveState: true,
                preserveScroll: true,
                onFinish: () => {
                    setSearch((prevState) => ({
                        ...prevState,
                        result: input,
                        onSearch: true
                    }));
                }
            });
        } else {
            searchParams.delete('search');
            router.visit(window.location.pathname + '?' + searchParams.toString(), {
                preserveState: true,
                preserveScroll: true,
                onFinish: () => {
                    setSearch((prevState) => ({
                        ...prevState,
                        input: '',
                        result: '',
                        onSearch: false
                    }));
                }
            });
        }
    };

    return (
        <>
            <div className="space-y-2">
                <form ref={ searchFormRef } onSubmit={ handleFormSubmit } className="flex items-center justify-end gap-1">
                    <Input
                        label="Pencarian"
                        placeholder="cari berdasarkan nama"
                        value={ search.input }
                        onChange={ (event) => {
                            setSearch((prevState) => ({
                                ...prevState,
                                input: event.target.value,
                            }));
                        } }
                        required
                    />
                    <Button type="submit" variant="text" className="!p-3">
                        <Search className="w-5 h-5"/>
                    </Button>
                </form>
                <div className="min-h-16 space-y-1 text-gray-900">
                    <Typography variant="small" className={ `font-medium ${search.onSearch ? 'block' : 'hidden'}` }>
                        Menampilkan hasil pencarian untuk
                    </Typography>
                    <Typography variant="small" className="font-bold italic truncate" hidden={!search.onSearch}>
                        { search.result }
                    </Typography>
                    <button className="font-sans self-end text-sm font-medium underline text-red-600" onClick={handleCancelSearch} hidden={!search.onSearch}>
                        Batalkan pencarian
                    </button>
                </div>
            </div>
        </>
    )
};
