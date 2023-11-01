import { ApiProperty } from "@nestjs/swagger"

export class CreateCarDto {
    @ApiProperty()
    make               :string
    @ApiProperty()
    model              :string
    @ApiProperty()
    year               :number
    @ApiProperty()
    registrationNumber :string
    @ApiProperty()
    color              :string
    @ApiProperty()
    mileage            :number
    @ApiProperty()
    vin                :string
    @ApiProperty()
    fuelType           :string
    @ApiProperty()
    transmissionType   :string
    @ApiProperty()
    seatingCapacity    :number
    @ApiProperty()
    engineType         :string
    @ApiProperty()
    features           :string[]
    @ApiProperty()
    imageUrls          :string[]
    @ApiProperty()
    dailyRate          :number
    @ApiProperty()
    isAvailable        :boolean
    @ApiProperty()
    availableFrom      :string
    @ApiProperty()
    lastServiceDate    :string
    @ApiProperty()
    maintenanceHistory :string
    @ApiProperty()
    averageRating      :number
    @ApiProperty()
    agencyId            :string
    @ApiProperty()
    location            :string
}
