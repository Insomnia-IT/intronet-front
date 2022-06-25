import React, {
  Children,
  ReactElement,
  useEffect,
  useRef,
  useState,
} from "react";
import { JsxElement } from "typescript";

const visibleElements = new EventTarget();
// <Map<Element, IntersectionObserverEntry>>(
//   new Map()
// );
const observer = new IntersectionObserver(
  (entries) => {
    visibleElements.dispatchEvent(
      new CustomEvent("change", {
        detail: new Map(entries.map((x) => [x.target, x])),
      })
    );
  },
  {
    root: document.body,
    rootMargin: "50%",
  }
);

export function Intersection(props: IntersectionProps) {
  const ref = useRef();
  const [isVisible, setIsVisible] = useState(false);
  useEffect(() => {
    const element = ref.current;
    const listener = (
      ev: CustomEvent<Map<Element, IntersectionObserverEntry>>
    ) => {
      if (ev.detail.has(element)) {
        const isVisible = ev.detail.get(element).isIntersecting;
        setIsVisible(isVisible);
      }
    };
    visibleElements.addEventListener("change", listener);
    observer.observe(element);
    return () => {
      observer.unobserve(element);
      visibleElements.removeEventListener("change", listener);
    };
  }, []);
  if (isVisible) {
    return <div ref={ref}>{props.children}</div>;
  }
  return <div ref={ref} style={{ width: props.width, height: props.height }} />;
}

type IntersectionProps = {
  width?: number | string;
  height?: number | string;
  children: ReactElement;
};
