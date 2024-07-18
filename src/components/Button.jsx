import PropTypes from 'prop-types';
import css from '../styles/button.module.css';

export const Button = ({ handlePage }) => {
  return (
    <button onClick={handlePage} type="button" className={css.button}>
      Load more
    </button>
  );
};

Button.propTypes = {
  handlePage: PropTypes.func.isRequired,
};
