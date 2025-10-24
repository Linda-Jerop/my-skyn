import { useState, useEffect } from 'react';
import { getDatabase, ref, get } from 'firebase/database';

export default function ProductPairing() {
  const [step, setStep] = useState(1);
  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [selectedCategory, setSelectedCategory] = useState('');
  const [recommendations, setRecommendations] = useState([]);
  const [loading, setLoading] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');

  const db = getDatabase();

  // Fetch products from Firebase
  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const productsRef = ref(db, 'products');
        const snapshot = await get(productsRef);
        if (snapshot.exists()) {
          const data = snapshot.val();
          const productsList = Object.keys(data).map(key => ({
            id: key,
            ...data[key]
          }));
          setProducts(productsList);
          
          // Extract unique categories
          const uniqueCategories = [...new Set(productsList.map(p => p.category))];
          setCategories(uniqueCategories);
        }
      } catch (error) {
        console.error('Error fetching products:', error);
      }
    };
    fetchProducts();
  }, []);

  // Check compatibility and get recommendations
  const getRecommendations = async () => {
    setLoading(true);
    try {
      const rulesRef = ref(db, 'compatibilityRules');
      const rulesSnapshot = await get(rulesRef);
      
      if (!rulesSnapshot.exists() || !selectedProduct) {
        setLoading(false);
        return;
      }

      const rules = rulesSnapshot.val();
      const productIngredients = Object.keys(selectedProduct.ingredients || {});
      
      // Filter products by selected category
      const categoryProducts = products.filter(p => 
        p.category === selectedCategory && p.id !== selectedProduct.id
      );

      // Check compatibility for each product
      const compatible = categoryProducts.map(product => {
        const targetIngredients = Object.keys(product.ingredients || {});
        let compatibilityScore = 100;
        let warnings = [];
        let benefits = [];

        // Check each ingredient combination
        productIngredients.forEach(ing1 => {
          targetIngredients.forEach(ing2 => {
            const rule = Object.values(rules).find(r => 
              (r.ingredient1 === ing1 && r.ingredient2 === ing2) ||
              (r.ingredient1 === ing2 && r.ingredient2 === ing1)
            );

            if (rule) {
              if (rule.compatibility === 'incompatible') {
                compatibilityScore -= 30;
                warnings.push({
                  severity: rule.severity,
                  message: rule.reason,
                  recommendation: rule.recommendation
                });
              } else if (rule.compatibility === 'caution') {
                compatibilityScore -= 10;
                warnings.push({
                  severity: rule.severity,
                  message: rule.reason,
                  recommendation: rule.recommendation
                });
              } else if (rule.compatibility === 'compatible') {
                benefits.push(rule.reason);
              }
            }
          });
        });

        return {
          ...product,
          compatibilityScore: Math.max(0, compatibilityScore),
          warnings,
          benefits
        };
      });

      // Sort by compatibility score
      const sorted = compatible.sort((a, b) => b.compatibilityScore - a.compatibilityScore);
      setRecommendations(sorted);
    } catch (error) {
      console.error('Error getting recommendations:', error);
    }
    setLoading(false);
  };

  // Handle product selection
  const handleProductSelect = (product) => {
    setSelectedProduct(product);
    setStep(2);
  };

  // Handle category selection
  const handleCategorySelect = (category) => {
    setSelectedCategory(category);
    setStep(3);
    getRecommendations();
  };

  // Filter products based on search
  const filteredProducts = products.filter(p => 
    p.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    p.brand.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const resetFlow = () => {
    setStep(1);
    setSelectedProduct(null);
    setSelectedCategory('');
    setRecommendations([]);
    setSearchTerm('');
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-pink-50 via-purple-50 to-blue-50 py-12 px-4">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-gray-800 mb-2">
            Find Your Perfect Pair ✨
          </h1>
          <p className="text-gray-600">
            Smart ingredient matching for safer, more effective skincare
          </p>
        </div>

        {/* Progress Steps */}
        <div className="flex justify-center items-center mb-8">
          <div className="flex items-center space-x-4">
            <div className={`flex items-center justify-center w-10 h-10 rounded-full ${step >= 1 ? 'bg-purple-600 text-white' : 'bg-gray-200 text-gray-500'}`}>
              1
            </div>
            <div className={`h-1 w-20 ${step >= 2 ? 'bg-purple-600' : 'bg-gray-200'}`}></div>
            <div className={`flex items-center justify-center w-10 h-10 rounded-full ${step >= 2 ? 'bg-purple-600 text-white' : 'bg-gray-200 text-gray-500'}`}>
              2
            </div>
            <div className={`h-1 w-20 ${step >= 3 ? 'bg-purple-600' : 'bg-gray-200'}`}></div>
            <div className={`flex items-center justify-center w-10 h-10 rounded-full ${step >= 3 ? 'bg-purple-600 text-white' : 'bg-gray-200 text-gray-500'}`}>
              3
            </div>
          </div>
        </div>

        {/* Step 1: Select Your Product */}
        {step === 1 && (
          <div className="bg-white rounded-2xl shadow-lg p-8">
            <h2 className="text-2xl font-bold text-gray-800 mb-6">
              Which product do you already have?
            </h2>
            
            <input
              type="text"
              placeholder="Search by product name or brand..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full p-4 border-2 border-gray-200 rounded-lg mb-6 focus:border-purple-500 focus:outline-none"
            />

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 max-h-96 overflow-y-auto">
              {filteredProducts.map(product => (
                <div
                  key={product.id}
                  onClick={() => handleProductSelect(product)}
                  className="border-2 border-gray-200 rounded-lg p-4 hover:border-purple-500 hover:shadow-md cursor-pointer transition-all"
                >
                  <div className="flex items-start space-x-3">
                    <div className="flex-1">
                      <h3 className="font-semibold text-gray-800">{product.name}</h3>
                      <p className="text-sm text-gray-500">{product.brand}</p>
                      <span className="inline-block mt-2 px-3 py-1 bg-purple-100 text-purple-700 text-xs rounded-full">
                        {product.category}
                      </span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Step 2: Select Category */}
        {step === 2 && (
          <div className="bg-white rounded-2xl shadow-lg p-8">
            <div className="mb-6">
              <button
                onClick={() => setStep(1)}
                className="text-purple-600 hover:text-purple-700 flex items-center"
              >
                ← Back
              </button>
            </div>

            <div className="mb-6 p-4 bg-purple-50 rounded-lg">
              <p className="text-sm text-gray-600">Selected:</p>
              <h3 className="font-bold text-gray-800">{selectedProduct?.name}</h3>
              <p className="text-sm text-gray-500">{selectedProduct?.brand}</p>
            </div>

            <h2 className="text-2xl font-bold text-gray-800 mb-6">
              What type of product are you looking for?
            </h2>

            <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
              {categories.map(category => (
                <button
                  key={category}
                  onClick={() => handleCategorySelect(category)}
                  className="p-6 border-2 border-gray-200 rounded-lg hover:border-purple-500 hover:bg-purple-50 transition-all capitalize font-medium text-gray-700"
                >
                  {category}
                </button>
              ))}
            </div>
          </div>
        )}

        {/* Step 3: Recommendations */}
        {step === 3 && (
          <div className="bg-white rounded-2xl shadow-lg p-8">
            <div className="mb-6 flex justify-between items-center">
              <button
                onClick={() => setStep(2)}
                className="text-purple-600 hover:text-purple-700 flex items-center"
              >
                ← Back
              </button>
              <button
                onClick={resetFlow}
                className="text-gray-600 hover:text-gray-700"
              >
                Start Over
              </button>
            </div>

            <div className="mb-6 p-4 bg-purple-50 rounded-lg">
              <p className="text-sm text-gray-600">Pairing with:</p>
              <h3 className="font-bold text-gray-800">{selectedProduct?.name}</h3>
              <p className="text-sm text-gray-500">{selectedProduct?.brand}</p>
            </div>

            <h2 className="text-2xl font-bold text-gray-800 mb-6">
              Recommended {selectedCategory}s
            </h2>

            {loading ? (
              <div className="flex justify-center py-12">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-purple-600"></div>
              </div>
            ) : recommendations.length === 0 ? (
              <div className="text-center py-12 text-gray-500">
                No products found in this category
              </div>
            ) : (
              <div className="space-y-4">
                {recommendations.map(product => (
                  <div
                    key={product.id}
                    className="border-2 border-gray-200 rounded-lg p-6 hover:shadow-md transition-all"
                  >
                    <div className="flex items-start justify-between mb-4">
                      <div>
                        <h3 className="font-bold text-lg text-gray-800">{product.name}</h3>
                        <p className="text-gray-600">{product.brand}</p>
                        <p className="text-purple-600 font-semibold mt-1">${product.price}</p>
                      </div>
                      <div className="text-right">
                        <div className={`inline-flex items-center px-3 py-1 rounded-full font-semibold ${
                          product.compatibilityScore >= 80 
                            ? 'bg-green-100 text-green-700' 
                            : product.compatibilityScore >= 60 
                            ? 'bg-yellow-100 text-yellow-700'
                            : 'bg-red-100 text-red-700'
                        }`}>
                          {product.compatibilityScore}% Match
                        </div>
                      </div>
                    </div>

                    {product.benefits.length > 0 && (
                      <div className="mb-3">
                        <p className="text-sm font-semibold text-green-700 mb-1">✓ Benefits:</p>
                        {product.benefits.map((benefit, idx) => (
                          <p key={idx} className="text-sm text-gray-600 ml-4">• {benefit}</p>
                        ))}
                      </div>
                    )}

                    {product.warnings.length > 0 && (
                      <div className="mb-3">
                        <p className="text-sm font-semibold text-orange-700 mb-1">⚠ Warnings:</p>
                        {product.warnings.map((warning, idx) => (
                          <div key={idx} className="ml-4 mb-2">
                            <p className="text-sm text-gray-700">{warning.message}</p>
                            <p className="text-xs text-gray-500 italic">{warning.recommendation}</p>
                          </div>
                        ))}
                      </div>
                    )}

                    <p className="text-sm text-gray-600 mb-3">{product.description}</p>

                    <button className="w-full bg-purple-600 text-white py-3 rounded-lg hover:bg-purple-700 transition-colors font-semibold">
                      Add to Routine
                    </button>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}