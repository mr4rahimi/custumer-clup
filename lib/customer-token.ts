import { SignJWT, jwtVerify } from "jose";

const secret = new TextEncoder().encode(process.env.NEXTAUTH_SECRET);

export type CustomerTokenPayload = {
  customerId: string;
  tenantId: string;
};

export async function signCustomerToken(payload: CustomerTokenPayload): Promise<string> {
  return new SignJWT(payload)
    .setProtectedHeader({ alg: "HS256" })
    .setIssuedAt()
    .setExpirationTime("30d")
    .sign(secret);
}

export async function verifyCustomerToken(token: string): Promise<CustomerTokenPayload> {
  const { payload } = await jwtVerify(token, secret);
  return payload as unknown as CustomerTokenPayload;
}
