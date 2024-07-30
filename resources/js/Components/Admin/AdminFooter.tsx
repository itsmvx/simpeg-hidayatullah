import { Typography } from "@material-tailwind/react";
import { Heart } from "lucide-react";

export const AdminFooter = ({ brandName, brandLink }: {
    brandName: string;
    brandLink: string;
}) => {
    const year = new Date().getFullYear();
    const routes = [
            { key: "Creative Tim", path: "https://www.creative-tim.com" },
            { key: "About Us", path: "https://www.creative-tim.com/presentation" },
            { key: "Blog", path: "https://www.creative-tim.com/blog" },
            { key: "License", path: "https://www.creative-tim.com/license" },
    ];

    return (
        <footer className="py-2">
            <div className="flex w-full flex-wrap items-center justify-center gap-6 px-2 md:justify-between">
                <Typography variant="small" className="font-normal text-inherit">
                    &copy; {year}, made with{" "}
                    <Heart className="-mt-0.5 inline-block h-3.5 w-3.5 text-red-600" /> by{" "}
                    <a
                        href={brandLink}
                        target="_blank"
                        className="transition-colors hover:text-blue-500 font-bold"
                    >
                        {brandName}
                    </a>{" "}
                    for a better web.
                </Typography>
                <ul className="flex items-center gap-4">
                    {routes.map(({ name, path }) => (
                        <li key={name}>
                            <Typography
                                as="a"
                                href={path}
                                target="_blank"
                                variant="small"
                                className="py-0.5 px-1 font-normal text-inherit transition-colors hover:text-blue-500"
                            >
                                {name}
                            </Typography>
                        </li>
                    ))}
                </ul>
            </div>
        </footer>
    );
};
