import mongoose from "mongoose";
import { Connection } from "@/models/connection.model";

type ObjectIdLike = string | mongoose.Types.ObjectId;

function normalizeIds(id:ObjectIdLike) : string {
    return id.toString();
}

function uniqueIds(ids : ObjectIdLike[]) : string[]{
    return [...new Set(ids.map((id) => normalizeIds(id)))];
}

export async function getAcceptedNeighborIds(userId: ObjectIdLike) : Promise<string[]>{
    const normalizedUserId = normalizeIds(userId);
    const acceptedEdges = await Connection.find({
        fromUser : normalizedUserId,
        type:"connection",
        status:"accepted",
    }).select("toUser");

    return uniqueIds(acceptedEdges.map((edge) => edge.toUser.toString() ));
}

export async function getPendingSentRequestIds(userId: ObjectIdLike) : Promise<string[]>{
    const normalizedUserId = normalizeIds(userId);
    const pendingEdges = await Connection.find({
        fromUser : normalizedUserId,
        type:"connection",
        status:"pending",
    }).select("toUser");

    return uniqueIds(pendingEdges.map((edge) => edge.toUser.toString() ));
}

export async function getPendingReceivedRequestIds(userId: ObjectIdLike) : Promise<string[]>{
    const normalizedUserId = normalizeIds(userId);
    const pendingEdges = await Connection.find({
        toUser : normalizedUserId,
        type:"connection",
        status:"pending",
    }).select("fromUser");

    return uniqueIds(pendingEdges.map((edge) => edge.fromUser.toString() ));
}

export async function getExcludedUserIds(userId: ObjectIdLike): Promise<string[]> {
  const normalizedUserId = normalizeIds(userId);

  const [acceptedIds, pendingSentIds, pendingReceivedIds] = await Promise.all([
    getAcceptedNeighborIds(normalizedUserId),
    getPendingSentRequestIds(normalizedUserId),
    getPendingReceivedRequestIds(normalizedUserId),
  ]);

  return uniqueIds([
    normalizedUserId,
    ...acceptedIds,
    ...pendingSentIds,
    ...pendingReceivedIds,
  ]);
}

export async function getMutualConnectionIds(userAId : ObjectIdLike , userBId : ObjectIdLike) : Promise<String[]>{
    const [userANeighbors , userBNeighbors] = await Promise.all([getAcceptedNeighborIds(userAId),getAcceptedNeighborIds(userBId)]);
    const userBSet = new Set(userBNeighbors);
    return userANeighbors.filter((id)=> userBSet.has(id));
}

export async function getSecondDegreeCandidateIds(userId: ObjectIdLike): Promise<string[]> {
  const normalizedUserId = normalizeIds(userId);

  const [firstDegreeIds, excludedIds] = await Promise.all([
    getAcceptedNeighborIds(normalizedUserId),
    getExcludedUserIds(normalizedUserId),
  ]);

  if (!firstDegreeIds.length) {
    return [];
  }

  const secondDegreeLists = await Promise.all(
    firstDegreeIds.map((neighborId) => getAcceptedNeighborIds(neighborId))
  );

  const secondDegreeIds = secondDegreeLists.flat();
  const excludedSet = new Set(excludedIds);

  return uniqueIds(
    secondDegreeIds.filter((candidateId) => !excludedSet.has(candidateId))
  );
}