import { useEffect, useRef } from "preact/hooks";
import {JSX} from "preact";

export function factory(
  html: string
): (key: string | number, options?: IIconOptions) => JSX.Element {
  const div = document.createElementNS("http://www.w3.org/2000/svg", "svg");
  div.innerHTML = html;
  // const div = React.createElement(ReactWrapper, { html, custom: null });
  const cache = new Map<string | number, HTMLCollection>();

  return (key: string | number) => {
    if (!cache.has(key)) {
      const cloned = (div.cloneNode(true) as HTMLElement).children; // React.cloneElement<{ html, custom }>(div, { custom });
      cache.set(key, cloned);
    }
    return <ReactWrapper html={cache.get(key)} />;
  };
}

function ReactWrapper({ html }: { html: HTMLCollection }) {
  const ref = useRef<SVGSVGElement>();
  useEffect(() => {
    for (let child of Array.from(ref.current.children)) {
      child.remove();
    }
    for (let child of Array.from(html)) {
      ref.current.append(child);
    }
  }, []);
  return <svg ref={ref} />;
}

export interface IIconOptions {}
