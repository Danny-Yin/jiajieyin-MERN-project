import React, { useEffect,useCallback, useState } from "react";
//import {ItemTypes} from './ItemTypes.js';
import FavoriteDataService from "../services/favorites";
import {Container , Col, Row}from 'react-bootstrap'
import './favorites.css'
import update from 'immutability-helper'
import { DndProvider } from 'react-dnd'
import { HTML5Backend } from 'react-dnd-html5-backend'
import { FinalCard } from './FinalCard.js'
//import movies from "../services/movies";
//import {jsx as _jsx} from 'react/jsx-runtime';


const style = {
  width: 450,
  height: 100
}

const Favorites = ({user, favorites}) => {
    {
    console.log("user", user)
    const [favoriteMovies,setfavoritedMovies] = useState([]);

    const CommentMovies = useCallback(() => {
        console.log("CommentMovies")
        if (!user) {
            return;
        }

        FavoriteDataService.getAll(user.googleId)
            .then(response =>{
                console.log("response", response.data)
                setfavoritedMovies(response.data.map((movie,index) =>{
                    return {
                        id: index,
                        text: movie
                    }
                }))
            })
            .catch(e => {
                console.log(e);
            })
    },[user])

    useEffect(()=>{
        CommentMovies();
    },[CommentMovies]);

    const moveCard = useCallback((user, dragIndex, hoverIndex) => {
        setfavoritedMovies((prevCards) => {
          let newFavMovies = update(prevCards, {
            $splice: [
              [dragIndex, 1],
              [hoverIndex, 0, prevCards[dragIndex]],
            ],
          })
          
          console.log("newFavMovies", newFavMovies);
          let favIds = newFavMovies.map(movie => movie.text._id)
          
          if (user) {
            var data = {
              _id: user.googleId,
              favorites: favIds
            }
            FavoriteDataService.updateFavoritesList(data)
              .catch(e => {
                console.log(e);
              })
          }
          
          return newFavMovies;
      })
      }, [user])
    
    const renderCards = useCallback((card,index)=>{
        return (
            <FinalCard
                key={card.id}
                index = {index}
                id = {card.id}
                text = {card.text}
                moveCard={(dragIndex,hoverIndex) => moveCard(user,dragIndex,hoverIndex)}
                />
        )
    },[moveCard,user])

    return(
        <>
            <Container className="favoritesContainer">
                <DndProvider backend={HTML5Backend}>
                    <Row>
                        <Col className="favoritesPanel">
                            Drag your favorites to rank them
                        </Col>
                        <Col>
                            <div style={style}>{favoriteMovies.map((card, i) => renderCards(card, i))}</div>
                        </Col>
                    </Row>
                </DndProvider>
            </Container>
        </>
  
    )
    }
}

export default Favorites;
