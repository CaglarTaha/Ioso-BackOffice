// src/services/user.service.ts
import config from '../core/config';
import { AppDataSource } from '../core/data-source';
import * as bcrypt from 'bcrypt';
import * as jwt from 'jsonwebtoken';
import { User } from '../entity/user.entity';
import { Role } from '../entity/role.entity';


export class UserServices {
  static async getAllUsers(): Promise<User[]> {
    return AppDataSource.manager.find(User, { relations: ['role'] });
  }

  static async getUsersByRole(roleId: number): Promise<User[]> {
    return AppDataSource.manager.find(User, { 
      where: { roleId, active: true },
      relations: ['role']
    });
  }

  static async getUserWithTokenById(id: number): Promise<{ user: User; token: string } | undefined> {
    const user = await AppDataSource.manager.findOne(User, { where: { id } });

    if (!user) {
      throw new Error('User not found');
    }

    const tokenPayload = {
      id: user.id,
      email: user.email,
      type: user.role.name,
    };

    const token = jwt.sign(tokenPayload, config.jwt.key, { expiresIn: '1h' });

    return {user, token };
  }

  static async getUserById(id: number): Promise<User | undefined> {
    return AppDataSource.manager.findOne(User, { where: { id } });
  }

  static async createUser(userData: Partial<User>): Promise<User> {
    console.log('Creating user with data:', userData);
    
    return await AppDataSource.transaction(async manager => {
      // Email kontrolü - duplicate kontrolü önceden yap
      const existingUser = await manager.findOne(User, {
        where: { email: userData.email }
      });
      
      if (existingUser) {
        const error = new Error('Bu email adresi ile kayıtlı kullanıcı zaten mevcut.') as any;
        error.statusCode = 409;
        throw error;
      }
      
      const role = await manager.findOne(Role, {where: {id: userData.roleId}}); // roleId ile rolü bul
      if (!role) {
          const error = new Error('Belirtilen roleId ile eşleşen rol bulunamadı.') as any;
          error.statusCode = 404;
          throw error;
      }
      
      console.log('Found role:', role);

      const newUser = manager.create(User, {
          firstName: userData.firstName,
          lastName: userData.lastName,
          email: userData.email,
          password: userData.password,
          roleId: userData.roleId,
          role: role
      });
      
      console.log('Created user object:', newUser);

      const savedUser = await manager.save(newUser);
      console.log('Saved user:', savedUser);
      
      return savedUser;
    });
}



static async publicUserCreate(userData: Partial<User>): Promise<User> {
  console.log('Creating public user with data:', userData);
  
  return await AppDataSource.transaction(async manager => {
    // Email kontrolü - duplicate kontrolü önceden yap
    const existingUser = await manager.findOne(User, {
      where: { email: userData.email }
    });
    
    if (existingUser) {
      const error = new Error('Bu email adresi ile kayıtlı kullanıcı zaten mevcut.') as any;
      error.statusCode = 409;
      throw error;
    }
    
    const role = await manager.findOne(Role, {where: {id: userData.roleId}}); // roleId ile rolü bul
    if (!role) {
        const error = new Error('Belirtilen roleId ile eşleşen rol bulunamadı.') as any;
        error.statusCode = 404;
        throw error;
    }
    
    console.log('Found role:', role);

    const newUser = manager.create(User, {
        firstName: userData.firstName,
        lastName: userData.lastName,
        email: userData.email,
        password: userData.password,
        roleId: userData.roleId,
        role: role
    });
    
    console.log('Created public user object:', newUser);

    const savedUser = await manager.save(newUser);
    console.log('Saved public user:', savedUser);
    
    return savedUser;
  });
}

  static async updateUser(id: number, updatedData: Partial<User>): Promise<User | undefined> {
    await AppDataSource.manager.update(User, id, updatedData);
    return AppDataSource.manager.findOne(User, { where: { id } });
  }

  static async deleteUser(id: number): Promise<void> {
    await AppDataSource.manager.delete(User, id);
  }

  static async deactivateUser(id: number): Promise<User | undefined> {
    const user = await AppDataSource.manager.findOne(User, { where: { id } });

    if (user) {
      user.active = false;
      await AppDataSource.manager.save(user);
    }
    return user;
  }

  static async login(email: string, password: string): Promise<{ user: User; accessToken: string; refreshToken: string }> {
    const user = await AppDataSource.manager.findOne(User, { where: { email }, relations: ['role']});

    if (!user) {
      const error = new Error('Invalid email or password') as any;
      error.statusCode = 401;
      throw error;
    }

    const isPasswordValid = await bcrypt.compare(password, user.password);

    if (!isPasswordValid) {
      const error = new Error('Invalid email or password') as any;
      error.statusCode = 401;
      throw error;
    }

    const tokenPayload = {
      id: user.id,
      email: user.email,
      type: user.role.name,
    };

    const accessToken = jwt.sign(tokenPayload, config.jwt.key, { expiresIn: '1h' });
    const refreshToken = jwt.sign({ id: user.id }, config.jwt.key, { expiresIn: '7d' });

    // Save refresh token to user
    user.refreshToken = refreshToken;
    await AppDataSource.manager.save(user);

    return { user, accessToken, refreshToken };
  }

  static async refreshToken(refreshToken: string): Promise<{ accessToken: string; refreshToken: string }> {
    try {
      const decoded = jwt.verify(refreshToken, config.jwt.key) as { id: number };
      const user = await AppDataSource.manager.findOne(User, { 
        where: { id: decoded.id, refreshToken }, 
        relations: ['role'] 
      });

      if (!user) {
        const error = new Error('Invalid refresh token') as any;
        error.statusCode = 401;
        throw error;
      }

      const tokenPayload = {
        id: user.id,
        email: user.email,
        type: user.role.name,
      };

      const newAccessToken = jwt.sign(tokenPayload, config.jwt.key, { expiresIn: '1h' });
      const newRefreshToken = jwt.sign({ id: user.id }, config.jwt.key, { expiresIn: '7d' });

      // Update refresh token
      user.refreshToken = newRefreshToken;
      await AppDataSource.manager.save(user);

      return { accessToken: newAccessToken, refreshToken: newRefreshToken };
    } catch (error) {
      const err = new Error('Invalid refresh token') as any;
      err.statusCode = 401;
      throw err;
    }
  }

  static async logout(userId: number): Promise<void> {
    await AppDataSource.manager.update(User, userId, { refreshToken: null });
  }
}
