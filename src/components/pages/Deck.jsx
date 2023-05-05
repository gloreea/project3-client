import {Link} from "react-router-dom"
import CardForm from "../partials/CardForm";
import {useState, useEffect} from "react"
import { useNavigate, useParams } from "react-router-dom"
import axios from 'axios';

export default function Deck(){
  const [cards, setCards] = useState([]);
  const [front, setFront] = useState('');
  const [back, setBack] = useState('');
  const [image, setImage] = useState('');

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
      fetchCards();
    } catch (err) {
      console.log(`Error deleting flashcard: ${err.message}`);
    }
  };
  
  const handleSubmit = async (e) => {
    e.preventDefault();
    const token = localStorage.getItem('jwt');
  
    if (!token) {
      navigate('/login');
      return;
    }
  
    try {
      const response = await axios.post(`${process.env.REACT_APP_SERVER_URL}/api-v1/decks/${id}/flashcards`, {
        front,
        back,
        image,
        deckId: id,
      }, {
        headers: {
          'Authorization': token,
          'Content-Type': 'application/json',
        },
      });
      console.log(`POST response status: ${response.status}`);
      console.log(`POST response data: ${JSON.stringify(response.data)}`);
      setFront('');
      setBack('');
      setImage('');
      fetchCards();
    } catch (err) {
      console.log(`Error adding flashcard: ${err.message}`);
    }
  };
  
  
  const handleImageUpload = (event) => {
    const file = event.target.files[0];
    const reader = new FileReader();
  
    reader.onloadend = () => {
      setImage(reader.result);
    };
  
    if (file) {
      reader.readAsDataURL(file);
    }
  };
  
  const flashCard = cards.map((card) => (
    <div className="flashcard-container" key={card._id}>
      <p className="flashcard-container-p flashcard-container-front">Front: {card.front}</p>
      {card.image && (
        <img
          className="flashcard-container-image"
          src={card.image}
          alt={`Image for ${card.front}`}
        />
      )}
      <p className="flashcard-container-back flashcard-container-show-back-back">Back: {card.back}</p>
      <button className="edit-button">Edit</button>
      <button className="delete-button" onClick={() => deleteFlashcard(card._id)}>Delete</button>
    </div>
  ));
  
  
  
  

  return (
    <>
    <form  className="flashcard-form" onSubmit={handleSubmit}>
    <label>
      Front:
      <input type="text" value={front} onChange={(e) => setFront(e.target.value)} required />
    </label>
    <br />
    <label>
      Back:
      <input type="text" value={back} onChange={(e) => setBack(e.target.value)} required/>
    </label>
   <br />
    <label class= "file-input" htmlFor="image-upload" className="form-label">
      Image:
      <div className="image-preview"> 
        {image && <img src={image} alt="Preview" />}
      </div>
      <input className="form-control" id="image-upload" type="file" onChange={handleImageUpload} />
    </label>
    <br />
    <button className = "flashcard-form-button" type="submit">Add Flashcard</button>
    </form>
    <div className="flashcard-list">
      {flashCard}
    </div>
    </>
  );
}
