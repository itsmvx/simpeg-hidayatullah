import { ForwardedRef, forwardRef } from "react";
import { Checkbox as MTCheckbox, CheckboxProps } from "@material-tailwind/react";

export const Checkbox = forwardRef<HTMLInputElement, CheckboxProps>
((props: CheckboxProps, ref?: ForwardedRef<HTMLInputElement> | undefined) => {
    return (
        <>
            <MTCheckbox { ...props as CheckboxProps } className={`focus:ring-0 ${ props.className }`} crossOrigin={undefined} ref={ref}>
                { props.children }
            </MTCheckbox>
        </>
    );
});
