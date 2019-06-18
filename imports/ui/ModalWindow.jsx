import React from 'react';
import PropTypes from 'prop-types';

const ModalWindow = ({ props }) => {
  const { rowData } = props;

  const noDataAvailable = () => {
    return 'No Data Available';
  };

  const getTitle = () => {
    const amountOfSeasons = rowData.additionalInfo.number_of_seasons;
    const status = rowData.additionalInfo.status.toLowerCase();
    let title;
    if (!rowData.title) {
      title = noDataAvailable();
      return title;
    }
    if (amountOfSeasons > 1 || amountOfSeasons === 0) {
      title = `${rowData.title} (${
        rowData.additionalInfo.number_of_seasons
      } seasons, ${status})`;
      return title;
    }
    title = `${rowData.title} (${
      rowData.additionalInfo.number_of_seasons
    } season, ${status})`;
    return title;
  };

  const getCountry = () => {
    let country = [];
    if (!rowData.additionalInfo.origin_country) {
      country = noDataAvailable();
      return country;
    }
    // eslint-disable-next-line prefer-destructuring
    country = rowData.additionalInfo.origin_country[0];
    return country;
  };

  const getAuthors = () => {
    let authors = [];
    if (!rowData.additionalInfo.created_by.length) {
      authors = noDataAvailable();
      return authors;
    }
    rowData.additionalInfo.created_by.map((val) => authors.push(val.name));
    authors = authors.join(', ');
    return authors;
  };

  const getShowAge = () => {
    let returnValue;
    if (
      !rowData.additionalInfo.first_air_date ||
      !rowData.additionalInfo.last_air_date
    ) {
      returnValue = noDataAvailable();
      return returnValue;
    }
    const isInProduction = rowData.additionalInfo.in_production;
    const firstEpisode = new Date(
      ...rowData.additionalInfo.first_air_date.split('-')
    ).toLocaleString('en-us', { year: 'numeric', month: 'short' });
    const lastEpisode = new Date(
      ...rowData.additionalInfo.last_air_date.split('-')
    ).toLocaleString('en-us', { year: 'numeric', month: 'short' });
    if (isInProduction) {
      returnValue = (
        <p>
          <i>{firstEpisode} - In production</i>
        </p>
      );
    } else {
      returnValue = (
        <p>
          <i>
            {firstEpisode} - {lastEpisode}
          </i>
        </p>
      );
    }
    return returnValue;
  };

  const getDescription = () => {
    let description;
    if (!rowData.additionalInfo.overview) {
      description = noDataAvailable();
      return description;
    }
    description = rowData.additionalInfo.overview;
    return description;
  };

  const getGenres = () => {
    let genres = [];
    if (!rowData.additionalInfo.genres) {
      genres = noDataAvailable();
      return genres;
    }
    rowData.additionalInfo.genres.map((val) => genres.push(val.name));
    genres = genres.join(', ');
    return genres;
  };

  const getImage = () => {
    let imgSrc;
    if (!rowData.additionalInfo.images.backdrops.length) {
      imgSrc = `https://i.imgur.com/liRbyUs.png`;
      return imgSrc;
    }
    imgSrc = `https://image.tmdb.org/t/p/w780${
      rowData.additionalInfo.images.backdrops[
        Math.floor(
          Math.random() * rowData.additionalInfo.images.backdrops.length
        )
      ].file_path
    }`;
    return imgSrc;
  };

  const getHomepage = () => {
    let homepage;
    if (!rowData.additionalInfo.homepage) {
      homepage = noDataAvailable();
      return homepage;
    }
    homepage = (
      <a
        rel="noopener noreferrer"
        target="_blank"
        href={rowData.additionalInfo.homepage}
      >
        {rowData.additionalInfo.homepage}
      </a>
    );
    return homepage;
  };

  const getTrailer = () => {
    let trailer;
    if (!rowData.additionalInfo.videos.results[0]) {
      trailer = noDataAvailable();
      return trailer;
    }
    const trailerDataKey =
      rowData.additionalInfo.videos.results[
        Math.floor(Math.random() * rowData.additionalInfo.videos.results.length)
      ].key;
    const trailerData = `https://www.youtube.com/embed/${trailerDataKey}`;
    trailer = (
      <div style={{ marginTop: 14 }} className="iframeContainer">
        <iframe
          title={rowData.title}
          width="100%"
          height="422"
          src={trailerData}
          frameBorder="0"
          allow="accelerometer; autoplay; encrypted-media; gyroscope; picture-in-picture"
          allowFullScreen
        />
      </div>
    );
    return trailer;
  };

  return (
    <div>
      <div className="blurIt" />
      <div className="modalOverlay">
        <div className="modal">
          <h2 style={{ marginTop: 0, marginBottom: 0 }}>{getTitle()}</h2>
          <div>{getShowAge()}</div>
          <div
            className="imageHolder"
            style={{ backgroundImage: `url(${getImage()})` }}
          />
          <p>
            <strong>Origin country: </strong> {getCountry()}
          </p>
          <p>
            <strong>Created by: </strong> {getAuthors()}
          </p>
          <p>
            <strong>Description: </strong> {getDescription()}
          </p>
          <p>
            <strong>Genres: </strong> {getGenres()}
          </p>
          <p>
            <strong>Homepage: </strong> {getHomepage()}
          </p>
          <div>
            <strong>Trailer: </strong> {getTrailer()}
          </div>
        </div>
      </div>
    </div>
  );
};

ModalWindow.propTypes = {
  props: PropTypes.object.isRequired,
  rowData: PropTypes.object,
};

ModalWindow.displayName = 'ModalWindow';
export default ModalWindow;
