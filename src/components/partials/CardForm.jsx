import { useState } from 'react'
import axios from 'axios'

export default function CardForm() {
    const [deckTitle, setDeckTitle] = useState('')

    const handleSubmit = async (e) => {
        try {
            const token = localStorage.getItem('jwt')
            const newDeck = { title: deckTitle }

            const response = await axios.post(`${process.env.REACT_APP_SERVER_URL}/api-v1/decks/`, newDeck, {
                headers: {
                    'Authorization': token,
                }
            })
            console.log(response.data)
            setDeckTitle('')

        } catch (err) {
            console.log(err)
        }
    }

    return (
        <div>
            <form onSubmit={handleSubmit} >
                <h1>Create New Deck:</h1>
                <input
                    type="text"
                    placeholder='enter deck name'
                    id='deckname'
                    value={deckTitle}
                    onChange={(e) => setDeckTitle(e.target.value)}
                />

                <button type="submit">Create</button>
            </form>
        </div>
    )
}