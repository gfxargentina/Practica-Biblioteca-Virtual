import { Field, ObjectType } from "type-graphql";
import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  CreateDateColumn,
  ManyToOne,
} from "typeorm";
import { Author } from "./author.entity";
import { BookLoan } from "./bookLoan.entity";

@ObjectType()
@Entity() //para que la clase sea interpretada por typeorm
export class BookLoans {
  @Field()
  @PrimaryGeneratedColumn()
  id!: number;

  @Field()
  @Column()
  isOnLoan!: Boolean;

  @Column()
  books!: number;

  @Field()
  @CreateDateColumn()
  createdAt!: Date;
}
