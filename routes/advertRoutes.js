const express = require('express');
const router = express.Router();
const advertController = require('../controllers/advertController');
const authenticationToken = require("../utils/validation"); // Auth middleware
const upload = require('../middlewares/upload');

/**
 * @swagger
 * components:
 *   schemas:
 *     Advert:
 *       type: object
 *       required:
 *         - businessName
 *         - businessAddress
 *         - businessPhone
 *         - adsText
 *         - adsImage
 *         - startDate
 *         - endDate
 *         - adsPosition
 *         - adCost
 *       properties:
 *         businessName:
 *           type: string
 *           description: Name of the business
 *         businessAddress:
 *           type: string
 *           description: Address of the business
 *         businessPhone:
 *           type: string
 *           description: Phone number of the business
 *         adsText:
 *           type: string
 *           description: Text of the advertisement
 *         adsImage:
 *           type: string
 *           description: URL to the advertisement image
 *         startDate:
 *           type: string
 *           format: date
 *           description: Start date of the advertisement
 *         endDate:
 *           type: string
 *           format: date
 *           description: End date of the advertisement
 *         adsStatus:
 *           type: string
 *           enum: [active, pause, expired]
 *           description: Status of the advert
 *         adsPosition:
 *           type: string
 *           enum: [homeTop, eventsCard, footer]
 *           description: Position of the advert on the platform
 *         adCost:
 *           type: number
 *           description: Cost of the advertisement
 *         createdBy:
 *           type: string
 *           description: User who created the advert
 *         createdDate:
 *           type: string
 *           format: date
 *           description: Date when the advert was created
 */

/**
 * @swagger
 * /adverts/create:
 *   post:
 *     summary: Create a new advert
 *     tags: [Adverts]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/Advert'
 *     responses:
 *       201:
 *         description: Advert created successfully
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Advert'
 *       500:
 *         description: Server error
 */
router.post('/upload', upload.single('image'), (req, res) => {
    try {
      if (!req.file) {
        return res.status(400).json({ message: 'No file uploaded' });
      }
  
      const filePath = `/uploads/adverts/${req.file.filename}`;
      return res.status(200).json({ url: filePath }); // or use absolute URL if needed
    } catch (err) {
      return res.status(500).json({ message: 'Upload failed', error: err.message });
    }
});
  
router.post('/create', authenticationToken, upload.single('image'), advertController.createAdvert);

/**
 * @swagger
 * /adverts:
 *   get:
 *     summary: Fetch all adverts
 *     tags: [Adverts]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: List of all adverts
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/Advert'
 *       500:
 *         description: Server error
 */
router.get('/', authenticationToken, advertController.getAllAdverts);

/**
 * @swagger
 * /adverts/{id}:
 *   get:
 *     summary: Fetch a single advert by ID
 *     tags: [Adverts]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: string
 *         required: true
 *         description: ID of the advert
 *     responses:
 *       200:
 *         description: Advert data
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Advert'
 *       404:
 *         description: Advert not found
 *       500:
 *         description: Server error
 */
router.get('/:id', authenticationToken, advertController.getAdvertById);

/**
 * @swagger
 * /adverts/{id}:
 *   put:
 *     summary: Update an advert
 *     tags: [Adverts]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: string
 *         required: true
 *         description: ID of the advert to update
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/Advert'
 *     responses:
 *       200:
 *         description: Advert updated successfully
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Advert'
 *       404:
 *         description: Advert not found
 *       500:
 *         description: Server error
 */
router.put('/:id', authenticationToken, advertController.updateAdvert);

/**
 * @swagger
 * /adverts/{id}:
 *   delete:
 *     summary: Delete an advert
 *     tags: [Adverts]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: string
 *         required: true
 *         description: ID of the advert to delete
 *     responses:
 *       200:
 *         description: Advert deleted successfully
 *       404:
 *         description: Advert not found
 *       500:
 *         description: Server error
 */
router.delete('/:id', authenticationToken, advertController.deleteAdvert);

/**
 * @swagger
 * /adverts/{id}/pause:
 *   post:
 *     summary: Pause an advert
 *     tags: [Adverts]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: string
 *         required: true
 *         description: ID of the advert to pause
 *     responses:
 *       200:
 *         description: Advert paused successfully
 *       404:
 *         description: Advert not found
 *       500:
 *         description: Server error
 */
router.post('/:id/pause', authenticationToken, advertController.pauseAdvert);

/**
 * @swagger
 * /adverts/{id}/restart:
 *   post:
 *     summary: Restart an advert
 *     tags: [Adverts]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: string
 *         required: true
 *         description: ID of the advert to restart
 *     responses:
 *       200:
 *         description: Advert restarted successfully
 *       404:
 *         description: Advert not found
 *       500:
 *         description: Server error
 */
router.post('/:id/restart', authenticationToken, advertController.restartAdvert);

module.exports = router;
