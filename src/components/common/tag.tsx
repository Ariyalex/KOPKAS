import clsx from "clsx";

interface TagProps {
    color: string;
    bgColor: string;
    children: string
}

export function Tag({ color, bgColor, children }: TagProps) {
    return (
        <div className={clsx("py-0.5 px-2 w-fit h-fit text-sm rounded-full  ", color, bgColor)}>
            {children}
        </div>
    )
}