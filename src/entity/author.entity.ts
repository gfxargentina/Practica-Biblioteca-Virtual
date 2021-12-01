import { Field, ObjectType } from "type-graphql";
import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  CreateDateColumn,
  OneToMany,
  ManyToOne,
} from "typeorm";
import { Book } from "./book.entity";
import { BookLoan } from "./bookLoan.entity";

@ObjectType()
@Entity() //para que la clase sea interpretada por typeorm
export class Author {
  @Field()
  @PrimaryGeneratedColumn()
  id!: number;

  @Field(() => String, { nullable: true })
  @Column()
  fullName!: string;

  @Field(() => [Book], { nullable: true })
  @OneToMany(() => Book, (book) => book.author, { nullable: true })
  books!: Book[];

  @Field(() => BookLoan, { nullable: true })
  @ManyToOne(() => BookLoan, (bookLoan) => bookLoan.bookLoan)
  bookLoan?: BookLoan;

  @Field(() => String)
  @CreateDateColumn({ type: "timestamp" })
  createdAt!: string;
}
