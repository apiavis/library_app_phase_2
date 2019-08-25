import React from 'react';

import '../css/bootstrap.min.css';
import '../css/layout.css';

const Header = (props) => {

  function openModal(e) {
    props.handleModalToggle(e.target.dataset.modalTarget)
  }

  return (
    <div className="container-fluid row header-container">

      <div className="col-xs-3 btn-column">
        <button
          data-modal-target="removeBooksModal"
          onClick={openModal}
          type="button"
          className="btn btn-default btn-remove pull-left">

          <span className="glyphicon glyphicon-minus"></span> Remove Books
        </button>
      </div>

      <div className="col-xs-6 text-center">
        <h1 className="library-header">The Library</h1>
      </div>

      <div className="col-xs-3 btn-column">
        <button
          data-modal-target="addBooksModal"
          onClick={openModal}
          type="button"
          className="btn btn-default btn-add pull-right">

          <span className="glyphicon glyphicon-plus"></span> Add Books
        </button>
      </div>

    </div>
  )
}

export default Header;