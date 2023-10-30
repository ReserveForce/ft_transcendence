import {
  BadRequestException,
  HttpException,
  HttpStatus,
  Injectable,
} from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';

@Injectable()
export class UsersService {
  constructor(private prisma: PrismaService) {}

  async getUsers() {
    try {
      return await this.prisma.users.findMany();
    } catch (error) {
      console.error(error);
      throw new BadRequestException('유저 불러오기 실패');
    }
  }

  async getUser(id: number) {
    try {
      const user = await this.prisma.users.findUnique({ where: { id: id } });
      if (!user) throw new BadRequestException(`해당 유저 없음`);
      return user;
    } catch (error) {
      console.error(error);
      throw error;
    }
  }

  async getUserByName(name: string) {
    try {
      name = name.trim().replace(/\s+/g, '');
      const user = await this.prisma.users.findUnique({
        where: { name: name },
      });
      if (!user) throw new BadRequestException(`해당 유저 없음`);
      return user;
    } catch (error) {
      console.error(error);
      throw error;
    }
  }

  async createUser(userData: CreateUserDto) {
    try {
      return await this.prisma.users.create({
        data: userData,
      });
    } catch (error) {
      console.error(error);
      throw new BadRequestException('유저 생성 실패');
    }
  }

  async updateUser(id: number, userData: UpdateUserDto) {
    try {
      if (userData.name) {
        let editedName = userData.name;
        userData.name = editedName.trim().replace(/\s+/g, '');
      }
      return await this.prisma.users.update({
        where: { id: id },
        data: userData,
      });
    } catch (error) {
      console.error(error);
      throw new BadRequestException(`유저 정보 수정 실패`);
    }
  }

  async deleteUser(id: number) {
    try {
      return await this.prisma.users.delete({ where: { id: id } });
    } catch (error) {
      console.error(error);
      throw new BadRequestException(`유저 삭제 실패`);
    }
  }
}
