import { Dispatch, memo, SetStateAction } from "react";
import { Button, Card, Option, Select, Tooltip, Typography } from "@material-tailwind/react";
import { Input } from "@/Components/Input";
import { ListPlus, ListX } from "lucide-react";
import type { FormDataPendidikanFormal } from "@/Pages/Admin/Master/PegawaiCreatePage";

const PegawaiFormDataPendidikanFormal = ({ formState, setFormState, formInitial }: {
    formState: FormDataPendidikanFormal[];
    setFormState: Dispatch<SetStateAction<FormDataPendidikanFormal[]>>;
    formInitial: FormDataPendidikanFormal;
}) => {
    const TABLE_HEAD = [ "Tingkat pendidikan", "Nama Sekolah/Universitas", "Tahun lulus" ];
    const TINGKAT_PENDIDIKAN = [
        "SD / Sederajat",
        "SMP / Sederajat",
        "SMA / sederajat",
        "S1", "S2", "S3"
    ];

    return (
        <>
            <Card className="relative col-span-1 lg:col-span-2 w-full !rounded-none space-y-4 pb-16">
                <div className="w-full overflow-auto min-h-96">
                    <table className="w-full table-auto text-left border-2">
                        <thead>
                        <tr>
                            { TABLE_HEAD.map((head) => (
                                <th
                                    key={ head }
                                    className="border-b border-blue-gray-100 bg-blue-gray-50 p-4"
                                >
                                    <Typography
                                        variant="small"
                                        color="blue-gray"
                                        className="font-normal leading-none opacity-70"
                                    >
                                        { head }
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
                                    <td className={ classes }>
                                        <Select label="Tingkat Pendidikan" color="teal">
                                            { TINGKAT_PENDIDIKAN.map((tingkat) => ((
                                                <Option key={ tingkat } value={ tingkat }>
                                                    { tingkat }
                                                </Option>
                                            ))) }
                                        </Select>
                                    </td>
                                    { TABLE_HEAD.filter((_, idx) => idx !== 0).map((head, idx) => (
                                        <td key={`${index}-${idx}`} className={classes}>
                                            <Input
                                                color="teal"
                                                type="text"
                                                label={ head }
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

export default memo(PegawaiFormDataPendidikanFormal);
