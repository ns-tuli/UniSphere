import { validationResult } from 'express-validator';
import Club from '../models/Club.js';
import User from '../models/user.js';

export const createClub = async (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }
  try {
    const club = new Club(req.body);
    await club.save();
    res.status(201).json(club);
  } catch (error) {
    if (error.code === 11000) {
      return res.status(400).json({ error: 'Club name already exists' });
    }
    next(error);
  }
};
export const getClubs = async (req, res, next) => {
    try {
      const { category, search } = req.query;
      let query = {};
      if (category) {
        query.category = category;
      }
      if (search) {
        query.$or = [
          { name: { $regex: search, $options: 'i' } },
          { description: { $regex: search, $options: 'i' } }
        ];
      }
      const clubs = await Club.find(query).sort({ name: 1 });
      res.json(clubs);
    } catch (error) {
      next(error);
    }
  };
  export const getClub = async (req, res, next) => {
    try {
      const club = await Club.findById(req.params.id)
        .populate({
          path: 'events',
          match: { startDate: { $gte: new Date() } },
          options: { sort: { startDate: 1 } }
        })
        .populate('members.user', 'name email');
      if (!club) {
        return res.status(404).json({ error: 'Club not found' });
      }
      res.json(club);
    } catch (error) {
      next(error);
    }
  };
  
  export const joinClub = async (req, res, next) => {
    try {
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        return res.status(400).json({ 
          success: false, 
          errors: errors.array() 
        });
      }
  
      const { userId, role = 'member' } = req.body;
      const clubId = req.params.id;
  
      // Find user with password field explicitly
      const user = await User.findById(userId).select('+password');
      if (!user) {
        return res.status(404).json({ 
          success: false, 
          error: 'User not found' 
        });
      }
  
      const club = await Club.findById(clubId);
      if (!club) {
        return res.status(404).json({ 
          success: false, 
          error: 'Club not found' 
        });
      }
  
      // Check if user is already a member
      const isMember = club.members.some(member => 
        member.user.toString() === userId
      );
      
      if (isMember) {
        return res.status(400).json({ 
          success: false, 
          error: 'User is already a member of this club' 
        });
      }
  
      // Add user to club's members
      club.members.push({
        user: userId,
        role,
        joinedAt: new Date()
      });
  
      await club.save();
  
      // Add club to user's joinedClubs if not already present
      if (!user.joinedClubs.includes(club._id)) {
        user.joinedClubs.push(club._id);
        await user.save();
      }
  
      res.status(200).json({
        success: true,
        message: 'Successfully joined the club',
        data: club
      });
    } catch (error) {
      console.error('Join Club Error:', error);
      next(error);
    }
  };
  
  export const getCategories = async (req, res, next) => {
    try {
      const categories = await Club.distinct('category');
      res.json(categories);
    } catch (error) {
      next(error);
    }
  };
