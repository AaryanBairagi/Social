import { getAcceptedNeighborIds, getSecondDegreeCandidateIds } from "./connection-graph.service";
import { User } from "@/models/user.model";

export async function buildConnectionGraph(userId: string) {
  const centerId = userId;

  const firstDegree = await getAcceptedNeighborIds(centerId);
  const secondDegree = await getSecondDegreeCandidateIds(centerId);

  const nodes = new Map<string, any>();
  const edges: any[] = [];

  /* 🔥 FETCH USERS IN ONE QUERY */
  const users = await User.find({
    _id: { $in: [centerId, ...firstDegree] },
  }).select("username profilePhoto");

  const userMap = new Map(
    users.map((u : any) => [u._id.toString(), u])
  );

  /* ---------------- CENTER NODE ---------------- */
  const centerUser = userMap.get(centerId);

  nodes.set(centerId, {
    id: centerId,
    position: [0, 0, 0], // ✅ MUST BE ARRAY
    isCenter: true,
    username: centerUser?.username || "user",
    profilePhoto: centerUser?.profilePhoto || "/User-Prof.png",
  });

  /* ---------------- CONNECTION NODES ---------------- */
  firstDegree.forEach((id, index) => {
    const total = firstDegree.length;

    // 🔥 SPHERICAL DISTRIBUTION (better than circle)
    const phi = Math.acos(-1 + (2 * index) / total);
    const theta = Math.sqrt(total * Math.PI) * phi;

    const radius = 3;

    const x = radius * Math.cos(theta) * Math.sin(phi);
    const y = radius * Math.sin(theta) * Math.sin(phi);
    const z = radius * Math.cos(phi);

    const user = userMap.get(id);

    nodes.set(id, {
      id,
      position: [x, y, z], // ✅ ARRAY
      username: user?.username || "user",
      profilePhoto: user?.profilePhoto || "/User-Prof.png",
    });

    edges.push({
      from: centerId,
      to: id,
    });
  });

  secondDegree.forEach((id, index) => {
  const total = secondDegree.length;

  const phi = Math.acos(-1 + (2 * index) / total);
  const theta = Math.sqrt(total * Math.PI) * phi;

  const radius = 5; // farther than first degree

  const x = radius * Math.cos(theta) * Math.sin(phi);
  const y = radius * Math.sin(theta) * Math.sin(phi);
  const z = radius * Math.cos(phi);

  const user = userMap.get(id);

  nodes.set(id, {
    id,
    position: [x, y, z],
    username: user?.username || "user",
    profilePhoto: user?.profilePhoto || "/User-Prof.png",
    isSecondDegree: true, // 
  });

  edges.push({
    from: firstDegree[Math.floor(Math.random() * firstDegree.length)],
    to: id,
  });
  });

  return {
    nodes: Array.from(nodes.values()),
    edges,
  };
}