import PropTypes from 'prop-types';
import css from '../styles/modal.module.css';
import React from 'react';

export const Modal = ({ alt, src, handleClose, children }) => {
  const handleClick = event => {
    event.stopPropagation();
  };

  return (
    <div onClick={handleClose} className={css.overlay}>
      <div onClick={handleClick} className={css.modal}>
        {children || <img src={src} alt={alt} className={css.modalImage} />}
      </div>
    </div>
  );
};

Modal.propTypes = {
  alt: PropTypes.string.isRequired,
  src: PropTypes.string.isRequired,
  handleClose: PropTypes.func.isRequired,
  children: PropTypes.node,
};
