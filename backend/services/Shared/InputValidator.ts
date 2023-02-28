import { Space } from "./Model";

export class missingFieldError extends Error {}

export function validateAsSpaceEntry(arg: any) {
  if (!(arg as Space).name) {
    throw new missingFieldError("Value for name is required");
  }
  if (!(arg as Space).location) {
    throw new missingFieldError("Value for location is required");
  }
  if (!(arg as Space).spaceId) {
    throw new missingFieldError("Value for spaceId is required");
  }
}
