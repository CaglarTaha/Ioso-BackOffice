// src/seeds/role.seed.ts
import { DataSource } from 'typeorm';
import { Role } from '../entity/role.entity';

export async function seedRoles(dataSource: DataSource) {
  const roleRepo = dataSource.getRepository(Role);

  const count = await roleRepo.count();
  if (count === 0) {
    const defaultRole = roleRepo.create({ name: 'user' }); // formatName hook'u büyük harfi ayarlayacak
    await roleRepo.save(defaultRole);
    console.log('✅ Varsayılan rol oluşturuldu: User');
  } else {
    console.log('ℹ️ Rol zaten mevcut, seed atlanıyor.');
  }
}
