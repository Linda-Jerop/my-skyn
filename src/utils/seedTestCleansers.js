import { getDatabase, ref, set } from 'firebase/database';

export async function seedTestCleansers() {
  const db = getDatabase();
  const productsRef = ref(db, 'products');

  const testProducts = {
    "cleanser1": {
      "name": "Gentle Foaming Cleanser",
      "brand": "CeraVe",
      "category": "cleanser",
      "price": 15.99,
      "description": "Gentle foaming facial cleanser for normal to oily skin",
      "ingredients": {
        "ceramides": {
          "concentration": 3,
          "category": "moisturizer"
        },
        "niacinamide": {
          "concentration": 2,
          "category": "active"
        }
      },
      "skinType": ["all"]
    },
    "cleanser2": {
      "name": "Hydrating Cleanser",
      "brand": "Simple",
      "category": "cleanser",
      "price": 12.99,
      "description": "Non-foaming hydrating cleanser for dry skin",
      "ingredients": {
        "glycerin": {
          "concentration": 5,
          "category": "hydrator"
        },
        "panthenol": {
          "concentration": 1,
          "category": "soother"
        }
      },
      "skinType": ["dry", "sensitive"]
    },
    "cleanser3": {
      "name": "Brightening Face Wash",
      "brand": "Garnier",
      "category": "cleanser",
      "price": 9.99,
      "description": "Brightening cleanser with vitamin C",
      "ingredients": {
        "vitamin_c": {
          "concentration": 1,
          "category": "active"
        },
        "glycerin": {
          "concentration": 3,
          "category": "hydrator"
        }
      },
      "skinType": ["all"]
    }
  };

  try {
    await set(ref(db, 'products/test_cleanser1'), testProducts.cleanser1);
    await set(ref(db, 'products/test_cleanser2'), testProducts.cleanser2);
    await set(ref(db, 'products/test_cleanser3'), testProducts.cleanser3);
    console.log('Successfully added test cleansers');
    return true;
  } catch (error) {
    console.error('Error adding test cleansers:', error);
    return false;
  }
}