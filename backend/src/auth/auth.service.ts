import { Injectable, UnauthorizedException, NotFoundException, ConflictException, ForbiddenException } from '@nestjs/common';
import * as bcrypt from 'bcrypt';
import { JwtService } from '@nestjs/jwt';
import { AuthEntity } from './entity/auth.entity';
import { CreateUserDto } from 'src/users/dto/create-user.dto';
import { PrismaService } from 'src/prisma/prisma.service';

@Injectable()
export class AuthService {
  constructor(private prisma:PrismaService,private jwtService: JwtService) {}

  async updateRtHash(userId:string,rt:string){
    const hash = await bcrypt.hash(rt,10);
    await this.prisma.user.update({
      where:{
        id:userId
      },
      data:{
        refreshTokens:hash
      }
    })
  }

  
  async getToken(userId:string ,email: string){
    const [at,rt]=await Promise.all([
      this.jwtService.signAsync({ sub: userId, email: email }, {secret:process.env.jwt_secret,expiresIn:'15m'}),
      this.jwtService.signAsync({ sub: userId, email: email }, {secret:process.env.rt_secret,expiresIn:'7d'})
    ])
    return {accessToken:at,refreshToken:rt}
  }
  async logIn(email: string, pass: string) : Promise<AuthEntity>{
    const user = await this.prisma.user.findUnique({
      where:{
        email
      }
    });
    if (!user) throw new NotFoundException(`No user found for email: ${email}`);
    const isPasswordValid = await bcrypt.compare(pass, user.password);
    if (!isPasswordValid) throw new UnauthorizedException('Invalid password');
    const tokens= await this.getToken(user.id,user.email)
    await this.updateRtHash(user.id,tokens.refreshToken);
    return tokens;
  }

  async register(createUserDto: CreateUserDto):Promise<AuthEntity>{
    const existingUser = await this.prisma.user.findUnique({
      where:{ email :createUserDto.email}
    });
    if (existingUser) {
      throw new ConflictException('Email already registered');
    }
    const hashedPassword = await bcrypt.hash(createUserDto.password, 10);
    createUserDto.password = hashedPassword
  
    const newUser=await this.prisma.user.create({
      data:{
        ...createUserDto,
        password:hashedPassword,
        dateOfBirth:new Date(createUserDto.dateOfBirth),
        driverLicenseExpiry:new Date(createUserDto.driverLicenseExpiry)
      }
    })
    const tokens=await this.getToken(newUser.id,newUser.email);
    await this.updateRtHash(newUser.id,tokens.refreshToken);
    return tokens;
  }
  
 
  async logout(userId:string){
    console.log(userId);
    
    await this.prisma.user.updateMany({
      where:{
        id:userId,
        refreshTokens:{
          not:null
        }
      },
      data:{
        refreshTokens:null
      }
    })
  }

  async refresh(userId:string, rt :string){
    const user = await this.prisma.user.findUnique({
      where:{
        id:userId
      }
      })
    if(!user) throw new ForbiddenException('User not found');
    const rtMatches = await bcrypt.compare(rt,user.refreshTokens);
    if(!rtMatches) throw new ForbiddenException('Invalid refresh token');
    const tokens = await this.getToken(user.id,user.email);
    await this.updateRtHash(user.id,tokens.refreshToken);
    return tokens;
  }
}
