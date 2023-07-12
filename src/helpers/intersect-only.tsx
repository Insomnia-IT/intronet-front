import {EventEmitter} from "@cmmn/cell/lib";
import {useCallback, useEffect, useLayoutEffect, useRef, useState} from "preact/hooks";

const onChange = new EventEmitter<{event: IntersectionObserverEntry[]}>()
const observer = new IntersectionObserver(event => onChange.emit('event', event), {
  root: document,
  rootMargin: `50%`
});
type VirtualListProps = {
  children: any;
  height: number;
};
export function IntersectOnly(props: VirtualListProps){
  const [isVisible, setIsVisible] = useState(false)
  const ref = useRef<HTMLDivElement>();
  useLayoutEffect(() => {
    if (!ref.current)
      return;
    const div = ref.current;
    observer.observe(div);
    const off = onChange.on('event', e => {
      if (e.filter(x => x.target === ref.current).some(x => x.isIntersecting)) {
        console.log(e.find(x => x.target === ref.current).rootBounds)
        setIsVisible(true);
      }
    })
    return () => {
      observer.unobserve(div);
      off();
    };
  }, [ref]);
  if (isVisible)
    return props.children;
  return <div ref={ref} style={{height: props.height}}/>;
}
