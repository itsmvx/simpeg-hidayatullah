import { useEffect, useState } from "react";
import { Button } from "@material-tailwind/react";
import { ChevronsDown, ChevronsUp } from "lucide-react";

export const ScrollToTopBottom = () => {
    const [ showScrollTop, setShowScrollTop ] = useState(false);
    const [ showScrollBottom, setShowScrollBottom ] = useState(false);

    const handleScroll = () => {
        const scrollY = window.scrollY;
        const windowHeight = document.documentElement.clientHeight;
        const fullHeight = document.documentElement.scrollHeight;

        setShowScrollTop(scrollY > windowHeight / 2);
        setShowScrollBottom(scrollY + windowHeight < fullHeight - 10);
    };
    const scrollToTop = () => {
        window.scrollTo({
            top: 0,
            behavior: 'smooth',
        });
    };
    const scrollToBottom = () => {
        window.scrollTo({
            top: document.documentElement.scrollHeight,
            behavior: 'smooth',
        });
    };
    useEffect(() => {
        window.addEventListener('scroll', handleScroll);
        return () => {
            window.removeEventListener('scroll', handleScroll);
        };
    }, []);

    return (
        <>
            {showScrollTop && (
                <Button
                    onClick={scrollToTop}
                    className="!fixed w-10 h-10 bottom-20 right-8 bg-pph-green-deep !p-1.5 !shadow-none rounded-full"
                >
                    <ChevronsUp className="mx-auto" />
                </Button>
            )}
            {showScrollBottom && (
                <Button
                    onClick={scrollToBottom}
                    className="!fixed w-10 h-10 bottom-8 right-8 bg-pph-green-deep !p-1.5 !shadow-none rounded-full"
                >
                    <ChevronsDown className="mx-auto" />
                </Button>
            )}
        </>
    );
};
