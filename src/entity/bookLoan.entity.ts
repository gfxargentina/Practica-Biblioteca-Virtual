import {
  CreateDateColumn,
  Entity,
  ManyToOne,
  PrimaryGeneratedColumn,
} from "typeorm";
import { Field, ObjectType } from "type-graphql";
import { Book } from "./book.entity";

@ObjectType()
@Entity()
export class BookLoan {
  @Field()
  @PrimaryGeneratedColumn()
  id!: number;

  @Field(() => Book, { nullable: true })
  @ManyToOne(() => Book, (book) => book.bookLoan)
  books?: Book;

  @Field()
  @CreateDateColumn({ type: "timestamp" })
  createdAt!: String;

  @Field()
  @CreateDateColumn()
  returned_date?: Date;
}
