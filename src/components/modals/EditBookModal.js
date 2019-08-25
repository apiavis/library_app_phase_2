import React from 'react';

import { Modal, ModalHeader, ModalBody, ModalFooter } from 'reactstrap';

import '../../css/bootstrap.min.css';
import '../../css/layout.css';


class EditBookModal extends React.Component {
  constructor(props) {
    super(props)
    this.state = {
      id: '',
      title: '',
      author: '',
      rating: '',
      numPages: '',
      pubDate: '',
      synopsis: '',
      cover: ''
    }
  }

  populateInputs = () => {
    let bookId = this.props.id;
    let booksArr = this.props.bookShelf;
    let bookObj = booksArr.find(obj => obj.id === bookId);
    const bookKeysArr = ['title','author','rating','numPages','pubDate','synopsis'];
    const formIdsArr = ['title-edit-input','author-edit-input','rating-edit-input','pages-edit-input','date-edit-input','synopsis-edit-input'];
    for (let i = 0; i < bookKeysArr.length; i++) {
      let key = bookKeysArr[i];
      let formElement = document.getElementById(formIdsArr[i]);
      formElement.value = bookObj[key];
    }
    this.setState({
      id: bookObj.id,
      title: bookObj.title,
      author: bookObj.author,
      rating: bookObj.rating,
      numPages: bookObj.numPages,
      pubDate: bookObj.pubDate,
      synopsis: bookObj.synopsis,
      cover: bookObj.cover
    });
    return;
  }

  handleChange = (e) => {
    e.preventDefault();
    const { name, value } = e.target;
    this.setState({
      [name]: value
    });
  }
  
  editBook = (e) => {
    e.preventDefault();
    this.props.restInterface.editBook(this.state);
    this.props.close();
    return;
  }

  componentDidMount = () => {
    this.populateInputs()
  }


  render() {
    return (
      <Modal isOpen fade={false} toggle={this.props.close}>

        <ModalHeader toggle={this.props.close}>
          <p className="modal-title">Edit Book</p>
        </ModalHeader>

        <ModalBody>
          <form className="clearfix" autoComplete="off" id="editBookModalForm">

            <div className="form-group">
              <label htmlFor="title-edit-input">Title *</label>
              <input id="title-edit-input" onChange={this.handleChange} className="form-control" type="text" required={true} autoFocus="autoFocus" name="title" />
            </div>

            <div className="row">
              <div className="form-group col-xs-9">
                <label htmlFor="author-edit-input">Author *</label>
                <input id="author-edit-input" onChange={this.handleChange} className="form-control" type="text" required={true} name="author" />
              </div>
              <div className="form-group col-xs-3">
                <label htmlFor="rating-edit-input">Star Rating</label>
                <input id="rating-edit-input" onChange={this.handleChange} className="form-control" type="number" min="0" max="5" name="rating" />
              </div>
            </div>

            <div className="row">
              <div className="form-group col-xs-6">
                <label htmlFor="pages-edit-input">Pages</label>
                <input id="pages-edit-input" onChange={this.handleChange} className="form-control" type="number" placeholder="300" name="numPages" />
              </div>
              <div className="form-group col-xs-6">
                <label htmlFor="date-edit-input">Publication Date</label>
                <input id="date-edit-input" onChange={this.handleChange} className="form-control" type="date" value={this.state.pubDate} name="pubDate" />
              </div>
            </div>

            <div className="form-group">
              <label htmlFor="synopsis-edit-input">Synopsis</label><br />
              <textarea id="synopsis-edit-input" onChange={this.handleChange} cols="75" rows="5" maxLength="250" placeholder="No synopsis available."
                name="synopsis" className="synopsis" />
            </div>

            <div className="form-group">
              <label htmlFor="cover-edit-input">Book cover</label>
              <input id="cover-edit-input" onChange={this.handleChange} type="file" accept=".jpg, .jpeg, .png" name="cover" />
            </div>

            <button id="submit-edit-button" className="btn btn-default btn-add" type="button" data-dismiss="modal" form="editBookModalForm" onClick={this.editBook}>Submit Changes</button>
          </form>
        </ModalBody>


        <ModalFooter>
          <button variant="primary" className="btn btn-default" type="button" onClick={this.props.close}>Close</button>
        </ModalFooter>

      </Modal>
    )
  }
}

export default EditBookModal;