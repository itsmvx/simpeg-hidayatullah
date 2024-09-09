import { MasterLayout } from "@/Layouts/MasterLayout";
import { PageProps } from "@/types";
import { Head, Link } from "@inertiajs/react";
import { Button } from "@material-tailwind/react";
import { Plus } from "lucide-react";

export default function MASTER_SumberDayaIndexPage({ auth }: PageProps) {
    return (
        <>
            <Head title="Master - Sumber Daya"/>
            <MasterLayout auth={ auth }>
                <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-3">
                    <div className="relative group overflow-hidden p-8 rounded-xl bg-white border border-gray-300">
                        <div aria-hidden="true" className="inset-0 absolute aspect-video border rounded-full -translate-y-1/2 group-hover:-translate-y-1/4 duration-300 bg-gradient-to-b from-blue-500 to-white blur-2xl opacity-25"></div>
                        <div className="relative">
                            <div className="border border-blue-500/10 flex relative *:relative *:size-6 *:m-auto size-12 rounded-lg before:rounded-[7px] before:absolute before:inset-0 before:border-t before:border-white before:from-blue-100 before:bg-gradient-to-b before:shadow">
                                <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="lucide lucide-signature">
                                    <path d="m21 17-2.156-1.868A.5.5 0 0 0 18 15.5v.5a1 1 0 0 1-1 1h-2a1 1 0 0 1-1-1c0-2.545-3.991-3.97-8.5-4a1 1 0 0 0 0 5c4.153 0 4.745-11.295 5.708-13.5a2.5 2.5 0 1 1 3.31 3.284"/>
                                    <path d="M3 21h18"/>
                                </svg>
                            </div>

                            <div className="mt-6 pb-6 rounded-b-[--card-border-radius]">
                                <p className="text-gray-700 font-medium">
                                    Surat perjanjian kontrak kerja
                                </p>
                            </div>

                            <div className="flex gap-3 -mb-8 py-4 border-t border-gray-200">
                                <Link href={route('master.sumber-daya.surat-kontrak-kerja')} className="group rounded-xl disabled:border *:select-none [&>*:not(.sr-only)]:relative *:disabled:opacity-20 disabled:text-gray-950 disabled:border-gray-200 disabled:bg-gray-100 bg-gray-100 hover:bg-gray-200/75 active:bg-gray-100 flex gap-1.5 items-center text-sm h-8 px-3.5 justify-center">
                                    <span className="font-medium">Buat</span>
                                    <Plus width={18} />
                                </Link>
                            </div>
                        </div>
                    </div>
                </div>
            </MasterLayout>
        </>
    );
}
