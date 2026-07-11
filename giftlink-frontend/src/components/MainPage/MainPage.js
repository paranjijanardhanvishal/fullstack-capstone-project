import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { urlConfig } from '../../config';

function MainPage() {
    const [gifts, setGifts] = useState([]);
    const navigate = useNavigate();

    useEffect(() => {
        // Task 1: Fetch all gifts
        const fetchGifts = async () => {
            try {
                let url = `${urlConfig.backendUrl}/api/gifts`
                const response = await fetch(url);
                if (!response.ok) {
                    throw new Error(`HTTP error; ${response.status}`)
                }
                const data = await response.json();
                setGifts(data);
            } catch (error) {
                console.log('Fetch error: ' + error.message);
            }
        };

        fetchGifts();
    }, []);

    // Task 2: Navigate to details page
    const goToDetailsPage = (productId) => {
        navigate(`/app/product/${productId}`);
    };

    // Task 3: Format timestamp
    const formatDate = (timestamp) => {
        const date = new Date(timestamp * 1000);
        return date.toLocaleDateString('default', { month: 'long', day: 'numeric', year: 'numeric' });
    };

    return (
        <div className="container mt-5">
            <div className="row">
                {gifts.map((gift) => (
                    <div key={gift.id} className="col-md-4 mb-4">
                        <div className="card h-100" onClick={() => goToDetailsPage(gift.id)} style={{ cursor: 'pointer' }}>
                            
                            {/* Task 4: Display gift image or placeholder */}
                            <div className="image-placeholder">
                                {gift.image ? (
                                    <img src={gift.image} alt={gift.name} className="card-img-top" />
                                ) : (
                                    <div className="no-image-available">No Image Available</div>
                                )}
                            </div>

                            <div className="card-body">
                                {/* Task 5: Display gift name */}
                                <h5 className="card-title">{gift.name}</h5>
                                
                                {/* Task 6: Display formatted date */}
                                <p className="card-text">{formatDate(gift.date_added)}</p>
                            </div>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
}

export default MainPage;