// src/routes/profile.routes.ts
import { Router } from 'express'
import { ProfileController } from '../controllers/profile.controllers'
import { authMiddleware } from '../middlewares/auth'

const router = Router()
const profileController = new ProfileController()

// Get the profile of the logged-in user
router.get('/', authMiddleware, profileController.getProfile)
// Update the profile of the logged-in user
router.put('/', authMiddleware, profileController.updateProfile)

export default router
