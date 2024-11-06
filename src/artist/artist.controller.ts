import {
  Controller,
  Get,
  Post,
  Put,
  Delete,
  Param,
  Body,
  HttpException,
  HttpStatus,
  UseGuards,
} from '@nestjs/common';
import { ArtistService } from './artist.service';
import { CreateArtistDto } from './dto/create-artist.dto';
import { UpdateArtistDto } from './dto/update-artist.dto';
import { UuidGuard } from '../utils/uuid.guard';

@Controller('artist')
export class ArtistController {
  constructor(private readonly artistService: ArtistService) {}

  @Get()
  getAllArtists() {
    return this.artistService.findAll();
  }

  @Get(':id')
  @UseGuards(UuidGuard)
  async getArtistById(@Param('id') id: string) {
    const artist = await this.artistService.findById(id);
    if (!artist) {
      throw new HttpException('Artist not found', HttpStatus.NOT_FOUND);
    }
    return artist;
  }

  @Post()
  async createArtist(@Body() createArtistDto: CreateArtistDto) {
    if (!createArtistDto.name || createArtistDto.grammy === undefined) {
      throw new HttpException(
        'Name and grammy fields are required',
        HttpStatus.BAD_REQUEST,
      );
    }
    return this.artistService.create(createArtistDto);
  }

  @Put(':id')
  @UseGuards(UuidGuard)
  async updateArtist(
    @Param('id') id: string,
    @Body() updateArtistDto: UpdateArtistDto,
  ) {
    const artist = await this.artistService.update(id, updateArtistDto);
    if (!artist) {
      throw new HttpException('Artist not found', HttpStatus.NOT_FOUND);
    }
    return artist;
  }

  @Delete(':id')
  @UseGuards(UuidGuard)
  async deleteArtist(@Param('id') id: string) {
    const isDeleted = await this.artistService.delete(id);
    if (!isDeleted) {
      throw new HttpException('Artist not found', HttpStatus.NOT_FOUND);
    }
    return { status: 204, message: 'Artist deleted successfully' };
  }
}
