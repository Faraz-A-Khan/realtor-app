import { Controller, Delete, Get, Post, Put } from '@nestjs/common';

@Controller('home')
export class HomeController {
  @Get()
  getHomes() {
    return {
      message: 'Welcome to the Home Page',
      status: 'success',
    };
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
