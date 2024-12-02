import { Doc_Details } from 'src/models/docdetails/datum';
import { Pat_Details } from 'src/models/patdetails/datum';
import { Patnote_Details } from 'src/models/patnotes/data';

export class vaultdata {
  loginid: number;
  loginname : string;
  userrole : string;
  userstatus : string;
  userfname:string;
  userlname:string;
  docdetail:Doc_Details;
  patdetail:Pat_Details;
  caldetid:number;
  patnotedetail:Patnote_Details;
  docdetid:number;
  patdetid:string;
  pattype:string;
  token:string;
  msg:{message:string,msgboxtype:string};
  patfile_transid : string;
}
