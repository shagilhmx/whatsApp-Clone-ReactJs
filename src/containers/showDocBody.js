import React, { memo, useState, useEffect, useRef, useCallback } from 'react';
import styles from './CMDashboard.module.css';
import PdfViwer from '../../common/components/GlobalPDFViewer/GlobalPdfViewer';
import { showVerificationStatus } from '../../common/components/CMKycDocViewer/utilities';
import PopUp from '../../common/components/PopUp/PopUp';
import ZoomInIcon from '@material-ui/icons/ZoomIn';
import ZoomOutIcon from '@material-ui/icons/ZoomOut';
import RotateRightIcon from '@material-ui/icons/RotateRight';
import RotateLeftIcon from '@material-ui/icons/RotateLeft';
import _ from 'lodash';
import Button from '@material-ui/core/Button';
import PanToolIcon from '@material-ui/icons/PanTool';
import ButtonGroup from '@material-ui/core/ButtonGroup';
import { Fragment } from 'react';
const { show_top } = styles;
const ShowDocBody = ({
  docId,
  updateTrigger,
  setUpdateTrigger,
  income,
  file,
  isError,
  fileTitle,
  setIsError,
  verified,
  autoCheck,
  pageStyle,
  docContainerStyle,
  docContainerClasses,
  fileTitleStyle,
  fileTitleContainerStyle,
  loadingComponent
}) => {
  const [verifiedStatus, setVerifiedStatus] = useState(verified);
  const [error, setError] = useState('');
  const [popShow, setPopShow] = useState(false);
  const [showPdf, setShowPdf] = useState(false);
  const [mounted, setMounted] = useState(false);
  const [rotate, setRotate] = useState(0);
  const [scale, setScale] = useState(1);
  const [isMouseDown, setIsMouseDown] = useState(false);
  const [marginX, setMarginX] = useState(0);
  const [marginY, setMarginY] = useState(0);

  const imageRef = useRef();

  useEffect(() => {
    return () => {
      setShowPdf(false);
      setMounted(false);
      if (typeof setIsError == 'function') {
        setIsError(false);
      }
      if (setUpdateTrigger) setUpdateTrigger(!updateTrigger);
    };
  }, []);
  const handleZoomIN = () => {
    setScale(scale + 0.2);
  };
  const handleZoomOut = () => {
    if (scale > 0.6) setScale(scale - 0.2);
  };
  const handleRotateLeft = () => {
    setRotate(rotate + 90);
  };
  const handleRotateRight = () => {
    setRotate(rotate - 90);
  };

  useEffect(() => {
    if (imageRef?.current?.style) {
      imageRef.current.style.transform = `rotate(${rotate}deg)scale(${scale})`;
    }
  }, [rotate, scale]);

  const mouseMoving = e => {
    if (!isMouseDown) return;
    setMarginX(marginX + e.movementX);
    setMarginY(marginY + e.movementY);
  };

  const handlePan = () => {
    setIsMouseDown(!isMouseDown);
  };

  return (
    <Fragment>
      {autoCheck && !mounted && (
        <img
          className="hidden"
          src={file}
          onError={e => {
            e.target.onerror = null;
            setShowPdf(true);
            setMounted(true);
          }}
          onLoad={() => setMounted(true)}
        />
      )}

      <div className="w-full px-5 mt-10 " style={fileTitleContainerStyle}>
        <div className="flex justify-between mb-4" style={fileTitleStyle}>
          {fileTitle && (
            <div className="text-base capitalize text-black-1003 mx-auto text-center font-roboto font-med font-medium ">
              {fileTitle}
            </div>
          )}
        </div>
        {income &&
          showVerificationStatus(
            verifiedStatus,
            docId,
            setVerifiedStatus,
            setPopShow,
            setError
          )}
        <div
          className={`h-auto mt-10 text-center bg-black-1014 rounded-md px-1  py-1`}
          style={pageStyle}
        >
          <div
            className={`text-left w-full py-3 bg-white rounded items-center flex overflow-auto`}
          >
            <ButtonGroup color="primary" className="ml-1">
              <Button color="primary" onClick={handleZoomIN}>
                <ZoomInIcon className="text-black-0" />
              </Button>
              <Button
                color="primary"
                onClick={handleZoomOut}
                className={
                  scale > 0.6 ? 'cursor-pointer' : 'cursor-not-allowed'
                }
              >
                <ZoomOutIcon
                  className={scale < 0.6 ? 'text-grey-998' : 'text-black-0'}
                />
              </Button>
            </ButtonGroup>

            <ButtonGroup color="primary" className="ml-1">
              <Button color="primary" onClick={handleRotateLeft}>
                <RotateRightIcon className="text-black-0" />
              </Button>

              <Button color="primary" onClick={handleRotateRight}>
                <RotateLeftIcon className="text-black-0" />
              </Button>
            </ButtonGroup>
            {!isError && !showPdf && (
              <ButtonGroup color="primary" className="ml-1">
                <Button
                  color="primary"
                  className={
                    isMouseDown
                      ? 'bg-black-500 text-white'
                      : 'text-black-0 bg-white'
                  }
                >
                  <PanToolIcon
                    className={` ${isMouseDown && 'opacity-75'}`}
                    onClick={handlePan}
                  />
                </Button>
              </ButtonGroup>
            )}
            <ButtonGroup color="primary" className="ml-1">
              <Button
                className="ml-1 font-roboto text-black-0 font-normal "
                onClick={() => {
                  setRotate(0);
                  setScale(1);
                  setMarginX(0);
                  setMarginY(0);
                  setIsMouseDown(false);
                }}
              >
                Reset
              </Button>
            </ButtonGroup>
          </div>
          <div
            className={`${docContainerClasses} ${isMouseDown && 'cursor-move'}`}
            style={{ maxHeight: '80vh', ...docContainerStyle }}
          >
            <div className="relative">
              {isError || (autoCheck && showPdf) ? (
                <PdfViwer
                  file={file}
                  renderMode="svg"
                  scale={scale}
                  setScale={setScale}
                  rotate={rotate}
                  loadingComponent={loadingComponent}
                />
              ) : (
                <div className="w-full overflow-auto">
                  <img
                    className={`mx-auto mt-10 relative`}
                    src={file}
                    alt="document"
                    ref={imageRef}
                    style={{ left: marginX, top: marginY }}
                    onMouseMove={mouseMoving}
                    onClick={() => setIsMouseDown(false)}
                  />
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
      {popShow && (
        <PopUp type="fail" text={error} setShow={setPopShow} show={popShow} />
      )}
    </Fragment>
  );
};

export default memo(ShowDocBody);
