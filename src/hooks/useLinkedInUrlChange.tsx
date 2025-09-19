import { useEffect, useRef } from "react";

function useLinkedInUrlChange(callback: () => void) {
    const lastUrl = useRef(window.location.href);

    useEffect(() => {
        const observer = new MutationObserver(() => {
            if (lastUrl.current !== window.location.href) {
                lastUrl.current = window.location.href;
                callback();
            }
        });

        observer.observe(document.body, { childList: true, subtree: true });

        return () => observer.disconnect();
    }, [callback]);
}

export default useLinkedInUrlChange;
