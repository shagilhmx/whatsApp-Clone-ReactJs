import React from 'react';
import classes from './NewSpinner.module.css';
const defaultStyle = {
  borderTopColor: '#3498db',
  width: '2rem',
  height: '2rem',
  borderWidth: '3px',
  borderTopWidth: '3px'
};
const NewSpinner = ({ styleObj = defaultStyle, colorClasses = '' }) => {
  return (
    <div
      className={
        classes.loader +
        ' ease-linear rounded-full border-6 border-t-6 border-grey-100 h-16 w-16 ' +
        colorClasses
      }
      style={styleObj}
    ></div>
  );
};

export default NewSpinner;
