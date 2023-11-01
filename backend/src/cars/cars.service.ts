import { Injectable } from '@nestjs/common';
import { CreateCarDto } from './dto/create-car.dto';
import { UpdateCarDto } from './dto/update-car.dto';
import { PrismaService } from 'src/prisma/prisma.service';

@Injectable()
export class CarsService {
  constructor(private readonly prisma:PrismaService){}

  async create(createCarDto: CreateCarDto ,id:string) {
    return await this.prisma.car.create({
      data:{
        ...createCarDto,
        agencyId:id
      }
    });
  }

  async findAll() {
    return await this.prisma.car.findMany();
  }

  async findOne(id: string) {
    return await this.prisma.car.findUnique({
      where:{
        id
      }
    });
  }

  async update(id: string, updateCarDto: UpdateCarDto,idAgency:string) {
    return await this.prisma.car.update({
      where :{
        id:id,
        agencyId:idAgency
      },
      data :{
        ...updateCarDto
      }
    });
  }

  async remove(id: string,idAgency:string) {
    return await this.prisma.car.delete({
      where :{id,agencyId:idAgency}
    });
  }
}
