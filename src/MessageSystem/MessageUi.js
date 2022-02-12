import React, { useEffect, useState } from 'react';
import Avatar from '@material-ui/core/Avatar';
import {
  chat,
  chatContainer,
  messageUi
} from './MessageConversation.module.css';
import MessageConversation from './MessageConversation';
import applicant from '../images/message_system/applicant.svg';
import hl from '../images/message_system/hl.svg';
import rupee from '../images/message_system/rupee.svg';
import SvgComponent from '../common/components/SvgComponent/SvgComponent';
import { getApplicantionInfo } from '../common/utils/applicantionInfo';
import { numberFormat } from '../common/constants/NumberFormat';
import CancelIcon from '@material-ui/icons/Cancel';
const MessageUi = ({
  baseUrl,
  applicantInfo,
  setShowWhatsApp,
  messageUIContainerClasses,
  onSendHandler,
  userData = null
}) => {
  const [applicationInfo, storeApplicationInfo] = useState(
    userData || getApplicantionInfo() || {}
  );
  useEffect(() => {
    storeApplicationInfo(userData || getApplicantionInfo());
  }, [applicantInfo?.id, applicantInfo?.phoneNumber]);

  return (
    <div className={`w-full  flex`}>
      <div className="w-full">
        <div className={`shadow-2xl ${messageUi} ${messageUIContainerClasses}`}>
          <div className={chat}>
            <div className={`${chatContainer} `}>
              <div className="bg-grey-2237 shadow-none flex items-center justify-center h-20 px-2 rounded-t">
                <Avatar alt="user" src="" />
                <div className="w-full ml-2 items-center justify-center block">
                  <span className="text-black-1024 font-roboto font-medium text-left text-base">
                    {`${applicantInfo?.name?.firstName || ''} ${applicantInfo
                      ?.name?.middleName || ''} ${applicantInfo?.name
                      ?.lastName || ''}`}
                  </span>
                  <div className="flex  ">
                    <div className="w-full flex mt-1">
                      <div className="flex mr-5">
                        <SvgComponent img={applicant} className="w-3" />
                        <p className="text-grey-2238 mx-1 font-roboto font-medium text-sm">
                          {applicantInfo?.mainApplicant}
                        </p>
                      </div>
                      <div className="flex mr-5">
                        <SvgComponent img={hl} className="w-3" />
                        <p className="text-grey-2238 mx-1 font-roboto font-medium text-sm">
                          {applicationInfo?.leadData?.loanProduct}
                        </p>
                      </div>

                      <div className="flex mr-5">
                        <SvgComponent img={rupee} className="w-3" />
                        <p className="text-grey-2238 mx-1 font-roboto font-medium text-sm">
                          {numberFormat(
                            applicationInfo?.leadData?.loanAmount || 0
                          )}
                        </p>
                      </div>
                      <div
                        className="flex float-right ml-auto mr-2 md:hidden"
                        onClick={() => {
                          typeof setShowWhatsApp == 'function' &&
                            setShowWhatsApp(false);
                        }}
                      >
                        <CancelIcon />
                      </div>
                    </div>
                  </div>
                </div>
              </div>
              <MessageConversation
                baseUrl={baseUrl}
                applicationInfo={applicationInfo}
                applicantInfo={applicationInfo?.applicantInfo}
                onSendHandler={onSendHandler}
                setShowWhatsApp={setShowWhatsApp}
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  )
};

export default MessageUi;
