// src/controllers/admin/spo.controller.ts
import { Request, Response } from 'express';

import { validate } from '../../utils/common.utils';
import { UserServices } from '../../services/user.service';
import { User } from '../../entity/user.entity';
import { number } from 'joi';
import { loginUserResponseValidator, loginUserValidator, userInputValidator, userResponseValidator } from '../../validators/user.validator';
import { mapToUser } from '../../utils/user.utils';
export class UserController {

  static async getAllUsers(req: Request, res: Response) {
    const AllUsers = await UserServices.getAllUsers();
    res.json(AllUsers);
  }

  static async getUsersByRole(req: Request, res: Response) {
    const roleId = parseInt(req.params.roleId);
    const users = await UserServices.getUsersByRole(roleId);
    res.json({ data: users.map(mapToUser) });
  }

  static async getUserById(req: Request, res: Response) {
    const id = parseInt(req.params.id);
    const user = await UserServices.getUserById(id);
    if (!user) {
      res.status(404).json({ error: 'User not found' });
    }
    res.json(user);
  }

  static async LoginUser(req: Request, res: Response) {
    const { email, password } = validate(req.body, loginUserValidator);
    const { user, accessToken, refreshToken } = await UserServices.login(email, password);
    res.json({ data: { user: mapToUser(user), accessToken, refreshToken } });
  }

  static async RefreshToken(req: Request, res: Response) {
    const { refreshToken } = req.body;
    const tokens = await UserServices.refreshToken(refreshToken);
    res.json({ data: tokens });
  }

  static async LogoutUser(req: Request, res: Response) {
    const userId = (req as any).user.id;
    await UserServices.logout(userId);
    res.json({ message: 'Logged out successfully' });
  }

  static async createUser(req: Request, res: Response) {

      const data = validate(req.body, userInputValidator);
      const newUser = await UserServices.createUser(data);
      res.status(201).json(validate({ data: mapToUser(newUser) }, userResponseValidator));

  }

  static async publicCreateUser(req: Request, res: Response) {

    const data = validate(req.body, userInputValidator);
    const newUser = await UserServices.publicUserCreate(data);
    res.status(201).json(validate({ data: mapToUser(newUser) }, userResponseValidator));

}


  static async updateUser(req: Request, res: Response) {
    const id = parseInt(req.params.id);
    const data = validate(req.body, userInputValidator);
    const UpdatedUser = await UserServices.updateUser(id,data);
    if (!UpdatedUser) {
      res.status(404).json({ error: 'User not found' });
    }
    res.json(validate({ data: mapToUser(UpdatedUser) }, userResponseValidator));
  }
  static async deleteUser(req: Request, res: Response) {
    const id = parseInt(req.params.id);
    await UserServices.deleteUser(id);
    res.status(204).send();
  }

}
