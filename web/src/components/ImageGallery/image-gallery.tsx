import { FunctionalComponent } from "preact";
import { useEffect, useMemo, useRef, useState } from "preact/hooks";
import styles from "./image-gallery.module.css";

const SWIPE_THRESHOLD = 40;

export const ImageGallery: FunctionalComponent<{
  images?: string[];
  alt: string;
}> = ({ images, alt }) => {
  const allSlides = useMemo(
    () => (images ?? []).filter(Boolean),
    [images?.join("|")]
  );
  const [failed, setFailed] = useState<Set<string>>(() => new Set());
  const slides = allSlides.filter((url) => !failed.has(url));
  const [index, setIndex] = useState(0);
  const swipeStartX = useRef(0);

  useEffect(() => {
    setIndex(0);
    setFailed(new Set());
  }, [allSlides.join("|")]);

  useEffect(() => {
    if (index >= slides.length && slides.length) setIndex(0);
  }, [slides.length, index]);

  const go = (dir: 1 | -1) => {
    if (slides.length <= 1) return;
    setIndex((i) => (i + dir + slides.length) % slides.length);
  };

  const onSwipeStart = (clientX: number) => {
    swipeStartX.current = clientX;
  };

  const onSwipeEnd = (clientX: number) => {
    const dx = clientX - swipeStartX.current;
    if (Math.abs(dx) < SWIPE_THRESHOLD) return;
    go(dx < 0 ? 1 : -1);
  };

  if (!slides.length) return null;

  const safeIndex = index < slides.length ? index : 0;
  const src = slides[safeIndex];

  return (
    <div
      className={styles.wrap}
      onTouchStart={(e) => onSwipeStart(e.touches[0].clientX)}
      onTouchEnd={(e) => onSwipeEnd(e.changedTouches[0].clientX)}
      onPointerDown={(e) => {
        if (e.pointerType === "mouse" && e.button !== 0) return;
        onSwipeStart(e.clientX);
        (e.currentTarget as HTMLElement).setPointerCapture(e.pointerId);
      }}
      onPointerUp={(e) => onSwipeEnd(e.clientX)}
    >
      <div className={styles.imageFrame}>
        <img
          key={src}
          className={styles.image}
          src={src}
          alt={alt}
          decoding="async"
          draggable={false}
          onError={() =>
            setFailed((prev) => new Set([...prev, src]))
          }
        />
      </div>
      {slides.length > 1 && (
        <div className={styles.dots}>
          {slides.map((url, i) => (
            <span
              key={url}
              className={[
                styles.dot,
                i === safeIndex ? styles.dotActive : "",
              ].join(" ")}
            />
          ))}
        </div>
      )}
    </div>
  );
};
