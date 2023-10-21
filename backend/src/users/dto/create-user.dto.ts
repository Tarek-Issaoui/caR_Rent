import { ApiProperty } from "@nestjs/swagger";

export class CreateUserDto {
    @ApiProperty()
    email:string
    @ApiProperty()
    password:string
    @ApiProperty()
    username :string
    @ApiProperty()
    creditCardInfo :string
    @ApiProperty()
    firstName :string
    @ApiProperty()
    lastName :string
    @ApiProperty()
    address :string
    @ApiProperty()
    phone :string
    @ApiProperty()
    dateOfBirth :string
    @ApiProperty()
    driverLicenseExpiry :string
    @ApiProperty()
    driverLicenseNumber :string
    
}
