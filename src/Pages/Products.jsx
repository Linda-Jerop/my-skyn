// THIS FILE IS A BASIS FOR FUTURE IMPROVEMENTS AND FEATURES - SO PEOPLE CAN BUY PRODUCTS FROM THE APP TOO

import { useState, useEffect } from 'react'; // hooks for state management and side effects
import { database } from '../firebaseConfig'; // Import Firebase database instance from our config
import { ref, onValue } from 'firebase/database'; // Import Firebase functions to reference data and listen for changes
import { useCart } from '../contexts/CartContext'; // Import cart context for adding products to cart

// Products component - displays all skincare products from Firebase
export default function Products() {
  const [products, setProducts] = useState([]);   // store the list of products fetched from database
  const [loading, setLoading] = useState(true);   // loading state to show spinner while fetching data
  const [error, setError] = useState('');         // Error state to display any database errors
  const [filter, setFilter] = useState('all');    // Filter state to track which category is selected (default is 'all')
  const [addedToCart, setAddedToCart] = useState(null); // Track which product was just added for visual feedback
  const [gridView, setGridView] = useState('grid'); // Track view type: 'grid' or 'list'
  
  const { addToCart } = useCart(); // Get addToCart function from cart context

  // Function to handle adding product to cart with visual feedback
  const handleAddToCart = (product) => {
    addToCart(product);
    setAddedToCart(product.id);
    // Remove the feedback after 2 seconds
    setTimeout(() => {
      setAddedToCart(null);
    }, 2000);
  };

  useEffect(() => {
    const productsRef = ref(database, 'products');
    
    const unsubscribe = onValue(productsRef, (snapshot) => { //onValue listens to changes in real-time
      if (snapshot.exists()) { //checking if products exist in the database
        const data = snapshot.val(); //get data object from firebase
        const productsArray = Object.values(data); // Convert object to array (Firebase stores objects, we need arrays for mapping)
        setProducts(productsArray); // Update state with fetched products
      } else {
        setProducts([]);
      }
      setLoading(false); // Data loaded, stop showing loading spinner
    }, (error) => {
      // If Firebase connection fails, show error message
      setError('Failed to load products. Please check your database.');
      setLoading(false);
      console.error(error);
    });

    // Cleanup: unsubscribe from Firebase listener when component unmounts
    return () => unsubscribe();
  }, []); // Empty array means this runs only once on mount

  // If filter is 'all', show all products; otherwise only show matching category
  const filteredProducts = filter === 'all' 
    ? products 
    : products.filter(p => p.category === filter);

  const categories = ['all', ...new Set(products.map(p => p.category))]; 

  // Show loading spinner while fetching data from Firebase
  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          {/* Spinning circle animation */}
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading products...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 via-blue-50 to-indigo-100 py-12 px-4">
      <div className="w-full max-w-7xl mx-auto">
        <div className="text-center mb-12">
          <h1 className="text-4xl md:text-5xl font-bold bg-gradient-to-r from-purple-600 via-blue-600 to-indigo-600 bg-clip-text text-transparent mb-4">
            Our Products
          </h1>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto leading-relaxed">
            Discover premium skincare products curated for your unique skin needs
          </p>
        </div>
        
        {/* Conditionally show error message if Firebase fails */}
        {error && (
          <div className="bg-red-50/80 backdrop-blur-sm border border-red-200 rounded-2xl p-6 mb-8 shadow-lg">
            <p className="text-red-700 font-medium">{error}</p>
          </div>
        )}

        {/* Check if products array is empty */}
        {products.length === 0 ? (
          // Show this message when no products exist in database
          <div className="bg-white/80 backdrop-blur-sm rounded-3xl shadow-2xl p-12 text-center border border-white/20">
            <div className="w-20 h-20 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-6">
              <svg className="w-10 h-10 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" />
              </svg>
            </div>
            <p className="text-gray-600 text-lg mb-4">No products found in the database.</p>
            <p className="text-sm text-gray-500">
              Go to <a href="/admin" className="text-purple-600 underline hover:text-purple-700 transition-colors font-medium">Admin Panel</a> to add products.
            </p>
          </div>
        ) : (
          // If products exist, show the filtering and grid display
          <>
            {/* Controls: Category filters and view toggle */}
            <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between mb-8 gap-4">
              {/* Category filter buttons */}
              <div className="flex flex-wrap gap-3 justify-center lg:justify-start">
                {/* Loop through categories and create a button for each */}
                {categories.map((category) => (
                  <button
                    key={category}
                    // When clicked, update filter state to show only that category
                    onClick={() => setFilter(category)}
                    // Apply different styles based on whether this category is currently selected
                    className={`px-6 py-3 rounded-2xl font-semibold transition-all duration-300 transform hover:scale-105 ${
                      filter === category
                        ? 'bg-gradient-to-r from-purple-600 to-blue-600 text-white shadow-lg' // Selected state
                        : 'bg-white/80 backdrop-blur-sm text-gray-700 hover:bg-white border border-white/30 shadow-md' // Unselected state
                    }`}
                  >
                    {/* Capitalize first letter of category name */}
                    {category.charAt(0).toUpperCase() + category.slice(1)}
                  </button>
                ))}
              </div>

              {/* View toggle buttons */}
              <div className="flex items-center gap-2 justify-center lg:justify-end">
                <span className="text-sm font-medium text-gray-600 mr-2">View:</span>
                <div className="bg-white/80 backdrop-blur-sm rounded-xl p-1 shadow-md border border-white/30">
                  <button
                    onClick={() => setGridView('grid')}
                    className={`p-2 rounded-lg transition-all duration-200 ${
                      gridView === 'grid'
                        ? 'bg-gradient-to-r from-purple-600 to-blue-600 text-white shadow-md'
                        : 'text-gray-600 hover:text-gray-800'
                    }`}
                    title="Grid View"
                  >
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2V6zM14 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2V6zM4 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2v-2zM14 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2v-2z" />
                    </svg>
                  </button>
                  <button
                    onClick={() => setGridView('list')}
                    className={`p-2 rounded-lg transition-all duration-200 ${
                      gridView === 'list'
                        ? 'bg-gradient-to-r from-purple-600 to-blue-600 text-white shadow-md'
                        : 'text-gray-600 hover:text-gray-800'
                    }`}
                    title="List View"
                  >
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 10h16M4 14h16M4 18h16" />
                    </svg>
                  </button>
                </div>
              </div>
            </div>

            {/* Products display - conditional grid or list layout */}
            <div className={gridView === 'grid' 
              ? "grid grid-cols-1 sm:grid-cols-2 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 2xl:grid-cols-5 gap-6 md:gap-8"
              : "space-y-6"
            }>
              {/* Loop through filtered products and create a card for each */}
              {filteredProducts.map((product) => (
                <div
                  key={product.id}
                  className={gridView === 'grid'
                    ? "bg-white/80 backdrop-blur-sm rounded-3xl shadow-xl overflow-hidden hover:shadow-2xl transition-all duration-500 transform hover:-translate-y-3 hover:scale-[1.02] border border-white/20 group"
                    : "bg-white/80 backdrop-blur-sm rounded-3xl shadow-xl overflow-hidden hover:shadow-2xl transition-all duration-500 border border-white/20 group flex"
                  }
                >
                  {/* Product image - uses placeholder if no image provided */}
                  <div className={gridView === 'grid'
                    ? "relative overflow-hidden bg-gradient-to-br from-gray-50 to-gray-100"
                    : "relative overflow-hidden bg-gradient-to-br from-gray-50 to-gray-100 w-48 flex-shrink-0"
                  }>
                    <img
                      src={product.image || 'https://via.placeholder.com/300x300/f3f4f6/6b7280?text=No+Image'}
                      alt={product.name}
                      className={gridView === 'grid'
                        ? "w-full h-64 object-cover transition-transform duration-500 group-hover:scale-110"
                        : "w-full h-48 object-cover transition-transform duration-500 group-hover:scale-110"
                      }
                    />
                    {/* Overlay gradient on hover */}
                    <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                  </div>
                  {/* Product details section */}
                  <div className={gridView === 'grid' ? "p-6 relative" : "p-6 relative flex-1"}>
                    {/* Product name and price on same row */}
                    <div className="flex items-start justify-between mb-3">
                      <h3 className={gridView === 'grid'
                        ? "text-lg font-bold bg-gradient-to-r from-purple-600 to-blue-600 bg-clip-text text-transparent flex-1 mr-2 leading-tight"
                        : "text-xl font-bold bg-gradient-to-r from-purple-600 to-blue-600 bg-clip-text text-transparent flex-1 mr-2 leading-tight"
                      }>
                        {product.name}
                      </h3>
                      <div className="text-right">
                        <span className={gridView === 'grid'
                          ? "text-xl font-bold text-green-600"
                          : "text-2xl font-bold text-green-600"
                        }>${product.price}</span>
                      </div>
                    </div>
                    <p className="text-sm text-gray-600 font-medium mb-3">{product.brand}</p>
                    <p className={gridView === 'grid'
                      ? "text-gray-600 text-sm mb-4 line-clamp-2 leading-relaxed"
                      : "text-gray-600 text-sm mb-4 leading-relaxed"
                    }>{product.description}</p>
                    {/* Tags for category and skin types */}
                    <div className="flex flex-wrap gap-2 mb-4">
                      {/* Category badge */}
                      <span className="px-3 py-1 bg-gradient-to-r from-purple-100 to-blue-100 text-purple-700 text-xs rounded-full font-semibold border border-purple-200">
                        {product.category}
                      </span>
                      {/* Skin type badges - only show if product has skinType array */}
                      {product.skinType && product.skinType.map((type) => (
                        <span
                          key={type}
                          className="px-3 py-1 bg-gradient-to-r from-green-100 to-emerald-100 text-green-700 text-xs rounded-full font-semibold border border-green-200"
                        >
                          {type}
                        </span>
                      ))}
                    </div>
                    {/* Add to cart button with actual functionality */}
                    <button 
                      onClick={() => handleAddToCart(product)}
                      className={`w-full py-3 rounded-xl transition-all duration-300 transform hover:scale-[1.02] font-medium shadow-md ${
                        addedToCart === product.id
                          ? 'bg-green-600 text-white'
                          : 'bg-gradient-to-r from-purple-600 to-blue-600 hover:from-blue-600 hover:to-purple-600 text-white'
                      }`}
                    >
                      {addedToCart === product.id ? (
                        <div className="flex items-center justify-center space-x-2">
                          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                          </svg>
                          <span>Added to Cart!</span>
                        </div>
                      ) : (
                        'Add to Cart'
                      )}
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </>
        )}
      </div>
    </div>
  );
}