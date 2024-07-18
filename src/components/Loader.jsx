import { Vortex } from 'react-loader-spinner';
import css from '../styles/loader.module.css';

export const Loader = () => {
  return (
    <div className={css['loader-container']}>
      <Vortex
        className={css.loader}
        visible={true}
        strokeWidth="4"
        animationDuration="0.75"
        ariaLabel="rotating-lines-loading"
        wrapperStyle={{}}
        wrapperClass=""
      />
    </div>
  );
};
