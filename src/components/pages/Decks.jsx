
import CardForm from "../partials/CardForm";
import {useState, useEffect} from "react"
import { useNavigate, useParams } from "react-router-dom"
import axios from 'axios';

export default function Decks(){
    const [deck, setDeck] = useState({})

    const {id} = useParams()
    const navigate = useNavigate()


    

    useEffect(() => {
        const token = localStorage.getItem('jwt');
        console.log(token)

        if (!token) {
            navigate('/login'); // Redirect user to login page if no token found
          }


        axios.get(`${process.env.REACT_APP_SERVER_URL}/api-v1/decks/1`, {
            headers: {
                'Authorization': token
            }
        })
        .then(response => {
            console.log(response)
            setDeck(response.data.result)
        })
        .catch(console.warn)
    },[])


    return(
        <>
        This is the page to show the user their collection of Decks
        <CardForm/>
        </>
    )
}