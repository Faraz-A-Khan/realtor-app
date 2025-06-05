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
interface CreateHomeParams {
  address: string;
  city: string;
  price: number;
  propertyType: PropertyType;
  numberOfBedrooms: number;
  numberOfBathrooms: number;
  landSize: number;
  images: { url: string }[]
}
interface UpdateHomeParams {
  address?: string;
  city?: string;
  price?: number;
  propertyType?: PropertyType;
  numberOfBedrooms?: number;
  numberOfBathrooms?: number;
  landSize?: number;
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

    if (!homes.length) {
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

  async createHome({ address, city, price, propertyType, numberOfBathrooms, numberOfBedrooms, landSize, images }: CreateHomeParams, userId: number): Promise<HomeResponseDto> {
    const home = await this.prismaService.home.create({
      data: {
        address,
        city,
        price,
        propertyType,
        number_of_bedrooms: numberOfBedrooms,
        number_of_bathrooms: numberOfBathrooms,
        land_size: landSize,
        realtor_id: userId
      },
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
      }
    });

    const homeImages = images.map(image => {
      return {
        url: image.url,
        home_id: home.id
      };
    });
    await this.prismaService.image.createMany({
      data: homeImages
    });
    return new HomeResponseDto(home);
  }

  async updateHomeById(id: number, { address, city, price, propertyType, numberOfBathrooms, numberOfBedrooms, landSize }: UpdateHomeParams): Promise<HomeResponseDto> {

    const home = await this.prismaService.home.update({
      where: { id },
      data: {
        address,
        city,
        price,
        propertyType,
        number_of_bedrooms: numberOfBedrooms,
        number_of_bathrooms: numberOfBathrooms,
        land_size: landSize,
      }
    });

    return new HomeResponseDto(home);
  }

  async deleteHomeById(id: number): Promise<{ message: string; status: string, data: HomeResponseDto }> {
    const existingHome = await this.prismaService.home.findUnique({
      where: { id }
    });
    if (!existingHome) {
      throw new NotFoundException(`Home with ID ${id} not found`);
    }
    await this.prismaService.home.delete({
      where: { id }
    });
    return {
      message: `Home with ID: ${id} deleted successfully`,
      status: 'success',
      data: new HomeResponseDto(existingHome)
    };
  }

  async getRealtorByHomeId(id: number) {
    const home = await this.prismaService.home.findUnique({
      where: {
        id
      },
      select: {
        realtor: {
          select: {
            id: true,
            name: true,
            email: true,
            phone: true
          }
        }
      }
    });

    if (!home) {
      throw new NotFoundException(`No Realtor for Home ID ${id} exists`);
    }

    return home.realtor;
  }
}
