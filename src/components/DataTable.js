import React from 'react';
import { Table, ButtonGroup } from 'reactstrap';

import '../css/bootstrap.min.css';
import '../css/layout.css';


class DataTable extends React.Component {
  constructor(props) {
    super(props)
    this.state = {
      pageNum: 1,
      resultsPerPage: 5,
      booksToDisplay: []
    }
  }


  _createTable = () => {
    const tableContent = this.state.booksToDisplay
      .map((book, index) => (
        <tr key={index} data-book-id={book.id}>
          {this._createRow(book)}
        </tr>
      ))
    return tableContent;
  }


  _createHead = () => {
    const columns = ['Title', 'Author', 'Cover', 'Synopsis', 'Num Pages', 'Pub Date', 'Rating', 'Delete'];
    return columns.map((column, index) => <th key={index}>{column}</th>)
  }


  _createRow = (book) => {
    const rowSections = ['title', 'author', 'cover', 'synopsis', 'numPages', 'pubDate', 'rating'];

    const row = rowSections
      .map((prop, index) => (
        <td
          key={`${index}-${book.id}`}
          onClick={this.toggleEditModal}
          className={prop === 'synopsis' ? 'synopsis-stretch' : ''}
        >
          {this._formatTableContent(book, prop)}
        </td>
      ))

    row.push(
      <td key={`${rowSections.length + 1}-${book.id}`}>
        <input type="checkbox" onClick={(e) => this.confirmDelete(e,book.id,book.title)} />
      </td>
    )

    return row;
  }

  _formatTableContent = (book, prop) => {
    switch (prop) {
      case 'cover':
        return <img src={book[prop] || '../assets/generic_cover.png'} alt="book cover" className="tableImg" />
      case 'rating':
        return this._createStars(book[prop])
      case 'synopsis':
        return <p>{book[prop].slice(0, 40)}...</p>
      default:
        return book[prop]
    }
  }

  _createStars = (rating) => {
    const stars = []
    for (let i = 0; i < 5; i++) {
      stars.push(<span className={`fa fa-star ${i < rating ? 'checked' : ''}`} key={i}></span>)
    }

    return <div>{stars}</div>
  }

  toggleEditModal = (e) => {
    let bookElem = e.target.parentElement;
    let bookToEditId = bookElem.getAttribute('data-book-id');
    this.props.handleModalToggle('editBookModal', bookToEditId);
  }

  confirmDelete = (e,id,titleToDelete) => {
    let target = e.target;
    setTimeout(() => {
      const confirmation = window.confirm(`Are you sure you would like to delete ${titleToDelete}?`);
      if (confirmation) {
        this.props.restInterface.deleteBookById(id);
      } else {
        target.checked = false;
      }
    }, 100);
  }

  scrollToTop = () => {
    window.scrollTo({
      top: 0,
      left: 0,
      behavior: 'smooth'
    });
  }

  updateBooksToDisplay = async () => {
    let prevBtn = document.getElementById('prevBtn');
    prevBtn.style.display = 'none';
    let pageNum = this.state.pageNum;
    let resultsPerPage = this.state.resultsPerPage;
    let booksArr = this.props.bookShelf;
    let booksByPageArr = booksArr.slice(((pageNum*resultsPerPage) - resultsPerPage), pageNum*resultsPerPage);
    this.setState({
      booksToDisplay: booksByPageArr
    });
    return;
  }

  pageUp = () => {
    let totalPageNum = Math.ceil(this.props.bookShelf.length / 5);
    this.setState({
      pageNum: this.state.pageNum + 1
    },()=>{
      if(this.state.pageNum === totalPageNum) {
        this.updateBooksToDisplay();
        let nextBtn = document.getElementById('nextBtn');
        nextBtn.style.display = 'none';
        let prevBtn = document.getElementById('prevBtn');
        prevBtn.style.display = 'inline';
      } else if (this.state.pageNum > totalPageNum + 1) {
        this.updateBooksToDisplay()
        let nextBtn = document.getElementById('nextBtn');
        nextBtn.style.display = 'inline';
        let prevBtn = document.getElementById('prevBtn');
        prevBtn.style.display = 'inline';
        return;
      } else {
        this.updateBooksToDisplay()
        let nextBtn = document.getElementById('nextBtn');
        nextBtn.style.display = 'inline';
        let prevBtn = document.getElementById('prevBtn');
        prevBtn.style.display = 'inline';
      }
    });
  }

  pageDown = () => {
    this.setState({
      pageNum: this.state.pageNum  - 1
    },()=>{
      if(this.state.pageNum === 1) {
        this.updateBooksToDisplay();
        let prevBtn = document.getElementById('prevBtn');
        prevBtn.style.display = 'none';
        let nextBtn = document.getElementById('nextBtn');
        nextBtn.style.display = 'inline';
      } else {
        this.updateBooksToDisplay()
        let prevBtn = document.getElementById('prevBtn');
        prevBtn.style.display = 'inline';
        let nextBtn = document.getElementById('nextBtn');
        nextBtn.style.display = 'inline';
      }
    });
  }

  componentDidUpdate = (prevProps) => {
    if (prevProps.bookShelf.length !== this.props.bookShelf.length || 
      ((this.props.bookShelf.length > 0) && this.props.bookShelf[0].id !== prevProps.bookShelf[0].id)) {
      this.updateBooksToDisplay();
    }
  }

  render() {

    const tableHead = this._createHead();
    const tableBody = this._createTable();

    return (
      <div id="dataTable" >
        <p className="modal-title">Books</p>

        <Table>
          <thead>
            <tr>
              {tableHead}
            </tr>
          </thead>

          <tbody>
            {tableBody}
          </tbody>
        </Table>

        <ButtonGroup className="btn-group">
          <button onClick={this.pageDown} className="btn btn-default" id="prevBtn" type="button">Previous Page</button>
          <button onClick={this.scrollToTop} className="btn btn-default" type="button">Back to Top</button>
          <button onClick={this.pageUp} className="btn btn-default" id="nextBtn" type="button">Next Page</button>
        </ButtonGroup>

      </div>
    )
  }
}

export default DataTable;
