export default function CardForm() {
    return (
        <div>
            <form>
                <h1>Create New Deck:</h1>
                <input 
                type="text"
                placeholder='enter deck name'
                id='deckname'
                />
            <button type="submit">Create</button>
            </form>
        </div>

    )
}