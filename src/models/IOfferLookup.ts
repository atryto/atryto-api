import ITimestamp from "./iTimestamp";

interface IOfferLookup extends ITimestamp {
  cityslug?: string;
  sourcecoinsymbol?: string;
  destcoinsymbol?: string;
}
export default IOfferLookup;