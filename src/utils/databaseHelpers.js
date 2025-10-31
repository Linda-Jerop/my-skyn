import { database } from '../firebaseConfig';
import { ref, set, push, update, remove, get } from 'firebase/database';
import skincareData from '../assets/skincare-database.json';

// ============================================
// DATABASE HELPER FUNCTIONS
// ============================================

/**
 * Add a new product to the database
 * @param {Object} productData - Product object with name, category, skinType, etc.
 */
export const addProduct = async (productData) => {
  try {
    // Normalize category to lowercase
    const normalizedData = {
      ...productData,
      category: productData.category?.toLowerCase()
    };
    
    console.log('Adding product with data:', normalizedData);
    
    const productsRef = ref(database, 'products');
    const newProductRef = push(productsRef);
    await set(newProductRef, {
      ...normalizedData,
      id: newProductRef.key,
      createdAt: new Date().toISOString()
    });
    console.log('Product added successfully!');
    return newProductRef.key;
  } catch (error) {
    console.error('Error adding product:', error);
    throw error;
  }
};

/**
 * Update an existing product
 * @param {string} productId - The ID of the product to update
 * @param {Object} updates - Object containing fields to update
 */
export const updateProduct = async (productId, updates) => {
  try {
    const productRef = ref(database, `products/${productId}`);
    await update(productRef, {
      ...updates,
      updatedAt: new Date().toISOString()
    });
    console.log('Product updated successfully!');
  } catch (error) {
    console.error('Error updating product:', error);
    throw error;
  }
};

/**
 * Delete a product
 * @param {string} productId - The ID of the product to delete
 */
export const deleteProduct = async (productId) => {
  try {
    const productRef = ref(database, `products/${productId}`);
    await remove(productRef);
    console.log('Product deleted successfully!');
  } catch (error) {
    console.error('Error deleting product:', error);
    throw error;
  }
};

/**
 * Get all products from the database
 */
export const getAllProducts = async () => {
  try {
    const productsRef = ref(database, 'products');
    const snapshot = await get(productsRef);
    if (snapshot.exists()) {
      return snapshot.val();
    } else {
      console.log('No products found');
      return {};
    }
  } catch (error) {
    console.error('Error getting products:', error);
    throw error;
  }
};

/**
 * Add compatibility rule
 * @param {string} product1 - First product category
 * @param {string} product2 - Second product category
 * @param {boolean} compatible - Whether they're compatible
 * @param {string} note - Optional note about the compatibility
 */
export const addCompatibilityRule = async (product1, product2, compatible, note = '') => {
  try {
    const rulesRef = ref(database, 'compatibility');
    const newRuleRef = push(rulesRef);
    await set(newRuleRef, {
      product1,
      product2,
      compatible,
      note,
      createdAt: new Date().toISOString()
    });
    console.log('Compatibility rule added successfully!');
    return newRuleRef.key;
  } catch (error) {
    console.error('Error adding compatibility rule:', error);
    throw error;
  }
};

/**
 * Seed the database with initial data
 * Use this once to populate your database with real skincare products
 */
export const seedDatabase = async () => {
  try {
    // Use the imported skincare database with real products
    await set(ref(database), skincareData);
    console.log('Database seeded successfully with 28 skincare products!');
    console.log('Products from: CeraVe, Simple, Garnier, Uncover, D\'ivine');
  } catch (error) {
    console.error('Error seeding database:', error);
    throw error;
  }
};

// Example usage in console or component:
// import { addProduct, seedDatabase } from './utils/databaseHelpers';
// 
// To add a product:
// addProduct({
//   name: 'New Moisturizer',
//   category: 'moisturizer',
//   price: 29.99
// });
//
// To seed initial data:
// seedDatabase();
