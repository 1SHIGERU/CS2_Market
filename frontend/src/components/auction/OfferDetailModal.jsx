import React, { useContext, useEffect, useState } from 'react'
import axios from 'axios'
import Success from '../success/Succes';
import AuthContext from '../../lib/AuthContext';
import { useNavigate, Link, useLocation } from 'react-router-dom';
import Spinner from '../../components/loadingScene/Spinner';

const OfferDetailModal = ({closerHandler, category, rarityColor, 
    imageLink, inspectLink, name, isOwner,
    steam_price, price , id, stickerString, inventory, owner, offerAciveId, condition,tradeable}) => 
    {
        const { user } = useContext(AuthContext)

        const location = useLocation()
        const isMarketPage = location.pathname === '/market';
        const isOwn = owner.steam_id === user.steam_id;
        const shouldHideButton = isOwn && (isMarketPage || offerAciveId === user.steam_id);

        let navigate = useNavigate()
        const [itemDetails, setItemDetails] = useState([])
        const [ownerData, setOwnerData] = useState([])
        const [stickerInfo, setStickerInfo] = useState([])
        const [stickerLabels, setStickerLabels] = useState([])
        const [inputValue, setinputValue] = useState("")

        const [sellerData, setSellerData] = useState([]);
        const [buySuccess, setbuySuccess] = useState(false);

        const [isLoading, setIsLoading] = useState(false)
    
    useEffect(() => {
        const fetchItemDetails = async () =>  {
            setIsLoading(true);
            try {
                axios.post(`http://localhost:8000/inv/item/`, { "inspect_link": inspectLink})
                .then((response) => setItemDetails(response.data.item_details))
                .catch((err) => console.log(err))
            
        } catch (err) {
            console.log(err);
        }
        
    }
    
    fetchItemDetails()

    if (stickerString) {
        const srcRegex = /<img[^>]+src="([^">]+)"/g;

        // Array to hold extracted src values
        let srcValues = [];

    // Find and store all src values
        let match;
        while ((match = srcRegex.exec(stickerString)) !== null) {
            srcValues.push(match[1]);
        }
        let stickerNames = [];
        const stickerTextMatch = stickerString.match(/Sticker: ([\s\S]*?)(?=<\/center>)/);
        if (stickerTextMatch && stickerTextMatch[1]) {
            stickerNames = stickerTextMatch[1].trim().split(',').map(name => name.trim());
        }
    
        setStickerInfo(srcValues);
        setStickerLabels(stickerNames);

    }
    setIsLoading(false);
 }, [])

 const handleInputChange = (e) => {
    const value = parseFloat(e.target.value, 10); // Przekształcenie wartości wejściowej na liczbę

    if (value > 0)  // Sprawdzenie, czy wartość jest większa od 0
        setinputValue(value); // Aktualizacja stanu, jeśli wartość jest poprawna
}

 const createOffer = async () => {
    console.log(user.steam_id)
    await axios.post("http://localhost:8000/offers/", {
        "item": {
            "item_name": name,
            "img_link": imageLink,
            "condition": condition,
            "stickerstring": stickerString,
            "inspect": inspectLink,
            "rarity": rarityColor,
            "category": category,
            "listed": true,
            "tradeable": true
        },
        "price": parseFloat(inputValue),
        "quantity": 1,
        "steam_id": user.steam_id.toString()
    }, {
        headers: {
            Authorization: `Bearer ${localStorage.getItem("access")}`
        }
    }).then((res) =>{ 
        console.log("responsik:", res)
        navigate("/market")
    }).catch((err) => console.log("error:", err))


    console.log({    
        item_id: id,
        item_name: name,
        img_link: imageLink,
        condition: condition,
        stickerstring: stickerString,
        inspect: inspectLink,
        rarity: rarityColor,
        category: category,
        listed: true,
        tradeable: tradeable,
        item: {
            owner: 5,
            item: 5, 
            quantity: 1,
            price: inputValue
        }
    })
  }
  

  const buyItem = () => {
    axios.post("http://localhost:8000/transactions/", {
        buyer: user.steam_id.toString(),
        offer: offerAciveId,
    },{ headers: {
            Authorization: `Bearer ${localStorage.getItem("access")}`
        }
    }).then(res => {
        setbuySuccess(true);
        setTimeout(function() {
            closerHandler(prev => !prev);
          }, 5000);
    }).catch(err => console.log(err))
  }

  return (

    <>
    
        <div className='flex w-full h-full fixed inset-0 backdrop-blur-sm z-[120] bg-black bg-opacity-50 justify-center items-center'>
            <div className='flex flex-col bg-[#242633] text-white p-12 pt-4 rounded-md justify-center overflow-auto shadow-xl'>
            { buySuccess ? <Success/> : <> 
                <div className='flex justify-end sticky'>
                    <button className='mb-4' onClick={closerHandler}>
                        X
                    </button>
                </div>
                
                <div className='max-h-[70vh]'>    
                    <div className="flex flex-col mt-auto">                     
                        <div className="p-2 
                            bg-[url('https://t4.ftcdn.net/jpg/03/01/90/79/360_F_301907970_ZVaPcSGe9rgYgRMRGUcbf91YxNwB7d2W.jpg')]
                            border-b-4 border-b-[#5e98d9]">
                            <img 
                                src={`${imageLink}`}
                                width={300}
                                height={200}
                                className="px-4"    
                            />
                            <button className="p-1 text-sm border-b-2 border-transparent transition duration-100 ease-in hover:border-gray-400">
                                <i class="fa-solid fa-magnifying-glass text-gray-400"></i>
                                <a href={`${inspectLink}`}>
                                    &nbsp; Inspect in game
                                </a>
                            </button>
                        </div>
                        <div id="sticker_info" name="sticker_info" title="Sticker" className={`flex bg-gray-800 rounded-b-xl py-2 justify-between ${stickerString ? '' : 'hidden'}`}>
                            {stickerInfo.map((item, i) => (
                               <div className='flex flex-col max-w-[64px] items-center'><img width={64} height={48} src={item} key={i} /><label className='text-[0.7em] text-clip text-center'>{stickerLabels[i]}</label></div>
                            ))}
                            
                        </div>
                    </div>
                    <div className="mt-4">
                        <h1 className="text-xl mb-4">{name}</h1>
                        <div className="flex">
                        <ul className="text-sm text-zinc-400">
                            <li className="p-1">Float</li>
                            <li className="p-1">Pattern ID</li>
                            <li className="p-1">Finish Catalog</li>
                        </ul>
                        <ul className="text-sm ml-10 ">
                            <p className="p-1">{itemDetails.float}</p>
                            <p className="p-1">{itemDetails.paintseed}</p>
                            <p className="p-1">{itemDetails.paintindex}</p>
                        </ul>
                        </div>
                        <div className="mt-6">
                            <h1 className="mb-4">Price details</h1>
                            <div className="flex">
                                <ul className="text-sm text-zinc-400">
                                    <li className="p-1">Steam price:</li>
                                    <li className="p-1">{id ? "Item price:" : "Suggested price:"}</li>
                                </ul>
                                <ul className="text-sm ml-10">
                                    <li className="p-1">{steam_price} &nbsp;$</li>
                                    <li className="p-1">{price ? price : (steam_price * 0.8).toFixed(2)} &nbsp;$</li>
                                </ul>
                            </div>
                        </div>
                        { isOwner ? 
                            <>

                            </>
                        :
                        <div className="mt-10 flex-col mt-4">
                            <h1 className="text-xl mb-4">Seller:</h1>
                            <div className="flex items-center  bg-gray-800 rounded-xl">
                            {owner.steam_id === user.steam_id ?
                             <>
                                <Link to = {'/UserDashboard/Settings'}>
                                <img 
                                    src={owner.avatar_url}
                                    className="rounded-full"
                                />
                                </Link>
                             </>                            
                            : 
                            <>
                            <Link to={`/UserProfile/${owner.steam_id}`}>
                                <img 
                                    src={owner.avatar_url}
                                    className="rounded-full"
                                />
                            </Link>
                            </>
                            }
            
                                <div className="flex-col ml-4">
                                    <p className="mx-auto font-bold">{owner.username}</p>
                                </div>
                            </div>
                        </div>
                        }
                        <div className="flex flex-col text-sm  mt-8 font-thin">
                        {isOwner ?  <input
                                        type="number"
                                        placeholder="Price"
                                        class="bg-[#242633] border-0 border-b-2 border-white text-white focus:outline-none focus:border-green-300 block mb-4 focus:ring-0"
                                        onChange={handleInputChange}
                                      /> : <></>}
                                <button
                                    className={`bg-emerald-700 rounded-l p-2 px-16 mb-8 transition hover:bg-emerald-600 ${
                                        shouldHideButton ? 'hidden' : ''
                                    }`}
                                    onClick={inventory ? createOffer : buyItem}
                                    disabled={shouldHideButton}
                                    >
                                    {isOwner ? (
                                        <>
                                        <i className="fa-solid fa-tag"></i> &nbsp; List
                                        </>
                                    ) : (
                                        <>
                                        <i className="fa-solid fa-cart-shopping"></i> &nbsp; Buy now
                                        </>
                                    )}
                                </button>
                        </div>
                    
                    </div>
                </div>
                    
                </> }
            </div>
        </div>
    </>
  )
}

export default OfferDetailModal
