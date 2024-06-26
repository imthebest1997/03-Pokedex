import { BadRequestException, Injectable, InternalServerErrorException, NotFoundException, Query } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { InjectModel } from '@nestjs/mongoose';
import { CreatePokemonDto } from './dto/create-pokemon.dto';
import { UpdatePokemonDto } from './dto/update-pokemon.dto';
import { Model, isValidObjectId } from 'mongoose';
import { Pokemon } from './entities/pokemon.entity';
import { PaginationDto } from '../dto/pagination.dto';

@Injectable()
export class PokemonService {

  private defaultLimit: number;

  constructor(
    @InjectModel( Pokemon.name )
    private readonly pokemonModel: Model<Pokemon>,
    private readonly configService: ConfigService
  ) {
    this.defaultLimit = this.configService.get<number>('defaultLimit');
    console.log({ defaultLimit: this.configService.get<number>('defaultLimit') })
  }

  async create(createPokemonDto: CreatePokemonDto) {
    createPokemonDto.name = createPokemonDto.name.toLocaleLowerCase();
    try {
      const pokemon = await this.pokemonModel.create(createPokemonDto);
      return pokemon;        
    } catch (error) {
      this.handleExceptions( error );
    }
  }

  async findAll(paginationDto: PaginationDto){
    try {
      const { limit = this.defaultLimit, offset = 0 } = paginationDto;

      return await this.pokemonModel.find()
        .limit( limit )
        .skip( offset )
        .sort({ 
          no: 1 
        })
        .select('-__v');
    } catch (error) {
      throw new InternalServerErrorException(`Can't find pokemons - Check the logs`);      
    }
  }

  async findOne(term: string) {
    try {
      let pokemon: Pokemon;

      // Buscar por número
      if ( !isNaN( +term ) ) {
        pokemon = await this.pokemonModel.findOne({ no: term });
      } 

      // Buscar por MongoID si no se encontró por número
      if ( !pokemon && isValidObjectId( term ) ){
        pokemon = await this.pokemonModel.findById( term );
      }

      // Buscar por nombre si no se encontró por número ni por MongoID
      if( !pokemon ) {
        term = term.toLocaleLowerCase();
        pokemon = await this.pokemonModel.findOne({ name: term });
      }

      // Lanzar una excepción si no se encontró ningún Pokémon
      if( !pokemon ){
        throw new NotFoundException(`Pokemon with id, name or no "${term}" not found`);
      }
      
      return pokemon;      
    } catch (error) {

      if (error instanceof NotFoundException) {
        throw error;
      }

      // Lanzar una excepción genérica en caso de error
      throw new InternalServerErrorException(`Can't find pokemon - Check the logs`);      
    }
  }
  
  async update(term: string, updatePokemonDto: UpdatePokemonDto) {
    try {
      const pokemon = await this.findOne( term );

      if( updatePokemonDto.name ){
        updatePokemonDto.name = updatePokemonDto.name.toLocaleLowerCase();        
      }

      await pokemon.updateOne( updatePokemonDto );

      return {...pokemon.toJSON(), ...updatePokemonDto};      
    } catch (error) {
      this.handleExceptions( error );
    }
  }

  async remove(id: string) {
    try {
      // const pokemon = await this.findOne( id );
      // await pokemon.deleteOne();

      // const res = await this.pokemonModel.findByIdAndDelete( id );
      const { deletedCount  } = await this.pokemonModel.deleteOne({ _id: id });

      if( deletedCount === 0 ){
        throw new BadRequestException(`Pokemon with id "${id}" not found`);
      }

      return { deletedCount };
    } catch (error) {
      console.log(error);
      this.handleExceptions( error );
    }
  }

  private handleExceptions( error: any ){
    console.log(error);
    if (error.code === 11000) {
      throw new BadRequestException(`Other pokemon exists in db with ${ JSON.stringify( error.keyValue ) }.`);
    }     
    
    if (error instanceof BadRequestException) {
      throw error;
    }

    if( error instanceof NotFoundException ){
      throw error;    
    }

    throw new InternalServerErrorException(`Can't create/update pokemon with term (id, name or no) - Check the logs`);
  }

}
