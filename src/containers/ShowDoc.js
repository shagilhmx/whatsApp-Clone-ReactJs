import React, { memo } from 'react';
import Modal from '../common/components/Modal/modal';
import _ from 'lodash';
import ShowDocBody from './showDocBody';
const ShowDoc = ({
  docId,
  updateTrigger,
  setUpdateTrigger,
  income,
  file,
  isError,
  show,
  setShow,
  fileTitle,
  setIsError,
  verified,
  autoCheck = false,
  isShowninPopup = true,
  pageStyle = {},
  docContainerStyle = {},
  docContainerClasses = 'text-center bg-black-1014 rounded-md px-5 md:px-20 overflow-auto pb-5',
  fileTitleStyle = {},
  fileTitleContainerStyle = {},
  loadingComponent
}) => {
  if (isShowninPopup)
    return (
      <Modal
        show={show}
        setShow={setShow}
        styleContainer={{
          minWidth: '50%',
          maxWidth: '70%',
          height: '90%'
        }}
      >
        <ShowDocBody
          docId={docId}
          updateTrigger={updateTrigger}
          setUpdateTrigger={setUpdateTrigger}
          income={income}
          file={file}
          isError={isError}
          show={show}
          setShow={setShow}
          fileTitle={fileTitle}
          setIsError={setIsError}
          verified={verified}
          autoCheck={autoCheck}
          pageStyle={pageStyle}
          docContainerStyle={docContainerStyle}
          docContainerClasses={docContainerClasses}
          fileTitleStyle={fileTitleStyle}
          fileTitleContainerStyle={fileTitleContainerStyle}
          loadingComponent={loadingComponent}
        />
      </Modal>
    );
  else
    return (
      <ShowDocBody
        docId={docId}
        updateTrigger={updateTrigger}
        setUpdateTrigger={setUpdateTrigger}
        income={income}
        file={file}
        isError={isError}
        show={show}
        setShow={setShow}
        fileTitle={fileTitle}
        setIsError={setIsError}
        verified={verified}
        autoCheck={autoCheck}
        pageStyle={pageStyle}
        docContainerStyle={docContainerStyle}
        docContainerClasses={docContainerClasses}
        fileTitleStyle={fileTitleStyle}
        fileTitleContainerStyle={fileTitleContainerStyle}
        loadingComponent={loadingComponent}
      />
    );
};

export default memo(ShowDoc);
