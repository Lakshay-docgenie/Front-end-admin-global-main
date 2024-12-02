

export class Doc_ledger_detail {
    docdet_fname : string;
    docdet_lname : string;
    docdet_name : string;
    idDoctor_Consult_summary:number;
    Summary_peroid :string;
    NoOfTransactions :string;
    NoOfFollows :string;
    GrossValueinINR :string;
    Commission  :string;
    TDS :string;
    NetValueinINR:string;
    docid:number;
    displaystatus:string;
    payments:doc_payment_detail;
    PaymentDate_1 :string;
      Payment_Amount_1 :string;
      Transactiondetail:string;
      PaymentDate_2:string;
      Payment_Amount_2 :string;
      Grossamt_upd :string;
      Commission_upd :string;
      TDS_upd :string;
      Netvalue_upd:string;
    }
  
    class doc_payment_detail{
      PaymentDate_1 :string;
      Payment_Amount_1 :string;
      Transactiondetail:string;
      PaymentDate_2:string;
      Payment_Amount_2 :string;
      Grossamt_upd :string;
      Commission_upd :string;
      TDS_upd :string;
      Netvalue_upd:string;
    }