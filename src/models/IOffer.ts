import ITimestamp from "./iTimestamp";

interface IOffer extends ITimestamp {
  id?: number;
  userid?: number;
  cityslug?: string;
  sourcecoinsymbol?: string;
  destcoinsymbol?: string;
  wantedpriceperunit?: number;
  minamount?: number;
  amount?: number;
}
export default IOffer;
