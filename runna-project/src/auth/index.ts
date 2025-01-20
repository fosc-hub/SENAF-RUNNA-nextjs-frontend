"use server";
import { SignJWT, jwtVerify } from "jose";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import { NextRequest, NextResponse } from "next/server";
import { cache } from "react";
import { TUser } from '../api/interfaces';
import { TupleKeys } from "react-hook-form/dist/types/path/common";

const secretKey = process.env.MYSECRETKEY;
const key = new TextEncoder().encode(secretKey);

export async function encrypt(payload: any) {
  return await new SignJWT(payload)
    .setProtectedHeader({ alg: "HS256" })
    .setIssuedAt()
    .setExpirationTime("10 hour from now")
    .sign(key);
}

export async function decrypt(input: any) {
  try {
    const { payload } = await jwtVerify(input, key, {
      algorithms: ["HS256"],
    });
    return payload;
  } catch (e) {
    return null;
  }
}


export async function login(userData: any) {
  // Verify credentials && get the user

  const user = userData;

  // Create the session
  const expires = new Date(Date.now() + 10 * 60 * 60 * 1000);
  const session = await encrypt({ user, expires });

  // Save the session in a cookie
  cookies().set("session", session, {
    expires,
    httpOnly: true,
    sameSite: "lax",
    path: "/",
    secure: true,
  });
}

export async function getSession() {
    console.log("Secret Key:", secretKey);
    const session = await cookies().get("session")?.value;
    if (!session) return null;
    return await decrypt(session);
  }

export async function logout() {
// Destroy the session
    cookies().delete("session");
}