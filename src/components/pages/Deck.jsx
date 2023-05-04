import {Link} from "react-router-dom"
import CardForm from "../partials/CardForm";
import {useState, useEffect} from "react"
import { useNavigate, useParams } from "react-router-dom"
import axios from 'axios';

export default function Deck(){
  const [cards, setCards] = useState([]);
  const {id} = useParams()
  const navigate = useNavigate();

  const fetchCards = async () => {
    try {
      const token = localStorage.getItem('jwt');

      if (!token) {
        navigate('/login'); // Redirect user to login page if no token found
      } else {
        const response = await axios.get(`${process.env.REACT_APP_SERVER_URL}/api-v1/decks/${id}`, {
          headers: {
            'Authorization': token
          }
        });
        console.log(`this is the setCards response data`,response.data);
        setCards(response.data.flashcards);
      }
    } catch (error) {
      console.error(error);
    }
  }

  useEffect(() => {
    fetchCards();
  },[]);

  const deleteFlashcard = async (id) => {
    const token = localStorage.getItem('jwt');
    console.log(token)
  
    if (!token) {
      navigate('/login'); // Redirect user to login page if no token found
    }
  
    try {
      const url = `${process.env.REACT_APP_SERVER_URL}/api-v1/flashcards/${id}`;
      console.log(`Deleting flashcard at URL: ${url}`);
      const response = await axios.delete(url, {
        headers: {
          'Authorization': token
        }
      });
      console.log(`DELETE response status: ${response.status}`);
      console.log(`DELETE response data: ${JSON.stringify(response.data)}`);
    } catch (err) {
      console.log(`Error deleting flashcard: ${err.message}`);
    }
  };
  


  
  const flashCard = cards.map(card => (
    <div className="flashcard-container" key={card._id}>
      <p className="flashcard-container-p flashcard-container-front">Front: {card.front}</p>
      <p className="flashcard-container-back flashcard-container-show-back-back">Back: {card.back}</p>
      <button className="delete-button" onClick={() => deleteFlashcard(card._id)}>Delete</button>
    </div>
  ));
  
  
  

  return (
    <>
      {flashCard}
    </>
  );
}
