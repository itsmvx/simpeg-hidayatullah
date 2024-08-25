import { Head } from "@inertiajs/react";
import { Linkedin, Mail } from "lucide-react";
import { PPHLogo } from "@/Lib/StaticImages";

export default function HallOfFamesPage() {

    const DevTeams: {
        nama: string;
        avatar: string | null;
        kontribusi: string;
        email: string | null;
        linkedIn: string | null;
        github: string | null;
    }[] = [
        {
            nama: `It's me Vain X`,
            avatar: 'https://avatars.githubusercontent.com/u/132477830?v=4',
            kontribusi: 'Programmer Gen.1',
            email: 'latif.s12401@gmail.com',
            linkedIn: 'www.linkedin.com/in/latifs24',
            github: 'https://github.com/itsmvx'
        },
        {
            nama: `Indy Adira Khalfani`,
            avatar: 'https://avatars.githubusercontent.com/u/45002979?v=4',
            kontribusi: 'Quality Control Gen.1',
            email: 'indyadira.learn@gmail.com',
            linkedIn: 'https://www.linkedin.com/in/indyadirak',
            github: 'https://github.com/indyadirak'
        },
    ];
    return (
        <>
            <Head title="Hall Of Fames" />
            <section className="py-6 dark:bg-gray-100 dark:text-gray-800">
                <div className="container flex flex-col items-center justify-center p-4 mx-auto sm:p-10">
                    <p className="p-2 text-lg font-semibold tracking-wider text-center uppercase">Tim Pengembangan Sistem</p>
                    <h1 className="text-4xl font-bold leading-none text-center sm:text-5xl">Terima kasih untuk orang-orang</h1>
                    <h1 className="mt-5 text-xl font-medium leading-none text-center">Yang berkontribusi dalam pengembangan sistem</h1>
                    <div className="flex flex-row flex-wrap-reverse justify-center mt-8">
                        {
                            DevTeams.map((dev) => ((
                                <div className="flex flex-col justify-center w-full px-8 mx-6 my-12 text-center rounded-md md:w-96 lg:w-80 xl:w-64 dark:bg-gray-800 dark:text-gray-100">
                                    <img alt={dev.nama} className="self-center flex-shrink-0 w-24 h-24 -mt-12 bg-center bg-cover rounded-full dark:bg-gray-500" src={dev.avatar ?? PPHLogo}  />
                                    <div className="flex-1 my-4">
                                        <p className="text-xl font-semibold leading-snug">
                                            { dev.nama }
                                        </p>
                                        <p>{ dev.kontribusi }</p>
                                    </div>
                                    <div className="flex items-center justify-center p-3 space-x-3 border-t-2">
                                        {dev.email && (
                                            <a
                                                rel="noopener noreferrer"
                                                href={`mailto:${dev.email}?Subject=Halo!`}
                                                title="Email"
                                                className="text-gray-900 hover:text-red-200"
                                            >
                                                <Mail />
                                            </a>
                                        )}
                                        <a rel="noopener noreferrer" href={dev.linkedIn ?? '#'} title="LinkedIn" target="_blank" className="text-gray-900 hover:text-blue-300">
                                            <Linkedin />
                                        </a>
                                        <a rel="noopener noreferrer" href={dev.github ?? '#'} title="GitHub" target="_blank" className="text-gray-900 hover:text-gray-400">
                                            <svg xmlns="http://www.w3.org/2000/svg" fill="currentColor" viewBox="0 0 32 32" className="w-5 h-5">
                                                <path d="M16 0.396c-8.839 0-16 7.167-16 16 0 7.073 4.584 13.068 10.937 15.183 0.803 0.151 1.093-0.344 1.093-0.772 0-0.38-0.009-1.385-0.015-2.719-4.453 0.964-5.391-2.151-5.391-2.151-0.729-1.844-1.781-2.339-1.781-2.339-1.448-0.989 0.115-0.968 0.115-0.968 1.604 0.109 2.448 1.645 2.448 1.645 1.427 2.448 3.744 1.74 4.661 1.328 0.14-1.031 0.557-1.74 1.011-2.135-3.552-0.401-7.287-1.776-7.287-7.907 0-1.751 0.62-3.177 1.645-4.297-0.177-0.401-0.719-2.031 0.141-4.235 0 0 1.339-0.427 4.4 1.641 1.281-0.355 2.641-0.532 4-0.541 1.36 0.009 2.719 0.187 4 0.541 3.043-2.068 4.381-1.641 4.381-1.641 0.859 2.204 0.317 3.833 0.161 4.235 1.015 1.12 1.635 2.547 1.635 4.297 0 6.145-3.74 7.5-7.296 7.891 0.556 0.479 1.077 1.464 1.077 2.959 0 2.14-0.020 3.864-0.020 4.385 0 0.416 0.28 0.916 1.104 0.755 6.4-2.093 10.979-8.093 10.979-15.156 0-8.833-7.161-16-16-16z"></path>
                                            </svg>
                                        </a>
                                    </div>
                                </div>
                            )))
                        }
                    </div>
                </div>
            </section>
        </>
    );
}
