import { validationResult } from 'express-validator';
import Club from '../models/Club.js';
import User from '../models/User.js';
import axios from "axios"
export const createClub = async (req, res, next) => {
  
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
       
      if (!club) {
        return res.status(404).json({ error: 'Club not found' });
      }
      res.json(club);
    } catch (error) {
      next(error);
    }
  };
  

  export const addMember = async (req, res, next) => {
    try {
      const { email, role } = req.body;  // Using email instead of userId
      const clubId = req.params.clubId;  // Club ID from URL parameter
  
      // Find the club by its ID
      const club = await Club.findById(clubId);
      if (!club) {
        return res.status(404).json({ success: false, error: 'Club not found' });
      }
  
      // Check if the email is already a member of the club
      const isMember = club.members.some((member) => member.email === email);
      if (isMember) {
        return res.status(400).json({ success: false, error: 'User is already a member of this club' });
      }
  
      // Add the email to the club's members
      club.members.push({ email, role, joinedAt: new Date() });
  
      await club.save();
  
      res.status(200).json({
        success: true,
        message: 'User added as a member of the club',
        data: club,
      });
    } catch (error) {
      console.error('Add Member Error:', error);
      next(error);
    }
  };
  

export  const updateClub = async (req, res) => {
    const { clubId } = req.params; // Get the clubId from the URL params
    const clubData = req.body; // Get the club data from the request body
  
    try {
      // Find the club by its ID and update with the new data
      const updatedClub = await Club.findByIdAndUpdate(clubId, clubData, { new: true });
      
      if (!updatedClub) {
        return res.status(404).json({ message: "Club not found" }); // If no club is found
      }
  
      res.status(200).json(updatedClub); // Return the updated club data
    } catch (error) {
      console.error(error);
      res.status(500).json({ message: "Error updating club: " + error.message });
    }
  };

export  const deleteClub = async (req, res) => {
    const { clubId } = req.params; // Get the clubId from the URL params
  
    try {
      // Find and delete the club by its ID
      const deletedClub = await Club.findByIdAndDelete(clubId);
  
      if (!deletedClub) {
        return res.status(404).json({ message: "Club not found" }); // If no club is found
      }
  
      res.status(200).json({ message: "Club deleted successfully" }); // Return success message
    } catch (error) {
      console.error(error);
      res.status(500).json({ message: "Error deleting club: " + error.message });
    }
  };