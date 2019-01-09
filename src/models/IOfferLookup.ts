import ITimestamp from "./iTimestamp";
import ICoin from "./ICoin";

interface IOfferLookup extends ITimestamp {
  id?: number;
  cityslug?: string;
  sourcecoinsymbol?: string;
  destcoinsymbol?: string;
}
export default IOfferLookup;