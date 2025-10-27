// THIS FILE IS A BASIS FOR FUTURE IMPROVEMENTS AND FEATURES - SO PEOPLE CAN BUY PRODUCTS FROM THE APP TOO

import { useState, useEffect } from 'react'; // hooks for state management and side effects
import { database } from '../firebaseConfig'; // Import Firebase database instance from our config
import { ref, onValue } from 'firebase/database'; // Import Firebase functions to reference data and listen for changes

// Products component - displays all skincare products from Firebase
export default function Products() {
  const [products, setProducts] = useState([]);   // store the list of products fetched from database
  const [loading, setLoading] = useState(true);   // loading state to show spinner while fetching data
  const [error, setError] = useState('');         // Error state to display any database errors
  const [filter, setFilter] = useState('all');    // Filter state to track which category is selected (default is 'all')

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
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-8 text-center">Our Products</h2>
        
        {/* Conditionally show error message if Firebase fails */}
        {error && (
          <div className="bg-red-50 border-l-4 border-red-500 p-4 mb-6 rounded">
            <p className="text-red-700">{error}</p>
          </div>
        )}

        {/* Check if products array is empty */}
        {products.length === 0 ? (
          // Show this message when no products exist in database
          <div className="bg-white rounded-lg shadow-md p-8 text-center">
            <p className="text-gray-600 mb-4">No products found in the database.</p>
            <p className="text-sm text-gray-500">
              Go to <a href="/admin" className="text-blue-600 underline">Admin Panel</a> to add products.
            </p>
          </div>
        ) : (
          // If products exist, show the filtering and grid display
          <>
            {/* Category filter buttons */}
            <div className="flex flex-wrap gap-2 mb-6 justify-center">
              {/* Loop through categories and create a button for each */}
              {categories.map((category) => (
                <button
                  key={category}
                  // When clicked, update filter state to show only that category
                  onClick={() => setFilter(category)}
                  // Apply different styles based on whether this category is currently selected
                  className={`px-4 py-2 rounded-full font-medium transition-all ${
                    filter === category
                      ? 'bg-blue-600 text-white' // Selected state
                      : 'bg-white text-gray-700 hover:bg-gray-100' // Unselected state
                  }`}
                >
                  {/* Capitalize first letter of category name */}
                  {category.charAt(0).toUpperCase() + category.slice(1)}
                </button>
              ))}
            </div>

            {/* Products display grid - responsive columns */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {/* Loop through filtered products and create a card for each */}
              {filteredProducts.map((product) => (
                <div
                  key={product.id}
                  className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-xl transition-shadow"
                >
                  {/* Product image - uses placeholder if no image provided */}
                  <img
                    src={product.image || 'https://via.placeholder.com/300'}
                    alt={product.name}
                    className="w-full h-48 object-cover"
                  />
                  {/* Product details section */}
                  <div className="p-6">
                    {/* Product name and price on same row */}
                    <div className="flex items-start justify-between mb-2">
                      <h3 className="text-xl font-bold text-gray-900">{product.name}</h3>
                      <span className="text-lg font-bold text-blue-600">${product.price}</span>
                    </div>
                    <p className="text-sm text-gray-500 mb-2">{product.brand}</p>
                    <p className="text-gray-600 text-sm mb-4">{product.description}</p>
                    {/* Tags for category and skin types */}
                    <div className="flex flex-wrap gap-2 mb-3">
                      {/* Category badge */}
                      <span className="px-3 py-1 bg-purple-100 text-purple-700 text-xs rounded-full font-medium">
                        {product.category}
                      </span>
                      {/* Skin type badges - only show if product has skinType array */}
                      {product.skinType && product.skinType.map((type) => (
                        <span
                          key={type}
                          className="px-3 py-1 bg-green-100 text-green-700 text-xs rounded-full"
                        >
                          {type}
                        </span>
                      ))}
                    </div>
                    {/* Add to cart button (currently just UI, no functionality) */}
                    <button className="w-full bg-blue-600 text-white py-2 rounded-lg hover:bg-blue-700 transition-colors font-medium">
                      Add to Cart
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