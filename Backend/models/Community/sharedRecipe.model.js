import mongoose from 'mongoose';

const sharedRecipeSchema = new mongoose.Schema({
  challenge: { type: mongoose.Schema.Types.ObjectId, ref: 'Challenge', required: true },
  user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  creatorName: { type: String, required: true }, // e.g., "Rahul S."
  name: { type: String, required: true },        // e.g., "Traditional Maharashtrian Poha"
  region: { type: String, required: true },      // e.g., "West"
  state: { type: String, required: true },       // e.g., "Maharashtra"
  macros: { type: String, required: true }       // e.g., "240 kcal | 6g Protein"
}, { timestamps: true });

const SharedRecipe = mongoose.model('SharedRecipe', sharedRecipeSchema);
export default SharedRecipe;