import { getDatabase, ref, set } from 'firebase/database';

export async function seedCompatibilityRules() {
  const db = getDatabase();
  const rulesRef = ref(db, 'compatibilityRules');

  const rules = {
    "rule1": {
      "ingredient1": "retinol",
      "ingredient2": "vitamin_c",
      "compatibility": "incompatible",
      "reason": "pH conflict and potential irritation",
      "severity": "high",
      "recommendation": "Use vitamin C in the morning and retinol at night"
    },
    "rule2": {
      "ingredient1": "retinol",
      "ingredient2": "hyaluronic_acid",
      "compatibility": "compatible",
      "reason": "HA helps buffer retinol irritation",
      "severity": "none",
      "recommendation": "Apply retinol first, then hyaluronic acid"
    },
    "rule3": {
      "ingredient1": "niacinamide",
      "ingredient2": "vitamin_c",
      "compatibility": "caution",
      "reason": "May cause flushing in some users at high concentrations",
      "severity": "low",
      "recommendation": "Use at different times or ensure products have compatible pH"
    },
    "rule4": {
      "ingredient1": "retinol",
      "ingredient2": "aha",
      "compatibility": "incompatible",
      "reason": "Excessive exfoliation and irritation risk",
      "severity": "high",
      "recommendation": "Alternate nights or use AHA in morning"
    },
    "rule5": {
      "ingredient1": "retinol",
      "ingredient2": "bha",
      "compatibility": "caution",
      "reason": "Can be drying and irritating when used together",
      "severity": "medium",
      "recommendation": "Use on alternate nights or consult a dermatologist"
    },
    "rule6": {
      "ingredient1": "niacinamide",
      "ingredient2": "retinol",
      "compatibility": "compatible",
      "reason": "Can help reduce retinol irritation",
      "severity": "none",
      "recommendation": "Can be used together for enhanced benefits"
    },
    "rule7": {
      "ingredient1": "benzoyl_peroxide",
      "ingredient2": "vitamin_c",
      "compatibility": "incompatible",
      "reason": "Can oxidize and degrade each other",
      "severity": "medium",
      "recommendation": "Use vitamin C in morning and benzoyl peroxide at night"
    }
  };

  try {
    await set(rulesRef, rules);
    console.log('Successfully seeded compatibility rules');
    return true;
  } catch (error) {
    console.error('Error seeding compatibility rules:', error);
    return false;
  }
}