import { Body, Controller, Delete, ForbiddenException, Get, Param, ParseIntPipe, Post, Put, Query, UnauthorizedException } from '@nestjs/common';
import { HomeService } from './home.service';
import { CreateHomeDto, HomeResponseDto, UpdateHomeDto } from './dto/home.dto';
import { PropertyType } from 'generated/prisma';
import { User, UserDetails } from 'src/user/decorators/user.decorator';
@Controller('home')
export class HomeController {
  constructor(private readonly homeService: HomeService) { }
  @Get()
  async getHomes(
    @Query('city') city?: string,
    @Query('minPrice') minPrice?: string,
    @Query('maxPrice') maxPrice?: string,
    @Query('propertyType') propertyType?: PropertyType
  ): Promise<HomeResponseDto[]> {

    const price = minPrice || maxPrice ? {
      ...(minPrice && { gte: parseFloat(minPrice) }),
      ...(maxPrice && { lte: parseFloat(maxPrice) }),
    } : undefined;

    const filters = {
      ...(city && { city }),
      ...(price && { price }),
      ...(propertyType && { propertyType }),
    }

    return await this.homeService.getHomes(filters);
  }

  @Get(':id')
  getHome(@Param('id', ParseIntPipe) id: number) {
    return this.homeService.getHomeById(id);
  }
  @Post()
  createHome(
    @Body() body: CreateHomeDto,
    @User() user: UserDetails
  ) {
    return this.homeService.createHome(body, user.id);
  }
  @Put(':id')
  async updateHome(
    @Param('id', ParseIntPipe) id: number,
    @Body() body: UpdateHomeDto,
    @User() user: UserDetails
  ) {

    const realtor = await this.homeService.getRealtorByHomeId(id);

    if (realtor.id !== user.id) {
      throw new UnauthorizedException("You do not have permission to update this resource");
    }
    return this.homeService.updateHomeById(id, body);
  }
  @Delete(':id')
  async deleteHome(
    @Param('id', ParseIntPipe) id: number,
    @User() user: UserDetails
  ) {
    const realtor = await this.homeService.getRealtorByHomeId(id);

    if (realtor.id !== user.id) {
      throw new UnauthorizedException("You do not have permission to update this resource");
    }
    return this.homeService.deleteHomeById(id);
  }
}
