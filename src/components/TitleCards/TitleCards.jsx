import { useState, useEffect, useRef } from 'react';
import './TitleCard.css';
import cards_data from '../../assets/cards/Cards_data'; // Not used here, might be a leftover
import PropTypes from 'prop-types';
import { Link } from 'react-router-dom';

const TitleCards = ({ title, category }) => {
  const [apiData, setApiData] = useState([]);
  const cardsRef = useRef();

  const options = {
    method: 'GET',
    headers: {
      accept: 'application/json',
      Authorization: 'Bearer eyJhbGciOiJIUzI1NiJ9.eyJhdWQiOiJhNjRjMjJlZTBkMjU2MmVmNjQyMDFmMzJmMDNkMTc2NSIsIm5iZiI6MTczODMwODYxMS4zNzc5OTk4LCJzdWIiOiI2NzljN2MwMzEzNGY0ODgxNjEwMTE4OTEiLCJzY29wZXMiOlsiYXBpX3JlYWQiXSwidmVyc2lvbiI6MX0.wC__7zJMnT4_98TgTNSTg_zbKAP9r0rwPglupsIkksA',
    },
  };

  // Scroll handler to scroll horizontally
  const handleWheel = (e) => {
    e.preventDefault();  // Fixed typo from prevnetDefault to preventDefault
    cardsRef.current.scrollLeft += e.deltaY;  // Use deltaY for vertical scrolling to trigger horizontal scroll
  };

  useEffect(() => {
    // Fetch data from the API
    fetch(
      `https://api.themoviedb.org/3/movie/${
        category ? category : 'now_playing'
      }?language=en-US&page=1`,
      options, {
        mode: 'no-cors',
      }
    )
      .then((res) => res.json())
      .then((res) => setApiData(res.results))
      .catch((err) => console.error(err));

    // Add scroll event listener when component mounts
    const cardsRefCurrent = cardsRef.current;
    cardsRefCurrent.addEventListener('wheel', handleWheel);

    // Cleanup the event listener when the component unmounts
    return () => {
      cardsRefCurrent.removeEventListener('wheel', handleWheel);
    };
  }, [category]); // Adding category as a dependency to re-fetch data when it changes

  return (
    <div className="TitleCards">
      <h2>{title ? title : 'Popular on Netflix'}</h2>
      <div className="card-list" ref={cardsRef}>
        {apiData?.length > 0 &&
          apiData.map((card, index) => (
            <Link to={`/player/${card.id}`} className="card" key={index}>
              <img
                src={`https://image.tmdb.org/t/p/w500${card.backdrop_path}`}
                alt=""
              />
              <p>{card.original_title}</p>
            </Link>
          ))}
      </div>
    </div>
  );
};

TitleCards.propTypes = {
  title: PropTypes.string,
  category: PropTypes.string,
};

export default TitleCards;
