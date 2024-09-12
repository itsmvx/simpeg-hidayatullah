import { Typography } from "@material-tailwind/react";
import { Heart } from "lucide-react";

export const Footer = () => {

    return (
        <footer className="py-2">
            <div className="flex w-full flex-wrap items-center justify-center gap-6 px-2 md:justify-between">
                <Typography as="div" variant="small" className="font-normal text-inherit ">
                    &copy; 2024, made with{" "}
                    <a href={route('hall-of-fames')} target="_blank" className="mx-0.5">
                        <Heart className="-mt-0.5 inline-block h-3.5 w-3.5 text-red-600" />
                    </a>
                    by KKN ITATS Kelompok 2
                </Typography>
            </div>
        </footer>
    );
};
