export const setApplicantionInfo = applicantionInfo => {
  localStorage.setItem('applicantionInfo', JSON.stringify(applicantionInfo));
  return true;
};

export const getApplicantionInfo = () => {
  return localStorage.hasOwnProperty('applicantionInfo')
    ? JSON.parse(localStorage.getItem('applicantionInfo'))
    : false;
};

export const removeApplicantionInfo = () => {
  return localStorage.hasOwnProperty('applicantionInfo')
    ? localStorage.removeItem('applicantionInfo')
    : false;
};
