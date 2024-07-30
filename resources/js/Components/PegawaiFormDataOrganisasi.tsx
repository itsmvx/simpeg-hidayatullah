import { ChangeEvent, Dispatch, memo, SetStateAction } from "react";
import { Button, Card, Tooltip, Typography } from "@material-tailwind/react";
import { Input } from "@/Components/Input";
import { ListPlus, ListX } from "lucide-react";
import type { FormDataOrganisasi } from "@/Pages/Admin/ADMIN_PegawaiCreatePage";

const PegawaiFormDataOrganisasi = ({ formState, setFormState, formInitial }: {
    formState: FormDataOrganisasi[];
    setFormState: Dispatch<SetStateAction<FormDataOrganisasi[]>>;
    formInitial: FormDataOrganisasi;
}) => {

    const TABLE_HEAD = [
        { key: "nama", label: "Nama Organisasi" },
        { key: "jabatan", label: "Jabatan" },
        { key: "masa", label: "Masa Bhakti" },
        { key: "keterangan", label: "Keterangan" }
    ];

    const handleChangeInput = (event: ChangeEvent<HTMLInputElement>) => {
        const { id, name, value } = event.target;
        const index = Number(id);

        if (index >= formState.length) {
            return;
        }

        setFormState((prevState) =>
            prevState.map((item, idx) =>
                idx === index ? { ...item, [name]: value } : item
            )
        );
    };

    return (
        <>
            <Card className="relative col-span-1 lg:col-span-2 w-full !rounded-none space-y-4 pb-16">
                <div className="w-full overflow-auto min-h-96">
                    <table className="w-full table-auto text-left border-2">
                        <thead>
                        <tr>
                            { TABLE_HEAD.map(({ key, label }) => (
                                <th
                                    key={ key }
                                    className="border-b border-blue-gray-100 bg-blue-gray-50 p-4"
                                >
                                    <Typography
                                        variant="small"
                                        color="blue-gray"
                                        className="font-normal leading-none opacity-70"
                                    >
                                        { label }
                                    </Typography>
                                </th>
                            )) }
                        </tr>
                        </thead>
                        <tbody>
                        { formState.map((_, index) => {
                            const isLast = index === 5 - 1;
                            const classes = isLast ? "p-4" : "p-4 border-b border-blue-gray-50";

                            return (
                                <tr key={ index }>
                                    { TABLE_HEAD.map(({ key, label }, idx) => (
                                        <td key={`${index}-${idx}`} className={classes}>
                                            <Input
                                                color="teal"
                                                type="text"
                                                id={String(index)}
                                                name={key}
                                                value={formState[key]}
                                                onChange={handleChangeInput}
                                                label={ label }
                                            />
                                        </td>
                                    )) }
                                </tr>
                            );
                        }) }
                        </tbody>
                    </table>
                </div>
                <div
                    className="absolute h-10 bottom-2 right-5 left-5 flex items-center justify-between">
                    <Tooltip content="Hapus satu baris">
                        <Button
                            className="w-11 h-11 rounded-full !py-2.5 !px-3"
                            disabled={ formState.length <= 1 }
                            onClick={ () => {
                                setFormState((prevState) => prevState.filter((filt, index) => index + 1 < prevState.length));
                            } }
                        >
                            <ListX className="text-white" width={ 25 }/>
                        </Button>
                    </Tooltip>
                    <Tooltip content="Tambah satu baris">
                        <Button
                            className=" w-11 h-11 rounded-full !py-2.5 !px-3"
                            onClick={ () => {
                                setFormState((prevState) => ([ ...prevState, formInitial ]))
                            } }
                        >
                            <ListPlus className="text-white" width={ 25 }/>
                        </Button>
                    </Tooltip>
                </div>
            </Card>
        </>
    )
};

export default memo(PegawaiFormDataOrganisasi);
