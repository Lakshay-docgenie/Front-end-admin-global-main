import { Data} from 'src/models/patientlist/data';
import { Datacalldet} from 'src/models/patientlist/data';

export class Body {
    status: number;
    msg: string;
    data : Data;
}

export class Bodycalldet {
    status: number;
    msg: string;
    data : Datacalldet;
}

