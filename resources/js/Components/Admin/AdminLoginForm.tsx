import { Button, Card, IconButton, Tooltip, Typography } from "@material-tailwind/react";
import { Input } from "@/Components/Input";
import { ArrowLeft, Eye, EyeOff } from "lucide-react";
import { Dispatch, memo, SetStateAction, SyntheticEvent } from "react";
import { PPHLogo } from "@/Lib/StaticImages";

type Form = {
    username: string;
    password: string;
    passwordView: boolean;
    onSubmit: boolean;
    error: {
        username: boolean;
        password: boolean;
    };
    unit: {
        id: string;
        nama: string;
    };
};
const AdminLoginForm = ({ form, setForm, handleSubmit }: {
    form: Form;
    setForm: Dispatch<SetStateAction<Form>>;
    handleSubmit: (event: SyntheticEvent<HTMLFormElement>) => void
}) => {
    return (
        <>
            <Card className="relative w-[25rem] md:w-[28rem] lg:w-[30rem] flex flex-col gap-4 border-2 !border-zinc-900/80 p-11 transition-all duration-200 ease-in-out !overflow-hidden">
                <Tooltip content="Kembali">
                    <button
                        className="absolute top-0 left-0 !shadow-none flex items-center gap-3 py-2.5 px-4 !rounded-none !rounded-br hover:!bg-gray-900 hover:!text-white"
                        onClick={() => {
                            setForm((prevState) => ({
                                ...prevState,
                                unit: {
                                    id: '',
                                    nama: ''
                                }
                            }));
                        }}
                    >
                        <ArrowLeft />
                    </button>
                </Tooltip>
                <div className="text-center mb-5">
                    <div className="mx-auto w-20 h-20 flex content-center">
                        <img src={PPHLogo} alt="logo-pph" />
                    </div>
                    <Typography variant="h4" className="font-bold">
                        Login Admin
                    </Typography>
                    <Typography variant="h3" className="font-bold mb-3">
                        { form.unit.nama }
                    </Typography>
                    <Typography variant="h5">
                        Selamat Datang
                    </Typography>
                </div>
                <form className="space-y-10" onSubmit={ handleSubmit }>
                    <div className="mb-1 flex flex-col gap-4">
                        <Typography variant="small" color="blue-gray" className="-mb-3 font-medium">
                            Username
                        </Typography>
                        <Input
                            size="lg"
                            placeholder="masukkan username"
                            value={ form.username }
                            error={ form.error.username }
                            onChange={ (event) => {
                                setForm((prevState) => ({
                                    ...prevState,
                                    username: event.target.value,
                                    error: {
                                        ...prevState.error,
                                        username: event.target.value.length < 1
                                    }
                                }))
                            } }
                            className="!border-t-blue-gray-200 focus:!border-t-gray-900"
                            labelProps={ {
                                className: "before:content-none after:content-none",
                            } }
                        />
                        <Typography variant="small" color="blue-gray" className="-mb-3 font-medium">
                            Password
                        </Typography>
                        <div className="flex items-center justify-center gap-1">
                            <Input
                                type={ form.passwordView ? 'text' : 'password' }
                                size="lg"
                                placeholder="********"
                                error={ form.error.password }
                                onChange={ (event) => {
                                    setForm((prevState) => ({
                                        ...prevState,
                                        password: event.target.value,
                                        error: {
                                            ...prevState.error,
                                            password: event.target.value.length < 1
                                        }
                                    }))
                                } }
                                className="!border-t-blue-gray-200 focus:!border-t-gray-900"
                                labelProps={ {
                                    className: "before:content-none after:content-none",
                                } }
                            />
                            <IconButton
                                type="button"
                                onClick={ () => {
                                    setForm((prevState) => ({
                                        ...prevState,
                                        passwordView: !prevState.passwordView
                                    }));
                                } }
                                className="w-12 aspect-square flex items-center justify-center"
                            >
                                { form.passwordView
                                    ? (
                                        <Eye/>
                                    ) : (
                                        <EyeOff/>
                                    )
                                }
                            </IconButton>
                        </div>
                    </div>
                    <Button
                        type="submit"
                        className="mt-6 flex items-center justify-center"
                        loading={ form.onSubmit }
                        fullWidth
                    >
                        Masuk
                    </Button>
                </form>
            </Card>
        </>
    );
};

export default memo(AdminLoginForm);
