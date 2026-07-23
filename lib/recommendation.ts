import mongoose from "mongoose";
import { User } from "@/models/user.model";
import {
  getExcludedUserIds,
  getMutualConnectionIds,
  getSecondDegreeCandidateIds,
} from "@/lib/graph/connection-graph.service";

type ObjectIdLike = string | mongoose.Types.ObjectId;

export type RecommendationResult = {
  user: {
    _id: string;
    firstName: string;
    lastName?: string;
    username: string;
    profilePhoto?: string;
    bio?: string;
    college?: string;
    year?: number;
    department?: string;
    interests?: string[];
  };
  score: number;
  reasons: string[];
  breakdown: {
    mutualConnections: number;
    sharedInterests: number;
    sameDepartment: boolean;
    sameYear: boolean;
    sameCollege: boolean;
    secondDegree: boolean;
  };
};

const RECOMMENDATION_USER_FIELDS =
  "firstName lastName username profilePhoto bio college year department interests";

function normalizeId(id: ObjectIdLike): string {
  return id.toString();
}

function safeString(value: unknown): string {
  return typeof value === "string" ? value.trim().toLowerCase() : "";
}

function safeStringArray(value: unknown): string[] {
  if (!Array.isArray(value)) return [];

  return value
    .filter((item): item is string => typeof item === "string")
    .map((item) => item.trim().toLowerCase())
    .filter(Boolean);
}

function getSharedInterestsCount(viewer: any, candidate: any): number {
  const viewerInterests = new Set(safeStringArray(viewer.interests));
  const candidateInterests = safeStringArray(candidate.interests);

  let count = 0;
  for (const interest of candidateInterests) {
    if (viewerInterests.has(interest)) {
      count++;
    }
  }

  return count;
}

function calculateScore(params: {
  mutualConnections: number;
  sharedInterests: number;
  sameDepartment: boolean;
  sameYear: boolean;
  sameCollege: boolean;
  secondDegree: boolean;
}): number {
  let score = 0;

  score += params.mutualConnections * 20;
  score += params.sharedInterests * 12;

  if (params.sameDepartment) score += 15;
  if (params.sameYear) score += 10;
  if (params.sameCollege) score += 8;
  if (params.secondDegree) score += 10;

  return score;
}

function generateReasons(params: {
  mutualConnections: number;
  sharedInterests: number;
  sameDepartment: boolean;
  sameYear: boolean;
  sameCollege: boolean;
  secondDegree: boolean;
}): string[] {
  const reasons: string[] = [];

  if (params.mutualConnections > 0) {
    reasons.push(
      `${params.mutualConnections} mutual connection${
        params.mutualConnections > 1 ? "s" : ""
      }`
    );
  }

  if (params.sameDepartment) {
    reasons.push("same department");
  }

  if (params.sameYear) {
    reasons.push("same year");
  }

  if (params.sameCollege) {
    reasons.push("same college");
  }

  if (params.sharedInterests > 0) {
    reasons.push(
      `${params.sharedInterests} shared interest${
        params.sharedInterests > 1 ? "s" : ""
      }`
    );
  }

  if (params.secondDegree) {
    reasons.push("connected through your network");
  }

  return reasons;
}

export async function getRecommendedUsersForUser(
  userId: ObjectIdLike,
  limit = 10
): Promise<RecommendationResult[]> {
  const normalizedUserId = normalizeId(userId);

  const viewer = await User.findById(normalizedUserId).select(
    RECOMMENDATION_USER_FIELDS
  );

  if (!viewer) return [];

  const [excludedIds, secondDegreeIds] = await Promise.all([
    getExcludedUserIds(normalizedUserId),
    getSecondDegreeCandidateIds(normalizedUserId),
  ]);

  const viewerCollege = safeString(viewer.college);
  const viewerDepartment = safeString(viewer.department);
  const viewerYear = viewer.year ?? null;
  const viewerInterests = safeStringArray(viewer.interests);

  const profileBasedCandidates = await User.find({
    _id: {
      $nin: excludedIds.map((id) => new mongoose.Types.ObjectId(id)),
    },
    $or: [
      ...(viewerCollege ? [{ college: viewer.college }] : []),
      ...(viewerDepartment ? [{ department: viewer.department }] : []),
      ...(viewerYear !== null ? [{ year: viewer.year }] : []),
      ...(viewerInterests.length ? [{ interests: { $in: viewer.interests } }] : []),
    ],
  }).select(RECOMMENDATION_USER_FIELDS);

  const candidateIdSet = new Set<string>([
    ...secondDegreeIds,
    ...profileBasedCandidates.map((user) => user._id.toString()),
  ]);

  if (!candidateIdSet.size) return [];

  const candidates = await User.find({
    _id: {
      $in: [...candidateIdSet].map((id) => new mongoose.Types.ObjectId(id)),
    },
  }).select(RECOMMENDATION_USER_FIELDS);

  const results: RecommendationResult[] = [];

  for (const candidate of candidates) {
    const candidateId = candidate._id.toString();

    const mutualConnectionIds = await getMutualConnectionIds(
      normalizedUserId,
      candidateId
    );

    const sharedInterests = getSharedInterestsCount(viewer, candidate);

    const sameDepartment =
      !!viewerDepartment &&
      !!safeString(candidate.department) &&
      safeString(candidate.department) === viewerDepartment;

    const sameYear =
      viewerYear !== null &&
      candidate.year !== undefined &&
      candidate.year !== null &&
      candidate.year === viewerYear;

    const sameCollege =
      !!viewerCollege &&
      !!safeString(candidate.college) &&
      safeString(candidate.college) === viewerCollege;

    const secondDegree = secondDegreeIds.includes(candidateId);

    const score = calculateScore({
      mutualConnections: mutualConnectionIds.length,
      sharedInterests,
      sameDepartment,
      sameYear,
      sameCollege,
      secondDegree,
    });

    const reasons = generateReasons({
      mutualConnections: mutualConnectionIds.length,
      sharedInterests,
      sameDepartment,
      sameYear,
      sameCollege,
      secondDegree,
    });

    if (score <= 0) continue;

    results.push({
      user: {
        _id: candidateId,
        firstName: candidate.firstName,
        lastName: candidate.lastName,
        username: candidate.username,
        profilePhoto: candidate.profilePhoto,
        bio: candidate.bio,
        college: candidate.college,
        year: candidate.year,
        department: candidate.department,
        interests: candidate.interests,
      },
      score,
      reasons,
      breakdown: {
        mutualConnections: mutualConnectionIds.length,
        sharedInterests,
        sameDepartment,
        sameYear,
        sameCollege,
        secondDegree,
      },
    });
  }

  return results.sort((a, b) => b.score - a.score).slice(0, limit);
}

