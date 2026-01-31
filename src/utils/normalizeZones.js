import { v4 as uuid } from "uuid";

export function normalizeZones(zones = []) {
  return zones.map(z => ({
    ...z,
    id: z.id || z._id || uuid()
  }));
}
