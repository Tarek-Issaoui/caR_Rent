import { Body, Controller, HttpCode, HttpStatus, Post, Request, UseGuards } from '@nestjs/common';
import { CreateUserDto } from 'src/users/dto/create-user.dto';
import { AuthService } from './auth.service';
import { AuthDto } from './dto/auth.dto';
import { AuthEntity } from './entity/auth.entity';
import { RtAuthGuard } from './guards/rt-auth.guard';
import { GetCurrentUser } from './decorator/get-curr-user.decorator';
import { ApiBearerAuth } from '@nestjs/swagger';
import { Public } from './decorator/public.decorator';
@Controller('auth')
export class AuthController {
  constructor(private  authService: AuthService ) {}
  @Public()
  @HttpCode(HttpStatus.CREATED)
  @Post('local/register')
  async registerUser(@Body() createUserDto:CreateUserDto):Promise<AuthEntity>{
    return  await this.authService.register(createUserDto);
  }

  @Public()
  @Post('local/login')
  @HttpCode(HttpStatus.OK)
  async logIn(@Body() dto: AuthDto):Promise<AuthEntity> {
    return await this.authService.logIn(dto.email, dto.password);
  }

  @Post('logout')
  @ApiBearerAuth()
  @HttpCode(HttpStatus.OK)
  async logout(@GetCurrentUser('sub') userId:string){
    return await this.authService.logout(userId)
  }


  @Public()
  @Post('refresh')
  @UseGuards(RtAuthGuard)
  @ApiBearerAuth()
  @HttpCode(HttpStatus.OK)
  async refresh(@GetCurrentUser('sub') userId:string,@GetCurrentUser('refreshToken') rt:string){
    return await this.authService.refresh(userId,rt)
  }
}