import { ForwardedRef, forwardRef } from "react";
import { Textarea as MTTextArea, TextareaProps } from "@material-tailwind/react";

export const TextArea = forwardRef<HTMLDivElement, TextareaProps>
((props: TextareaProps, ref?: ForwardedRef<HTMLDivElement> | undefined) => {
    return (
        <>
            <MTTextArea { ...props as TextareaProps } className={`focus:ring-0 ${ props.className }`} ref={ref}>
                { props.children }
            </MTTextArea>
        </>
    );
});
