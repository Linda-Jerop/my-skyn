import React, { useState } from 'react';
import { useRoutine } from '../contexts/RoutineContext';
import { useCart } from '../contexts/CartContext';

const Routine = () => {
  const { routines, addToRoutine, removeFromRoutine, clearRoutine } = useRoutine();
  const { addToCart } = useCart();
  const [activeTab, setActiveTab] = useState('morning');

  const sampleProducts = [
    {
      id: 'cleanser-1',
      name: 'Gentle Daily Cleanser',
      brand: 'SkinCare Pro',
      price: 24.99,
      type: 'cleanser',
      description: 'A gentle, sulfate-free cleanser perfect for daily use'
    },
    {
      id: 'toner-1',
      name: 'Hydrating Toner',
      brand: 'Pure Beauty',
      price: 18.99,
      type: 'toner',
      description: 'Alcohol-free toner that balances and hydrates skin'
    },
    {
      id: 'serum-1',
      name: 'Vitamin C Serum',
      brand: 'Glow Labs',
      price: 34.99,
      type: 'serum',
      description: 'Brightening serum with 20% Vitamin C'
    },
    {
      id: 'moisturizer-1',
      name: 'Daily Moisturizer SPF 30',
      brand: 'SunShield',
      price: 28.99,
      type: 'moisturizer',
      description: 'Lightweight moisturizer with broad-spectrum SPF protection'
    },
    {
      id: 'moisturizer-2',
      name: 'Night Repair Cream',
      brand: 'Renewal',
      price: 42.99,
      type: 'moisturizer',
      description: 'Rich night cream with retinol and peptides'
    },
    {
      id: 'oil-1',
      name: 'Facial Oil Blend',
      brand: 'Natural Glow',
      price: 36.99,
      type: 'oil',
      description: 'Nourishing blend of jojoba and rosehip oils'
    }
  ];

  const getRoutineSteps = (routineType) => {
    const routine = routines[routineType];
    return routine.map((product, index) => ({
      ...product,
      step: index + 1
    }));
  };

  const getRecommendedOrder = (routineType) => {
    const orderMap = {
      morning: ['cleanser', 'toner', 'serum', 'moisturizer', 'sunscreen'],
      night: ['cleanser', 'toner', 'serum', 'oil', 'moisturizer']
    };
    return orderMap[routineType] || [];
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 via-blue-50 to-indigo-100 py-12 px-4">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="text-center mb-12">
          <h1 className="text-4xl md:text-5xl font-bold bg-gradient-to-r from-purple-600 via-blue-600 to-indigo-600 bg-clip-text text-transparent mb-4">
            My Skincare Routines
          </h1>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto leading-relaxed">
            Build and customize your perfect morning and evening skincare routines
          </p>
        </div>

        {/* Tab Navigation */}
        <div className="flex justify-center mb-8">
          <div className="bg-white/80 backdrop-blur-sm rounded-2xl p-2 shadow-lg border border-white/20">
            <button
              onClick={() => setActiveTab('morning')}
              className={`px-8 py-3 rounded-xl font-semibold transition-all duration-300 ${
                activeTab === 'morning'
                  ? 'bg-gradient-to-r from-yellow-400 to-orange-500 text-white shadow-md'
                  : 'text-gray-600 hover:text-gray-800'
              }`}
            >
              🌅 Morning Routine
            </button>
            <button
              onClick={() => setActiveTab('night')}
              className={`px-8 py-3 rounded-xl font-semibold transition-all duration-300 ${
                activeTab === 'night'
                  ? 'bg-gradient-to-r from-indigo-500 to-purple-600 text-white shadow-md'
                  : 'text-gray-600 hover:text-gray-800'
              }`}
            >
              🌙 Night Routine
            </button>
          </div>
        </div>

        <div className="grid lg:grid-cols-2 gap-8">
          {/* Current Routine */}
          <div className="bg-white/80 backdrop-blur-sm rounded-3xl shadow-2xl p-8 border border-white/20">
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-2xl font-bold text-gray-800">
                {activeTab === 'morning' ? '🌅 Morning' : '🌙 Night'} Routine
              </h2>
              {routines[activeTab].length > 0 && (
                <button
                  onClick={() => clearRoutine(activeTab)}
                  className="text-red-500 hover:text-red-700 transition-colors text-sm font-medium"
                >
                  Clear All
                </button>
              )}
            </div>

            {routines[activeTab].length === 0 ? (
              <div className="text-center py-12">
                <div className="w-20 h-20 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <svg className="w-10 h-10 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6V4m0 2a2 2 0 100 4m0-4a2 2 0 110 4m-6 8a2 2 0 100-4m0 4a2 2 0 100 4m0-4v2m0-6V4m6 6v10m6-2a2 2 0 100-4m0 4a2 2 0 100 4m0-4v2m0-6V4" />
                  </svg>
                </div>
                <p className="text-gray-500 text-lg">No products in your {activeTab} routine yet</p>
                <p className="text-gray-400 text-sm mt-2">Add products from the suggestions below!</p>
              </div>
            ) : (
              <div className="space-y-4">
                {getRoutineSteps(activeTab).map((product, index) => (
                  <div key={product.id} className="flex items-center space-x-4 p-4 bg-gradient-to-r from-gray-50 to-white rounded-2xl border border-gray-100">
                    <div className={`w-8 h-8 rounded-full flex items-center justify-center font-bold text-white text-sm ${
                      activeTab === 'morning' 
                        ? 'bg-gradient-to-r from-yellow-400 to-orange-500' 
                        : 'bg-gradient-to-r from-indigo-500 to-purple-600'
                    }`}>
                      {index + 1}
                    </div>
                    <div className="flex-1">
                      <h3 className="font-bold text-gray-800">{product.name}</h3>
                      <p className="text-gray-600 text-sm">{product.brand}</p>
                      <p className="text-purple-600 font-semibold">${product.price}</p>
                    </div>
                    <div className="flex space-x-2">
                      <button
                        onClick={() => addToCart(product)}
                        className="p-2 bg-green-100 hover:bg-green-200 text-green-700 rounded-lg transition-colors"
                        title="Add to cart"
                      >
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" />
                        </svg>
                      </button>
                      <button
                        onClick={() => removeFromRoutine(product.id, activeTab)}
                        className="p-2 bg-red-100 hover:bg-red-200 text-red-700 rounded-lg transition-colors"
                        title="Remove from routine"
                      >
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                        </svg>
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Product Suggestions */}
          <div className="bg-white/80 backdrop-blur-sm rounded-3xl shadow-2xl p-8 border border-white/20">
            <h2 className="text-2xl font-bold text-gray-800 mb-6">Suggested Products</h2>
            <div className="space-y-4 max-h-96 overflow-y-auto">
              {sampleProducts.map(product => {
                const isInRoutine = routines[activeTab].some(item => item.id === product.id);
                
                return (
                  <div key={product.id} className="p-4 bg-gradient-to-r from-gray-50 to-white rounded-2xl border border-gray-100">
                    <div className="flex justify-between items-start mb-2">
                      <div className="flex-1">
                        <h3 className="font-bold text-gray-800">{product.name}</h3>
                        <p className="text-gray-600 text-sm">{product.brand}</p>
                        <p className="text-purple-600 font-semibold">${product.price}</p>
                      </div>
                      <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                        product.type === 'cleanser' ? 'bg-blue-100 text-blue-700' :
                        product.type === 'toner' ? 'bg-green-100 text-green-700' :
                        product.type === 'serum' ? 'bg-purple-100 text-purple-700' :
                        product.type === 'moisturizer' ? 'bg-orange-100 text-orange-700' :
                        product.type === 'oil' ? 'bg-yellow-100 text-yellow-700' :
                        'bg-gray-100 text-gray-700'
                      }`}>
                        {product.type}
                      </span>
                    </div>
                    <p className="text-gray-600 text-sm mb-3">{product.description}</p>
                    <div className="flex space-x-2">
                      <button
                        onClick={() => addToRoutine(product, activeTab)}
                        disabled={isInRoutine}
                        className={`flex-1 py-2 px-4 rounded-xl font-medium transition-all duration-300 ${
                          isInRoutine
                            ? 'bg-gray-200 text-gray-500 cursor-not-allowed'
                            : 'bg-gradient-to-r from-purple-600 to-blue-600 hover:from-blue-600 hover:to-purple-600 text-white transform hover:scale-[1.02]'
                        }`}
                      >
                        {isInRoutine ? 'In Routine' : 'Add to Routine'}
                      </button>
                      <button
                        onClick={() => addToCart(product)}
                        className="py-2 px-4 bg-green-600 hover:bg-green-700 text-white rounded-xl transition-colors font-medium"
                      >
                        Cart
                      </button>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>

        {/* Routine Tips */}
        <div className="mt-12 bg-white/60 backdrop-blur-sm rounded-3xl p-8 border border-white/30">
          <h3 className="text-2xl font-bold text-gray-800 mb-6 text-center">
            {activeTab === 'morning' ? '🌅 Morning' : '🌙 Night'} Routine Tips
          </h3>
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            {activeTab === 'morning' ? (
              <>
                <div className="text-center">
                  <div className="w-12 h-12 bg-gradient-to-r from-blue-500 to-cyan-500 rounded-full flex items-center justify-center mx-auto mb-3">
                    <span className="text-white font-bold">1</span>
                  </div>
                  <h4 className="font-semibold text-gray-800 mb-2">Cleanse</h4>
                  <p className="text-sm text-gray-600">Start with a gentle cleanser to remove overnight buildup</p>
                </div>
                <div className="text-center">
                  <div className="w-12 h-12 bg-gradient-to-r from-green-500 to-emerald-500 rounded-full flex items-center justify-center mx-auto mb-3">
                    <span className="text-white font-bold">2</span>
                  </div>
                  <h4 className="font-semibold text-gray-800 mb-2">Tone</h4>
                  <p className="text-sm text-gray-600">Balance your skin's pH and prep for products</p>
                </div>
                <div className="text-center">
                  <div className="w-12 h-12 bg-gradient-to-r from-purple-500 to-pink-500 rounded-full flex items-center justify-center mx-auto mb-3">
                    <span className="text-white font-bold">3</span>
                  </div>
                  <h4 className="font-semibold text-gray-800 mb-2">Treat</h4>
                  <p className="text-sm text-gray-600">Apply serums for specific skin concerns</p>
                </div>
                <div className="text-center">
                  <div className="w-12 h-12 bg-gradient-to-r from-orange-500 to-red-500 rounded-full flex items-center justify-center mx-auto mb-3">
                    <span className="text-white font-bold">4</span>
                  </div>
                  <h4 className="font-semibold text-gray-800 mb-2">Protect</h4>
                  <p className="text-sm text-gray-600">Moisturize and always use SPF during the day</p>
                </div>
              </>
            ) : (
              <>
                <div className="text-center">
                  <div className="w-12 h-12 bg-gradient-to-r from-indigo-500 to-purple-500 rounded-full flex items-center justify-center mx-auto mb-3">
                    <span className="text-white font-bold">1</span>
                  </div>
                  <h4 className="font-semibold text-gray-800 mb-2">Double Cleanse</h4>
                  <p className="text-sm text-gray-600">Remove makeup and sunscreen thoroughly</p>
                </div>
                <div className="text-center">
                  <div className="w-12 h-12 bg-gradient-to-r from-blue-500 to-indigo-500 rounded-full flex items-center justify-center mx-auto mb-3">
                    <span className="text-white font-bold">2</span>
                  </div>
                  <h4 className="font-semibold text-gray-800 mb-2">Tone & Treat</h4>
                  <p className="text-sm text-gray-600">Use stronger actives like retinol or AHA/BHA</p>
                </div>
                <div className="text-center">
                  <div className="w-12 h-12 bg-gradient-to-r from-purple-500 to-pink-500 rounded-full flex items-center justify-center mx-auto mb-3">
                    <span className="text-white font-bold">3</span>
                  </div>
                  <h4 className="font-semibold text-gray-800 mb-2">Nourish</h4>
                  <p className="text-sm text-gray-600">Apply facial oils for deep nourishment</p>
                </div>
                <div className="text-center">
                  <div className="w-12 h-12 bg-gradient-to-r from-pink-500 to-rose-500 rounded-full flex items-center justify-center mx-auto mb-3">
                    <span className="text-white font-bold">4</span>
                  </div>
                  <h4 className="font-semibold text-gray-800 mb-2">Moisturize</h4>
                  <p className="text-sm text-gray-600">Lock in moisture with a rich night cream</p>
                </div>
              </>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Routine;