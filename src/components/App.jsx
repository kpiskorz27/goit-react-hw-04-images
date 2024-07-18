import css from '../styles/app.module.css';
import { useState, useEffect, useRef, useCallback } from 'react';

import { Button } from './Button';
import { ImageGallery } from './ImageGallery';
import { ImageGalleryItem } from './ImageGalleryItem';
import { Loader } from './Loader';
import { Modal } from './Modal';
import { Searchbar } from './Searchbar';

export const App = () => {
  const [images, setImages] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [clicked, setClicked] = useState(false);
  const [modalAlt, setModalAlt] = useState('');
  const [modalSrc, setModalSrc] = useState('');
  const [searchValue, setSearchValue] = useState('');

  const timerRef = useRef(null);

  const handleForm = async event => {
    event.preventDefault();
    const form = event.currentTarget;
    let inputValue = form.elements.search.value.trim();
    setImages([]);
    if (!inputValue) {
      setError('Please fill the search field');
      return;
    }
    setSearchValue(inputValue);
    setCurrentPage(1);
    form.reset();
  };

  const handleOpen = event => {
    setLoading(true);
    setClicked(true);
    const alt = event.target.alt;
    const src = event.target.getAttribute('datasrc');
    setModalAlt(alt);
    setModalSrc(src);
    setTimeout(() => {
      setLoading(false);
    }, 750);
  };

  const handleClose = useCallback(() => {
    setClicked(false);
  }, []);

  const handlePage = () => {
    setCurrentPage(prevPage => prevPage + 1);
  };

  const fetchData = useCallback(async () => {
    const query = `https://pixabay.com/api/?q=${searchValue}&page=${currentPage}&key=22104358-08479b9423ea424bd28360651&image_type=photo&orientation=horizontal&per_page=12`;
    try {
      const response = await fetch(query);
      const data = await response.json();
      const fetchedImages = data.hits;

      const uniqueImages = fetchedImages.filter(
        image => !images.some(existingImage => existingImage.id === image.id)
      );

      if (uniqueImages.length > 0) {
        setImages(prevImages => [...prevImages, ...uniqueImages]);
      }
    } catch (error) {
      setError('Sorry, could not get images from the server');
      console.log(error);
    }
  }, [searchValue, currentPage, images]);

  useEffect(() => {
    if (searchValue || currentPage > 1) {
      setError('');
      setLoading(true);
      timerRef.current = setTimeout(() => {
        fetchData();
        setLoading(false);
      }, 300);
    }
    return () => {
      clearTimeout(timerRef.current);
    };
  }, [searchValue, currentPage, fetchData]);

  useEffect(() => {
    const handleKeyPress = event => {
      if (event.key === 'Escape' && clicked) {
        handleClose();
      }
    };

    window.addEventListener('keydown', handleKeyPress);

    return () => {
      window.removeEventListener('keydown', handleKeyPress);
    };
  }, [clicked, handleClose]);

  return (
    <div className={css.app}>
      <Searchbar handleForm={handleForm} />
      {searchValue && (
        <>
          {images.length > 0 && (
            <ImageGallery>
              {images.map(({ largeImageURL, webformatURL, tags, id }) => (
                <ImageGalleryItem
                  key={id}
                  imageURL={webformatURL}
                  alt={tags}
                  handleOpen={handleOpen}
                  largeImageURL={largeImageURL}
                />
              ))}
            </ImageGallery>
          )}
          {loading && <Loader />}
          {images.length > 0 && <Button handlePage={handlePage} />}
        </>
      )}
      {clicked && (
        <Modal alt={modalAlt} src={modalSrc} handleClose={handleClose}>
          {loading ? (
            <div className={css['loader-container']}>
              <Loader />
            </div>
          ) : (
            <img src={modalSrc} alt={modalAlt} className={css.modalImage} />
          )}
        </Modal>
      )}
      {error && <div className={css.error}>{error}</div>}
    </div>
  );
};
