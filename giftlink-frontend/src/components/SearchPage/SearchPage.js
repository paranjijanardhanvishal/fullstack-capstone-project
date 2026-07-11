import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import 'bootstrap/dist/css/bootstrap.min.css';
import './SearchPage.css';
import { urlConfig } from '../../config';

function SearchPage() {

    // Task 1
    const [searchQuery, setSearchQuery] = useState('');
    const [selectedCategory, setSelectedCategory] = useState('');
    const [selectedCondition, setSelectedCondition] = useState('');
    const [ageRange, setAgeRange] = useState(10);
    const [searchResults, setSearchResults] = useState([]);

    const categories = ['Living', 'Bedroom', 'Bathroom', 'Kitchen', 'Office'];
    const conditions = ['New', 'Like New', 'Older'];

    const navigate = useNavigate();

    useEffect(() => {
        const fetchProducts = async () => {
            try {
                const url = `${urlConfig.backendUrl}/api/gifts`;
                const response = await fetch(url);

                if (!response.ok) {
                    throw new Error(`HTTP error: ${response.status}`);
                }

                const data = await response.json();
                setSearchResults(data);

            } catch (error) {
                console.log('Fetch error: ' + error.message);
            }
        };

        fetchProducts();
    }, []);

    // Task 2
    const handleSearch = async () => {
        try {
            const url =
                `${urlConfig.backendUrl}/api/search?` +
                `name=${searchQuery}` +
                `&age_years=${ageRange}` +
                `&category=${selectedCategory}` +
                `&condition=${selectedCondition}`;

            const response = await fetch(url);

            if (!response.ok) {
                throw new Error("Search failed");
            }

            const data = await response.json();
            setSearchResults(data);

        } catch (error) {
            console.log(error);
        }
    };

    // Task 6
    const goToDetailsPage = (productId) => {
        navigate(`/app/product/${productId}`);
    };

    return (
        <div className="container mt-5">

            <div className="row justify-content-center">

                <div className="col-md-8">

                    <div className="filter-section mb-4 p-3 border rounded">

                        <h5>Filters</h5>

                        <div className="d-flex flex-column">

                            {/* Task 3 */}

                            <select
                                className="form-control mb-2"
                                value={selectedCategory}
                                onChange={(e) => setSelectedCategory(e.target.value)}
                            >
                                <option value="">All Categories</option>

                                {categories.map((category, index) => (
                                    <option key={index} value={category}>
                                        {category}
                                    </option>
                                ))}
                            </select>

                            <select
                                className="form-control mb-2"
                                value={selectedCondition}
                                onChange={(e) => setSelectedCondition(e.target.value)}
                            >
                                <option value="">All Conditions</option>

                                {conditions.map((condition, index) => (
                                    <option key={index} value={condition}>
                                        {condition}
                                    </option>
                                ))}
                            </select>

                            {/* Task 4 */}

                            <label>
                                Age Range: {ageRange}
                            </label>

                            <input
                                type="range"
                                className="form-range"
                                min="0"
                                max="20"
                                value={ageRange}
                                onChange={(e) => setAgeRange(e.target.value)}
                            />

                        </div>

                    </div>

                    {/* Task 7 */}

                    <input
                        type="text"
                        className="form-control mb-3"
                        placeholder="Search gifts..."
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                    />

                    {/* Task 8 */}

                    <button
                        className="btn btn-primary mb-4"
                        onClick={handleSearch}
                    >
                        Search
                    </button>

                    {/* Task 5 */}

                    {searchResults.length === 0 ? (

                        <div className="alert alert-warning">
                            No products found.
                        </div>

                    ) : (

                        <div className="row">

                            {searchResults.map((gift) => (

                                <div
                                    key={gift.id}
                                    className="col-md-4 mb-4"
                                >

                                    <div
                                        className="card search-card"
                                        onClick={() => goToDetailsPage(gift.id)}
                                        style={{ cursor: 'pointer' }}
                                    >

                                        {gift.image ? (

                                            <img
                                                src={gift.image}
                                                alt={gift.name}
                                                className="card-img-top"
                                            />

                                        ) : (

                                            <div className="no-image-available">
                                                No Image
                                            </div>

                                        )}

                                        <div className="card-body">

                                            <h5>{gift.name}</h5>

                                            <p>{gift.category}</p>

                                            <p>{gift.condition}</p>

                                        </div>

                                    </div>

                                </div>

                            ))}

                        </div>

                    )}

                </div>

            </div>

        </div>
    );
}

export default SearchPage;