import express from 'express';
import { body } from 'express-validator';
import { createClub, addMember, getClub, getClubs, updateClub, deleteClub} from '../controllers/clubController.js';

const router = express.Router();

// Create a new club
router.post(
  '/',createClub
);

router.get('/', getClubs);
router.get('/:id', getClub);
router.post('/:clubId/members', addMember);
router.put('/:clubId', updateClub);
router.delete('/:clubId',  deleteClub);



export default router;