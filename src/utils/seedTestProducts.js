import { getDatabase, ref, set } from 'firebase/database';

export async function seedTestProducts() {
  const db = getDatabase();
  const productsRef = ref(db, 'products');

  const testProducts = {
    "moisturizer1": {
      "name": "Daily Moisturizing Lotion",
      "brand": "CeraVe",
      "category": "moisturizer",
      "price": 12.99,
      "description": "Lightweight, oil-free moisturizer for all skin types",
      "ingredients": {
        "hyaluronic_acid": {
          "concentration": 1,
          "category": "hydrator"
        },
        "ceramides": {
          "concentration": 3,
          "category": "moisturizer"
        }
      },
      "skinType": ["all"]
    },
    "moisturizer2": {
      "name": "Ultra Facial Cream",
      "brand": "Simple",
      "category": "moisturizer",
      "price": 28.00,
      "description": "24-hour hydration with squalane",
      "ingredients": {
        "squalane": {
          "concentration": 2,
          "category": "moisturizer"
        },
        "glycerin": {
          "concentration": 5,
          "category": "hydrator"
        }
      },
      "skinType": ["dry", "sensitive"]
    },
    "moisturizer3": {
      "name": "Moisture Surge",
      "brand": "Garnier",
      "category": "moisturizer",
      "price": 39.50,
      "description": "72-hour hydrator with aloe",
      "ingredients": {
        "aloe": {
          "concentration": 3,
          "category": "soother"
        },
        "hyaluronic_acid": {
          "concentration": 2,
          "category": "hydrator"
        }
      },
      "skinType": ["all"]
    }
  };

  try {
    await set(ref(db, 'products/test_moisturizer1'), testProducts.moisturizer1);
    await set(ref(db, 'products/test_moisturizer2'), testProducts.moisturizer2);
    await set(ref(db, 'products/test_moisturizer3'), testProducts.moisturizer3);
    console.log('Successfully added test moisturizers');
    return true;
  } catch (error) {
    console.error('Error adding test products:', error);
    return false;
  }
}