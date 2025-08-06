import { Role } from '../entity/role.entity';
import { AppDataSource } from '../core/data-source';

export class RoleService {

    static async getAllRoles(): Promise<Role[]> {
        const RoleRepo = AppDataSource.manager.getRepository(Role); // AppDataSource.manager.getRepository kullan
        return await RoleRepo.find();
      }
      
  static async createRole(name: string): Promise<Role> {
    return await AppDataSource.transaction(async manager => {
      // İsmi formatla (baş harf büyük, diğerleri küçük)
      const formattedName = name.charAt(0).toUpperCase() + name.slice(1).toLowerCase();
      
      // Aynı isimde rol var mı kontrol et
      const existingRole = await manager.findOne(Role, {
        where: { name: formattedName }
      });
      
      if (existingRole) {
        const error = new Error('Bu isimde bir rol zaten mevcut.') as any;
        error.statusCode = 409;
        throw error;
      }
      
      const newRole = manager.create(Role, { name: formattedName });
      return await manager.save(newRole);
    });
  }

  static async getRoleById(id: number): Promise<Role | undefined> {
        return AppDataSource.manager.findOne(Role, { where: { id } });
      }


  static async updateRole(id: number, updatedData: Partial<Role>): Promise<Role | undefined> {
    return await AppDataSource.transaction(async manager => {
      // Eğer name güncelleniyorsa, duplicate kontrolü yap
      if (updatedData.name) {
        const formattedName = updatedData.name.charAt(0).toUpperCase() + updatedData.name.slice(1).toLowerCase();
        
        const existingRole = await manager.findOne(Role, {
          where: { name: formattedName }
        });
        
        // Eğer aynı isimde başka bir rol varsa ve güncellenmeye çalışılan rol değilse hata ver
        if (existingRole && existingRole.id !== id) {
          const error = new Error('Bu isimde bir rol zaten mevcut.') as any;
          error.statusCode = 409;
          throw error;
        }
        
        updatedData.name = formattedName;
      }
      
      await manager.update(Role, id, updatedData);
      return await manager.findOne(Role, { where: { id } });
    });
  }
  
  static async deleteRole(id: number): Promise<void> {
    const roleRepository = AppDataSource.manager.getRepository(Role);
    await roleRepository.delete(id);
  }
}
