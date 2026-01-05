import { useEffect, useRef } from 'react';

/**
 * A custom hook that triggers a callback when the target element comes into view.
 * @param callback Function to call when the element intersects
 * @param hasMore Condition to check if there are more items to load (prevents callback if false)
 * @param loading Condition to check if currently loading (prevents callback if true)
 */
export function useInfiniteScroll(callback: () => void, hasMore: boolean, loading: boolean) {
    const observerTarget = useRef<HTMLDivElement>(null);

    useEffect(() => {
        const element = observerTarget.current;
        if (!element) return;

        const observer = new IntersectionObserver(
            (entries) => {
                const first = entries[0];
                if (first.isIntersecting && hasMore && !loading) {
                    callback();
                }
            },
            {
                root: null,
                rootMargin: '100px', // Trigger before reaching the absolute bottom
                threshold: 0.1
            }
        );

        observer.observe(element);

        return () => {
            if (element) observer.unobserve(element);
        };
    }, [callback, hasMore, loading]);

    return observerTarget;
}
