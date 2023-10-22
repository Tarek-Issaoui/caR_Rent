import { ApiProperty } from "@nestjs/swagger"

export class CreateAgencyDto {
    @ApiProperty()  
    name               :string
    @ApiProperty()
    address            :string
    @ApiProperty()
    city               :string
    @ApiProperty()
    state              :string
    @ApiProperty()
    zipCode            :string
    @ApiProperty()
    phone              :string
    @ApiProperty()
    email              :string
    @ApiProperty()
    password           :string
    @ApiProperty()
    website            :string
    @ApiProperty()
    businessHours      :string
    @ApiProperty()
    rentalPolicies     :string
    @ApiProperty()
    numberOfCars       :number
    @ApiProperty()
    specialOffers      :string
    @ApiProperty()
    images             :string[]
}
