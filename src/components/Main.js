import React from 'react';
import axios from 'axios';

import Header from './Header';
import Jumbotron from './Jumbotron';
import Navbar from './Navbar';
import Footer from './Footer';
import DataTable from './DataTable';
import ModalController from './modals/ModalController';


import '../css/bootstrap.min.css';
import '../css/layout.css';


export default class Main extends React.Component {
  constructor() {
    super()
    this.state = {
      modal: null, 
      bookShelf: [],
    }
  }


  // ******** REST API restInterface METHODS
  
  validateBooks = (booksArr) => {
    var regex = /([12]\d{3}-(0[1-9]|1[0-2])-(0[1-9]|[12]\d|3[01]))/;
    let validatedBooksArr = [];
    const bookDisposalArr = [];
    const bookProperties= ['author','id','numPages','pubDate','rating','synopsis','title'];
    for (let i = 0; i < booksArr.length; i++) {
      if (!(this.hasAllProperties(booksArr[i],bookProperties))) {
        console.log("Additional data is required for one or more books.  Sending book(s) to the book dipslosal array.");
        bookDisposalArr.push(booksArr[i]);
      } else {
        booksArr[i].author = String(booksArr[i].author);
        booksArr[i].cover = String(booksArr[i].cover);
        booksArr[i].id = String(booksArr[i].id);
        booksArr[i].numPages = String(booksArr[i].numPages);
        booksArr[i].rating = String(booksArr[i].rating);
        booksArr[i].synopsis = String(booksArr[i].synopsis);
        booksArr[i].id = String(booksArr[i].id);
        var dateObj = new Date(booksArr[i].pubDate);
        
        if (regex.test(dateObj)) {
          booksArr[i].pubDate = String(dateObj);
          validatedBooksArr.push(booksArr[i]);
        } else if ((dateObj.toString()) !== "Invalid Date") {
          if ((dateObj.getMonth() + 1) < 10) {
            var month = `0${dateObj.getMonth() + 1}`;
          } else {
            month = ((dateObj.getMonth()) + 1);
          }
          if (dateObj.getDate() < 10) {
            var date = `0${dateObj.getDate()}`;
          } else {
            date = dateObj.getDate();
          }
          let newDateFormat = `${dateObj.getFullYear()}-${month}-${date}`;
          booksArr[i].pubDate = newDateFormat;
          validatedBooksArr.push(booksArr[i]);
        } else if (booksArr[i].pubDate === "") {
          booksArr[i].pubDate = "";
          validatedBooksArr.push(booksArr[i]);
        } else {
          bookDisposalArr.push(booksArr[i]);
        }
      }
    }
    return validatedBooksArr;
  }

  hasAllProperties = (obj, props) => {
    for (let i = 0; i < props.length; i++) {
        if (!obj.hasOwnProperty(props[i]))
            return false;
    }
    return true;
  }
  
  getAllBooks = async () => {
    const failArr = [];
    let booksArr = [];
    let booksArrSorted = [];
    const books = await axios.get('https://us-central1-library-backend-firebase.cloudfunctions.net/api/library/200/?timeStamp=0')
      .catch(function (error) {
        console.log(`Ooops: ${error}`);
        return failArr;
      });
    booksArr = books.data;
    booksArr = this.validateBooks(booksArr); 
    booksArrSorted = this.sortBooksById(booksArr);
    this.setState(() => {
      return {
        bookShelf: booksArrSorted
      }
    });
  }

  addBooks = async (bookArr) => {
    await axios.post('https://us-central1-library-backend-firebase.cloudfunctions.net/api/library',{
      books: bookArr
    })
    .then(res => {
      if(res){
        this.setState({bookShelf:[]},()=>{
          this.getAllBooks()
        })
      }
    });
    return;
  }

  removeBooks = (paramsObj) => {
    let titleToDelete = paramsObj.title;
    let authorToDelete = paramsObj.author;
    if (!authorToDelete && titleToDelete){
      let confirmation = window.confirm("Are you sure you would like to delete all books with title " + titleToDelete + "?");
      if (confirmation === true) {
        axios.delete(`https://us-central1-library-backend-firebase.cloudfunctions.net/api/library/deleteBy/?title=${titleToDelete}`)
        .then(res => {
          if(res){
            this.setState({bookShelf:[]},()=>{
              this.getAllBooks()
            })
          }
        }).catch(error=> console.log(error));
      } else {
        return;
      }
    } else if (authorToDelete && !titleToDelete){
      let confirmation = window.confirm("Are you sure you would like to delete all books by " + authorToDelete + "?");
      if (confirmation === true) {
        axios.delete(`https://us-central1-library-backend-firebase.cloudfunctions.net/api/library/deleteBy/?author=${authorToDelete}`)
        .then(res => {
          if(res){
            this.setState({bookShelf:[]},()=>{
              this.getAllBooks()
            })
          }
        }).catch(error=> console.log(error));
      } else {
        return;
      }
    } else {
      let confirmation = window.confirm("Are you sure you would like to delete all copies of " + titleToDelete + " by " + authorToDelete + "?");
      if (confirmation === true) {
        axios.delete(`https://us-central1-library-backend-firebase.cloudfunctions.net/api/library/deleteBy/?title=${titleToDelete}&author=${authorToDelete}`)
        .then(res => {
          if(res){
            this.setState({bookShelf:[]},()=>{
              this.getAllBooks()
            })
          }
        }).catch(error=> console.log(error));
      } else {
        return;
      }
    }
    return;
  }

  editBook = async (editedBook) => {
    let id = editedBook.id;
    await axios.put(`https://us-central1-library-backend-firebase.cloudfunctions.net/api/library/update/${id}`,editedBook)
    .then(res => {
      if(res){
        this.setState({bookShelf:[]},()=>{
          this.getAllBooks()
        })
      }
    }).catch(function (error) {
      console.log(`Ooops: ${error}`);
    });
    return;
  }

  searchForBooks = async (paramsObj) => {
    let title = paramsObj.title;
    let author = paramsObj.author;
    let desiredBooks = await axios.get(`https://us-central1-library-backend-firebase.cloudfunctions.net/api/library/searchBy/?title=${title}&author=${author}`)
    .catch(error=> console.log(error)); 
    if (typeof desiredBooks.data[0] === 'string'){
      if ((title && author) && (desiredBooks.data[0].includes("Sorry")) && (desiredBooks.data[1].includes("Sorry"))){
        alert(desiredBooks.data[0] + "\n" + desiredBooks.data[1]);
      } else if ((title && !author) && (desiredBooks.data[0].includes("Sorry"))){
        alert(desiredBooks.data[0]);
      } else if ((!title && author) && (desiredBooks.data[0].includes("Sorry"))){
        alert(desiredBooks.data[0]);
      }
    } else {
      let searchResultsArr = desiredBooks.data;
      this.setState(() => {
        return {
          bookShelf: searchResultsArr
        }
      });
    }
    return;
  }

  suggestBook = async() => {
    let suggestedBookArr = [];
    let synopsis = "";
    while (synopsis === "" || synopsis === undefined || synopsis === null) {
      var response = await axios.get('https://us-central1-library-backend-firebase.cloudfunctions.net/api/library/random')
      .catch(function (error) {
        console.log(`Ooops: ${error}`);
        return;
      })
      synopsis = response.data[0].synopsis;
    }
    let suggestedBookObj = response.data[0];
    suggestedBookArr.push(suggestedBookObj);
    this.setState(() => {
      return {
        bookShelf: suggestedBookArr
      }
    });
    return;
  }

  deleteBookById = (id) => {
    axios.delete(`https://us-central1-library-backend-firebase.cloudfunctions.net/api/library/deleteById/${id}`)
    .then(res => {
      if(res){
        this.setState({bookShelf:[]},()=>{
          this.getAllBooks()
        })
      }
    })
    .catch(error=> console.log(error));
    return;
  }

  // ******** END OF REST API restInterface METHODS

  
  handleModalToggle = (modalToOpen, id) => {
    this.setState({
      modal: modalToOpen,
      id: id
    });
  }

  sortBooksById = (books) => {
    return books.sort((a, b) => {
      if (a.id < b.id) return -1;
      if (a.id > b.id) return 1;
      return 0;
    });
  }

  componentDidMount = () => {
    this.getAllBooks();
  }


  render() {
    const { getAllBooks, addBooks, removeBooks, editBook, searchForBooks, suggestBook, deleteBookById } = this;
    const restInterface = { getAllBooks, addBooks, removeBooks, editBook, searchForBooks, suggestBook, deleteBookById };

    return (
      <div>
        <Header handleModalToggle={this.handleModalToggle} />

        <Jumbotron />

        <Navbar
          handleModalToggle={this.handleModalToggle}
          restInterface={restInterface}
        />

        <ModalController
          modal={this.state.modal}
          handleModalToggle={this.handleModalToggle}
          restInterface={restInterface}
          bookShelf={this.state.bookShelf}
          id={this.state.id}
        />

        <DataTable
          restInterface={restInterface}
          bookShelf={this.state.bookShelf}
          handleModalToggle={this.handleModalToggle}
        />

        <Footer />

      </div>
    )
  }
}