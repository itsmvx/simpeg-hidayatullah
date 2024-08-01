import { ChangeEvent, Dispatch, memo, SetStateAction } from "react";
import { Button, Card, Option, Select, Tooltip, Typography } from "@material-tailwind/react";
import { Input } from "@/Components/Input";
import { ListPlus, ListX } from "lucide-react";
import type { FormDataPendidikanFormal } from "@/Pages/Admin/MASTER_PegawaiCreatePage";

const PegawaiFormDataPendidikanFormal = ({ formState, setFormState, formInitial }: {
    formState: FormDataPendidikanFormal[];
    setFormState: Dispatch<SetStateAction<FormDataPendidikanFormal[]>>;
    formInitial: FormDataPendidikanFormal;
}) => {

    const TABLE_HEAD = [
        { key: 'tingkat', label: 'Tingkat Pendidikan' },
        { key: 'sekolah', label: 'Nama Sekolah/Universitas' },
        { key: 'lulus', label: 'Tahun Lulus' },
    ];

    const TINGKAT_PENDIDIKAN = [
        "SD / Sederajat",
        "SMP / Sederajat",
        "SMA / sederajat",
        "S1", "S2", "S3"
    ];

    const handleChangeInput = (event: ChangeEvent<HTMLInputElement>) => {
        const { id, name, value } = event.target;
        const index = Number(id);

        if (index >= formState.length) {
            return;
        }

        setFormState((prevState) =>
            prevState.map((prev, idx) =>
                idx === index ? { ...prev, [name]: value } : prev
            )
        );
    };
    const handleSelectChange = (index: number, key: keyof FormDataPendidikanFormal, value: string) => {
        setFormState((prevState) =>
            prevState.map((prev, idx) =>
                idx === index ? { ...prev, [key]: value } : prev
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
                            { TABLE_HEAD.map(({ key, label}) => (
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
                                    <td className={ classes }>
                                        <Select
                                            label="Tingkat Pendidikan"
                                            color="teal"
                                            name="tingkat"
                                            onChange={(value) => {
                                                handleSelectChange(index, 'tingkat', value ?? '');
                                            }}
                                        >
                                            { TINGKAT_PENDIDIKAN.map((tingkat) => ((
                                                <Option key={ tingkat } value={ tingkat }>
                                                    { tingkat }
                                                </Option>
                                            ))) }
                                        </Select>
                                    </td>
                                    { TABLE_HEAD.filter((_, idx) => idx !== 0).map(({ key, label }, idx) => (
                                        <td key={`${key}-${idx}`} className={classes}>
                                            <Input
                                                color="teal"
                                                type="text"
                                                id={String(index)}
                                                label={ label }
                                                name={key}
                                                value={formState[key]}
                                                onChange={handleChangeInput}
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
