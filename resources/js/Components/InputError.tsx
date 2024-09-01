import { CircleAlert } from "lucide-react";
import { HTMLAttributes } from "react";

export default function InputError({
    message,
    className = "",
    ...props
}: HTMLAttributes<HTMLParagraphElement> & { message?: string }) {
    return message ? (
        <p
            {...props}
            className={
                "text-sm text-red-600 flex items-center gap-2 bg-red-100 p-2 rounded-lg " +
                className
            }
        >
            <CircleAlert className="w-4 h-4" />
            {message}
        </p>
    ) : null;
}
