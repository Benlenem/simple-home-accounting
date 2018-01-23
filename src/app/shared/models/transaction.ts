import { Posting } from './posting';
import * as moment from 'moment';

export interface Transaction {
  readonly header: Header;
  readonly postings: Array<Posting>;
}

interface Header {
  readonly date: moment.Moment;
  readonly title: string;
  readonly tag?: string;
}

export interface TransactionWithUUID extends Transaction {
  readonly uuid: string;
}