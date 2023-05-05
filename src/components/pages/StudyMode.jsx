import { Link } from "react-router-dom"
import CardForm from "../partials/CardForm";
import { useState, useEffect } from "react"
import { useNavigate, useParams } from "react-router-dom"
import axios from 'axios';

export default function StudyMode() {
    const [cards, setCards] = useState([]);
    const [showBack, setShowBack] = useState(false);
    const { id } = useParams()
    const [currentCardIndex, setCurrentCardIndex] = useState(0)
    const navigate = useNavigate()
    const [numCorrect, setNumCorrect] = useState(0)
    const [flashcardCorrect, setFlashcardCorrect] = useState(false)
    const [shownCardIndices, setShownCardIndices] = useState([0]);
    // const [stopFlash, setStopFlash] = useState(false);

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
                console.log(`this is the setCards response data`, response.data);
                setCards(response.data.flashcards);
            }
        } catch (error) {
            console.error(error);
        }
    }

    useEffect(() => {
        fetchCards();
    }, []);



    const toggleBack = (event) => {
        setShowBack(!showBack);
      };
      

    //   const flashCard = cards.map(card => (
    //     <div className="flashcard-container" key={card._id} onClick={toggleBack}>
    //       <p className="flashcard-container-p flashcard-container-front">Front: {card.front}</p>
    //       <p className="flashcard-container-back ">Back: {card.back}</p>
    //     </div>
    //   ));
    const countCards = (cards) => {
        return cards.length;
      };

      const handleNextCard = () => {
        const remainingCards = cards.filter((_, index) => !shownCardIndices.includes(index));
      
        if (remainingCards.length === 0) {
          // All cards have been shown
          setCurrentCardIndex(cards.length); // set to a value greater than the card array length
          return;
        }
      
        const randomIndex = Math.floor(Math.random() * remainingCards.length);
        const cardIndex = cards.findIndex((card) => card === remainingCards[randomIndex]);
      
        setCurrentCardIndex(cardIndex);
        setShownCardIndices([...shownCardIndices, cardIndex]);
        setShowBack(false);
      };
      
      const currentCard = cards[currentCardIndex];
      
      if (currentCardIndex >= cards.length) {
        return (
          <div>
            <h2>No more flashcards</h2>
          </div>
        );
      }
      
    const handleMarkCorrect = () => {
      setNumCorrect((prevNumCorrect) => prevNumCorrect + 1)
      setFlashcardCorrect(true)
      
      setTimeout(() => {
        setFlashcardCorrect(false)
        handleNextCard()
      }, 1000); 
    }
    const handleMarkIncorrect = () => {
      setFlashcardCorrect(false)
      handleNextCard()
    }

    return (
        <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
        <div>
            <h2>Study Mode</h2>
            <h2>Deck Size: {countCards(cards)}</h2>

            <div className={`flashcard-container ${flashcardCorrect ? "flashcard-correct" : ""}`} onClick={toggleBack}>
            <h2>Current Card {currentCardIndex + 1}</h2>
              <p className="flashcard-container-p flashcard-container-front">Question: {currentCard.front}</p>
              <p className={`flashcard-container-back-next ${showBack ? 'flashcard-container-show-back-back' : ''}`}>Answer: {currentCard.back}</p>
            </div>
            <div>
                <button onClick={handleMarkCorrect}>Correct</button>
                <button onClick={handleMarkIncorrect}>Incorrect</button>
                <button onClick={handleNextCard}>Next</button>
            </div>
            <p>Number of Correct Flashcards: {numCorrect}</p>
        </div>
    </div>
    )    
}