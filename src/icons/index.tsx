import React from "preact/compat";

const svgDocument = (async function getIcons(){
  const svg = await fetch('/public/icons/icons.svg').then(x => x.text());
  const div = document.createElement('div');
  div.innerHTML = svg;
  return div;
})();

export const SvgIcon: React.FC<SvgIconProps> = ({id, g, size, ...props}) => {
  const ref = React.useRef<SVGGElement & SVGSVGElement>();
  React.useEffect(() => {
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

export type SvgIconProps = ({id: string, g?: boolean, size?: string | number;} & Omit<React.JSX.SVGAttributes<SVGSVGElement>, "size">);
