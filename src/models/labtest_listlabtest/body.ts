import { labtestDetail} from 'src/models/labtest_listlabtest/datum';
import { labtestStatus} from 'src/models/labtest_listlabtest/datum';

export class listlabtest {
    status: number;
    msg: string;
    data : labtestDetail[];
}

export class listLabOrder{
    status: number;
    msg: string;
    data : labtestStatus[];
}