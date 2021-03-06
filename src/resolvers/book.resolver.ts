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
import { BookLoan } from "../entity/bookLoan.entity";

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

// Loan input
@InputType()
class LoanInput {
  @Field()
  createdAt!: string;

  @Field()
  returned_date?: string;

  @Field()
  bookId?: number;
}

//book return input
@InputType()
class BookReturnInput {
  @Field()
  bookId!: number;
}

@Resolver()
export class BookResolver {
  //creamos los repositorios que utilizaremos
  bookRepository: Repository<Book>;
  authorRepository: Repository<Author>;
  bookLoanRepository: Repository<BookLoan>;

  //para inicializar los repositorios
  constructor() {
    this.bookRepository = getRepository(Book);
    this.authorRepository = getRepository(Author);
    this.bookLoanRepository = getRepository(BookLoan);
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

  //Query - devuelve todos los libros
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
  @UseMiddleware(isAuth)
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
  @UseMiddleware(isAuth)
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
  @UseMiddleware(isAuth)
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

  //Mutation - Prestar un libro
  @Mutation(() => BookLoan)
  @UseMiddleware(isAuth)
  async loan(
    @Arg("input", () => LoanInput) input: LoanInput
  ): Promise<BookLoan | undefined> {
    try {
      const book: Book | undefined = await this.bookRepository.findOne(
        input.bookId
      );
      if (!book) {
        const error = new Error();
        error.message = "El libro no existe";
        throw error;
      }

      const loanBook = await this.bookLoanRepository.insert({
        returned_date: input.returned_date,
        createdAt: input.createdAt,
        books: book,
      });
      const result = await this.bookLoanRepository.findOne(
        loanBook.identifiers[0].id,
        { relations: ["books"] }
      );
      //actualiza el libro como prestado
      await this.bookRepository.save({
        id: input.bookId,
        isOnLoan: true,
      });
      return result;
    } catch (e) {
      console.log(e);
      if (e instanceof Error) {
        throw new Error(e.message);
      }
    }
  }

  //Mutation devolver un libro
  @Mutation(() => Book)
  @UseMiddleware(isAuth)
  async bookReturn(
    @Arg("input", () => BookReturnInput) input: BookReturnInput
  ): Promise<Book | undefined> {
    try {
      const book: Book | undefined = await this.bookRepository.findOne(
        input.bookId
      );
      if (!book) {
        const error = new Error();
        error.message = "El libro no existe";
        throw error;
      }

      //actualiza el libro como devuelto
      const result = await this.bookRepository.save({
        id: input.bookId,
        isOnLoan: false,
      });
      return result;
    } catch (e) {
      console.log(e);
      if (e instanceof Error) {
        throw new Error(e.message);
      }
    }
  }

  //Query devuelve todos los prestamos
  @Query(() => [BookLoan])
  @UseMiddleware(isAuth)
  async getAllLoans(): Promise<BookLoan[]> {
    return await this.bookLoanRepository.find({
      relations: ["books", "books.author", "books.bookLoan"],
    });
  }

  //query
  @Query(() => [Author])
  @UseMiddleware(isAuth)
  async getAllLoansByAuthor(): Promise<Author[]> {
    return await this.authorRepository
      .createQueryBuilder("author")
      .leftJoinAndSelect("author.books", "books")
      .leftJoinAndSelect("author.bookLoan", "returned")
      .where("books.isOnLoan = :isOnLoan", { isOnLoan: true })
      .getMany();
  }

  //query loans
  @Query(() => [BookLoan])
  @UseMiddleware(isAuth)
  async getAllLoansByLoans(): Promise<BookLoan[]> {
    return await this.bookLoanRepository
      .createQueryBuilder("loans")
      .leftJoinAndSelect("loans.books", "books")
      //.leftJoinAndSelect("loans.books.author", "author")
      .where("books.isOnLoan = :isOnLoan", { isOnLoan: true })
      .getMany();
  }
}
