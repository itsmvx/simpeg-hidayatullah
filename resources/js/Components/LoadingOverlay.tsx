import { PPHLogo } from "@/Lib/StaticImages";

export const LoadingOverlay = ({ className }: { className?: string }) => {
    return (
        <>
            <div className="fixed inset-0 h-screen flex items-center justify-center bg-gray-200/70 z-[9999]">
                <div className={ `relative w-24 h-24 m-auto ${ className as string }` }>
                    <img
                        src={ PPHLogo } width={ 60 }
                        alt="pph-logo"
                        className="absolute top-1/2 -translate-y-1/2 left-1/2 -translate-x-1/2"
                    />
                    <div className="animate-spin border-8 border-l-[#181916] border-r-[#8EC843]  rounded-full w-24 h-24"/>
                </div>
            </div>
        </>
    );
};
