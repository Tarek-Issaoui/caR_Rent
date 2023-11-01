import { ExecutionContext, createParamDecorator } from "@nestjs/common";

export const  GetCurrentUser =createParamDecorator((data :string | undefined ,context:ExecutionContext)=>{
    const request = context.switchToHttp().getRequest();
    if(!data){
        // console.log(request.user);
        
        return request.user;
    }
    return request.user[data];
}
)