import { EventLifecycleStatus } from "@prisma/client";

interface LifecycleInput {
  registrationDeadline: Date;
  date: Date;
  startTime: string;
  endTime: string;
  isCancelled?: boolean;
}

export const resolveEventLifecycleStatus = ({
  registrationDeadline,
  date,
  startTime,
  endTime,
  isCancelled,
}: LifecycleInput): EventLifecycleStatus => {
  if (isCancelled) return EventLifecycleStatus.CANCELLED;

  const now = new Date();

  // Build event start & end datetime
  const eventStart = new Date(`${date.toISOString().split("T")[0]}T${startTime}`);
  const eventEnd = new Date(`${date.toISOString().split("T")[0]}T${endTime}`);

  if (now >= eventEnd) {
    return EventLifecycleStatus.COMPLETED;
  }

  if (now >= eventStart) {
    return EventLifecycleStatus.ONGOING;
  }

  if (now > registrationDeadline) {
    return EventLifecycleStatus.REGISTRATION_CLOSED;
  }

  return EventLifecycleStatus.UPCOMING;
};
