import { Mutation, Resolver, Arg, InputType, Field, Query } from "type-graphql";
import { getRepository, Repository } from "typeorm";
import { Author } from "../entity/author.entity";
import { Book } from "../entity/book.entity";

//input para crear un libro
@InputType()
class BookInput {
  @Field()
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
  title?: string;

  @Field(() => Number, { nullable: true })
  author?: number;
}

@InputType()
class BookUpdateParsedInput {
  @Field(() => String, { nullable: true })
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
  async createBook(@Arg("input", () => BookInput) input: BookInput) {
    try {
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
  async getAllBooks(): Promise<Book[] | undefined> {
    try {
      return await this.bookRepository.find({ relations: ["author"] });
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
        relations: ["author"],
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
      const parsedInput = await this.parseInput(input);
      await this.bookRepository.update(bookId.id, parsedInput);
      return true;
    } catch (error) {
      if (error instanceof Error) {
        throw new Error(error.message);
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
