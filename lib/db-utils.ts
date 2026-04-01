import { createHash } from "crypto";

export function hashToken(token: string): string {
  return createHash("sha256").update(token).digest("hex");
}

export function validateElectionWindow(election: {
  status: string | null;
  startTime: Date | null;
  endTime: Date | null;
}): boolean {
  if (election.status !== "OPEN") return false;
  const now = new Date();
  if (election.startTime && now < election.startTime) return false;
  if (election.endTime && now > election.endTime) return false;
  return true;
}

export function serializeBigInt(value: unknown): unknown {
  if (typeof value === "bigint") return value.toString();
  if (Array.isArray(value)) return value.map(serializeBigInt);
  if (value && typeof value === "object") {
    return Object.fromEntries(
      Object.entries(value as Record<string, unknown>).map(([k, v]) => [
        k,
        serializeBigInt(v),
      ])
    );
  }
  return value;
}

export function deserializeBigInt(value: unknown): unknown {
  if (typeof value === "string" && /^\d+n?$/.test(value)) {
    try {
      return BigInt(value.replace("n", ""));
    } catch {
      return value;
    }
  }
  if (Array.isArray(value)) return value.map(deserializeBigInt);
  if (value && typeof value === "object") {
    return Object.fromEntries(
      Object.entries(value as Record<string, unknown>).map(([k, v]) => [
        k,
        deserializeBigInt(v),
      ])
    );
  }
  return value;
}

export function jsonStringify(data: unknown): string {
  return JSON.stringify(serializeBigInt(data));
}

export function jsonParse<T>(str: string): T {
  return JSON.parse(str) as T;
}
