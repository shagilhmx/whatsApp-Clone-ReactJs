import React, { useState } from 'react';
import PictureAsPdfIcon from '@material-ui/icons/PictureAsPdf';
import CloudDownloadIcon from '@material-ui/icons/CloudDownload';
import FullscreenIcon from '@material-ui/icons/Fullscreen';
import ShowDoc from '../containers/ShowDoc';
import { i_frame } from './MessageConversation.module.css';
import ImageIcon from '@material-ui/icons/Image';
import DeliveryStatus from './DeliveryStatus';
import moment from 'moment';
const DocumentView = ({ fileOrImg, user_rm, objectContent }) => {
  const [isFile, setIsFile] = useState(false);
  const [showFullImage, setShowFullImage] = useState(false);

  const download = () => {
    var link = document.createElement('a');
    link.href = fileOrImg;
    link.download = 'file';
    link.target = '_blank';
    link.dispatchEvent(new MouseEvent('click'));
  };

  if (objectContent.attachmentFileType != 'application/pdf')
    return (
      <div
        className="table my-3 p-1 rounded-xl border-2 "
        style={{
          maxWidth: '300px',
          backgroundColor: user_rm ? '#e1ffc7' : 'white',
          borderColor: '#cfe9ba'
        }}
      >
        <div className="table clear-both float-left">
          {objectContent.isOutgoing && (
            <div
              className="text-sm text-black-500 mt-1 float-right mb-3 font-bold"
              style={{ fontSize: '10px', color: '#6bcbef', fontSize: '12px' }}
            >
              {` ${objectContent.rmUserName?.firstName || ''} ${objectContent
                .rmUserName?.middleName || ''} ${objectContent.rmUserName
                ?.lastName || ''} `}
            </div>
          )}
        </div>
        <div className="w-full align-center px-4">
          <ImageIcon
            className="w-full h-full bg-white rounded-2xl"
            style={{ maxHeight: '200px', maxWidth: '240px', color: '#115293' }}
          />
        </div>

        <div className=" block py-3 rounded ">
          <p
            className="text-black-500 font-roboto pl-2 mt-0.5 font-medium"
            style={{ color: '#115293' }}
          >
            {objectContent?.attachmentCaption}
          </p>

          <div className=" clear-both float-right  flex">
            <div className="flex px-2 pb-2">
              <p
                className="text-sm text-black-500 mt-1"
                style={{ fontSize: '10px' }}
              >
                {moment(objectContent.timestamp).isValid()
                  ? `${moment(objectContent.timestamp).format(
                      'DD-MMM-YYYY, hh-mm A'
                    )}`
                  : ''}
              </p>
            </div>
            {objectContent.isOutgoing &&
              !objectContent.isSending &&
              !objectContent.isError && <DeliveryStatus each={objectContent} />}
          </div>

          <div className="pl-3 hidden" onClick={download}>
            <CloudDownloadIcon style={{ color: 'gray', cursor: 'pointer' }} />
          </div>
          <div className="pl-3 hidden" onClick={() => setShowFullImage(true)}>
            <FullscreenIcon style={{ color: 'gray', cursor: 'pointer' }} />
          </div>
        </div>
        {showFullImage && (
          <ShowDoc
            file={fileOrImg}
            show={showFullImage}
            setShow={setShowFullImage}
            autoCheck={true}
          />
        )}
      </div>
    );

  return (
    <div
      className="overflow-hidden my-3 table"
      style={{
        maxHeight: '200px',
        backgroundColor: user_rm ? '#e1ffc7' : 'white',
        border: 'groove',
        borderColor: '#dcf8c6',
        borderRadius: '12px',
        maxWidth: '300px'
      }}
    >
      <div className="table clear-both float-left">
        {objectContent.isOutgoing && (
          <div
            className="text-sm text-black-500 mt-1 float-right mb-3 font-bold"
            style={{ fontSize: '10px', color: '#6bcbef', fontSize: '12px' }}
          >
            {` ${objectContent.rmUserName?.firstName || ''} ${objectContent
              .rmUserName?.middleName || ''} ${objectContent.rmUserName
              ?.lastName || ''} `}
          </div>
        )}
      </div>
      <div className="w-full align-center px-4">
        <PictureAsPdfIcon
          className="w-full h-full bg-red-300"
          style={{ maxHeight: '200px', maxWidth: '240px' }}
        />
      </div>
      <div className={`w-full items-center py-5  ${i_frame}`}>
        <p
          className="text-black-500 font-roboto pl-2 mt-0.5 font-medium"
          style={{ color: '#115293' }}
        >
          {objectContent?.attachmentCaption}
        </p>

        <div className=" clear-both float-right  flex">
          <div className="flex px-2 pb-2">
            <p
              className="text-sm text-black-500 mt-1"
              style={{ fontSize: '10px' }}
            >
              {moment(objectContent.timestamp).isValid()
                ? `${moment(objectContent.timestamp).format(
                    'DD-MMM-YYYY, hh-mm A'
                  )}`
                : ''}
            </p>
          </div>
          {objectContent.isOutgoing &&
            !objectContent.isSending &&
            !objectContent.isError && <DeliveryStatus each={objectContent} />}
        </div>

        <div className="w-12/12 mx-auto items-center rounded-b-lg flex px-3 hidden">
          <PictureAsPdfIcon style={{ color: 'red' }} />
          <div className="pl-3" onClick={download}>
            <CloudDownloadIcon style={{ color: 'gray', cursor: 'pointer' }} />
          </div>
          <div className="pl-3" onClick={() => setShowFullImage(true)}>
            <FullscreenIcon style={{ color: 'gray', cursor: 'pointer' }} />
          </div>
        </div>
      </div>
      {showFullImage && (
        <ShowDoc
          file={fileOrImg}
          show={showFullImage}
          setShow={setShowFullImage}
          autoCheck={true}
        />
      )}
    </div>
  );
};
export default DocumentView;
