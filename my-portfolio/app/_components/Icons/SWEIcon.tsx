import { ComponentPropsWithoutRef } from "react"

export const SWEIcon = (props: ComponentPropsWithoutRef<"svg"> & {size?: number}) => {
    const { size = 24, ...restProps } = props;
    return (            
            <svg width={0.95*size} height={0.95*size}  viewBox="0 0 24 24"><g fill="none" stroke="currentColor" preserveAspectRatio="xMidYMid" {...restProps} strokeWidth={2}><path d="M2 12c0-4.714 0-7.071 1.464-8.536C4.93 2 7.286 2 12 2c4.714 0 7.071 0 8.535 1.464C22 4.93 22 7.286 22 12c0 4.714 0 7.071-1.465 8.535C19.072 22 16.714 22 12 22s-7.071 0-8.536-1.465C2 19.072 2 16.714 2 12Z"></path><path strokeLinecap="round" d="M17 15h-5m-5-5l.234.195c1.282 1.068 1.923 1.602 1.923 2.305c0 .703-.64 1.237-1.923 2.305L7 15"></path></g></svg>
    )
}