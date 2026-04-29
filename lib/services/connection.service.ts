import { User } from "@/models/user.model";
import { Connection } from "@/models/connection.model";

type ServiceResult<T = unknown> = {
  success: boolean;
  status: number;
  message?: string;
  data?: T;
};

const USER_PUBLIC_FIELDS = "firstName lastName userId profilePhoto bio college year department interests";

async function getUserByClerkId(clerkId : string){
    return User.findOne({clerkId});
}

async function getUserById(userId : string){
    return User.findById(userId);
}

export async function sendConnectionRequest(currentClerkId : string , targetUserId : string) : Promise<ServiceResult> {
    const currentUser = await getUserByClerkId(currentClerkId);
    if(!currentUser) return {success:false , status : 404 , message : "Current User cannot be found"};

    const targetUser = await getUserById(targetUserId);
    if(!targetUser) return {success:false , status : 404 , message : "Current User cannot be found"};

    //self check
    if (currentUser._id.toString() === targetUser._id.toString()) {
        return { success: false, status: 400, message: "Cannot send request to yourself" };
    }

    const existingEdge = await Connection.findOne({
        type : "connection" , 
        $or : [{fromUser : currentUser._id , toUser : targetUser._id} , {fromUser : targetUser._id , toUser : currentUser._id}]
    });

    if(existingEdge){
        if(existingEdge.status==="accepted") return {success : false , status : 200 , message : "Already Connected"}

        const isSameDirection =
            existingEdge.fromUser.toString() === currentUser._id.toString() &&
            existingEdge.toUser.toString() === targetUser._id.toString();

        if(existingEdge.status === "pending" && isSameDirection) {
            return { success: false, status: 200, message: "Request already sent" };
        }

        if(existingEdge.status === "pending" && ! isSameDirection){
            return {success : false , status : 200 , message : "This user has already sent the request"}
        }
    }

    await Connection.create({
        fromUser : currentUser._id,
        toUser : targetUser._id , 
        status : "pending",
        type : "connection"
    });

    return {
        success: true,
        status: 201,
        message: "Connection request sent",
    };
}

export async function acceptConnectionRequest(
  currentClerkId: string,
  requesterId: string
): Promise<ServiceResult> {
  const currentUser = await getUserByClerkId(currentClerkId);
  if (!currentUser) {
    return { success: false, status: 404, message: "Current user not found" };
  }

  const requester = await getUserById(requesterId);
  if (!requester) {
    return { success: false, status: 404, message: "Requester not found" };
  }

  if (currentUser._id.toString() === requester._id.toString()) {
    return { success: false, status: 400, message: "Cannot accept your own request" };
  }

  const pendingEdge = await Connection.findOne({
    fromUser: requester._id,
    toUser: currentUser._id,
    type: "connection",
    status: "pending",
  });

  if (!pendingEdge) {
    return { success: false, status: 404, message: "No pending request found" };
  }

  pendingEdge.status = "accepted";
  pendingEdge.respondedAt = new Date();
  await pendingEdge.save();

  await Connection.findOneAndUpdate(
    {fromUser : currentUser._id , toUser : requester._id , type : "connection"},
    {$set:{
      status : "accepted",
      respondedAt : new Date()
    }},
    {upsert : true , new : true , setDefaultsOnInsert : true});

  return {
    success: true,
    status: 200,
    message: "Connection request accepted",
  };
}


export async function getSentRequests(currentClerkId : string) : Promise<ServiceResult>{
    const currentUser = await getUserByClerkId(currentClerkId);
    if(!currentUser) return {success:false , status : 404 , message : "Current User cannot be found"};

    const sentRequests = await Connection.find({
        fromUser : currentUser._id,
        type : "connection",
        status : "pending",
    }).populate("toUser" , USER_PUBLIC_FIELDS)
    .sort({createdAt : -1})
    .lean();

    return {
        success : true,
        status : 200,
        data : sentRequests
    }
}

export async function getReceivedRequests(currentClerkId : string) : Promise<ServiceResult>{
    const currentUser = await getUserByClerkId(currentClerkId);
    if(!currentUser) return {success:false , status : 404 , message : "Current User cannot be found"};

    const receivedRequests = await Connection.find({
        toUser : currentUser._id,
        type : "connection",
        status : "pending",
    }).populate("fromUser" , USER_PUBLIC_FIELDS)
    .sort({createdAt : -1})
    .lean();

    return {
        success : true,
        status : 200,
        data : receivedRequests
    }
}

export async function getFollowers(userId: string): Promise<ServiceResult> {
  const user = await getUserById(userId);
  if (!user) {
    return { success: false, status: 404, message: "User not found" };
  }

  const followerEdges = await Connection.find({
    toUser: user._id,
    type: "connection",
    status: "accepted",
  })
    .populate("fromUser", USER_PUBLIC_FIELDS)
    .sort({ updatedAt: -1 })
    .lean();

  const followers = followerEdges.map((edge: any) => edge.fromUser);

  return {
    success: true,
    status: 200,
    data: followers,
  };
}

export async function getFollowing(
  userId: string,
  includePending = false
): Promise<ServiceResult> {
  const user = await getUserById(userId);
  if (!user) {
    return { success: false, status: 404, message: "User not found" };
  }

  const followingEdges = await Connection.find({
    fromUser: user._id,
    type: "connection",
    status: includePending ? { $in: ["pending", "accepted"] } : "accepted",
  })
    .populate("toUser", USER_PUBLIC_FIELDS)
    .sort({ updatedAt: -1 })
    .lean();

  const following = followingEdges.map((edge: any) => edge.toUser);

  return {
    success: true,
    status: 200,
    data: following,
  };
}

export async function cancelSentRequest(
  currentClerkId: string,
  targetUserId: string
): Promise<ServiceResult> {
  const currentUser = await getUserByClerkId(currentClerkId);
  if (!currentUser) {
    return { success: false, status: 404, message: "Current user not found" };
  }

  const targetUser = await getUserById(targetUserId);
  if (!targetUser) {
    return { success: false, status: 404, message: "Target user not found" };
  }

  const deleted = await Connection.findOneAndDelete({
    fromUser: currentUser._id,
    toUser: targetUser._id,
    type: "connection",
    status: "pending",
  });

  if (!deleted) {
    return {
      success: false,
      status: 404,
      message: "Pending request not found",
    };
  }

  return {
    success: true,
    status: 200,
    message: "Sent request cancelled successfully",
  };
}

export async function rejectReceivedRequest(
  currentClerkId: string,
  requesterId: string
): Promise<ServiceResult> {
  const currentUser = await getUserByClerkId(currentClerkId);
  if (!currentUser) {
    return { success: false, status: 404, message: "Current user not found" };
  }

  const requester = await getUserById(requesterId);
  if (!requester) {
    return { success: false, status: 404, message: "Requester not found" };
  }

  const deleted = await Connection.findOneAndDelete({
    fromUser: requester._id,
    toUser: currentUser._id,
    type: "connection",
    status: "pending",
  });

  if (!deleted) {
    return {
      success: false,
      status: 404,
      message: "Received request not found",
    };
  }

  return {
    success: true,
    status: 200,
    message: "Request rejected successfully",
  };
}

export async function unfollowUser(
  currentClerkId: string,
  targetUserId: string
): Promise<ServiceResult> {
  const currentUser = await getUserByClerkId(currentClerkId);
  if (!currentUser) {
    return { success: false, status: 404, message: "Current user not found" };
  }

  const targetUser = await getUserById(targetUserId);
  if (!targetUser) {
    return { success: false, status: 404, message: "Target user not found" };
  }

  const deleted = await Connection.findOneAndDelete({
    fromUser: currentUser._id,
    toUser: targetUser._id,
    type: "connection",
    status: "accepted",
  });

  if (!deleted) {
    return {
      success: false,
      status: 404,
      message: "Follow relationship not found",
    };
  }

  return {
    success: true,
    status: 200,
    message: "Unfollowed user successfully",
  };
}

export async function removeFollower(
  currentClerkId: string,
  followerUserId: string
): Promise<ServiceResult> {
  const currentUser = await getUserByClerkId(currentClerkId);
  if (!currentUser) {
    return { success: false, status: 404, message: "Current user not found" };
  }

  const followerUser = await getUserById(followerUserId);
  if (!followerUser) {
    return { success: false, status: 404, message: "Follower user not found" };
  }

  const deleted = await Connection.findOneAndDelete({
    fromUser: followerUser._id,
    toUser: currentUser._id,
    type: "connection",
    status: "accepted",
  });

  if (!deleted) {
    return {
      success: false,
      status: 404,
      message: "Follower relationship not found",
    };
  }

  return {
    success: true,
    status: 200,
    message: "Follower removed successfully",
  };
}