import { Data } from './data';
import { invData } from './data';

export class RegistrBody {
    status: number;
    msg : string;
    data : Data;
}

export class invBody {
    status: number;
    msg : string;
    data : invData;
}
