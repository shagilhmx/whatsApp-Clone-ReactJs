import React, { useEffect, useRef } from 'react';
import styles from './styles.module.css';

function Modal(props) {
  const {
    show,
    setShow,
    noCloseBtn = true,
    clickOutsideClose = true,
    type,
    dontClose,
    autoClose = false,
    xl = false,
    styleContainer = {},
    modalStyle = {},
    titleStyle = {},
    title = false,
    classStyle = {},
    modalConentStyle = {},
    closeIconStyle = {},
    stopDeafultPropagation = false
  } = props;
  const msDecider = () => {
    switch (type) {
      case 'success':
        return 2000;
      case 'fail':
        return 4000;
      case 'loading':
        return 2000;
      default:
        return 2000;
    }
  };
  const { modal } = styles;
  if (!show) return null;
  useEffect(() => {
    if (autoClose) {
      setTimeout(() => {
        setShow(false);
      }, msDecider());
    }
  }, [props]);

  return (
    <div
      className={`${modal} fixed w-full h-full top-0 left-0 flex items-center justify-center `}
      style={{ ...modalStyle, ...(type && { zIndex: '11000' }) }}
      onClick={e => {
        if (stopDeafultPropagation) return;
        e.stopPropagation();
        if (clickOutsideClose && !dontClose) {
          setShow(false);
        }
      }}
    >
      <div
        className={`modal-container bg-white w-11/12 ${classStyle} ${
          xl ? `md:max-w-xl` : `md:max-w-md`
        } mx-auto rounded shadow-lg  overflow-y-auto`}
        style={styleContainer}
      >
        <div
          className="modal-content py-4  px-6"
          onClick={e => {
            if (stopDeafultPropagation) return;
            e.stopPropagation();
          }}
          style={modalConentStyle}
        >
          {noCloseBtn && (
            <div className="flex justify-end  pb-3">
              {title ? (
                <span
                  className="mr-auto float-left text-black-1011 font-roboto font-medium text-base"
                  style={titleStyle}
                >
                  {title}
                </span>
              ) : null}
              <div
                className="modal-close cursor-pointer "
                onClick={e => {
                  setShow(false);
                }}
                style={closeIconStyle}
              >
                <svg
                  className="fill-current text-black"
                  xmlns="http://www.w3.org/2000/svg"
                  width={18}
                  height={18}
                  viewBox="0 0 18 18"
                >
                  <path d="M14.53 4.53l-1.06-1.06L9 7.94 4.53 3.47 3.47 4.53 7.94 9l-4.47 4.47 1.06 1.06L9 10.06l4.47 4.47 1.06-1.06L10.06 9z" />
                </svg>
              </div>
            </div>
          )}
          <div>{props.children}</div>
        </div>
      </div>
    </div>
  );
}

export default Modal;
