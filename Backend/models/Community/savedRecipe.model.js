import mongoose from 'mongoose';

const savedRecipeSchema = new mongoose.Schema({
  user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  recipe: { type: mongoose.Schema.Types.ObjectId, ref: 'SharedRecipe', required: true }
}, { timestamps: true });

// This prevents a user from bookmarking the exact same recipe card twice
savedRecipeSchema.index({ user: 1, recipe: 1 }, { unique: true });

const SavedRecipe = mongoose.model('SavedRecipe', savedRecipeSchema);
export default SavedRecipe;