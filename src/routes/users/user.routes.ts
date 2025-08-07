import express, { Router } from "express";
import asyncWrap from "express-async-wrap";
import { authenticateToken } from "../../middleware/auth.middleware";
import { UserController } from "../../controllers/user/user.controler";

const router: Router = express.Router();

/**
 * @swagger
 * /users:
 *   get:
 *     summary: Get a list of all users
 *     tags: [User]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       '200':
 *         description: Successful response with the list of users
 *         content:
 *           application/json:
 *              schema:
 *                $ref: '#/components/schemas/UserListResponse'
 *       '500':
 *         description: Internal Server Error
 */
router.get("/users", authenticateToken(["Admin"]), asyncWrap(UserController.getAllUsers));

router.get("/users/role/:roleId", authenticateToken(["Admin", "User"]), asyncWrap(UserController.getUsersByRole));

/**
 * @swagger
 * /public/user/login:
 *   post:
 *     summary: Log in a User
 *     tags: [User]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *              schema:
 *                $ref: '#/components/schemas/LoginUserInput'
 *     responses:
 *       '200':
 *         description: Successful response with the logged-in mentor and JWT
 *         content:
 *           application/json:
 *              schema:
 *                $ref: '#/components/schemas/LoginUserResponse'
 *       '401':
 *         description: Invalid email or password
 *       '500':
 *         description: Internal Server Error
 */
router.post('/auth/login', asyncWrap(UserController.LoginUser));
router.post('/auth/refresh', asyncWrap(UserController.RefreshToken));
router.post('/auth/logout', authenticateToken(["User", "Admin"]), asyncWrap(UserController.LogoutUser));

/**
 * @swagger
 * /create/users:
 *   post:
 *     summary: Create a new user
 *     tags: [User]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/UserInput'
 *     responses:
 *       '201':
 *         description: Created
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/UserResponse'
 *       '400':
 *         description: Bad request, invalid input data
 *       '500':
 *         description: Internal Server Error
 */
router.post("/create/users", asyncWrap(UserController.createUser));

/**
 * @swagger
 * /public/create/users:
 *   post:
 *     summary: Create a new user
 *     tags: [User]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/UserInput'
 *     responses:
 *       '201':
 *         description: Created
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/UserResponse'
 *       '400':
 *         description: Bad request, invalid input data
 *       '500':
 *         description: Internal Server Error
 */
router.post("/auth/register", asyncWrap(UserController.publicCreateUser));


/**
 * @swagger
 * /users/{id}:
 *   get:
 *     summary: Get a user by ID
 *     tags: [User]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         description: ID of the user to retrieve
 *         schema:
 *           type: string
 *     responses:
 *       '200':
 *         description: Successful response with the user data
 *         content:
 *           application/json:
 *              schema:
 *                $ref: '#/components/schemas/UserResponse'
 *       '404':
 *         description: User not found
 *       '500':
 *         description: Internal Server Error
 */
router.get(
  "/users/:id",
  authenticateToken(["Admin"]),
  asyncWrap(UserController.getUserById)
);

/**
 * @swagger
 * /users/{id}:
 *   put:
 *     summary: Update a user by ID
 *     tags: [User]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         description: ID of the user to update
 *         schema:
 *           type: string
 *     requestBody:
 *       description: Updated user object
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/UserInput'
 *     responses:
 *       '200':
 *         description: Successful response with the updated user data
 *         content:
 *           application/json:
 *              schema:
 *                $ref: '#/components/schemas/UserResponse'
 *       '400':
 *         description: Bad request, invalid input data
 *       '404':
 *         description: User not found
 *       '500':
 *         description: Internal Server Error
 */
router.put(
  "/users/:id",
  authenticateToken(["Admin"]),
  asyncWrap(UserController.updateUser)
);

/**
 * @swagger
 * /users/{id}:
 *   delete:
 *     summary: Delete a user by ID
 *     tags: [User]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         description: ID of the user to delete
 *         schema:
 *           type: string
 *     responses:
 *       '204':
 *         description: Successful response, no content
 *       '404':
 *         description: User not found
 *       '500':
 *         description: Internal Server Error
 */
router.delete(
  "/users/:id",
  authenticateToken(["Admin"]),
  asyncWrap(UserController.deleteUser)
);

export default router;
