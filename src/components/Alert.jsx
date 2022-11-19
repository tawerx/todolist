import React from 'react';

/**
 * @typedef {object} AlertProps
 * @property {string} message
 */

/**
 * Alert component
 * @type {React.FC<AlertProps>}
 * @returns {React.ReactElement} Custom Alert element
 */
const Alert = ({ message }) => {
  return (
    <div className="alert">
      <span>{message}</span>
    </div>
  );
};

export default Alert;
