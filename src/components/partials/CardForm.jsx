import { useState } from 'react'
import axios from 'axios'

export default function CardForm({ addNewDeck }) {
    const [deckTitle, setDeckTitle] = useState('')

    const handleSubmit = async (e) => {
        e.preventDefault()
        try {
            const token = localStorage.getItem('jwt')
            const newDeck = { title: deckTitle }

            const response = await axios.post(`${process.env.REACT_APP_SERVER_URL}/api-v1/decks/`, newDeck, {
                headers: {
                    'Authorization': token,
                }
            })
            console.log(response.data)
            addNewDeck(response.data)
            setDeckTitle('')

        } catch (err) {
            console.log(err)
        }
    }

    return (
        <div className = "card-form-container">
            <form onSubmit={handleSubmit} >
                <h1 className="card-form-title">Create New Deck:</h1>
                <input
                    type="text"
                    placeholder='enter deck name'
                    id='deckname'
                    value={deckTitle}
                    onChange={(e) => setDeckTitle(e.target.value)}
                    className="card-form-input"
                />

                <button className="card-form-submit" type="submit">Create</button>
            </form>
        </div>
    )
}