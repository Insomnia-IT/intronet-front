import React from "preact/compat";

const svgDocument = (async function getIcons(){
  const svg = await fetch('/public/icons/icons.svg').then(x => x.text());
  const div = document.createElement('div');
  div.innerHTML = svg;
  return div;
})();

export const SvgIcon: React.FC<SvgIconProps> = ({id, g, ...props}) => {
  const ref = React.useRef<SVGGElement & SVGSVGElement>();
  React.useEffect(() => {
    if (!ref.current) return;
    svgDocument.then(div => {
      const icon = div.querySelector(id)?.firstElementChild;
      if (!icon)
        console.warn(`not found icon: `, id);
      icon && ref.current.appendChild(icon.cloneNode(true));
    });
  }, [ref, id]);
  if (g)
    return <g ref={ref} {...props}/>;
  return <svg ref={ref} viewBox="0 0 24 24" width={24} height={24} {...props} />;
}

export type SvgIconProps = ({id: string, g?: boolean} & React.JSX.SVGAttributes<SVGSVGElement>);
