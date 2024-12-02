import { Datum} from 'src/models/doctorlist/datum';
import { labtestDetail} from 'src/models/labtest_listlabtest/datum';
import { packagedetail} from 'src/models/pack_listpackage/datum';

export class Data {
  loginid: number;
  username : string;
  userrole : string;
  sub_form_flag: number;
  name: string;
  token:string;
}

export class sessData {
  AllDocDet : Datum[];
  fromPage : string;
  Listlabtest : labtestDetail[];
  listPackDet : packagedetail[];
}

