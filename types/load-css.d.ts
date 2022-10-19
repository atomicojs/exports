export function loadCss({ cssInline }: {
    cssInline: boolean;
}): ({ share, src }: {
    share: any;
    src: any;
}) => Promise<{
    inline: string;
}>;
