"use server";
import {
  ShippingAddressSchema,
  SignInFormSchema,
  SignUPFormSchema,
} from "../validators";
import { hashSync } from "bcrypt-ts-edge";
import { auth, signIn, signOut } from "@/auth";
import { isRedirectError } from "next/dist/client/components/redirect-error";
import { prisma } from "@/db/prisma";
import { formatError } from "../utils";
import { ShippingAddress } from "@/types";
import { getMyCart } from "./cart.actions";

export const signInWithCredentials = async (
  _prevState: unknown,
  formData: FormData
) => {
  try {
    const user = SignInFormSchema.parse({
      email: formData.get("email"),
      password: formData.get("password"),
    });

    await signIn("credentials", user);

    return {
      success: true,
      message: "Signed in successfully",
    };
  } catch (error) {
    if (isRedirectError(error)) {
      throw error;
    }

    return {
      success: false,
      message: "Failed to sign in",
    };
  }
};

export async function signOutUser() {
  // get current users cart and delete it so it does not persist to next user
  const currentCart = await getMyCart();

  if (currentCart?.id) {
    await prisma.cart.delete({ where: { id: currentCart.id } });
  } else {
    console.warn("No cart found for deletion.");
  }
  await signOut();
}

export const signUpUser = async (_prevState: unknown, formData: FormData) => {
  try {
    const newUser = SignUPFormSchema.parse({
      name: formData.get("name"),
      email: formData.get("email"),
      password: formData.get("password"),
      confirmPassword: formData.get("confirmPassword"),
    });

    const plainPassword = newUser.password;

    newUser.password = hashSync(newUser.password, 10);

    await prisma.user.create({
      data: {
        name: newUser.name,
        email: newUser.email,
        password: newUser.password,
      },
    });

    await signIn("credentials", {
      email: newUser.email,
      password: plainPassword,
    });

    return {
      success: true,
      message: "User registered successfully",
    };
  } catch (error) {
    if (isRedirectError(error)) {
      throw error;
    }

    return {
      success: false,
      message: formatError(error),
    };
  }
};

//get user by ID
export const getUserById = async (userId: string) => {
  const user = await prisma.user.findUnique({
    where: { id: userId },
  });

  if (!user) {
    throw new Error("Failed to find user");
  }

  return user;
};

// update user's address
export const updateUserAddress = async (data: ShippingAddress) => {
  try {
    const session = await auth();

    const currentUser = await prisma.user.findFirst({
      where: {
        id: session?.user?.id,
      },
    });

    if (!currentUser) throw new Error("Could not find user");

    const address = ShippingAddressSchema.parse(data);

    await prisma.user.update({
      where: {
        id: currentUser.id,
      },
      data: {
        address,
      },
    });
    return {
      success: true,
      message: "User Address Updated",
    };
  } catch (error) {
    return { success: false, message: formatError(error) };
  }
};
