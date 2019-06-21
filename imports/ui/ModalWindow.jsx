import React from 'react';
import PropTypes from 'prop-types';
import './Styles/modalWindow.css';

const ModalWindow = (props) => {
  const {
    Title,
    ShowAge,
    Image,
    Country,
    Authors,
    Description,
    Genres,
    Homepage,
    Trailer,
  } = props;

  return (
    <div>
      <div className="modalOverlay">
        <div className="modal">
          <h2>{Title}</h2>
          <div>{ShowAge}</div>
          <div
            className="imageHolder"
            style={{ backgroundImage: `url(${Image})` }}
          />
          <p>
            <strong>Origin country: </strong> {Country}
          </p>
          <p>
            <strong>Created by: </strong> {Authors}
          </p>
          <p>
            <strong>Description: </strong> {Description}
          </p>
          <p>
            <strong>Genres: </strong> {Genres}
          </p>
          <p>
            <strong>Homepage: </strong> {Homepage}
          </p>
          <div>
            <strong>Trailer: </strong> {Trailer}
          </div>
        </div>
      </div>
    </div>
  );
};

ModalWindow.propTypes = {
  Authors: PropTypes.string.isRequired,
  Country: PropTypes.string.isRequired,
  Description: PropTypes.string.isRequired,
  Genres: PropTypes.string.isRequired,
  Title: PropTypes.string.isRequired,
  Image: PropTypes.string.isRequired,
  ShowAge: PropTypes.oneOfType([PropTypes.element, PropTypes.string])
    .isRequired,
  Homepage: PropTypes.oneOfType([PropTypes.element, PropTypes.string])
    .isRequired,
  Trailer: PropTypes.oneOfType([PropTypes.element, PropTypes.string])
    .isRequired,
};

ModalWindow.displayName = 'ModalWindow';
export default ModalWindow;
