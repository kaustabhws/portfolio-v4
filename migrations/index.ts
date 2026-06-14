import * as migration_20260614_095609_initial from './20260614_095609_initial';

export const migrations = [
  {
    up: migration_20260614_095609_initial.up,
    down: migration_20260614_095609_initial.down,
    name: '20260614_095609_initial'
  },
];
