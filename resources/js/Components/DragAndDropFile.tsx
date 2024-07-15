import { Dispatch, SetStateAction, useEffect } from "react";
import { z } from "zod";
import { notifyToast } from "@/Lib/Utils";

type DragAndDropFile = {
    open: boolean;
    file: File | null;
}
export const DragNDropFile = ({ state, setState }: {
    state: DragAndDropFile
    setState: Dispatch<SetStateAction<DragAndDropFile>>;
}) => {
    const ACCEPTED_IMAGE_TYPES = [
        'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet'
    ]
    const handleFilesUpload = (files: File[]) => {
        try {
            const verifiedFiles: File[] = files.map((file: File) => {
                return z.any()
                    .refine((file: File) => ACCEPTED_IMAGE_TYPES.includes(file?.type))
                    .parse(file);
            });
            setState((prevState) => ({
                ...prevState,
                file: verifiedFiles[0]
            }));
        } catch (error: any) {
            notifyToast('error', 'Hanya file xlsx');
        }
        setState((prevState) => ({
            ...prevState,
            open: false
        }));
    };

    return (
        <>
            <div className="max-w-lg mx-auto p-6 bg-white dark:bg-gray-800 rounded-md">
                <h2 className="text-3xl font-semibold text-center mb-6 dark:text-white">File Upload</h2>
                <div className="relative border-2 border-dashed border-gray-300 dark:border-gray-600 rounded-md px-2 py-8 text-center">
                    <div
                        aria-current={false}
                        className="absolute inset-0 group bg-transparent z-20 aria-[current=true]:bg-blue-gray-100/70"
                        onDragOver={ (event) => {
                            event.preventDefault();
                            event.stopPropagation();
                            event.currentTarget.ariaCurrent = 'true';
                        }}
                        onDragLeave={(event) => {
                            event.currentTarget.ariaCurrent = 'false';
                        }}
                        onDrop={ (event) => {
                            event.preventDefault();
                            event.stopPropagation();
                            if (!event.dataTransfer.files) {
                                return;
                            }
                            const files: File[] = Array.from(event.dataTransfer.files);
                            handleFilesUpload(files);
                            event.currentTarget.ariaCurrent = 'false';
                        }}
                    />
                    <input
                        type="file"
                        accept="application/vnd.openxmlformats-officedocument.spreadsheetml.sheet"
                        onChange={ (event) => {
                            if (!event.target.files) {
                                return;
                            }
                            handleFilesUpload(Array.from(event.target.files));
                            event.target.value = '';
                        } }
                        className="hidden"
                        id="fileInput"
                    />
                    <svg className="mx-auto h-16 w-16 text-gray-400 dark:text-gray-300 mb-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M16 17l-4 4m0 0l-4-4m4 4V3"></path>
                    </svg>
                    <p className="text-sm text-gray-600 dark:text-gray-400 font-medium">Seret dan letakkan file disini</p>
                </div>
                <p className="text-sm font-semibold text-gray-900 text-center">
                    <label htmlFor="fileInput" className="cursor-pointer text-blue-500 hover:underline"> Cari file</label> untuk diupload.
                </p>
            </div>
        </>
    );
};
