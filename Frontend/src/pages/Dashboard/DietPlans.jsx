import React, { useState, useEffect, useContext } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Plus, X, ChevronRight, Timer } from "lucide-react";
import axios from "axios";
import { userDataContext } from "../../context/UserContext";
import { authDataContext } from "../../context/AuthContextProvider";
import Loader from "../../components/Loader";

export default function DietPlans() {
  const { userData } = useContext(userDataContext);
  const { serverUrl } = useContext(authDataContext);
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [dietPlans, setDietPlans] = useState([]);
  const [expandedPlan, setExpandedPlan] = useState(null);
  const [loading, setLoading] = useState(false);
  const [fetchingPlans, setFetchingPlans] = useState(true); // To track if we're in the process of fetching plans

  // Form state for creating diet plan
  const [formData, setFormData] = useState({
    // name: "",
    // age: "",
    weight: "",
    height: "",
    goal: "Weight Loss",
    food_preference: "Vegetarian",
    gender: "Male",
    days: 7,
    medical_conditions: "",
    allergies: "",
    activity_level: "Moderately Active",
  });

  const calculateAgeFrontend = (dob) => {
    if (!dob) return "";
    const birthDate = new Date(dob);
    const today = new Date();
    let age = today.getFullYear() - birthDate.getFullYear();
    const m = today.getMonth() - birthDate.getMonth();
    if (m < 0 || (m === 0 && today.getDate() < birthDate.getDate())) {
      age--;
    }
    return age;
  };
  //playstore star like animation component
  const PlaystoreStar = ({ number }) => {
    return (
      <div className="relative w-14 h-14 flex items-center justify-center">
        <motion.div
          animate={{ rotate: 360 }}
          transition={{
            repeat: Infinity,
            duration: 3,
            ease: "linear",
          }}
          className="absolute inset-0 flex items-center justify-center"
        >
          <div className="relative w-12 h-12">
            <div className="absolute inset-0 bg-green-500 rounded-xl transform rotate-45 opacity-80 mix-blend-multiply"></div>
            <div className="absolute inset-0 bg-green-100 rounded-xl transform -rotate-45 opacity-80 mix-blend-multiply"></div>
          </div>
        </motion.div>

        <span className="relative z-10 text-white font-bold text-xs bg-black/35 w-10 h-10 flex flex-col items-center justify-center rounded-full backdrop-blur-sm">
          <span className="text-[9px] leading-none text-gray-200">Plan</span>
          <span className="leading-none">{number}</span>
        </span>
      </div>
    );
  };

  // Calculate it once to use in the form
  const userAge = calculateAgeFrontend(userData?.dateOfBirth);

  // Handle form input changes
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  // Handle form submission
  const handleCreatePlan = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      const user_profile = {
        // name: formData.name,
        // age: parseInt(formData.age),
        weight: parseFloat(formData.weight),
        height: parseFloat(formData.height),
        gender: formData.gender,
        goal: formData.goal,
        days: parseInt(formData.days),
        food_preference: formData.food_preference,
        medical_conditions: formData.medical_conditions
          .split(",")
          .map((c) => c.trim())
          .filter((c) => c),
        allergies: formData.allergies
          .split(",")
          .map((a) => a.trim())
          .filter((a) => a),
        activity_level: formData.activity_level,
      };
      const response = await axios.post(
        `${serverUrl}/api/generate/ml-response-generate`,
        user_profile,
        { withCredentials: true },
      );

      // alert("Diet Plan created successfully!");
      setShowCreateModal(false);
      setFormData({
        // name: "",
        // age: "",
        weight: "",
        height: "",
        gender: "Male",
        goal: "Weight Loss",
        days: 7,
        food_preference: "Vegetarian",
        medical_conditions: "",
        allergies: "",
        activity_level: "Moderately Active",
      });
      // Refresh diet plans
      fetchDietPlans();
    } catch (error) {
      console.error("Error creating diet plan:", error);
      alert("Error creating diet plan. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  // Fetch all diet plans
  const fetchDietPlans = async () => {
    try {
      const response = await axios.get(`${serverUrl}/api/generate/all-plans`, {
        withCredentials: true,
      });
      setTimeout(
        () => {
          setFetchingPlans(false);
        },
        response.data.length > 0 ? 500 : 1500,
      ); // Shorter delay if plans exist, longer if no plans to show the empty state animation

      setDietPlans(response.data || []);
    } catch (error) {
      console.error("Error fetching diet plans:", error);
    }
  };

  useEffect(() => {
    fetchDietPlans();
  }, []);

  // Format date for display
  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
    });
  };

  return (
    <>
      <AnimatePresence mode="wait">
        <motion.div
          key="dietplans"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -20 }}
          className="space-y-6"
        >
          <div className="flex items-center justify-between">
            <h3 className="text-xl font-bold text-gray-800">
              Your AI Generated Diet Plans
            </h3>
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => setShowCreateModal(true)}
              className="flex items-center gap-2 px-6 py-3 bg-green-500 text-white rounded-xl font-semibold shadow-lg hover:bg-green-600 transition-colors"
            >
              <Plus className="w-5 h-5" />
              Create New Plan
            </motion.button>
          </div>

          {/* Diet Plans List */}
          {dietPlans.length === 0 && !fetchingPlans ? (
            <motion.div
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              className="bg-white rounded-3xl p-16 text-center shadow-lg"
              style={{
                boxShadow: "4px 4px 16px #8fa98f, -4px -4px 16px #8fa98f",
              }}
            >
              <Plus className="w-20 h-20 mx-auto mb-4 text-gray-300" />
              <h4 className="text-2xl font-bold text-gray-800 mb-2">
                No Diet Plans Yet
              </h4>
              <p className="text-gray-500 mb-6">
                Create your first personalized diet plan to get started on your
                health journey!
              </p>
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => setShowCreateModal(true)}
                className="px-8 py-3 bg-green-500 text-white rounded-xl font-semibold shadow-lg hover:bg-green-600 transition-colors"
              >
                Create Your First Plan
              </motion.button>
            </motion.div>
          ) : (
            <div className="space-y-4">
              {dietPlans.map((plan) => (
                <motion.div
                  key={plan.planNumber}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="bg-white rounded-3xl overflow-hidden shadow-lg"
                  style={{
                    boxShadow: "2px 2px 12px #8fa98f, -2px -2px 8px #8fa98f",
                  }}
                >
                  {/* Plan Header */}
                  <motion.div
                    whileHover={{ backgroundColor: "#f9fafb" }}
                    onClick={() =>
                      setExpandedPlan(
                        expandedPlan === plan._id ? null : plan._id,
                      )
                    }
                    className="flex items-center justify-between p-6 cursor-pointer"
                  >
                    <div className="flex items-center gap-4">
                      <PlaystoreStar number={plan.planNumber} />
                      <div>
                        <h4 className="text-lg font-bold text-gray-800">
                          {plan.user.name.split(" ")[0]}'s Diet Plan
                        </h4>
                        <p className="text-sm text-gray-500">
                          Created on {formatDate(plan.createdAt)}
                        </p>
                      </div>
                    </div>
                    <motion.div
                      animate={{
                        rotate: expandedPlan === plan._id ? 90 : 0,
                      }}
                    >
                      <ChevronRight className="w-6 h-6 text-gray-400" />
                    </motion.div>
                  </motion.div>

                  {/* Expanded Plan Details */}
                  <AnimatePresence>
                    {expandedPlan === plan._id && (
                      <motion.div
                        initial={{ height: 0, opacity: 0 }}
                        animate={{ height: "auto", opacity: 1 }}
                        exit={{ height: 0, opacity: 0 }}
                        className="border-t border-gray-200"
                      >
                        <div className="p-6 space-y-4 bg-gray-50">
                          {/* User Profile Info */}
                          <div className="grid grid-cols-3 md:grid-cols-5 gap-4">
                            <div className="bg-white p-4 rounded-xl shadow-sm">
                              <p className="text-sm text-black mb-1">Age</p>
                              <p className="text-lg font-bold text-gray-800">
                                {plan.profileSnapshot.age} yrs
                              </p>
                            </div>
                            <div className="bg-white p-4 rounded-xl shadow-sm">
                              <p className="text-sm text-black mb-1">Weight</p>
                              <p className="text-lg font-bold text-gray-800">
                                {plan.profileSnapshot.weight} kg
                              </p>
                            </div>
                            <div className="bg-white p-4 rounded-xl shadow-sm">
                              <p className="text-sm text-black mb-1">Height</p>
                              <p className="text-lg font-bold text-gray-800">
                                {plan.profileSnapshot.height} cm
                              </p>
                            </div>
                            <div className="bg-white p-4 rounded-xl shadow-sm">
                              <p className="text-sm text-black mb-1">BMI</p>
                              <p className="text-lg font-bold text-gray-800">
                                {plan.profileSnapshot.bmi
                                  ? plan.profileSnapshot.bmi
                                  : "-"}
                              </p>
                            </div>
                            <div className="bg-white p-4 rounded-xl shadow-sm">
                              <p className="text-sm text-black mb-1">TDEE</p>
                              <p className="text-lg font-bold text-gray-800">
                                {plan.profileSnapshot.tdee
                                  ? plan.profileSnapshot.tdee
                                  : "-"}
                              </p>
                            </div>
                          </div>

                          {/* Meal Plan Days */}
                          <div className="space-y-3">
                            <h5 className="font-bold text-gray-800">
                              Weekly Meal Plan
                            </h5>
                            {plan.days?.map((dayObj) => (
                              <div
                                key={dayObj._id || dayObj.dayNumber}
                                className="bg-white p-4 rounded-xl shadow-sm"
                              >
                                <h6 className="font-bold text-green-600 mb-2">
                                  Day {dayObj.dayNumber}
                                </h6>
                                <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                                  <div>
                                    <p className="text-xl font-semibold text-black mb-1">
                                      Breakfast
                                    </p>
                                    <ul className="text-sm text-gray-500 space-y-1">
                                      {dayObj.meals
                                        ?.find(
                                          (m) => m.mealType === "Breakfast",
                                        )
                                        ?.foods?.map((item, idx) => (
                                          <li key={idx}>
                                            •{" "}
                                            <span className="font-semibold text-sm text-green-500 ">
                                              {item.name}
                                            </span>
                                            <br />
                                            <div className="ml-5">
                                              <span className="font-semibold">
                                                <span className="text-gray-600 font-bold">
                                                  Calories:
                                                </span>{" "}
                                                {item.calories} kcal
                                              </span>{" "}
                                              ,{" "}
                                              <span className="font-semibold">
                                                <span className="text-gray-600 font-bold">
                                                  Protein:
                                                </span>{" "}
                                                {item.protein}g
                                              </span>{" "}
                                              ,{" "}
                                              <span className="font-semibold">
                                                <span className="text-gray-600 font-bold">
                                                  Carbs:
                                                </span>{" "}
                                                {item.carbs}g
                                              </span>{" "}
                                              ,{" "}
                                              <span className="font-semibold">
                                                <span className="text-gray-600 font-bold">
                                                  Fat:
                                                </span>{" "}
                                                {item.fat}g
                                              </span>{" "}
                                            </div>
                                          </li>
                                        ))}
                                    </ul>
                                  </div>
                                  <div>
                                    <p className="text-xl  font-semibold text-black  mb-1">
                                      Lunch
                                    </p>
                                    <ul className="text-sm text-gray-500 space-y-1">
                                      {dayObj.meals
                                        ?.find((m) => m.mealType === "Lunch")
                                        ?.foods?.map((item, idx) => (
                                          <li key={idx}>
                                            •{" "}
                                            <span className=" font-semibold  text-sm text-green-500">
                                              {item.name}
                                            </span>
                                            <br />
                                            <div className="ml-5">
                                              <span className="font-semibold">
                                                <span className="text-gray-600 font-bold">
                                                  Calories:
                                                </span>{" "}
                                                {item.calories} kcal
                                              </span>{" "}
                                              ,{" "}
                                              <span className="font-semibold">
                                                <span className="text-gray-600 font-bold">
                                                  Protein:
                                                </span>{" "}
                                                {item.protein}g
                                              </span>{" "}
                                              ,{" "}
                                              <span className="font-semibold">
                                                <span className="text-gray-600 font-bold">
                                                  Carbs:
                                                </span>{" "}
                                                {item.carbs}g
                                              </span>{" "}
                                              ,{" "}
                                              <span className="font-semibold">
                                                <span className="text-gray-600 font-bold">
                                                  Fat:
                                                </span>{" "}
                                                {item.fat}g
                                              </span>{" "}
                                            </div>
                                          </li>
                                        ))}
                                    </ul>
                                  </div>
                                  <div>
                                    <p className="text-xl  font-semibold text-black mb-1">
                                      Dinner
                                    </p>
                                    <ul className="text-sm text-gray-500 space-y-1">
                                      {dayObj.meals
                                        ?.find((m) => m.mealType === "Dinner")
                                        ?.foods?.map((item, idx) => (
                                          <li key={idx}>
                                            •{" "}
                                            <span className=" font-semibold text-sm text-green-500">
                                              {item.name}
                                            </span>
                                            <br />
                                            <div className="ml-5">
                                              <span className="font-semibold">
                                                <span className="text-gray-600 font-bold">
                                                  Calories:
                                                </span>{" "}
                                                {item.calories} kcal
                                              </span>{" "}
                                              ,{" "}
                                              <span className="font-semibold">
                                                <span className="text-gray-600 font-bold">
                                                  Protein:
                                                </span>{" "}
                                                {item.protein}g
                                              </span>{" "}
                                              ,{" "}
                                              <span className="font-semibold">
                                                <span className="text-gray-600 font-bold">
                                                  Carbs:
                                                </span>{" "}
                                                {item.carbs}g
                                              </span>{" "}
                                              ,{" "}
                                              <span className="font-semibold">
                                                <span className="text-gray-600 font-bold">
                                                  Fat:
                                                </span>{" "}
                                                {item.fat}g
                                              </span>{" "}
                                            </div>
                                          </li>
                                        ))}
                                    </ul>
                                  </div>
                                </div>
                              </div>
                            ))}
                          </div>
                        </div>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </motion.div>
              ))}
            </div>
          )}
        </motion.div>
      </AnimatePresence>

      {/* Create Diet Plan Modal */}
      <AnimatePresence>
        {showCreateModal && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4"
            onClick={() => setShowCreateModal(false)}
          >
            <motion.div
              initial={{ scale: 0.8, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.8, opacity: 0 }}
              onClick={(e) => e.stopPropagation()}
              className="bg-white rounded-3xl shadow-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto"
            >
              {/* Modal Header */}
              <div className="sticky top-0 bg-white border-b border-gray-200 px-8 py-6 flex items-center justify-between rounded-t-3xl">
                <h3 className="text-2xl font-bold text-gray-800">
                  Create New Diet Plan
                </h3>
                <motion.button
                  whileHover={{ scale: 1.1, rotate: 90 }}
                  whileTap={{ scale: 0.9 }}
                  onClick={() => setShowCreateModal(false)}
                  className="w-10 h-10 rounded-full bg-gray-100 hover:bg-gray-200 flex items-center justify-center "
                >
                  <X className="w-5 h-5 text-gray-600" />
                </motion.button>
              </div>

              {/* Modal Body */}
              <form onSubmit={handleCreatePlan} className="p-8 space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">
                      Name
                    </label>
                    <input
                      type="text"
                      value={userData?.name || ""}
                      readOnly
                      className="w-full px-4 py-3 rounded-xl border-2 border-gray-200 focus:border-green-500 focus:outline-none"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">
                      Age
                    </label>
                    <input
                      type="number"
                      value={userAge}
                      readOnly
                      className="w-full px-4 py-3 rounded-xl border-2 border-gray-200 focus:border-green-500 focus:outline-none"
                      placeholder="Enter your age"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">
                      Weight (kg)
                    </label>
                    <input
                      type="number"
                      name="weight"
                      value={formData.weight}
                      onChange={handleInputChange}
                      required
                      step="0.1"
                      className="w-full px-4 py-3 rounded-xl border-2 border-gray-200 focus:border-green-500 focus:outline-none"
                      placeholder="Enter weight in kg"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">
                      Height (cm)
                    </label>
                    <input
                      type="number"
                      name="height"
                      value={formData.height}
                      onChange={handleInputChange}
                      required
                      step="0.1"
                      className="w-full px-4 py-3 rounded-xl border-2 border-gray-200 focus:border-green-500 focus:outline-none"
                      placeholder="Enter height in cm"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">
                      Gender
                    </label>
                    <select
                      name="gender"
                      value={formData.gender}
                      onChange={handleInputChange}
                      required
                      className="w-full px-4 py-3 rounded-xl border-2 border-gray-200 focus:border-green-500 focus:outline-none"
                    >
                      <option value="Male">Male</option>
                      <option value="Female">Female</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">
                      Food Preference
                    </label>
                    <select
                      name="food_preference"
                      value={formData.food_preference}
                      required
                      onChange={handleInputChange}
                      className="w-full px-4 py-3 rounded-xl border-2 border-gray-200 focus:border-green-500 focus:outline-none"
                    >
                      <option value="Vegetarian">Vegetarian</option>
                      <option value="Eggetarian">Eggetarian</option>
                      <option value="Non-Vegetarian">Non-Vegetarian</option>
                      <option value="Any">Any</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">
                      Activity Level
                    </label>
                    <select
                      name="activity_level"
                      value={formData.activity_level}
                      required
                      onChange={handleInputChange}
                      className="w-full px-4 py-3 rounded-xl border-2 border-gray-200 focus:border-green-500 focus:outline-none"
                    >
                      <option value="Sedentary">Sedentary</option>
                      <option value="Lightly Active">Lightly Active</option>
                      <option value="Moderately Active">
                        Moderately Active
                      </option>
                      <option value="Very Active">Very Active</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">
                      Goal
                    </label>
                    <select
                      name="goal"
                      value={formData.goal}
                      onChange={handleInputChange}
                      required
                      className="w-full px-4 py-3 rounded-xl border-2 border-gray-200 focus:border-green-500 focus:outline-none"
                    >
                      <option value="Weight Loss">Weight Loss</option>
                      <option value="Muscle Gain">Muscle Gain</option>
                      <option value="Maintenance">Maintenance</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">
                      Days
                    </label>
                    <select
                      name="days"
                      value={formData.days}
                      onChange={handleInputChange}
                      required
                      className="w-full px-4 py-3 rounded-xl border-2 border-gray-200 focus:border-green-500 focus:outline-none"
                    >
                      <option value="7">7</option>
                      <option value="14">14</option>
                    </select>
                  </div>

                  <div className="md:col-span-2">
                    <label className="block text-sm font-semibold text-gray-700 mb-2">
                      Medical Conditions (comma-separated)
                    </label>
                    <input
                      type="text"
                      name="medical_conditions"
                      value={formData.medical_conditions}
                      onChange={handleInputChange}
                      className="w-full px-4 py-3 rounded-xl border-2 border-gray-200 focus:border-green-500 focus:outline-none"
                      placeholder="e.g., diabetes, hypertension"
                    />
                  </div>

                  <div className="md:col-span-2">
                    <label className="block text-sm font-semibold text-gray-700 mb-2">
                      Allergies (comma-separated)
                    </label>
                    <input
                      type="text"
                      name="allergies"
                      value={formData.allergies}
                      onChange={handleInputChange}
                      className="w-full px-4 py-3 rounded-xl border-2 border-gray-200 focus:border-green-500 focus:outline-none"
                      placeholder="e.g., peanuts, dairy"
                    />
                  </div>
                </div>

                {/* Submit Button */}
                {loading && <Loader />}
                <motion.button
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  type="submit"
                  disabled={loading}
                  className="w-full px-6 py-4 bg-gradient-to-r from-green-500 to-green-600 text-white rounded-xl font-bold text-lg shadow-lg hover:from-green-600 hover:to-green-700 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {loading ? "Creating Plan..." : "Generate Diet Plan"}
                </motion.button>
              </form>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
