import mongoose from 'mongoose';

const plantAnalysisSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: [true, 'userId is required'],
      index: true,
    },
    imageUrl: {
      type: String,
      required: [true, 'imageUrl is required'],
      trim: true,
    },
    commonName: {
      type: String,
      required: [true, 'commonName is required'],
      trim: true,
    },
    scientificName: {
      type: String,
      required: [true, 'scientificName is required'],
      trim: true,
    },
    confidence: {
      type: Number,
      required: [true, 'confidence is required'],
      min: 0,
      max: 100,
    },
    healthScore: {
      type: Number,
      required: [true, 'healthScore is required'],
      min: 0,
      max: 100,
    },
    recommendations: {
      type: [String],
      default: [],
    },
  },
  {
    timestamps: {
      createdAt: 'createdAt',
      updatedAt: 'updatedAt',
    },
  }
);

plantAnalysisSchema.index({ userId: 1, createdAt: -1 });

export const PlantAnalysis = mongoose.model('PlantAnalysis', plantAnalysisSchema);