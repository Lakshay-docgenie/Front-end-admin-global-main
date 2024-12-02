import { Doc_ledger_detail } from 'src/models/docledger/datum';

export class Docledger_ResponseBody {
    status: number;
    msg: string;
    data : Doc_ledger_detail[];
}
