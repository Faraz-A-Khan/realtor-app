import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { HomeResponseDto } from './dto/home.dto';
import { PropertyType } from 'generated/prisma';

interface GetHomeParams {
  city?: string;
  price?: {
    gte?: number;
    lte?: number;
  };
  propertyType?: PropertyType;
}
@Injectable()
export class HomeService {
  constructor(private readonly prismaService: PrismaService) { }
  
  async getHomes(filters: GetHomeParams): Promise<HomeResponseDto[]> {
    const homes = await this.prismaService.home.findMany({
      select: {
        id: true,
        address: true,
        city: true,
        price: true,
        propertyType: true,
        number_of_bedrooms: true,
        number_of_bathrooms: true,
        listed_date: true,
        land_size: true,
        images: {
          select: {
            url: true,
          },
          take: 1 // Fetch only the first image
        }
      },
      where: filters
    });

    if(!homes.length) {
      throw new NotFoundException('No homes found with the provided filters');
    }
    return homes.map(home => {
      const fetchHome = { ...home, image: home.images[0].url };
      delete (fetchHome as Partial<typeof fetchHome>).images;
      return new HomeResponseDto(fetchHome)
    });
  }

  async getHomeById(id: number): Promise<HomeResponseDto> {
    const home = await this.prismaService.home.findUnique({
      where: { id },
      select: {
        id: true,
        address: true,
        city: true,
        price: true,
        propertyType: true,
        number_of_bedrooms: true,
        number_of_bathrooms: true,
        listed_date: true,
        land_size: true,
        images: {
          select: {
            url: true,
          }
        }
      }
    });

    if (!home) {
      throw new NotFoundException(`Home with ID ${id} not found`);
    }
    return new HomeResponseDto(home);
  }
}
