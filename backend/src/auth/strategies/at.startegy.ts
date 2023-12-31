import { PassportStrategy } from "@nestjs/passport"
import { ExtractJwt, Strategy } from "passport-jwt"
import { Injectable } from "@nestjs/common"

type JwtPayload = {
    sub: string
    email: string
    role: string
}
@Injectable()
export class AtStrategy extends PassportStrategy(Strategy,'jwt'){
    constructor(){
        super({
            jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
            secretOrKey: process.env.jwt_secret
        })
    }
    async validate(payload: JwtPayload){
        // console.log(payload);
        
        return payload;
    }
    
}