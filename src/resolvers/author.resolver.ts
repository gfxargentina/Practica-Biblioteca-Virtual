import { Mutation, Resolver, Arg, InputType, Field, Query } from "type-graphql";
import { getRepository, Repository } from "typeorm";
import { Author } from "../entity/author.entity";

//Los InputType son para especificarle lo que hay que pasarle al mutation o query por argumento Arg
//input para crear 1 author
@InputType()
class AuthorInput {
  @Field()
  fullName!: string;
}

//id del author
@InputType()
class AuthorIdInput {
  @Field(() => Number)
  id!: number;
}

//input para actualizar 1 author
@InputType()
class AuthorUpdateInput {
  @Field(() => Number)
  // ! campo obligatorio
  id!: number;

  @Field()
  //? campo opcional
  fullName?: string;
}

@Resolver()
export class AuthorResolver {
  authorRepository: Repository<Author>;

  constructor() {
    this.authorRepository = getRepository(Author);
  }

  //Crear un author
  @Mutation(() => Author)
  async createAuthor(
    @Arg("input", () => AuthorInput) input: AuthorInput
  ): Promise<Author | undefined> {
    try {
      const createdAuthor = await this.authorRepository.insert({
        fullName: input.fullName,
      });
      const result = await this.authorRepository.findOne(
        createdAuthor.identifiers[0].id
      );
      return result;
    } catch (error) {
      console.error;
    }
  }

  //Query- devuelve todos los autores
  @Query(() => [Author])
  async getAllAuthors(): Promise<Author[]> {
    return await this.authorRepository.find();
  }

  //Query - devuelve 1 author por id
  @Query(() => Author)
  async getOneAuthor(
    @Arg("input", () => AuthorIdInput) input: AuthorIdInput
  ): Promise<Author | undefined> {
    try {
      const author = await this.authorRepository.findOne(input.id);
      if (!author) {
        const error = new Error();
        error.message = "El autor no existe";
        throw error;
      }
      return author;
    } catch (e) {
      //throw new Error(e);
      console.log("Verificar error");
    }
  }

  //Mutation - Actualizar un Author
  @Mutation(() => Author)
  async updateOneAuthor(
    @Arg("input", () => AuthorUpdateInput) input: AuthorUpdateInput
  ): Promise<Author | undefined> {
    //verifica si el author existe
    const authorExist = await this.authorRepository.findOne(input.id);
    if (!authorExist) {
      throw new Error("El autor no existe");
    }

    //actualiza el author
    const updatedAuthor = await this.authorRepository.save({
      id: input.id,
      fullName: input.fullName,
    });
    return await this.authorRepository.findOne(updatedAuthor.id);
  }

  //Mutation - Para eliminar un author
  @Mutation(() => Boolean)
  async deleteOneauthor(
    @Arg("input", () => AuthorIdInput) input: AuthorIdInput
  ): Promise<Boolean> {
    await this.authorRepository.delete(input.id);
    return true;
  }
}
