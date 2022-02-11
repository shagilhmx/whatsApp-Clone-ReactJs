import React, {
  Fragment,
  useCallback,
  useContext,
  useEffect,
  useRef,
  useState
} from 'react';
import { makeStyles } from '@material-ui/core/styles';
import List from '@material-ui/core/List';
import ListItem from '@material-ui/core/ListItem';
import ListItemText from '@material-ui/core/ListItemText';
import Divider from '@material-ui/core/Divider';
import Avatar from '@material-ui/core/Avatar';
import SearchIcon from '@material-ui/icons/Search';
import {
  whatsAppUserClick,
  inputFocusedClass,
  inputBlurClass,
  circle
} from './MessageContainer/messageContainer.module.css';
import LinearProgress from '@material-ui/core/LinearProgress';
import { getUserChatListWhatsApp } from '../../common/constants/api';
import moment from 'moment';
import {
  getApplicantionInfo,
  setApplicantionInfo
} from '../../common/utils/applicantionInfo';
import Badge from '@material-ui/core/Badge';
import NotificationDataContext from '../../../../lems-ui/src/common/Context/NotificationDataContext';
import DescriptionIcon from '@material-ui/icons/Description';
import _ from 'lodash';
const useStyles = makeStyles(theme => ({
  badge: {
    backgroundColor: '#06d755',
    color: 'white'
  }
}));

const WhatsAppUserList = ({
  userListContainerclasses,
  selectedUser,
  setSelectedUser,
  userSentAMessage,
  setUserSentAMessage,
  setShowConversation,
  initialSetup,
  setInitialSetUp,
  setUserData
}) => {
  const [inputFocused, setInputFocused] = useState(false);
  const userListRef = useRef('');
  const [userList, setUserList] = useState([]);
  const [userListPageInfo, setUserListPageInfo] = useState({});
  const [isLoading, setIsLoading] = useState(true);
  const searchInput = useRef('');
  const messages = useContext(NotificationDataContext);

  const classes = useStyles();

  const getUserListsWithChatHistory = ({
    overRidePage,
    searchParameter = ''
  }) => {
    setIsLoading(true);
    let pageNumber = overRidePage || userListPageInfo?.number + 1 || '0';
    getUserChatListWhatsApp({
      page: pageNumber,
      size: 100,
      searchParameter: searchParameter
    })
      .then(res => {
        if (overRidePage) {
          setUserList(res?._embedded?.leadWhatsappRMResponseList || []);
        } else {
          setUserList([
            ...userList,
            ...(res?._embedded?.leadWhatsappRMResponseList || [])
          ]);
        }
        setUserListPageInfo(res?.page || {});
        setIsLoading(false);
        typeof setUserSentAMessage == 'function' && setUserSentAMessage(false);
      })
      .catch(error => {
        setIsLoading(false);
      });
  };
  useEffect(() => {
    getUserListsWithChatHistory({});
  }, []);

  useEffect(() => {
    if (!messages?.wa_notification) return;
    getUserListsWithChatHistory({ overRidePage: '0' });
  }, [messages?.wa_notification]);

  useEffect(() => {
    if (userSentAMessage)
      getUserListsWithChatHistory({
        overRidePage: '0'
      });
  }, [userSentAMessage]);

  const handleScroll = e => {
    if (
      userListRef.current?.clientHeight + userListRef.current?.scrollTop ==
      userListRef.current?.scrollHeight
    ) {
      if (
        userListPageInfo?.number < userListPageInfo?.totalPages - 1 &&
        !isLoading
      ) {
        getUserListsWithChatHistory({ overRidePage: false });
      }
    }
  };

  useEffect(() => {
    if (userList?.length > 0 && initialSetup) {
      if (getApplicantionInfo()?.showWhatsApp) return setInitialSetUp(false);

      setApplicantionInfo({
        leadId: userList?.[0]?.leadId,
        leadApplicantId: userList?.[0]?.applicantId,
        applicantInfo: {
          id: userList?.[0]?.applicantId,
          mainApplicant: false,
          phoneNumber:
            (!userList?.[0]?.applicantId &&
              userList?.[0]?.applicantName?.firstName) ||
            ''
        },
        leadData: {
          loanAmount: '',
          loanProduct: ''
        }
      });
      setInitialSetUp(false);
      setSelectedUser(
        userList?.[0]?.applicantId || userList?.[0]?.applicantName?.firstName
      );
    }
  }, [userList]);

  useEffect(() => {
    setSelectedUser(getApplicantionInfo()?.leadApplicantId);
  }, []);

  const handleSearchValueChange = () => {
    getUserListsWithChatHistory({
      searchParameter: searchInput?.current?.value || ''
    });
  };

  let searchApiCallback = useCallback(
    _.debounce(handleSearchValueChange, 500),
    []
  );

  return (
    <React.Fragment>
      <div
        className={`w-full overflow-scroll pr-2 bg-white ${userListContainerclasses}`}
        onScroll={handleScroll}
        ref={userListRef}
      >
        <div className="w-full sticky top-0 z-10">
          <div className="w-full py-5 px-3 items-center bg-grey-2237 ">
            <Avatar alt="Remy Sharp" src="/static/images/avatar/1.jpg" />
          </div>
          <div
            className={`flex w-full py-2  px-5 items-center shadow ${
              inputFocused ? inputFocusedClass : inputBlurClass
            } `}
          >
            <div className="w-full py-1 rounded-full flex bg-white overflow-hidden px-2 items-center ">
              <SearchIcon
                className="mr-2 text-base"
                style={{ color: '#919191' }}
              />
              <input
                ref={searchInput}
                placeholder="Search Applicant"
                className="w-full"
                onChange={searchApiCallback}
                onFocus={() => setInputFocused(true)}
                onBlur={() => setInputFocused(false)}
              />
            </div>
          </div>
        </div>
        <div className="w-full">
          <ul ref={userListRef}>
            {userList?.map(
              (
                {
                  applicantName,
                  isDocumentSent,
                  latestMessage,
                  unreadMessageCount,
                  leadId,
                  applicantId,
                  profileUrl,
                  latestConverstationTime
                },
                index
              ) => {
                return (
                  <Fragment key={index}>
                    <li
                      className={`px-3 py-3 cursor-pointer ${
                        selectedUser ==
                        (applicantId ||
                          (!applicantId && applicantName?.firstName))
                          ? whatsAppUserClick
                          : 'bg-white'
                      }`}
                      onClick={() => {
                        setUserData({
                          leadId: leadId,
                          leadApplicantId: applicantId,
                          phoneNumber:
                            (!applicantId && applicantName?.firstName) || ''
                        });
                        if (applicantId) {
                          setSelectedUser(applicantId);
                        } else {
                          setSelectedUser(applicantName?.firstName || '');
                        }

                        setUserList(
                          userList?.map(each =>
                            (each?.applicantId &&
                              each?.applicantId == applicantId) ||
                            (!each?.applicantId &&
                              each?.applicantName?.firstName ==
                                applicantName?.firstName)
                              ? { ...(each || {}), unreadMessageCount: 0 }
                              : each
                          )
                        );
                        setApplicantionInfo({
                          ...getApplicantionInfo(),
                          showWhatsApp: false
                        });
                        setTimeout(() => {
                          setShowConversation(true);
                        }, 200);
                      }}
                    >
                      <div className="w-full flex">
                        <div className={`${circle}`}>
                          <img
                            className="w-full"
                            alt="Profile"
                            src={profileUrl}
                          />
                        </div>

                        <div className="w-full pl-3 items-center grid grid-cols-3">
                          <div className="w-full flex col-span-2">
                            <div className="w-full">
                              <p className="font-sans font-normal text-sm text-black-whatsAppText">
                                {`${applicantName?.firstName ||
                                  ''} ${applicantName?.middleName ||
                                  ''} ${applicantName?.lastName || ''} ${
                                  applicantId ? `- ${applicantId}` : ''
                                }`}
                              </p>
                              <p
                                className={`text-xs font-sans ${
                                  unreadMessageCount
                                    ? 'text-black-whatsAppUnReadMessage'
                                    : ' text-black-whatsAppSidebarSecText'
                                }`}
                                style={{
                                  textOverflow: 'ellipsis',
                                  overflow: 'hidden',
                                  height: '1.5em',
                                  whiteSpace: 'nowrap'
                                }}
                              >
                                {latestMessage ||
                                  (isDocumentSent && (
                                    <span>
                                      <DescriptionIcon
                                        style={{ height: '14px' }}
                                      />
                                      sent document
                                    </span>
                                  ))}
                              </p>
                            </div>
                          </div>

                          <div className="w-full">
                            <p className="text-xs text-black-whatsAppParaText float-right clear-both -mt-2 ml-auto">
                              {moment(latestConverstationTime).format(
                                'Do MMM YY'
                              )}
                            </p>

                            {unreadMessageCount ? (
                              <div
                                className="relative ml-auto  "
                                style={{
                                  marginTop: '10px',
                                  right: '15px',
                                  width: '10px'
                                }}
                              >
                                <Badge
                                  badgeContent={unreadMessageCount}
                                  color="primary"
                                  max={999}
                                  classes={{ badge: classes.badge }}
                                />
                              </div>
                            ) : null}
                          </div>
                        </div>
                      </div>
                    </li>
                    <Divider light />
                  </Fragment>
                );
              }
            )}
          </ul>
          {userList?.length == 0 && !isLoading && (
            <p className="text-center mt-3 font-roboto text-sm text-black-500 text-normal ">
              No User Found!
            </p>
          )}
        </div>
      </div>
      {isLoading && <LinearProgress />}
    </React.Fragment>
  );
};

export default WhatsAppUserList;
