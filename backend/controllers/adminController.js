import { PlantAnalysis } from '../models/PlantAnalysis.js';
import { User } from '../models/User.js';
import { asyncHandler } from '../utils/asyncHandler.js';
import { sendSuccess } from '../utils/response.js';

function normalizeUser(user, analysisCount = 0) {
  return {
    id: user._id.toString(),
    name: user.name,
    email: user.email,
    analysisCount,
    createdAt: user.createdAt,
  };
}

function normalizeAnalysis(analysis) {
  const user = analysis.userId;

  return {
    id: analysis._id.toString(),
    imageUrl: analysis.imageUrl,
    commonName: analysis.commonName,
    scientificName: analysis.scientificName,
    confidence: analysis.confidence,
    healthScore: analysis.healthScore,
    recommendations: analysis.recommendations,
    createdAt: analysis.createdAt,
    user: user
      ? {
          id: user._id.toString(),
          name: user.name,
          email: user.email,
        }
      : null,
  };
}

export const getAdminOverview = asyncHandler(async (request, response) => {
  const [users, analyses] = await Promise.all([
    User.find().sort({ createdAt: -1 }),
    PlantAnalysis.find().populate('userId', 'name email').sort({ createdAt: -1 }),
  ]);

  const analysisCounts = new Map();

  analyses.forEach((analysis) => {
    const userId = analysis.userId?._id?.toString();
    if (!userId) {
      return;
    }

    analysisCounts.set(userId, (analysisCounts.get(userId) || 0) + 1);
  });

  return sendSuccess(response, 200, 'Admin overview retrieved successfully', {
    data: {
      users: users.map((user) => normalizeUser(user, analysisCounts.get(user._id.toString()) || 0)),
      analyses: analyses.map((analysis) => normalizeAnalysis(analysis)),
    },
  });
});