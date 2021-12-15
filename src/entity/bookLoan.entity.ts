import {
  CreateDateColumn,
  Entity,
  ManyToOne,
  OneToMany,
  PrimaryGeneratedColumn,
  Column,
} from "typeorm";
import { Field, ObjectType } from "type-graphql";
import { Book } from "./book.entity";
import { Author } from "./author.entity";

@ObjectType()
@Entity()
export class BookLoan {
  @Field()
  @PrimaryGeneratedColumn()
  id!: number;

  @Field(() => Book, { nullable: true })
  @ManyToOne(() => Book, (book) => book.bookLoan, {
    onDelete: "CASCADE",
    nullable: true,
  })
  books?: Book;

  @Field(() => [Author], { nullable: true })
  @OneToMany(() => Author, (author) => author.bookLoan, { nullable: true })
  bookLoan!: Author[];

  @Field({ nullable: true })
  @Column()
  createdAt!: String;

  @Field({ nullable: true })
  @Column()
  returned_date?: String;
}
