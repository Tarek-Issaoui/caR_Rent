import { Body, Controller, HttpCode, HttpStatus, Post, UseGuards } from '@nestjs/common';
import { CreateUserDto } from 'src/users/dto/create-user.dto';
import { AuthService } from './auth.service';
import { AuthDto } from './dto/auth.dto';
import { AuthEntity } from './entity/auth.entity';
import { RtAuthGuard } from './guards/rt-auth.guard';
import { GetCurrentUser } from './decorator/get-curr-user.decorator';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { Public } from './decorator/public.decorator';
import { CreateAgencyDto } from 'src/agencies/dto/create-agency.dto';
@Controller('auth')
@ApiTags('auth')
export class AuthController {
  constructor(private  authService: AuthService ) {}
  @Public()
  @HttpCode(HttpStatus.CREATED)
  @Post('local/registerUser')
  async registerUser(@Body() createUserDto:CreateUserDto):Promise<AuthEntity>{
    return  await this.authService.registerUser(createUserDto);
  }


  @Public()
  @HttpCode(HttpStatus.CREATED)
  @Post('local/registerAgency')
  async registerAgency(@Body() createAgencyDto:CreateAgencyDto):Promise<AuthEntity>{
    return  await this.authService.registerAgency(createAgencyDto);
  }

  @Public()
  @Post('local/loginUser')
  @HttpCode(HttpStatus.OK)
  async logIn(@Body() dto: AuthDto):Promise<AuthEntity> {
    return await this.authService.logInUser(dto.email, dto.password);
  }


  @Public()
  @Post('local/loginAgency')
  @HttpCode(HttpStatus.OK)
  async logInAgency(@Body() dto: AuthDto):Promise<AuthEntity> {
    return await this.authService.logInAgency(dto.email, dto.password);
  }


  @Post('logoutUser')
  @ApiBearerAuth()
  @HttpCode(HttpStatus.OK)
  async logoutUser(@GetCurrentUser('sub') id:string){
    return await this.authService.logoutUser(id)
  }

  @Post('logoutAgency')
  @ApiBearerAuth()
  @HttpCode(HttpStatus.OK)
  async logoutAgency(@GetCurrentUser('sub') id:string){
    return await this.authService.logoutAgency(id)
  }




  @Public()
  @Post('refreshUserToken')
  @UseGuards(RtAuthGuard)
  @ApiBearerAuth()
  @HttpCode(HttpStatus.OK)
  async refreshUserToken(@GetCurrentUser('sub') userId:string,@GetCurrentUser('refreshToken') rt:string){
    return await this.authService.refreshUserToken(userId,rt)
  }


  @Public()
  @Post('refreshAgencyToken')
  @UseGuards(RtAuthGuard)
  @ApiBearerAuth()
  @HttpCode(HttpStatus.OK)
  async refreshAgencyToken(@GetCurrentUser('sub') agencyId:string,@GetCurrentUser('refreshToken') rt:string){
    return await this.authService.refreshAgencyToken(agencyId,rt)
  }
}