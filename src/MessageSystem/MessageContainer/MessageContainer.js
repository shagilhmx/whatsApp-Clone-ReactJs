import React, { useCallback, useEffect, useRef, useState } from 'react';
import {
  getApplicantionInfo,
  setApplicantionInfo
} from '../../../common/utils/applicantionInfo';
import MessageUI from '../MessageUi';
import WhatsAppUserList from '../WhatsAppUserList';
import {
  whatsAppList,
  containerTopNav,
  messageUIContainerClasses,
  userListContainerclasses,
  container
} from './messageContainer.module.css';
import Helmet from 'react-helmet';
import Header from '../../../common/components/Header/Header';
import Sidebar from '../../../common/components/Sidebar/Sidebar';
import { siteTitle } from '../../../../data/SiteConfig';
import _ from 'lodash';
import ArrowBackIcon from '@material-ui/icons/ArrowBack';
import withErrorHandler from '../../../hoc/withErrorHandler/withErrorHandler';
import {
  getCustomerDetails,
  getProfessionType
} from '../../../common/constants/api';
import LinearProgress from '@material-ui/core/LinearProgress';

const MessageContainer = () => {
  const containerRef = useRef('');
  const [selectedUser, setSelectedUser] = useState(0);
  const [applicantInfo, setApplicantInfo] = useState(
    getApplicantionInfo().applicantInfo
  );
  const [showConversation, setShowConversation] = useState(
    getApplicantionInfo()?.showWhatsApp ? true : false
  );
  const [userSentAMessage, setUserSentAMessage] = useState(false);
  const [initialSetup, setInitialSetUp] = useState(true);
  const [userData, setUserData] = useState({});

  const [mobileView, setMobileView] = useState(false);
  const callBack = () => {
    if (containerRef.current?.clientWidth < 697) {
      setMobileView(true);
    } else {
      setMobileView(false);
    }
  };

  const debounceDivChange = useCallback(_.debounce(callBack, 350), []);
  useEffect(() => {
    const targetNode = containerRef.current;
    const observer = new ResizeObserver(debounceDivChange);
    observer.observe(targetNode);
    return () => {
      observer.disconnect();
    };
  }, []);
  function getLeadData() {
    return getCustomerDetails(userData?.leadId)
      .then(res => {
        return res;
      })
      .catch(error => {});
  }
  function getApplicantData() {
    return getProfessionType(userData?.leadId, userData?.leadApplicantId)
      .then(res => {
        return res;
      })
      .catch(error => {});
  }

  useEffect(() => {
    async function clickHandler() {
      let leadData = '';
      let applData = '';
      if (userData?.leadApplicantId) {
        leadData = await getLeadData();
        applData = await getApplicantData();
      }
      let data = {
        applicationStatus: leadData?.status || '',
        leadId: userData?.leadId,
        leadApplicantId: userData?.leadApplicantId,
        showWhatsApp: false,
        applicantInfo: {
          id: userData?.leadApplicantId,
          mainApplicant: applData
            ? applData?.applicantType == 'MAIN_APPLICANT'
              ? 'Applicant'
              : 'Co - Applicant'
            : 'NA',
          phoneNumber: userData?.phoneNumber
        },
        leadData: {
          loanAmount: leadData?.id ? leadData?.loanAmount || '---' : 'NA',
          loanProduct: leadData?.id ? leadData?.productName || '---' : `NA`
        }
      };
      if (!getApplicantionInfo()?.showWhatsApp) {
        setApplicantionInfo(data);
      }
      setApplicantInfo(data.applicantInfo);
    }
    clickHandler();
  }, [userData?.leadApplicantId, userData?.phoneNumber]);

  function onSendHandler() {
    setUserSentAMessage(!userSentAMessage);
  }

  return (
    <div className="bg-grey-950 relative h-full overflow-hidden font-roboto text-sm font-normal m-0 p-0">
      <Helmet title={`WhatsApp | ${siteTitle}`} />

      <div className=" min-h-screen flex pt-17 md:pt-0 ">
        <Sidebar />
        <div className="w-full max-screen" ref={containerRef}>
          <Header />
          {mobileView && showConversation && (
            <ArrowBackIcon
              onClick={() => setShowConversation(false)}
              className="cursor-pointer w-10"
            />
          )}

          <div
            className={`w-full  py-1  ${!mobileView &&
              containerTopNav} ${!mobileView && 'bg-grey-whatsAppBg'}`}
          >
            <div
              className={`w-full flex mx-auto max-w-5xl z-10 relative ${container}`}
            >
              <div
                className={`w-full md:w-4/12 max-w/12 ${whatsAppList}`}
                style={
                  mobileView
                    ? {
                        width: '100%',
                        ...(showConversation ? { display: 'none' } : {})
                      }
                    : {}
                }
              >
                <WhatsAppUserList
                  userListContainerclasses={userListContainerclasses}
                  selectedUser={selectedUser}
                  setSelectedUser={setSelectedUser}
                  setShowConversation={setShowConversation}
                  userSentAMessage={userSentAMessage}
                  setUserSentAMessage={setUserSentAMessage}
                  initialSetup={initialSetup}
                  setInitialSetUp={setInitialSetUp}
                  setUserData={setUserData}
                />
              </div>
              <div
                className="w-full bg-grey-1002 items-center "
                style={
                  mobileView && !showConversation ? { display: 'none' } : {}
                }
              >
                {initialSetup ? (
                  <div
                    className="w-full "
                    style={{
                      position: 'relative',
                      top: ' 50%'
                    }}
                  >
                    <LinearProgress />
                  </div>
                ) : (
                  <MessageUI
                    messageUIContainerClasses={messageUIContainerClasses}
                    applicantInfo={applicantInfo || []}
                    onSendHandler={onSendHandler}
                  />
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default withErrorHandler(MessageContainer);
