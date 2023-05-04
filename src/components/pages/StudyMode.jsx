import { Link } from "react-router-dom"
import CardForm from "../partials/CardForm";
import { useState, useEffect } from "react"
import { useNavigate, useParams } from "react-router-dom"
import axios from 'axios';

export default function StudyMode() {
    const [cards, setCards] = useState([]);
    const { id } = useParams()
    const [currentCardIndex, setCurrentCardIndex] = useState(0)
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



    //   const toggleBack = (event) => {
    //     const backElement = event.currentTarget.querySelector(".flashcard-container-back");
    //     backElement.classList.toggle("flashcard-container-show-back-back");
    //   };

    //   const flashCard = cards.map(card => (
    //     <div className="flashcard-container" key={card._id} onClick={toggleBack}>
    //       <p className="flashcard-container-p flashcard-container-front">Front: {card.front}</p>
    //       <p className="flashcard-container-back ">Back: {card.back}</p>
    //     </div>
    //   ));
    const handleNextCard = () => {
        setCurrentCardIndex((prevIndex) => prevIndex + 1);
    }
    const currentCard = cards[currentCardIndex]
    if (currentCardIndex >= cards.length) {
        return (
            <div>
                <h2>No more flashcards</h2>
            </div>
        )
    }

    return (
        <div>
            <div>
                <h2>Study Mode</h2>
                <div>
                    <h2>Current Card {currentCardIndex + 1}</h2>
                    <p>Front: {currentCard.front}</p>
                    <p>Back: {currentCard.back}</p>
                </div>
                <div>
                    <button onClick={handleNextCard}>Next Card</button>
                </div>
            </div>
        </div>
    );
}