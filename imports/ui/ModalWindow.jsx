import React from 'react';
import PropTypes from 'prop-types';

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
      <div className="blurIt" />
      <div className="modalOverlay">
        <div className="modal">
          <h2 style={{ marginTop: 0, marginBottom: 0 }}>{Title}</h2>
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
  ShowAge: PropTypes.element.isRequired,
  Homepage: PropTypes.element.isRequired,
  Trailer: PropTypes.element.isRequired,
};

ModalWindow.displayName = 'ModalWindow';
export default ModalWindow;
