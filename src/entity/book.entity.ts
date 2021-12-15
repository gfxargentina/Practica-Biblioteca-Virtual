import { Field, ObjectType } from "type-graphql";
import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  CreateDateColumn,
  ManyToOne,
  OneToMany,
} from "typeorm";
import { Author } from "./author.entity";
import { BookLoan } from "./bookLoan.entity";

@ObjectType()
@Entity() //para que la clase sea interpretada por typeorm
export class Book {
  @Field()
  @PrimaryGeneratedColumn()
  id!: number;

  @Field({ nullable: true })
  @Column()
  title!: string;

  @Field(() => Author, { nullable: true })
  //onDelete, cuando borre un author borra todos sus libros tambien
  @ManyToOne(() => Author, (author) => author.books, { onDelete: "CASCADE" })
  author!: Author;

  @Field(() => Boolean, { nullable: true })
  @Column({ default: false })
  isOnLoan?: Boolean;

  @Field(() => [BookLoan], { nullable: true })
  @OneToMany(() => BookLoan, (bookLoan) => bookLoan.books, {
    onDelete: "CASCADE",
    nullable: true,
  })
  bookLoan!: BookLoan[];

  @Field()
  @CreateDateColumn({ type: "timestamp" })
  createdAt!: string;
}
