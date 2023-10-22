import { ConflictException, Injectable } from '@nestjs/common';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { PrismaService } from 'src/prisma/prisma.service';
import { AuthService } from 'src/auth/auth.service';
import * as bcrypt from 'bcrypt';
const salt=10
@Injectable()
export class UsersService {
  constructor(private readonly prisma:PrismaService ){}

  //register the use 
  // async create(createUserDto: CreateUserDto) {
  //   const existingUser = await this.prisma.user.findUnique({
  //     where:{ email :createUserDto.email}
  //   });
  //   if (existingUser) {
  //     throw new ConflictException('Email already registered');
  //   }
  //   const hashedPassword=await bcrypt.hash(createUserDto.password,salt);
  //   await this.prisma.user.create({
  //     data:{...createUserDto,password:hashedPassword}
  //   });
  //   //Auto-login the user after registration 
  //   return { message: 'User registered successfully' };
  // }

  async findAll() {
    return await this.prisma.user.findMany();
  }

  async findOne(id: string) {
    return await this.prisma.user.findUnique({
      where:{id}
    });
  }

  async update(id: string, updateUserDto: UpdateUserDto) {
    return await this.prisma.user.update({
      where:{id},
      data:updateUserDto
    });
  }
  
  async remove(id: string) {
    return await this.prisma.user.delete({
      where:{id}
    });
  }

  // async findByEmail(email:string){
  //   return await this.prisma.user.findUnique({
  //     where:{email}
  //   })
  // }
}
