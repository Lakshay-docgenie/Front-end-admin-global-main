import { Pat_Details } from 'src/models/patdetails/datum';

export class PatDetails_ResponseBody {
    status: number;
    msg: string;
    data : Pat_Details[];
}
