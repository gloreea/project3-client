import { useState, useEffect } from "react"
import { useNavigate, useParams } from "react-router-dom"
import axios from 'axios';

export default function StudyMode({ currentUser, updateScore }) {
  const [cards, setCards] = useState([]);
  const [showBack, setShowBack] = useState(false);
  const { id } = useParams()
  const [currentCardIndex, setCurrentCardIndex] = useState(0)
  const navigate = useNavigate()
  const [numCorrect, setNumCorrect] = useState(0)
  const [flashcardCorrect, setFlashcardCorrect] = useState(false)
  const [shownCardIndices, setShownCardIndices] = useState([0]);
  const [incorrectCards, setIncorrectCards] = useState([]);

  console.log("current user in Studymode: ", currentUser)

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

    // update the user's score when marked correct
    if (currentUser) {
      updateScore(currentUser._id, numCorrect + 1) // add 1 to current score
    }
  }
  const handleMarkIncorrect = () => {
    const newCards = [...cards];
    const removedCard = newCards.splice(currentCardIndex, 1)[0];
    newCards.push(removedCard);
    setCards(newCards);
    setIncorrectCards((prevIncorrectCards) => [...prevIncorrectCards, currentCard]);
    handleNextCard();
  };



  return (
    <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
      <div>
        <h1>Study Mode</h1>
        <h2>Deck Size: {countCards(cards)}</h2>

        <div className={`flashcard-container ${flashcardCorrect ? "flashcard-correct" : ""}`} onClick={toggleBack}>
          <h2>Current Card {currentCardIndex + 1}</h2>
          <p className="flashcard-container-p flashcard-container-front">Question: {currentCard.front}</p>
          {currentCard.image && (
        <img
          className="flashcard-container-image"
          src={`https://res.cloudinary.com/dlzj22j8a/image/upload/w_100,h_100,c_fill/v1683568204/${currentCard.image}.jpg`}
          alt={`Image for ${currentCard.front}`}
        />
      )}
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