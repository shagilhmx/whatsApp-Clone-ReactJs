import React, { useEffect, useState } from 'react';
import Axios from 'axios';
const SvgComponent = ({
  img,
  className,
  style,
  width,
  height,
  viewBoxLeftTopPosition,
  viewBoxLeftBottomPosition,
  invoke = false
}) => {
  const [svgNode, setSvgNode] = useState({});

  const getImg = () => {
    Axios(img, {
      responseType: 'arraybuffer'
    })
      .then(response => {
        var enc = new TextDecoder('utf-8');
        let strRep = enc.decode(response.data);
        let e = document?.createElement('div');
        try {
          e.innerHTML = strRep;
          setSvgNode(e?.children[0]);
        } catch {
          setSvgNode({});
        }
      })
      .catch(err => {});
  };
  useEffect(() => {
    if (!img?.includes('data:image/svg+xml;base64,')) {
      getImg();
    } else {
      let a = img?.replace('data:image/svg+xml;base64,', '');
      let e = document?.createElement('div');
      try {
        e.innerHTML = atob(a); // converts the base64 format to string svg
        setSvgNode(e?.children[0]);
      } catch {
        setSvgNode({});
      }
    }
  }, [invoke]);

  let baseVal = svgNode?.viewBox?.baseVal;

  return (
    <svg
      xmlns={svgNode?.namespaceURI || 'http://www.w3.org/2000/svg'}
      width={width || svgNode?.width?.baseVal?.valueAsString}
      height={height || svgNode?.height?.baseVal?.valueAsString}
      viewBox={`${viewBoxLeftBottomPosition ||
        baseVal?.x ||
        0} ${viewBoxLeftTopPosition || baseVal?.y || 0} ${width ||
        baseVal?.width ||
        0} ${height || baseVal?.height || 0}`}
      className={`fill-current ${className}`}
      style={style}
      dangerouslySetInnerHTML={{
        __html: svgNode?.innerHTML
      }}
    ></svg>
  );
};

export default SvgComponent;
