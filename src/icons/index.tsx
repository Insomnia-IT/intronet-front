import {useCallback, useEffect, useRef} from "preact/hooks";
import {FunctionalComponent, JSX} from "preact";

const svgDocument = (async function getIcons(){
  const svg = await fetch('/public/icons/icons.svg').then(x => x.text());
  const div = document.createElement('div');
  div.innerHTML = svg;
  return div;
})();

export const SvgIcon: FunctionalComponent<SvgIconProps> = ({id, g, size, ...props}) => {
  const ref = useRef<SVGGElement & SVGSVGElement>();
  useEffect(() => {
    if (!ref.current) return;
    svgDocument.then(div => {
      const icon = div.querySelector(id)?.firstElementChild as SVGGElement;
      if (!icon)
        return console.warn(`not found icon: `, id);
      icon.setAttribute('vector-effect', 'non-scaling-stroke')
      icon && ref.current.appendChild(icon.cloneNode(true));
    });
  }, [ref, id]);
  if (g) {
    const {transform, ...otherProps} = props;
    const transforms = transform ? [transform] : [];
    if (size){
      transforms.push(`scale(${size}) scale(0.03125)`)
    }
    return <g ref={ref} transform={transforms.join(' ') || undefined} {...otherProps}/>;
  }
  return <svg ref={ref} viewBox="0 0 24 24" vectorEffect="non-scaling-stroke"
              width={size ?? 24} height={size ?? 24} {...props} />;
}

export type SvgIconProps = ({id: string, g?: boolean, size?: string | number;} & Omit<JSX.SVGAttributes<SVGSVGElement>, "size">);


export const SvgContainer: {
  logo?: Element,
  eye?: Element;
} = {};

export function Logo(){
  const setRef = useCallback((div: HTMLDivElement | undefined) => {
    if (div){
      div.replaceWith(SvgContainer.logo.cloneNode(true))
    }
  }, []);
  return <div ref={setRef}/>;
}

export function EyeLoading(props: {size: string;}){
  const setRef = useCallback((div: HTMLDivElement | undefined) => {
    if (div){
      const svg = SvgContainer.eye.cloneNode(true) as SVGSVGElement;
      div.replaceWith(svg);
      svg.setAttribute('width', `calc(${38/24}*${props.size})`);
      svg.setAttribute('height', props.size);
      svg.setAttribute('viewBox', '50 180 200 50');
      svg.querySelector('#eye-open').setAttribute('fill', 'var(--cold-white)');
      svg.querySelector('#eye-open').setAttribute('mask', 'url(#mask)');
      svg.querySelector('#circle').setAttribute('fill', '#000');
      svg.appendChild(document.createElementNS('http://www.w3.org/2000/svg', 'mask') as any);
      // (svg.querySelector('#circle') as SVGGElement).style.mixBlendMode = 'difference';
      svg.querySelector('mask').id= 'mask';
      svg.querySelector('mask').appendChild(document.createElementNS('http://www.w3.org/2000/svg', 'rect') as any);
      svg.querySelector('rect').setAttribute('fill', 'white')
      svg.querySelector('rect').setAttribute('width', '200')
      svg.querySelector('rect').setAttribute('height', '120')
      svg.querySelector('rect').setAttribute('x', '50')
      svg.querySelector('rect').setAttribute('y', '140')
      svg.querySelector('mask').appendChild(svg.querySelector('#circle'))
    }
  }, []);
  return <div ref={setRef}/>;
}
