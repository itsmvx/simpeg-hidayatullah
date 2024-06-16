import { ForwardedRef, forwardRef } from "react";
import { Input as MTInput, InputProps } from "@material-tailwind/react";

export const Input = forwardRef<HTMLInputElement, InputProps>
((props: InputProps, ref?: ForwardedRef<HTMLInputElement> | undefined) => {
    return (
        <>
            <MTInput { ...props as InputProps } className={`focus:ring-0 ${ props.className }`} crossOrigin={undefined} ref={ref}>
                { props.children }
            </MTInput>
        </>
    );
});
