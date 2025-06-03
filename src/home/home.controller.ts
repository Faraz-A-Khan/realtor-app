import { Controller, Delete, Get, Param, ParseIntPipe, Post, Put, Query } from '@nestjs/common';
import { HomeService } from './home.service';
import { HomeResponseDto } from './dto/home.dto';
import { PropertyType } from 'generated/prisma';

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
  createHome() {
    return {
      message: 'Home created successfully',
      status: 'success',
      data: {
        id: 1,
        name: 'New Home',
        description: 'This is a new home description.',
      },
    };
  }
  @Put(':id')
  updateHome() {
    return {
      message: 'Home updated successfully',
      status: 'success',
      data: {
        id: 1,
        name: 'Updated Home',
        description: 'This is an updated home description.',
      },
    };
  }
  @Delete(':id')
  deleteHome() {
    return {
      message: 'Home deleted successfully',
      status: 'success',
    };
  }
}
