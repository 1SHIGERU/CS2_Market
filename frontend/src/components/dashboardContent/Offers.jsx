import React, { useEffect, useState } from "react";
import axios from "axios";
import Auction from "../auction/Auction";

const UserOffers = ({creatorId}) => {
 
  const [offers, setOffers] = useState([])

  useEffect(() =>{
    const fetchOffers = async () => {
        const userOffers = await axios.get(`http://localhost:8001/offers/byCreator/${creatorId}`);
        setOffers(userOffers.data.filter(item => item.isActive === true))
        
    }
    fetchOffers();
  }, [])

  return (
    <div className="flex flex-wrap">
      {offers.map((item, index) => (
        <Auction 
            id={item.item.id}
            title={item.item.name}
            isOwnOffer={true}
            image={item.item.imageLink}
            condition={item.item.condition}
            price={item.price}
            />
      ))}
    </div>
  )
}

export default UserOffers;
