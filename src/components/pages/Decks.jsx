
import CardForm from "../partials/CardForm";
import {useState, useEffect} from "react"
import { useNavigate, useParams } from "react-router-dom"
import axios from 'axios';

export default function Decks(){
    const [deck, setDeck] = useState({})
    return(
        <>
        This is the page to show the user their collection of Decks
        <CardForm/>
        </>
    )
}