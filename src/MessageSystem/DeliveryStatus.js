import React from 'react';
import DoneAllIcon from '@material-ui/icons/DoneAll';
import DoneIcon from '@material-ui/icons/Done';
import { tick } from './MessageConversation.module.css';

const DeliveryStatus = ({ each }) => {
  if (each.deliveryStatus == 'Submitted')
    return (
      <span className={`${tick} `}>
        <DoneIcon
          className="w-4  "
          style={{ color: '#999', marginLeft: '2px' }}
        />
      </span>
    );
  else if (each.deliveryStatus == 'Delivered')
    return (
      <span className={`${tick} `}>
        <DoneAllIcon
          className="w-4  "
          style={{ color: '#999', marginLeft: '2px' }}
        />
      </span>
    );
  else if (each.deliveryStatus == 'Read')
    return (
      <span className={`${tick} `}>
        <DoneAllIcon
          className="w-4  "
          style={{ color: '#4fc3f7', marginLeft: '2px' }}
        />
      </span>
    );
  else return '';
};

export default DeliveryStatus;
