import axios from "axios";
import React, { useEffect, useState } from "react";

function App() {
  // I've defined a new states variable named "characters,publicPages,page,loading".
  const [characters, setCharacters] = useState([]);
  const [publicPages, setPublicPage] = useState([]);
  const [page, setPage] = useState(1);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    //Using this Hook, I asked React to run my getData function after rendering my component.
    getData();
  }, [page]);
 
  const getData = async () => {
    //With setLoading, we put it on hold until the data comes.
    setLoading(true);
    //I took the "characters" data with getItem and parsed it and put it in my store variable
    const store = JSON.parse(sessionStorage.getItem("characters")) || [];

    //If there is data stored in sessionStorage in the condition expression, it does the following operations,otherwise it adds the "character" data to sessionStroage by sending API request with axios.

    if (store[page]) {
      setCharacters([...store[page]]);
      setLoading(false);
      const allPages= sessionStorage.getItem("total");
      getPagination(allPages/20);
      
    } else {

      const conclusion = await axios.get(
        "http://gateway.marvel.com/v1/public/characters?offset=" +
          (page * 20 - 20) +
          "&ts=1&apikey=511722e80fb16c6d9343f7d8abadb1b3&hash=422408224d36f5efe08e1bdbf4521042"
      );

      getPagination(conclusion.data.data.total / 20);
      sessionStorage.setItem(
        "allPages",
        JSON.stringify(conclusion.data.data.total)
      );

      setCharacters([...conclusion.data.data.results]);
      sessionStorage.setItem(
        "characters",
        JSON.stringify({ ...store, [page]: [...conclusion.data.data.results] })
      );

      setLoading(false);
    }
  };

  const getPagination = (maxPage) => {
    //The getPagination function takes the maximum number of pages as a parameter. And it adds the page structure that matches the conditions in the cases to my allPages variable, which contains an empty array.
    var allPages = [];

    switch (true) {
    case page < 4:
      allPages.push(
        ...[
          1,
          2,
          3,
          4,
          "...",
          `${maxPage}`,
        ]
      );
      break;

    case (page >= 4) && (page <= maxPage -3):
      allPages.push(
        ...[
          1,
          "...",
          `${page-1}`,
          `${page}`,
          `${page+1}`,
          "...",
          `${maxPage}`
          
        ]
      );
      break;
    case page <= maxPage - 4:
      allPages.push(
        ...[
          1,
          "...",
          `${maxPage - 5}`,
          `${maxPage - 4}`,
          `${maxPage - 3}`,
          "...",
          `${maxPage}`,
        ]
      );
      break;

    case page == maxPage - 3:
      allPages.push(
        ...[
          1,
          "...",
          `${maxPage - 4}`,
          `${maxPage - 3}`,
          `${maxPage - 2}`,
          `${maxPage - 1}`,
          `${maxPage}`,
        ]
      );
      break;

    case page == maxPage - 2:
      allPages.push(
        ...[
          1,
          "...",
          `${maxPage - 3}`,
          `${maxPage - 2}`,
          `${maxPage - 1}`,
          `${maxPage}`,
        ]
      );
      break;

    case page == maxPage - 1:
      allPages.push(
        ...[
          1,
          "...",
          `${page - 2}`,
          `${page - 1}`,
          `${page}`,
          `${maxPage}`,
        ]
      );
      break;

    default:
      allPages.push(
        ...[
          1,
          "...",
          `${page - 2}`,
          `${page - 1}`,
          `${maxPage}`,
        ]
      );
    }
    setPublicPage(allPages);
  };

  return (
    
  //In my return() function, I first added the data with index keys to the div tags with the map() function.

  //I provided navigation functionality to the pagination property in the footer tag with the map() onClick() and scroolTo() methods.

    <div id="">
      <div id="content">
        <div className="card-elements">
          {characters.map((item, index) => (
            <div key={index} className="card-element">
              <div className="card-element-image">
                <img
                  className="img"
                  src={
                    item.thumbnail.path +
                    "/portrait_incredible." +
                    item.thumbnail.extension
                  }
                  alt=""
                />
              </div>
              <div className="card-element-text">
                <span>{item.name}</span>
              </div>
            </div>
          ))}
        </div>
      </div>

      {loading && (
        <div className="loading">
          <span>Please wait a moment...</span>
        </div>
      )}
      
      <footer className="pagination">
        
        {page !== 1 && (
          <span onClick={() => setPage((prevPage) => prevPage - 1)}>
            <i className="fa-solid fa-angle-left fa-xl"></i>
          </span>
        )}
        {publicPages.map((item, index) => (
          <span
            key={index}
            className={
              item==page ? "active" : ""
            }
            onClick={() =>{
              if( item != "...") {

                setPage(Number(item));
                window.scrollTo(0,100);
              }
                
              else{
                null;
              }
                
            }}
          >
            {item}
          </span>
        ))}
        {page !== 78 && (
          <span onClick={() => setPage((prevPage) => prevPage + 1)}>
            <i className="fa-solid fa-angle-right fa-xl "></i>
          </span>
        )}
        
      </footer>
    </div>
  );
}

export default App;
