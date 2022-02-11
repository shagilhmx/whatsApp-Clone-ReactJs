import React, { useContext, useEffect, useRef, useState } from 'react';
import {
  conversation,
  conversationContainer,
  emoji,
  inputmsg,
  send,
  circle,
  conversationCompose
} from './MessageConversation.module.css';
import AttachmentIcon from '@material-ui/icons/Attachment';
import SendIcon from '@material-ui/icons/Send';
import {
  whatsAppConversations,
  sendMessageToWhatsApp,
  markWhatsAppMessageAsRead,
  markWhatsAppMessageAsReadForUnKnownNumber,
  whatsAppConversationsByNumber
} from '../common/constants/api';
import _ from 'lodash';
import NewSpinner from '../common/components/NewSpinner/NewSpinner';
import MessageEachConversation from './MessageEachConversation';
import NotificationDataContext from '../common/Context/NotificationDataContext';

const MessageConversation = ({
  baseUrl,
  applicationInfo = {},
  applicantInfo = {},
  onSendHandler,
  setShowWhatsApp
}) => {
  const ref = useRef();
  const messageDiv = useRef();
  const [dynamicallyTypes, setDynamicallyTypes] = useState({});
  const [conversationLists, setConversationLists] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [page, setPage] = useState('-1');
  const [size, setSize] = useState(50);
  const [paginationInfo, setPaginationInfo] = useState({});
  const [userSendInput, setUserSendInput] = useState('');
  const messages = useContext(NotificationDataContext);

  const loadMorePage = res => {
    if (
      res?.page?.totalPages - 1 == res.page?.number &&
      res?.page?.totalPages > 1 &&
      res?._embedded?.whatsAppMessageList.length < 50
    ) {
      getConversationList({
        overRidePage: res.page?.number - 1,
        overRideLatestPage: false,
        data: res?._embedded?.whatsAppMessageList,
        getExtraPage: true
      });
    }
  };
  function conversationOnSuccess({
    res,
    overRideLatestPage,
    data,
    getExtraPage
  }) {
    setIsLoading(false);
    if (overRideLatestPage) {
      setConversationLists([...(res?._embedded?.whatsAppMessageList || [])]);
    } else {
      setConversationLists([
        ...(res?._embedded?.whatsAppMessageList || []),
        ...((data.length > 0 && data) || conversationLists || [])
      ]);
    }
    if (res?.page?.number < res?.page?.totalPages) {
      setPage(`${res.page?.number - 1}`);
    }
    setPaginationInfo(res?.page || {});
    if (overRideLatestPage) loadMorePage(res);
    if (getExtraPage) {
      messageDiv.current.scrollTop =
        messageDiv.current.scrollHeight - messageDiv.current.clientHeight;
    } else {
      messageDiv.current.scrollTop = 200;
    }
  }

  function getConversationList({
    overRidePage = false,
    overRideLatestPage = false,
    data = [],
    getExtraPage = false
  }) {
    setIsLoading(true);
    if (applicantInfo.id) {
      whatsAppConversations({
        leadId: applicationInfo.leadId,
        applicantId: applicantInfo.id,
        latestPage: overRideLatestPage,
        page: overRidePage || page,
        size: size
      })
        .then(res => {
          conversationOnSuccess({
            res: res,
            data: data,
            getExtraPage: getExtraPage,
            overRideLatestPage: overRideLatestPage
          });
        })
        .catch(error => {
          setIsLoading(false);
          setConversationLists([]);
          setShowWhatsApp(false);
        });
    } else if (!applicantInfo.id && applicantInfo?.phoneNumber) {
      whatsAppConversationsByNumber({
        phoneNumber: applicantInfo?.phoneNumber,
        latestPage: overRideLatestPage,
        page: overRidePage || page,
        size: size
      })
        .then(res => {
          conversationOnSuccess({
            res: res,
            data: data,
            getExtraPage: getExtraPage,
            overRideLatestPage: overRideLatestPage
          });
        })
        .catch(errr => {
          setIsLoading(false);
          setConversationLists([]);
          setShowWhatsApp(false);
        });
    }
  }

  useEffect(() => {
    messageDiv.current.scrollTop =
      messageDiv.current.scrollHeight - messageDiv.current.clientHeight;
  }, [dynamicallyTypes]);

  useEffect(() => {
    if (messages?.wa_notification?.length == 0) return;
    let currMessageObj = {};
    try {
      currMessageObj =
        messages?.wa_notification?.[messages?.wa_notification?.length - 1];
    } catch {
      return;
    }
    if (currMessageObj?.applicantId == applicantInfo?.id) {
      setDynamicallyTypes({
        ...(dynamicallyTypes || {}),
        [getANewKey()]: {
          message: currMessageObj?.whatsappMessage,
          attachmentUrl: currMessageObj?.isDocumentSent,
          file: currMessageObj?.isDocumentSent,
          isOutgoing: false,
          isError: false,
          isSending: false,
          timestamp: new Date()
        }
      });
    }
  }, [messages?.wa_notification]);

  useEffect(() => {
    setConversationLists([]);
    setPage('-1');
    setDynamicallyTypes({});
    getConversationList({
      overRideLatestPage: true
    });
    if (applicantInfo?.id) {
      markWhatsAppMessageAsRead(
        applicationInfo?.leadId,
        applicantInfo.id
      ).catch(error => {});
    } else if (applicantInfo?.phoneNumber && !applicantInfo?.id) {
      markWhatsAppMessageAsReadForUnKnownNumber(
        applicantInfo?.phoneNumber
      ).catch(error => {});
    }
  }, [applicantInfo?.id, applicantInfo?.phoneNumber]);
  let handleScroll = () => {
    const scrollTop = messageDiv?.current?.scrollTop;
    if (scrollTop == 0 && !isLoading && paginationInfo?.number > 0) {
      getConversationList({});
    }
  };

  handleScroll = _.debounce(handleScroll, 400);

  const updateDynamicTypedVals = ({
    isError = false,
    updateKey = false,
    isSending = false
  }) => {
    let key = updateKey || getANewKey();

    setDynamicallyTypes({
      ...(dynamicallyTypes || {}),
      [key]: {
        message: userSendInput,
        attachmentUrl: false,
        file: false,
        isOutgoing: true,
        isError: isError,
        isSending: isSending,
        timestamp: new Date()
      }
    });
    return key;
  };
  function getANewKey(dict) {
    return Object.keys(dict || dynamicallyTypes)?.length;
  }

  function handleSend(e) {
    let updateVal = updateDynamicTypedVals({ isSending: true });
    e.preventDefault();
    if (!userSendInput) return;
    let body = {
      message: userSendInput,
      leadId: applicationInfo?.leadId,
      applicantId: applicantInfo?.id
    };
    sendMessageToWhatsApp(body)
      .then(res => {
        if (res.error) {
          throw new Error(res);
        }
        typeof onSendHandler == 'function' && onSendHandler();

        updateDynamicTypedVals({
          updateKey: updateVal,
          isSending: false,
          isError: false
        });
      })
      .catch(error => {
        updateDynamicTypedVals({ isError: true, isSending: false });
      });

    setUserSendInput('');
    messageDiv.current.scrollTop =
      messageDiv.current.scrollHeight - messageDiv.current.clientHeight;
  }
  return (
    <div className={`${conversation} `}>
      {isLoading && (
        <div className="w-full z-100 bg-white items-center justify-center p-3 text-center absolute">
          <div className="table mx-auto">
            <NewSpinner />
          </div>
        </div>
      )}

      <div
        className={conversationContainer}
        ref={messageDiv}
        onScroll={handleScroll}
      >
        {conversationLists?.map((each, index) => {
          return <MessageEachConversation each={each} baseUrl={baseUrl} />;
        })}
        <div className="clear-both relative ">
          {Object.keys(dynamicallyTypes || {})?.map(each => (
            <MessageEachConversation
              each={dynamicallyTypes[each]}
              baseUrl={baseUrl}
            />
          ))}
        </div>
      </div>

      <form className={conversationCompose} onSubmit={handleSend} action="">
        <input
          type="file"
          ref={ref}
          className="hidden"
          accept="application/pdf,image/x-png,image/gif,image/jpeg"
          onChange={e => {
            const reader = new FileReader();
            let file =
              ref?.current?.files[(ref?.current?.files?.length || 1) - 1];
            if (!file || !file?.size) return;

            reader.onloadend = () => {
              setDynamicallyTypes({
                ...(dynamicallyTypes || {}),
                [getANewKey()]: {
                  file: file,
                  attachmentUrl: reader.result,
                  message: '',
                  isOutgoing: true,
                  timestamp: new Date()
                }
              });
            };
            reader.readAsDataURL(file);
          }}
        />
        <input
          className={`${inputmsg} w-full ml-2 pl-2 rounded`}
          name="input"
          placeholder="Type a message"
          autocomplete="off"
          autofocus
          value={userSendInput}
          onChange={e => setUserSendInput(e.target?.value)}
        />
        <button className={send} type="button" onClick={handleSend}>
          <div className={circle}>
            <SendIcon />
          </div>
        </button>
      </form>
    </div>
  );
};
export default MessageConversation;
