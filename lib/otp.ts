import { randomInt } from "node:crypto";

export const OTP_TTL_SECONDS = 120;

export function generateOtpCode(): string {
  return randomInt(0, 100000).toString().padStart(5, "0");
}

export function otpRedisKey(tenantId: string, phone: string): string {
  return `otp:${tenantId}:${phone}`;
}
