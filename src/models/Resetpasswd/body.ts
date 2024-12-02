import { Data } from './data';
import { sessData } from './data';

export class Body {
    status: number;
    msg: string;
    data : Data;
}

export class sessBody{
    status: number;
    msg: string;
    data : sessData;
}
