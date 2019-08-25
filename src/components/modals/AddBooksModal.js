import React from 'react';

import { Modal, ModalHeader, ModalBody, ModalFooter } from 'reactstrap';

import '../../css/bootstrap.min.css';
import '../../css/layout.css';


class AddBooksModal extends React.Component {
  constructor(props) {
    super(props)
    this.state = {
      queuedBooks: [],
      title: '',
      author: '',
      rating: '',
      numPages: '',
      pubDate: '',
      synopsis: '',
      cover: ''
    }
  }


  handleChange = (e) => {
    e.preventDefault();
    const { name, value } = e.target;
    this.setState({
      [name]: value
    })
  }


  queueBook = (e) => {
    e.preventDefault();
    let addedBookObj = {
      title: this.state.title,
      author: this.state.author,
      rating: this.state.rating,
      numPages: this.state.numPages,
      pubDate: this.state.pubDate,
      synopsis: this.state.synopsis,
      cover: this.state.cover
    }
    this.state.queuedBooks.push(addedBookObj);
    this.setState({
        title: '',
        author: '',
        rating: '',
        numPages: '',
        pubDate: '',
        synopsis: '',
        cover: ''
    });
    return;
  }


  addQueuedBooks = () => {
    this.props.restInterface.addBooks(this.state.queuedBooks);
    this.props.close();
  }


  componentDidMount = () => {
    document.getElementById('title').focus()
  }


  render() {
    return (
      <Modal isOpen fade={false} toggle={this.props.close}>

        <ModalHeader toggle={this.props.close}>
          <p className="modal-title">Add Books</p>
        </ModalHeader>

        <ModalBody>
          <form className="clearfix" autoComplete="off" onSubmit={this.queueBook}>

            <div className="form-group">
              <label htmlFor="title">Title *</label>
              <input id="title" onChange={this.handleChange} value={this.state.title} className="form-control" type="text" required={true} name="title" />
            </div>

            <div className="row">
              <div className="form-group col-xs-9">
                <label htmlFor="author">Author *</label>
                <input onChange={this.handleChange} value={this.state.author} className="form-control" type="text" required={true} name="author" />
              </div>

              <div className="form-group col-xs-3">
                <label htmlFor="rating">Star Rating</label>
                <input onChange={this.handleChange} value={this.state.rating} className="form-control" type="number" min={0} max={5} name="rating" />
              </div>
            </div>

            <div className="row">
              <div className="form-group col-xs-6">
                <label htmlFor="numPages">Pages</label>
                <input onChange={this.handleChange} value={this.state.numPages} className="form-control" type="number" placeholder={300} name="numPages" />
              </div>
              <div className="form-group col-xs-6">
                <label htmlFor="pubDate">Publication Date</label>
                <input onChange={this.handleChange} value={this.state.pubDate} className="form-control" type="date" placeholder="" name="pubDate" />
              </div>
            </div>

            <div className="form-group">
              <label htmlFor="synopsis">Synopsis</label>
              <textarea onChange={this.handleChange} value={this.state.synopsis} cols="75" rows="5" maxLength="250" placeholder="No synopsis available." name="synopsis" className="synopsis" />
            </div>

            <div className="form-group">
              <label htmlFor="cover">Book cover</label>
              <input onChange={this.handleChange} value={this.state.cover} type="file" accept=".jpg, .jpeg, .png" name="cover" />
            </div>

            <button className="btn btn-default pull-left" type="submit">Queue Book To Add</button>
            <button className="btn btn-default btn-add pull-right" type="button" onClick={this.addQueuedBooks}>AddBooks To Library</button>

            <div className="counter-message pull-right">
              <span>{this.state.queuedBooks.length}</span> book(s) ready to add!&nbsp;&nbsp;<span className="glyphicon glyphicon-arrow-right"></span>&nbsp;&nbsp;&nbsp;
          </div>

          </form>
        </ModalBody>

        <ModalFooter>
          <button variant="primary" className="btn btn-default" type="button" onClick={this.props.close}>Close</button>
        </ModalFooter>
      </Modal>
    )
  }
}

export default AddBooksModal;