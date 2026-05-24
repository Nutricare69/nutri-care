# NutriCare Dashboard - Remaining Work

## ✅ Completed Work

### Frontend
1. **Dashboard Component (Frontend/src/pages/Dashboard.jsx)**
   - ✅ Sidebar navigation with menu items (Diet Plan, Analytics, Community, NGO Support, Settings)
   - ✅ User profile display on top right with name and avatar
   - ✅ Diet Plan section with create button and modal
   - ✅ Form with all fields from nutritionPlan model
   - ✅ Analytics section (placeholder for charts)
   - ✅ Settings section (theme mode and password change)
   - ✅ Responsive design matching About.jsx styling
   - ✅ Framer Motion animations
   - ✅ Expandable diet plan dropdown lists showing meal details

### Backend
1. **Models**
   - ✅ NutriPlan model (Backend/models/nutritionPlan.model.js)
   - ✅ Food model created (Backend/models/food.model.js)

2. **Controllers (Backend/controllers/nutritionPlan.controller.js)**
   - ✅ `generateNutriPlan()` - Creates diet plan via ML API
   - ✅ `getAllPlans()` - Fetches all diet plans
   - ✅ `getPlanById()` - Fetches specific diet plan
   - ✅ `getFoodsData()` - Fetches foods from MongoDB with filtering and pagination

3. **Routes (Backend/routes/nutritionPlan.route.js)**
   - ✅ POST `/api/generate/ml-response-generate` - Generate diet plan
   - ✅ GET `/api/generate/all-plans` - Get all diet plans
   - ✅ GET `/api/generate/plan/:id` - Get specific diet plan
   - ✅ GET `/api/generate/foods` - Get foods data

---

## 🚧 Remaining Work

### 1. **Install and Setup Chart.js**

#### Installation
```bash
cd Frontend
npm install chart.js react-chartjs-2
```

#### Implementation Steps
1. Create a new component `Frontend/src/components/NutritionCharts.jsx`
2. Import Chart.js and create two charts:
   - Protein chart (line or bar chart)
   - Carbs & Fats chart (pie or doughnut chart)
3. Update `Dashboard.jsx` Analytics section to use the charts component
4. Fetch nutritional data from diet plans and aggregate it for visualization

#### Example Chart Implementation
```javascript
import React from 'react';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
  ArcElement,
  Title,
  Tooltip,
  Legend,
} from 'chart.js';
import { Line, Pie, Bar } from 'react-chartjs-2';

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
  ArcElement,
  Title,
  Tooltip,
  Legend
);

export default function NutritionCharts({ dietPlan }) {
  // Aggregate nutritional data from meal plan
  // Create chart data objects
  // Render charts
}
```

---

### 2. **Backend: Add Nutritional Data Extraction**

Create a new controller function to extract and calculate nutritional data from diet plans:

**File:** `Backend/controllers/nutritionPlan.controller.js`

```javascript
// Get nutritional analytics for a specific diet plan
export const getNutritionalAnalytics = async (req, res) => {
  try {
    const { planId } = req.params;
    const plan = await NutriPlan.findById(planId);

    if (!plan) {
      return res.status(404).json({ message: "Diet plan not found" });
    }

    // Extract all food items from the meal plan
    const allFoodItems = [];
    Object.values(plan.meal_plan).forEach((dayMeals) => {
      Object.values(dayMeals).forEach((mealItems) => {
        allFoodItems.push(...mealItems);
      });
    });

    // Fetch nutritional data for all foods
    const foods = await Food.find({
      name: { $in: allFoodItems }
    });

    // Calculate totals
    const totals = foods.reduce((acc, food) => {
      acc.protein += food.protein || 0;
      acc.carbs += food.carbs || 0;
      acc.fats += food.fats || 0;
      acc.calories += food.calories || 0;
      return acc;
    }, { protein: 0, carbs: 0, fats: 0, calories: 0 });

    // Calculate daily breakdown
    const dailyBreakdown = {};
    Object.entries(plan.meal_plan).forEach(([day, meals]) => {
      const dayFoods = Object.values(meals).flat();
      const dayFoodData = foods.filter(f => dayFoods.includes(f.name));

      dailyBreakdown[day] = dayFoodData.reduce((acc, food) => {
        acc.protein += food.protein || 0;
        acc.carbs += food.carbs || 0;
        acc.fats += food.fats || 0;
        acc.calories += food.calories || 0;
        return acc;
      }, { protein: 0, carbs: 0, fats: 0, calories: 0 });
    });

    res.status(200).json({
      totals,
      dailyBreakdown,
      averageDaily: {
        protein: totals.protein / 7,
        carbs: totals.carbs / 7,
        fats: totals.fats / 7,
        calories: totals.calories / 7
      }
    });
  } catch (error) {
    console.error("Error fetching nutritional analytics:", error);
    res.status(500).json({ message: "Error fetching nutritional analytics" });
  }
};
```

**Add route in** `Backend/routes/nutritionPlan.route.js`:
```javascript
nutriPlanRouter.get('/analytics/:planId', getNutritionalAnalytics);
```

---

### 3. **Populate Foods Database**

Create a seed script to populate the foods database with sample data:

**File:** `Backend/scripts/seedFoods.js`

```javascript
import mongoose from 'mongoose';
import Food from '../models/food.model.js';
import dotenv from 'dotenv';

dotenv.config();

const sampleFoods = [
  {
    name: 'Oatmeal',
    category: 'Breakfast',
    calories: 150,
    protein: 5,
    carbs: 27,
    fats: 3,
    food_preference: ['vegetarian', 'vegan'],
    allergens: ['gluten'],
    description: 'Whole grain oats cooked in water or milk'
  },
  {
    name: 'Grilled Chicken Breast',
    category: 'Lunch',
    calories: 165,
    protein: 31,
    carbs: 0,
    fats: 3.6,
    food_preference: ['non_vegetarian'],
    allergens: [],
    description: 'Lean protein source'
  },
  // Add more foods...
];

async function seedFoods() {
  try {
    await mongoose.connect(process.env.MONGODB_URI);
    console.log('Connected to MongoDB');

    await Food.deleteMany({}); // Clear existing foods
    await Food.insertMany(sampleFoods);

    console.log('Foods seeded successfully!');
    process.exit(0);
  } catch (error) {
    console.error('Error seeding foods:', error);
    process.exit(1);
  }
}

seedFoods();
```

**Run:** `node Backend/scripts/seedFoods.js`

---

### 4. **Frontend: Integrate Foods API**

Update the Dashboard to fetch and display foods when needed:

**In Dashboard.jsx**, add a state for foods and fetch function:

```javascript
const [foods, setFoods] = useState([]);
const [foodsLoading, setFoodsLoading] = useState(false);

const fetchFoods = async (category = '', foodPreference = '') => {
  setFoodsLoading(true);
  try {
    const params = new URLSearchParams();
    if (category) params.append('category', category);
    if (foodPreference) params.append('food_preference', foodPreference);

    const response = await axios.get(
      `${serverUrl}/api/generate/foods?${params.toString()}`,
      { withCredentials: true }
    );

    setFoods(response.data.groupedFoods);
  } catch (error) {
    console.error('Error fetching foods:', error);
  } finally {
    setFoodsLoading(false);
  }
};
```

---

### 5. **Password Change Functionality**

Implement the password change feature in settings:

**Backend Controller:** Create in `Backend/controllers/user.controller.js`
```javascript
export const changePassword = async (req, res) => {
  try {
    const { currentPassword, newPassword } = req.body;
    const userId = req.user.id; // Assuming you have auth middleware

    const user = await User.findById(userId);

    // Verify current password
    const isMatch = await bcrypt.compare(currentPassword, user.password);
    if (!isMatch) {
      return res.status(400).json({ message: "Current password is incorrect" });
    }

    // Hash new password
    const hashedPassword = await bcrypt.hash(newPassword, 10);
    user.password = hashedPassword;
    await user.save();

    res.status(200).json({ message: "Password updated successfully" });
  } catch (error) {
    console.error("Error changing password:", error);
    res.status(500).json({ message: "Error changing password" });
  }
};
```

**Frontend:** Update the password form in Dashboard Settings section with actual API call.

---

### 6. **Theme Mode Implementation**

Implement actual theme switching functionality:

1. Use React Context or localStorage to persist theme preference
2. Add CSS classes for dark mode in your Tailwind config
3. Toggle classes on the root element based on theme state

**Example:**
```javascript
useEffect(() => {
  const root = document.documentElement;
  if (theme === 'dark') {
    root.classList.add('dark');
  } else if (theme === 'light') {
    root.classList.remove('dark');
  } else {
    // System theme
    const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
    if (prefersDark) root.classList.add('dark');
    else root.classList.remove('dark');
  }
}, [theme]);
```

---

### 7. **Community and NGO Support Features**

These sections are marked as "Coming Soon". Future implementation could include:

**Community:**
- User forums or discussion boards
- Success stories sharing
- Recipe sharing
- Workout tips

**NGO Support:**
- List of partner NGOs
- Donation integration
- Volunteer opportunities
- Food waste reduction programs

---

## 📝 Summary

### Immediate Next Steps:
1. **Install Chart.js** and implement nutrition charts in Analytics section
2. **Add nutritional analytics endpoint** in backend
3. **Populate foods database** with sample data
4. **Implement password change** functionality
5. **Implement theme mode** switching

### Future Enhancements:
- User authentication and authorization for diet plans
- Export diet plans as PDF
- Meal reminders and notifications
- Shopping list generation from meal plans
- Integration with fitness trackers
- Social sharing features

---

## 🔗 API Endpoints Reference

### Nutrition Plan APIs
- `POST /api/generate/ml-response-generate` - Generate new diet plan
- `GET /api/generate/all-plans` - Get all diet plans
- `GET /api/generate/plan/:id` - Get specific diet plan
- `GET /api/generate/foods?category=&food_preference=` - Get foods data
- `GET /api/generate/analytics/:planId` - Get nutritional analytics (TO BE IMPLEMENTED)

### User APIs (FOR PASSWORD CHANGE)
- `PUT /api/user/change-password` - Change user password (TO BE IMPLEMENTED)

---

## 🎨 Design System

The dashboard follows the same design system as About.jsx:
- **Primary Colors:** Green (#10B981, #22C55E) and Yellow (#F59E0B, #EAB308)
- **Background:** `bg-[#A6D4AC]/40`
- **Card Style:** White cards with rounded-3xl, shadows: `4px 4px 16px #8fa98f`
- **Animations:** Framer Motion for smooth transitions
- **Icons:** Lucide React
- **Font:** System default with Tailwind classes

---

## 🚀 Testing Checklist

After implementing remaining features:
- [ ] Test diet plan creation with ML API
- [ ] Test diet plan listing and expansion
- [ ] Test foods API with different filters
- [ ] Test analytics charts rendering
- [ ] Test password change functionality
- [ ] Test theme mode switching
- [ ] Test responsive design on mobile devices
- [ ] Test navigation between sections
- [ ] Verify all animations work smoothly

---

## 📞 Support

If you encounter issues during implementation:
1. Check MongoDB connection is active
2. Verify ML API is running on port 8000
3. Check browser console for frontend errors
4. Check backend logs for API errors
5. Ensure all environment variables are set correctly
