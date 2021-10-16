import {
  Mutation,
  Resolver,
  Arg,
  InputType,
  Field,
  Query,
  UseMiddleware,
  Ctx,
} from "type-graphql";
import { getRepository, Repository } from "typeorm";
import { Author } from "../entity/author.entity";
import { Book } from "../entity/book.entity";
import { Length } from "class-validator";
import { IContext, isAuth } from "../middlewares/auth.middleware";

//input para crear un libro
@InputType()
class BookInput {
  @Field()
  @Length(3, 64)
  title!: string;

  @Field()
  author!: number;
}

//input para id de un libro
@InputType()
class BookIdInput {
  @Field(() => Number)
  id!: number;
}

//inputs para actualizar un libro
@InputType()
class BookUpdateInput {
  @Field(() => String, { nullable: true })
  @Length(3, 64)
  title?: string;

  @Field(() => Number, { nullable: true })
  author?: number;
}

@InputType()
class BookUpdateParsedInput {
  @Field(() => String, { nullable: true })
  @Length(3, 64)
  title?: string;

  @Field(() => Author, { nullable: true })
  author?: Author;
}

@Resolver()
export class BookResolver {
  //creamos los repositorios que utilizaremos
  bookRepository: Repository<Book>;
  authorRepository: Repository<Author>;

  //para inicializar los repositorios
  constructor() {
    this.bookRepository = getRepository(Book);
    this.authorRepository = getRepository(Author);
  }

  //Mutation - Crear un libro
  @Mutation(() => Book)
  @UseMiddleware(isAuth)
  async createBook(
    @Arg("input", () => BookInput) input: BookInput,
    @Ctx() context: IContext
  ) {
    try {
      console.log(context.payload);
      //verifica si existe el author
      const author: Author | undefined = await this.authorRepository.findOne(
        input.author
      );
      if (!author) {
        const error = new Error();
        error.message =
          "El autor para este libro no existe, porfavor verifique";
        throw error;
      }
      //inserta el libro en la db
      const book = await this.bookRepository.insert({
        title: input.title,
        author: author,
      });

      return await this.bookRepository.findOne(book.identifiers[0].id, {
        relations: ["author"],
      });
    } catch (e) {
      if (e instanceof Error) {
        throw new Error(e.message);
      }
    }
  }

  //Query - devuelvo todos los libros
  @Query(() => [Book])
  @UseMiddleware(isAuth)
  async getAllBooks(): Promise<Book[] | undefined> {
    try {
      return await this.bookRepository.find({
        relations: ["author", "author.books"],
      });
    } catch (e) {
      if (e instanceof Error) {
        throw new Error(e.message);
      }
    }
  }

  //Query - trae un libro por id
  @Query(() => Book)
  async getBookById(
    @Arg("input", () => BookIdInput) input: BookIdInput
  ): Promise<Book | undefined> {
    try {
      const book = await this.bookRepository.findOne(input.id, {
        relations: ["author", "author.books"],
      });
      if (!book) {
        const error = new Error();
        error.message = "El libro no se encuentra";
        throw error;
      }
      return book;
    } catch (e) {
      if (e instanceof Error) {
        throw new Error(e.message);
      }
    }
  }

  //Mutation - actualizar un libro
  @Mutation(() => Boolean)
  async updateBookByID(
    @Arg("bookId", () => BookIdInput) bookId: BookIdInput,
    @Arg("input", () => BookUpdateInput) input: BookUpdateInput
  ): Promise<Boolean | undefined> {
    try {
      const parsedInput: any = await this.parseInput(input);
      await this.bookRepository.update(bookId.id, parsedInput);
      return true;
    } catch (error) {
      if (error instanceof Error) {
        throw new Error(error.message);
      }
    }
  }

  //Mutation - Eliminar un libro
  @Mutation(() => Boolean)
  async deleteBook(
    @Arg("bookId", () => BookIdInput) bookId: BookIdInput
  ): Promise<Boolean | undefined> {
    try {
      const result = await this.bookRepository.delete(bookId.id);
      if (result.affected === 0)
        throw new Error("El libro que quiere eliminar NO existe");
      return true;
    } catch (e) {
      if (e instanceof Error) {
        throw new Error(e.message);
      }
    }
  }

  private async parseInput(input: BookUpdateInput) {
    try {
      const _input: BookUpdateParsedInput = {};

      if (input.title) {
        _input["title"] = input.title;
      }
      if (input.author) {
        const author = await this.authorRepository.findOne(input.author);
        if (!author) {
          throw new Error("El autor no existe");
        }
        _input["author"] = await this.authorRepository.findOne(input.author);
      }
      return _input;
    } catch (e) {
      if (e instanceof Error) {
        throw new Error(e.message);
      }
    }
  }
}
