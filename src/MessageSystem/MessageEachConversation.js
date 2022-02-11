import React from 'react';
import {
  message,
  metadata,
  time,
  received,
  sent,
  tick
} from './MessageConversation.module.css';
import DocumentView from './DocumentView';
import NewSpinner from '../common/components/NewSpinner/NewSpinner';
import ErrorOutlinedIcon from '@material-ui/icons/ErrorOutlined';
import moment from 'moment';
import DeliveryStatus from './DeliveryStatus';
const MessageEachConversation = ({ each, baseUrl }) => {
  if (!each.attachmentUrl && !each.message) return '';
  if (each.attachmentUrl || each.isDocumentSent)
    return (
      <div
        className={`clear-both relative ${
          each.isOutgoing ? 'float-right' : 'float-left'
        }`}
      >
        <DocumentView
          fileOrImg={each.attachmentUrl}
          user_rm={each.isOutgoing}
          objectContent={each}
          baseUrl={baseUrl}
        />
      </div>
    );

  return (
    <div
      className={`text-black-500 float-none items-center   ${message} ${
        each.isOutgoing ? sent : received
      }`}
    >
      <div className="table clear-both float-left">
        {each.isOutgoing && (
          <div
            className="text-sm text-black-500 mt-1 float-right mb-1 font-bold"
            style={{ fontSize: '10px', color: '#6bcbef', fontSize: '12px' }}
          >
            {` ${each.rmUserName?.firstName || ''} ${each.rmUserName
              ?.middleName || ''} ${each.rmUserName?.lastName || ''} `}
          </div>
        )}
      </div>

      <div className="w-full flex">
        {each.message}
        <span className={`${metadata} -mt-1`}>
          {each.isError && (
            <ErrorOutlinedIcon
              style={{ color: 'red', width: '18px', height: '18px' }}
            />
          )}
          {each.isSending && !each.isError && (
            <span>
              <NewSpinner
                styleObj={{
                  borderTopColor: '#3498db',
                  borderWidth: '3px',
                  borderTopWidth: '3px',
                  marginLeft: '2px',
                  width: '18px',
                  height: '18px'
                }}
              />
            </span>
          )}
        </span>
      </div>

      <div className=" clear-both float-right  flex">
        <div className="flex">
          <p
            className="text-sm text-black-500 mt-1"
            style={{ fontSize: '10px' }}
          >
            {moment(each.timestamp).isValid()
              ? `${moment(each.timestamp).format('DD-MMM-YYYY, hh-mm A')}`
              : ''}
          </p>
        </div>
        {each.isOutgoing && !each.isSending && !each.isError && (
          <DeliveryStatus each={each} />
        )}
      </div>
    </div>
  );
};

export default MessageEachConversation;
