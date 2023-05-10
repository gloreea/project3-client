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
    // console.log(token)

    if (!token) {
      navigate('/login'); // Redirect user to login page if no token found
    }

    axios.get(`${process.env.REACT_APP_SERVER_URL}/api-v1/decks/`, {
      headers: {
        'Authorization': token
      }
    })
      .then(response => {
        console.log(response.data);
        setDecks(response.data)
      })
      .catch(console.warn)

  }, [])

  const addNewDeck = newDeck => {
    setDecks([...decks, newDeck])
  }

  const deleteDeck = async (id) => {
    const token = localStorage.getItem('jwt')

    if (!token) {
      navigate('/login') // redirect to login if no token
    }

    try {
      const url = `${process.env.REACT_APP_SERVER_URL}/api-v1/decks/${id}`
      console.log(`Deleting deck ${id}`)
      const response = await axios.delete(url, {
        headers: {
          'Authorization': token
        }
      })

      // filter out the deleted deck from the array
      const updatedDecks = decks.filter(deck => deck._id !== id)

      // update the decks state
      setDecks(updatedDecks)
    } catch (err) {
      console.log('error deleting deck: ', err)
    }
  }

  const deckList = decks ? decks.map(deck => {

    return (
      <li key={`deck-li ${deck._id}`} className="deck-item">
        <Link to={`/decks/${deck._id}`} >
          <p>{deck.title}</p>
        </Link>
        
        <Link to={`/decks/${deck._id}/studymode`}>
          <button className="study-mode-button">Study Mode</button>
        </Link>

        <button className="delete-button" onClick={() => deleteDeck(deck._id)}>Delete</button>
      </li>
    );
  }) : null;

  return (
    <div>
      <div className="page-heading">
      <CardForm
        addNewDeck={addNewDeck}
      />
      </div>
      <br />
      <ul className="deck-list">
        {deckList}
      </ul>
    </div>
  )
}


