
import { Link } from "react-router-dom"
import CardForm from "../partials/CardForm";
import { useState, useEffect } from "react"
import { useNavigate, useParams } from "react-router-dom"
import axios from 'axios';

export default function Decks() {
  const [decks, setDecks] = useState([]);


  const { id } = useParams()
  const navigate = useNavigate()




  useEffect(() => {
    const token = localStorage.getItem('jwt');
    console.log(token)

    if (!token) {
      navigate('/login'); // Redirect user to login page if no token found
    }


    axios.get(`${process.env.REACT_APP_SERVER_URL}/api-v1/decks/`, {
      headers: {
        'Authorization': token
      }
    })
      .then(response => {
        console.log(response.data); // add this line
        setDecks(response.data)


      })
      .catch(console.warn)

  }, [])

  const addNewDeck = newDeck => {
    setDecks([...decks, newDeck])
  }

  const deckList = decks ? decks.map(deck => {

    return (
      <li key={`deck-li ${deck._id}`}>
        <Link to={`/decks/${deck._id}`}>
          <p>{deck.title}</p>
        </Link>
        <Link to={`/decks/${deck._id}/studymode`}>
          <button>Study Mode</button>
        </Link>
      </li>
    );
  }) : null;



  return (
    <div>

      <CardForm
        addNewDeck={addNewDeck}
      />

      {deckList}
    </div>
  )
}


