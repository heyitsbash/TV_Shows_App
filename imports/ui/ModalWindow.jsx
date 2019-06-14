import React from 'react';
import PropTypes from 'prop-types';

const ModalWindow = ({ props }) => {
  const { rowData } = props;

  return (
    <div>
      <div className="blurIt" />
      <div className="modalOverlay">
        <div className="modal">
          <p>hi im a modal from new component</p>
          <h2>Show title: {rowData.title}</h2>
        </div>
      </div>
    </div>
  );
};

ModalWindow.propTypes = {
  props: PropTypes.object.isRequired,
  rowData: PropTypes.object.isRequired,
};

ModalWindow.displayName = 'ModalWindow';
export default ModalWindow;
