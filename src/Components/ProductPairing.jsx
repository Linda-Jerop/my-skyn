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
      // Get compatibility rules
      const rulesRef = ref(db, 'compatibilityRules');
      const rulesSnapshot = await get(rulesRef);
      
      if (!selectedProduct) {
        console.error('No product selected');
        setLoading(false);
        return;
      }

      // Debug log to check product structure
      console.log('Selected Product:', selectedProduct);
      
      let rules = {};
      if (!rulesSnapshot.exists()) {
        console.warn('No compatibility rules found in database, using default rules');
        // Use default rules from initial data
        rules = {
          "retinol_vitamin_c": {
            "ingredient1": "retinol",
            "ingredient2": "vitamin_c",
            "compatibility": "incompatible",
            "reason": "pH conflict and potential irritation",
            "severity": "high",
            "recommendation": "Use vitamin C in the morning and retinol at night"
          },
          "retinol_ha": {
            "ingredient1": "retinol",
            "ingredient2": "hyaluronic_acid",
            "compatibility": "compatible",
            "reason": "HA helps buffer retinol irritation",
            "severity": "none",
            "recommendation": "Layer hyaluronic acid after retinol"
          },
          "niacinamide_vitamin_c": {
            "ingredient1": "niacinamide",
            "ingredient2": "vitamin_c",
            "compatibility": "caution",
            "reason": "May cause flushing in sensitive skin",
            "severity": "low",
            "recommendation": "Use at different times or test for sensitivity"
          }
        };
      } else {
        rules = rulesSnapshot.val();
      }

      const productIngredients = selectedProduct.ingredients 
        ? Object.keys(selectedProduct.ingredients)
        : selectedProduct.activeIngredients 
        ? selectedProduct.activeIngredients 
        : [];
      
      console.log('Product Ingredients:', productIngredients);
      
      // Filter products by selected category (case-insensitive)
      const categoryProducts = products.filter(p => {
        // Debug log
        console.log('Checking product:', p.name, 'Category:', p.category, 'Selected:', selectedCategory);
        return p.category?.toLowerCase() === selectedCategory?.toLowerCase() && p.id !== selectedProduct.id;
      });

      // Debug log
      console.log('Category Products:', categoryProducts);

      // Check compatibility for each product
      const compatible = categoryProducts.map(product => {
        const targetIngredients = product.ingredients 
          ? Object.keys(product.ingredients)
          : product.activeIngredients 
          ? product.activeIngredients 
          : [];
        
        console.log(`Checking ingredients for ${product.name}:`, targetIngredients);
        
        let compatibilityScore = 100;
        let warnings = [];
        let benefits = [];

        // Check each ingredient combination
        productIngredients.forEach(ing1 => {
          targetIngredients.forEach(ing2 => {
            const rule = Object.values(rules).find(r => 
              (r.ingredient1.toLowerCase() === ing1.toLowerCase() && r.ingredient2.toLowerCase() === ing2.toLowerCase()) ||
              (r.ingredient1.toLowerCase() === ing2.toLowerCase() && r.ingredient2.toLowerCase() === ing1.toLowerCase())
            );

            if (rule) {
              console.log(`Found rule for ${ing1} + ${ing2}:`, rule);
              
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
    console.log('Selected category:', category);
    // Normalize category name to match product data
    const normalizedCategory = category.toLowerCase();
    setSelectedCategory(normalizedCategory);
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
    <div className="min-h-screen bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-pink-100 via-purple-100 to-indigo-100 py-12 px-4">
      <div className="max-w-5xl mx-auto">
        {/* Header */}
        <div className="text-center mb-16 animate-fade-in relative">
          <div className="absolute inset-0 -z-10 bg-[radial-gradient(45%_35%_at_50%_10%,rgba(156,39,176,0.1),transparent)] pointer-events-none"></div>
          <h1 className="text-6xl font-black bg-gradient-to-r from-purple-600 via-pink-600 to-blue-600 bg-clip-text text-transparent mb-6 animate-text-gradient">
            Find Your Perfect Pair ✨
          </h1>
          <p className="text-xl text-gray-600 bg-white/70 backdrop-blur-md rounded-2xl py-3 px-8 inline-block shadow-xl border border-white/20">
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
          <div className="bg-white/80 backdrop-blur-xl rounded-3xl shadow-2xl p-8 border border-white/20">
            <h2 className="text-3xl font-bold bg-gradient-to-r from-purple-600 to-blue-600 bg-clip-text text-transparent mb-8">
              Which product do you already have?
            </h2>
            
            <div className="relative mb-8 group">
              <div className="absolute inset-0 bg-gradient-to-r from-purple-600 to-blue-600 rounded-2xl blur opacity-25 group-hover:opacity-40 transition-opacity"></div>
              <input
                type="text"
                placeholder="Search by product name or brand..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full p-5 bg-white/80 backdrop-blur-sm rounded-2xl shadow-inner border border-white/40 focus:border-purple-500 focus:outline-none focus:ring-2 focus:ring-purple-500/20 text-lg placeholder-gray-400 relative z-10"
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 max-h-[32rem] overflow-y-auto pr-4 styled-scrollbar">
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
                    className="bg-white/80 backdrop-blur-sm rounded-2xl shadow-lg p-6 hover:shadow-xl transition-all duration-300 hover:-translate-y-1 border border-gray-100"
                  >
                    <div className="flex items-start justify-between mb-4">
                      <div>
                        <h3 className="font-bold text-xl bg-gradient-to-r from-purple-600 to-blue-600 bg-clip-text text-transparent">{product.name}</h3>
                        <p className="text-gray-600 font-medium">{product.brand}</p>
                        <p className="text-purple-600 font-semibold mt-2">${product.price}</p>
                      </div>
                      <div className="text-right">
                        <div className={`inline-flex items-center px-4 py-2 rounded-full font-semibold shadow-sm ${
                          product.compatibilityScore >= 80 
                            ? 'bg-gradient-to-r from-green-500 to-emerald-500 text-white' 
                            : product.compatibilityScore >= 60 
                            ? 'bg-gradient-to-r from-yellow-500 to-orange-500 text-white'
                            : 'bg-gradient-to-r from-red-500 to-pink-500 text-white'
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

                    <p className="text-sm text-gray-600 mb-4 line-clamp-2">{product.description}</p>

                    <button className="w-full bg-gradient-to-r from-purple-600 to-blue-600 hover:from-blue-600 hover:to-purple-600 text-white py-3 rounded-xl transition-all duration-300 transform hover:scale-[1.02] font-medium shadow-md">
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