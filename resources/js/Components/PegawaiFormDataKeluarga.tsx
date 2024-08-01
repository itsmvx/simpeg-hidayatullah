import { ChangeEvent, Dispatch, memo, SetStateAction } from "react";
import { Button, Card, Option, Select, ThemeProvider, Tooltip, Typography } from "@material-tailwind/react";
import { Input } from "@/Components/Input";
import { ListPlus, ListX } from "lucide-react";
import { FormDataKeluarga, type FormDataPendidikanFormal } from "@/Pages/Admin/MASTER_PegawaiCreatePage";
import value = ThemeProvider.propTypes.value;

const PegawaiFormDataKeluarga = ({ formState, setFormState, formInitial }: {
    formState: FormDataKeluarga[];
    setFormState: Dispatch<SetStateAction<FormDataKeluarga[]>>;
    formInitial: FormDataKeluarga;
}) => {

    const TABLE_HEAD = [
        { key: 'status', label: 'Status Dalam Keluarga' },
        { key: 'nama', label: 'Nama Lengkap' },
        { key: 'jenisKelamin', label: 'Jenis Kelamin' },
        { key: 'tempatLahir', label: 'Tempat Lahir' },
        { key: 'tanggalLahir', label: 'Tanggal Lahir' },
        { key: 'pekerjaan', label: 'Pekerjaan' },
        { key: 'pendidikan', label: 'Pendidikan' }
    ];
    const STATUS_KELUARGA = [ "Kepala keluarga", "Istri", "Anak","Orang tua", "Lainnya" ];

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
    const handleSelectChange = (index: number, key: keyof FormDataKeluarga, value: string) => {
        setFormState((prevState) =>
            prevState.map((prev, idx) =>
                idx === index ? { ...prev, [key]: value } : prev
            )
        );
    };

    return (
        <>
            <Card className="relative col-span-1 lg:col-span-2 w-full !rounded-none space-y-4 pb-16">
                <div className="overflow-auto min-h-96">
                    <table className="col-span-2 table-auto text-left border-2">
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
                                    <td className={ classes }>
                                        <Select
                                            label="Status dlm keluarga"
                                            color="teal"
                                            onChange={(value) => {
                                                handleSelectChange(index, 'status', value ?? '');
                                            }}
                                        >
                                            { STATUS_KELUARGA.map((status) => ((
                                                <Option
                                                    key={ status }
                                                    value={ status }
                                                                                           >
                                                    { status }
                                                </Option>
                                            ))) }
                                        </Select>
                                    </td>
                                    { TABLE_HEAD.filter((_, idx) => idx !== 0).map(({ key, label }, idx) => (
                                        <td key={`${index}-${idx}`} className={classes}>
                                            {
                                                key === 'jenisKelamin'
                                                    ? (
                                                        <Select
                                                            label="Jenis kelamin"
                                                            color="teal"
                                                            onChange={(value) => handleSelectChange(index, 'jenisKelamin', value ?? '')}
                                                        >
                                                            <Option>Laki-laki</Option>
                                                            <Option>Perempuan</Option>
                                                        </Select>
                                                    ) : key === 'tanggalLahir'
                                                        ? (
                                                            <Input
                                                                color="teal"
                                                                type="date"
                                                                id={String(index)}
                                                                name={key}
                                                                label={ label }
                                                                value={formState[key]}
                                                                onChange={handleChangeInput}
                                                            />
                                                        ) : (
                                                            <Input
                                                                color="teal"
                                                                type="text"
                                                                id={String(index)}
                                                                label={ label }
                                                                name={key}
                                                                value={formState[key]}
                                                                onChange={handleChangeInput}
                                                            />
                                                        )
                                            }
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

export default memo(PegawaiFormDataKeluarga);
