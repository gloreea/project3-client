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

  

  const flashCard = cards.map(card => (
    <div class="flashcard-container flashcard-container:hover" key={card._id}>
      <p class="flashcard-container-p flashcard-container-front ">Front: {card.front}</p>
      <p class="flashcard-container-back ">Back: {card.back}</p>
    </div>
  ));

  return (
    <>
      {flashCard}
    </>
  );
}
