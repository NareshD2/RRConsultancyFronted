import React, { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import './DashboardPage.css';

const instructions = [
  "Post your property easily",
  "Get verified leads instantly",
  "24/7 customer support",
  "Highlight premium listings",
  "Track property interest",
  "Verified ownership documents"
];

const DashboardPage = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [wishlist, setWishlist] = useState([]);
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);
  const [allProperties, setAllProperties] = useState([]);
  const [user, setUser] = useState(null);
  const [loadingProperties, setLoadingProperties] = useState(true);
  const [sortOption, setSortOption] = useState('');

  const instructionSliderRef = useRef(null);
  const navigate = useNavigate();

  const toggleSidebar = () => {
    setIsSidebarOpen(!isSidebarOpen);
  };

  useEffect(() => {
    const fetchUser = async () => {
      try {
        const res = await fetch('http://localhost:4000/api/me', {
          method: 'GET',
          credentials: 'include',
        });

        if (res.ok) {
          const data = await res.json();
          setUser(data);
        } else {
          console.log("Not authenticated");
        }
      } catch (err) {
        console.error("Failed to fetch user:", err);
      }
    };

    fetchUser();
  }, []);
  useEffect(() => {
  const fetchWishlist = async () => {
    try {
      const res = await fetch('http://localhost:4000/api/wishlist', {
        method: 'GET',
        credentials: 'include',
      });
      if (res.ok) {
        const data = await res.json();
        const propertyIds = data.map((item) => item._id); // Extract _ids from the wishlist items
        setWishlist(propertyIds);
      } else {
        console.error('Failed to fetch wishlist');
      }
    } catch (err) {
      console.error('Error fetching wishlist:', err);
    }
  };

  if (user) {
    fetchWishlist();
  }
}, [user]);  // <-- runs only after user is set


  useEffect(() => {
    const slider = instructionSliderRef.current;
    const scrollAmount = 260;
    let autoScroll = setInterval(() => {
      if (!slider) return;
      if (slider.scrollLeft + slider.clientWidth >= slider.scrollWidth - 1) {
        slider.scrollTo({ left: 0, behavior: 'smooth' });
      } else {
        slider.scrollBy({ left: scrollAmount, behavior: 'smooth' });
      }
    }, 3000);
    return () => clearInterval(autoScroll);
  }, []);

  useEffect(() => {
    const fetchProperties = async () => {
      try {
        const response = await fetch('http://localhost:4000/api/properties',{
          method: 'GET',
          credentials: 'include',
        });
        const data = await response.json();
        setAllProperties(data);
      } catch (error) {
        console.error('Error fetching properties:', error);
      } finally {
        setLoadingProperties(false);
      }
    };

    fetchProperties();
  }, []);

  const toggleWishlist = async (_id) => {
  try {
    const res = await fetch(`http://localhost:4000/api/wishlist/${_id}`, {
      method: 'POST',
      credentials: 'include',
    });

    if (res.ok) {
      setWishlist((prev) =>
        prev.includes(_id) ? prev.filter((item) => item !== _id) : [...prev, _id]
      );
    } else {
      console.error('Failed to update wishlist');
    }
  } catch (err) {
    console.error('Error updating wishlist:', err);
  }
};

const filteredProperties = Array.isArray(allProperties) 
  ? allProperties.filter(
    (property) =>
      property.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      property.location.toLowerCase().includes(searchTerm.toLowerCase()) ||
      property.price?.toString().toLowerCase().includes(searchTerm.toLowerCase())
   )
  : [];

  // Helper to parse price string like "₹1.2 Cr" to number for sorting
  const parsePrice = (priceString) => {
    if (!priceString) return 0;
    let num = 0;
    const cleaned = priceString.replace(/[^0-9.]/g, '');
    if (priceString.toLowerCase().includes('cr')) {
      num = parseFloat(cleaned) * 10000000; // 1 Cr = 10 million
    } else if (priceString.toLowerCase().includes('lakh') || priceString.toLowerCase().includes('lac')) {
      num = parseFloat(cleaned) * 100000; // 1 Lakh = 100,000
    } else {
      num = parseFloat(cleaned);
    }
    return isNaN(num) ? 0 : num;
  };
    
  // Sort filteredProperties based on sortOption
  const sortedProperties = React.useMemo(() => {
    let sorted = [...filteredProperties];
    if (sortOption === 'Price: Low to High') {
      sorted.sort((a, b) => parsePrice(a.price) - parsePrice(b.price));
    } else if (sortOption === 'Price: High to Low') {
      sorted.sort((a, b) => parsePrice(b.price) - parsePrice(a.price));
    } else if (sortOption === 'Most Recent') {
      // Assuming property has a createdAt or date field
      sorted.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
    }
    return sorted;
  }, [filteredProperties, sortOption]);

  const handleLogout = () => {
  alert('Logging out...');
  
  // Clear client-side tokens
  localStorage.removeItem('token');
  sessionStorage.removeItem('token');

  // Call backend to clear HttpOnly cookie
  fetch('http://localhost:4000/api/logout', {
    method: 'POST',
    credentials: 'include', // ensures cookies are sent
  })
    .then((res) => {
      if (res.ok) {
        navigate('/login'); // Navigate only after successful logout
      } else {
        console.error('Logout failed on server');
        navigate('/login'); // Still redirect, fallback
      }
    })
    .catch((err) => {
      console.error('Logout request error:', err);
      navigate('/login'); // fallback on error
    });
};


  const handleShowWishlist = () => {
    navigate('/wishlist');
  };

  return (
    <div className="dashboard-container">
      {/* Top Navigation */}
      <nav className="top-navbar">
        <div className="navbar-left">
          <button className="hamburger" onClick={toggleSidebar}>☰</button>
          <input
            type="text"
            className="search-input"
            placeholder="Search properties..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
        <div className="sort-options">
          <select value={sortOption} onChange={(e) => setSortOption(e.target.value)}>
            <option value="">Sort By</option>
            <option value="Price: Low to High">Price: Low to High</option>
            <option value="Price: High to Low">Price: High to Low</option>
            <option value="Most Recent">Most Recent</option>
          </select>
        </div>
      </nav>

      <div className="main-content">
        {/* Sidebar */}
        <aside className={`sidebar ${isSidebarOpen ? 'open' : 'closed'}`}>
          {user ? (
            <>
              <h3>{user.username}</h3>
              <p>{user.email}</p>
              <button onClick={() => navigate('/your-properties')}>Your Properties</button>
              <button onClick={() => navigate('/upload-property')}>Upload a Property</button>
              <button onClick={handleShowWishlist}>Wishlist</button>
              {user.isadmin === true && (
  <button onClick={() => navigate('/review-properties')}>Review Properties</button>
)}
              <button onClick={handleLogout}>Logout</button>
            </>
          ) : (
            <p>Guest Mode Login for more Features....</p>
          )}
        </aside>

        {/* Main Dashboard Area */}
        <div className="dashboard">
          

          <section className="instructions-section">
            <h2>Why Choose Us?</h2>
            <div className="instructions-slider" ref={instructionSliderRef}>
              {instructions.map((text, index) => (
                <div className="instruction-card" key={index}>
                  {text}
                </div>
              ))}
            </div>
          </section>

          <div className="properties-grid">
            {loadingProperties ? (
              <p>Loading properties...</p>
            ) : sortedProperties.length > 0 ? (
              sortedProperties.map((property) => (
                <div
                  key={property._id}
                  className="property-card"
                  onClick={() =>
                    navigate(`/property/${property._id}`, { state: { property } })
                  }
                > 
                 {property.tag && property.tag.trim().length>0 && (
                  <div className="tag">{property.tag}</div>)}
                  <img
                    src={`http://localhost:4000${property.images[0]}`}
                    alt={property.title}
                  />
                  <div className="property-info">
                    <h2>{property.title}</h2>
                    <p>{property.location}</p>
                    <span className="price">{property.price}</span>
                    <button
                      className={`wishlist-btn ${
                        wishlist.includes(property._id) ? 'active' : ''
                      }`}
                      onClick={(e) => {
                        e.stopPropagation();
                        toggleWishlist(property._id);
                      }}
                    >
                      ❤️ {wishlist.includes(property._id) ? 'Wishlisted' : 'Add to Wishlist'}
                    </button>
                  </div>
                </div>
              ))
            ) : (
              <p className="no-results">No matching properties found.</p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default DashboardPage;
