import { Input } from "@/Components/Input";
import { AdminLayout } from "@/Layouts/AdminLayout";
import { Head } from "@inertiajs/react";
import { ChangeEvent, useState } from "react";
import { Button, Typography } from "@material-tailwind/react";
import { format } from "date-fns";
import { id } from "date-fns/locale";
import { Save } from "lucide-react";
import { TextArea } from "@/Components/TextArea";

type Unit = {
    id: string;
    nama: string;
    keterangan: string;
    created_at: string;
}
export default function AdminDetailsPage({ unit }: {
    unit: Unit
}) {
    const [ unitState, setUnitState ] = useState(unit);
    const [ onChangeUnit, setOnChangeUnit ] = useState(false);

    const handleUnitChange = (event: ChangeEvent<HTMLInputElement> | ChangeEvent<HTMLTextAreaElement>) => {
        const payload = {
            [event.target.name as keyof Unit]: event.target.value,
        };

        setUnitState((prevState) => ({
            ...prevState,
            ...payload
        }));
    }
    return (
        <>
            <Head title="Master - Admin Details" />
            <AdminLayout>
                <div className="space-y-3">
                    <div className="mx-auto flex items-center justify-center w-40 h-40 rounded-full border-4 border-pph-black bg-pph-green">
                        <h3 className="font-bold text-4xl text-pph-white/90">
                            { unit.nama.split(' ').map(word => word.charAt(0).toUpperCase()).join('').slice(0, 2) }
                        </h3>
                    </div>
                    <div className="flex flex-col items-center justify-center">
                        <p>Tanggal Didaftarkan:</p>
                        <p>{ format(unitState.created_at, 'PPPP', {
                            locale: id
                        }) }</p>
                    </div>

                    <form className="flex flex-col gap-4">
                        <div>
                            <Typography
                                variant="small"
                                color="gray"
                                className="mt-2 flex items-center gap-1 font-normal"
                            >
                                <svg
                                    xmlns="http://www.w3.org/2000/svg"
                                    viewBox="0 0 24 24"
                                    fill="currentColor"
                                    className="-mt-px h-4 w-4"
                                >
                                    <path
                                        fillRule="evenodd"
                                        d="M2.25 12c0-5.385 4.365-9.75 9.75-9.75s9.75 4.365 9.75 9.75-4.365 9.75-9.75 9.75S2.25 17.385 2.25 12zm8.706-1.442c1.146-.573 2.437.463 2.126 1.706l-.709 2.836.042-.02a.75.75 0 01.67 1.34l-.04.022c-1.147.573-2.438-.463-2.127-1.706l.71-2.836-.042.02a.75.75 0 11-.671-1.34l.041-.022zM12 9a.75.75 0 100-1.5.75.75 0 000 1.5z"
                                        clipRule="evenodd"
                                    />
                                </svg>
                                ID Unit
                            </Typography>
                            <Input
                                type="text"
                                label="ID Unit"
                                disabled
                                value={unitState.id}
                                onChange={handleUnitChange}
                            />
                        </div>
                        <Input
                            type="text"
                            value={ unitState.nama }
                            label="Nama Unit"
                            name="nama"
                            onChange={ handleUnitChange }
                        />
                        <TextArea
                            value={ unitState.keterangan }
                            label="Keterangan"
                            name="keterangan"
                            onChange={ handleUnitChange }
                        />
                        <Button
                            color="blue"
                            className="group *:group-disabled:text-gray-50 flex items-center justify-center h-10 gap-1 text-base"
                            disabled={!onChangeUnit}
                        >
                            <span className="normal-case">
                                Simpan
                            </span>
                            <Save />
                        </Button>
                    </form>
                </div>
            </AdminLayout>
        </>
    )
}
