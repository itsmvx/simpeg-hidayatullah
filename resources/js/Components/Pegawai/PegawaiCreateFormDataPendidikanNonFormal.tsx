import { ChangeEvent, Dispatch, memo, SetStateAction } from "react";
import { Button, Card, Tooltip, Typography } from "@material-tailwind/react";
import { Input } from "@/Components/Input";
import { ListPlus, ListX } from "lucide-react";
import type { FormDataPendidikanNonFormal } from "@/types";

const PegawaiFormDataPendidikanFormal = ({ formState, setFormState, formDefault }: {
    formState: FormDataPendidikanNonFormal[];
    setFormState: Dispatch<SetStateAction<FormDataPendidikanNonFormal[]>>;
    formDefault: FormDataPendidikanNonFormal;
}) => {

    const TABLE_HEAD = [
        { key: "jenis", label: "Jenis Kursus/Training" },
        { key: "penyelenggara", label: "Penyelenggara" },
        { key: "tempat", label: "Tempat" },
        { key: "tahun", label: "Tahun" }
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
                                {TABLE_HEAD.map(({ key, label }) => (
                                    <th
                                        key={key}
                                        className="border-b border-blue-gray-100 bg-blue-gray-50 p-4"
                                    >
                                        <Typography
                                            variant="small"
                                            color="blue-gray"
                                            className="font-normal leading-none opacity-70"
                                        >
                                            {label}
                                        </Typography>
                                    </th>
                                ))}
                            </tr>
                        </thead>
                        <tbody>
                            {formState.map((form, index) => {
                                const isLast = index === 5 - 1;
                                const classes = isLast ? "p-4" : "p-4 border-b border-blue-gray-50";

                                return (
                                    <tr key={index}>
                                        {TABLE_HEAD.map(({ key, label }, idx) => (
                                            <td key={`${index}-${idx}`} className={classes}>
                                                <Input
                                                    disabled
                                                    color="teal"
                                                    type="text"
                                                    id={String(index)}
                                                    name={key}
                                                    value={form[key]}
                                                    onChange={handleChangeInput}
                                                    label={label}
                                                />
                                            </td>
                                        ))}
                                    </tr>
                                );
                            })}
                        </tbody>
                    </table>
                </div>
            </Card>
        </>
    )
};

export default memo(PegawaiFormDataPendidikanFormal);
