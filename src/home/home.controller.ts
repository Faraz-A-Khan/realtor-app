import { Controller, Delete, Get, Post, Put } from '@nestjs/common';
import { HomeService } from './home.service';
import { HomeResponseDto } from './dto/home.dto';

@Controller('home')
export class HomeController {
  constructor(private readonly homeService: HomeService) { }
  @Get()
  async getHomes(): Promise<HomeResponseDto[]> {
    return await this.homeService.getHomes();
  }

  @Get(':id')
  getHome() {
    return {
      message: 'Home details',
      status: 'success',
      data: {
        id: 1,
        name: 'Sample Home',
        description: 'This is a sample home description.',
      },
    };
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
