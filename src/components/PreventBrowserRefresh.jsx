import { useEffect } from 'react';

const PreventBrowserRefresh = () => {
    useEffect(() => {
        let lastTouchY = 0;
        
        const touchStart = (event) => {
            lastTouchY = event.touches[0].clientY;
        };

        const touchMove = (event) => {
            const touchY = event.touches[0].clientY;
            if (touchY > lastTouchY + 10) {
                event.preventDefault();
            }
        };

        document.addEventListener('touchstart', touchStart, { passive: false });
        document.addEventListener('touchmove', touchMove, { passive: false });

        return () => {
            document.removeEventListener('touchstart', touchStart);
            document.removeEventListener('touchmove', touchMove);
        };
    }, []);

    return null;
};

export default PreventBrowserRefresh;
