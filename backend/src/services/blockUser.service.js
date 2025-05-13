import { getUserById } from './user.service.js';
import User from '../models/user.model.js';

export const blockUserService = async (userId, targetUserId) => {
    if (userId === targetUserId) {
      throw new Error("Cannot block yourself");
    }
  
    const user = await getUserById(userId); // goi User service de lay user
  
    if (user.blockedUserIds.includes(targetUserId)) {
      throw new Error("You have already blocked this user");
    }
  
    // Cập nhật blockedUserIds
    await User.update({
      where: { id: userId },
      data: {
        blockedUserIds: {
          push: targetUserId
        }
      }
    });
  
    return true;
  };