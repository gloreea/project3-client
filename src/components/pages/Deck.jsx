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
  const [editing, setEditing] = useState(false)
  const [editingCard, setEditingCard] = useState({})
  const [showForm, setShowForm] = useState(false);
  const [cardId, setCardId] = useState('');
  const [formImg, setFormImg] = useState('')
  const [displayImg, setDisplayImage]= useState('')
  

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
  
  const handleEditClick = (card) => {
    setEditing(true)
    setShowForm(true)
    setEditingCard(card)
    setFront(card.front)
    setBack(card.back)
    setCardId(card._id)
  }
  const handleSubmit = async (e) => {
    e.preventDefault();
    const token = localStorage.getItem('jwt');
  
    if (!token) {
      navigate('/login');
      return;
    }
  
    try {
      const formData = new FormData()
      
      formData.append('front', front);
      formData.append('back', back);
      formData.append('deckId', id)
      if (image) {
        formData.append('image', image);
        const uploadResponse = await axios.post(`${process.env.REACT_APP_SERVER_URL}/api-v1/upload`, formData);
        formData.set('image', uploadResponse.data.cloudImage);
      }
    
      if (editing) {
        const response = await axios.put(`${process.env.REACT_APP_SERVER_URL}/api-v1/flashcards/${cardId}`, {
          front,
          back,
          image,
          deckId: id,
        },
        {
          headers: {
            Authorization: token,
            'Content-Type': 'multipart/form-data' 
            // 'application/json',
          },
        }
      );
      console.log(`PUT response status: ${response.status}`)
      console.log(`PUT response data: ${JSON.stringify(response.data)}`);
    } else {
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
    }
    setFront('');
    setBack('');
    setImage('');
    fetchCards();
    setEditing(false);
    setCardId('')
  } catch (err) {
    console.log(`Error adding flashcard: ${err.message}`);
  }
};


const handleImageUpload = (event) => {
    const file = event.target.files[0];
    const reader = new FileReader();
    // const fd = new FormData()
    // fd.append('image', file)
    reader.onloadend = () => {
      setDisplayImage(reader.result);
    };
    if (file) {
    reader.readAsDataURL(file)
    setImage(file)
    }
  
    // axios.post(`${process.env.REACT_APP_SERVER_URL}/api-v1/upload`, fd)
    //   .then((response) => {
    //     console.log(response.data);
    //     setDisplayImage(response.data.cloudImage);
    //   })
    //   .catch((error) => {
    //   console.log(error)
    //   });
      
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
     
      <button className="edit-button" onClick={() => handleEditClick(card)}>Edit</button>
      <button className="delete-button" onClick={() => deleteFlashcard(card._id)}>Delete</button>
    </div>
  ));
  

  return (
    <>
    <form  className="flashcard-form" onSubmit={handleSubmit}>
    <label htmlFor="front">Front:</label>
      <input type="text" id="front" value={front} onChange={(e) => setFront(e.target.value)} required />
    <br />
    <label htmlFor="back">Back:</label>
      <input type="text" id="back" value={back} onChange={(e) => setBack(e.target.value)} required/>
   <br />
    <label htmlFor="image-upload" className="file-input">Image:</label>
      <div className="image-preview"> 
      <input id="image-upload" type="file" accept="image/*" className="form-control" onChange={handleImageUpload} />
      {displayImg !== '' && (
        <img 
          src={displayImg} 
          alt="Preview" 
          style={{ maxWidth: '100%', maxHeight: '100%' }}
          />
      )}
      </div>
    <br />
    <button className = "flashcard-form-button" type="submit">Add Flashcard</button>
    </form>
    <div className="flashcard-list">
      {flashCard}
    </div>
    </>
  );
}
