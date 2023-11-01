import { Injectable, UnauthorizedException, NotFoundException, ConflictException, ForbiddenException } from '@nestjs/common';
import * as bcrypt from 'bcrypt';
import { JwtService } from '@nestjs/jwt';
import { AuthEntity } from './entity/auth.entity';
import { CreateUserDto } from 'src/users/dto/create-user.dto';
import { PrismaService } from 'src/prisma/prisma.service';
import { CreateAgencyDto } from 'src/agencies/dto/create-agency.dto';

@Injectable()
export class AuthService {
  constructor(private prisma:PrismaService,private jwtService: JwtService) {}

  async updateRtHashUser(userId:string,rt:string){
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

  async updateRtHashAgency(agencyId:string,rt:string){
    const hash = await bcrypt.hash(rt,10);
    await this.prisma.agency.update({
      where:{
        id:agencyId
      },
      data:{
        refreshTokens:hash
      }
    })
  }

  
  async getToken(userId:string ,email: string,role:string){
    const [at,rt]=await Promise.all([
      this.jwtService.signAsync({ sub: userId, email: email ,role:role}, {secret:process.env.jwt_secret,expiresIn:'15m'}),
      this.jwtService.signAsync({ sub: userId, email: email ,role:role}, {secret:process.env.rt_secret,expiresIn:'7d'})
    ])
    return {accessToken:at,refreshToken:rt}
  }
  async logInUser(email: string, pass: string) : Promise<AuthEntity>{
    const user = await this.prisma.user.findUnique({
      where:{
        email
      }
    });
    if (!user) throw new NotFoundException(`No user found for email: ${email}`);
    const isPasswordValid = await bcrypt.compare(pass, user.password);
    if (!isPasswordValid) throw new UnauthorizedException('Invalid password');
    const tokens= await this.getToken(user.id,user.email,"USER")
    await this.updateRtHashUser(user.id,tokens.refreshToken);
    return tokens;
  }
  async logInAgency(email: string, pass: string) : Promise<AuthEntity>{
    const agency = await this.prisma.agency.findUnique({
      where:{
        email
      }
    });
    if (!agency) throw new NotFoundException(`No agency found for email: ${email}`);
    const isPasswordValid = await bcrypt.compare(pass, agency.password);
    if (!isPasswordValid) throw new UnauthorizedException('Invalid password');
    const tokens= await this.getToken(agency.id,agency.email,"AGENCY")
    await this.updateRtHashAgency(agency.id,tokens.refreshToken);
    return tokens;
  }


  async registerUser(createUserDto: CreateUserDto ):Promise<AuthEntity>{
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
    const tokens=await this.getToken(newUser.id,newUser.email,"USER");
    await this.updateRtHashUser(newUser.id,tokens.refreshToken);
    return tokens;
  }
  
  async registerAgency(createAgencyDto :CreateAgencyDto):Promise<AuthEntity>{
    const existingAgency = await this.prisma.agency.findUnique({
      where:{ email :createAgencyDto.email}
    });
    if (existingAgency) {
      throw new ConflictException('Email already registered');
    }
    const hashedPassword = await bcrypt.hash(createAgencyDto.password, 10);
    createAgencyDto.password = hashedPassword
  
    const newAgency=await this.prisma.agency.create({
      data:{
        ...createAgencyDto,
        password:hashedPassword
      }
    })
    const tokens=await this.getToken(newAgency.id,newAgency.email,"AGENCY");
    await this.updateRtHashAgency(newAgency.id,tokens.refreshToken);
    return tokens;
  }


  async logoutUser(userId:string){
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


  async logoutAgency(agencyId:string){
    await this.prisma.agency.updateMany({
      where:{
        id:agencyId,
        refreshTokens:{
          not:null
        }
      },
      data:{
        refreshTokens:null
      }
    })
  }
  async refreshUserToken(userId:string, rt :string){
    const user = await this.prisma.user.findUnique({
      where:{
        id:userId
      }
      })
    if(!user) throw new ForbiddenException('User not found');
    const rtMatches = await bcrypt.compare(rt,user.refreshTokens);
    if(!rtMatches) throw new ForbiddenException('Invalid refresh token');
    const tokens = await this.getToken(user.id,user.email,"USER");
    await this.updateRtHashUser(user.id,tokens.refreshToken);
    return tokens;
  }


  async refreshAgencyToken(agencyId:string, rt :string){
    const agency = await this.prisma.agency.findUnique({
      where:{
        id:agencyId
      }
      })
    if(!agency) throw new ForbiddenException('Agency not found');
    const rtMatches = await bcrypt.compare(rt,agency.refreshTokens);
    if(!rtMatches) throw new ForbiddenException('Invalid refresh token');
    const tokens = await this.getToken(agency.id,agency.email,"AGENCY");
    await this.updateRtHashAgency(agency.id,tokens.refreshToken);
    return tokens;
  }
}
