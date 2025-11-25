import { Equipment } from '../types';
import { BASIC_LASERS } from './basic-lasers';
import { PPC_WEAPONS } from './ppcs';
import { FLAMER_WEAPONS } from './flamers';
import { DEFENSIVE_WEAPONS } from './defensive';

export const ENERGY_WEAPONS: Equipment[] = [
  ...PPC_WEAPONS,
  ...FLAMER_WEAPONS,
  ...DEFENSIVE_WEAPONS,
  ...BASIC_LASERS
];
