import './types';
import {supportBigNumber} from './matchers/bigNumber';
import {supportEmit} from './matchers/emit';


export function waffleChai(chai: Chai.ChaiStatic, utils: Chai.ChaiUtils) {
  supportBigNumber(chai.Assertion, utils);
  supportEmit(chai.Assertion);
}