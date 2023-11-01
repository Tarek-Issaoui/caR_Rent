import { Controller, Get, Post, Body, Patch, Param, Delete } from '@nestjs/common';
import { CarsService } from './cars.service';
import { CreateCarDto } from './dto/create-car.dto';
import { UpdateCarDto } from './dto/update-car.dto';
import { HttpCode, HttpStatus } from '@nestjs/common';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { GetCurrentUser } from 'src/auth/decorator/get-curr-user.decorator';
import { RolePath } from 'src/auth/decorator/roles.decorator';
@Controller('cars')
@ApiTags('cars')
export class CarsController {
  constructor(private readonly carsService: CarsService) {}
  @Post()
  @ApiBearerAuth()

  @HttpCode(HttpStatus.CREATED)
  async create(@Body() createCarDto: CreateCarDto,@GetCurrentUser('sub') id:string) {
    return await this.carsService.create(createCarDto,id);
  }

  @Get()
  @RolePath(["AGENCY"])
  @ApiBearerAuth()
  @HttpCode(HttpStatus.OK)
  findAll() {
    return this.carsService.findAll();
  }

  @Get(':id')
  @ApiBearerAuth()
  @HttpCode(HttpStatus.OK)
  findOne(@Param('id') id: string) {
    return this.carsService.findOne(id);
  }

  @Patch(':id')
  @ApiBearerAuth()
  update(@Param('id') id: string, @Body() updateCarDto: UpdateCarDto ,@GetCurrentUser('sub') idAgency:string) {
    return this.carsService.update(id, updateCarDto,idAgency);
  }

  @Delete(':id')
  @ApiBearerAuth()
  remove(@Param('id') id: string,@GetCurrentUser('sub') idAgency:string) {
    return this.carsService.remove(id,idAgency);
  }
}
