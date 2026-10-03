"use server";

import { apiClient } from "@/lib/apiClient";
import { updateTag } from "next/cache";
import { CARD_TAGS } from "./tags";
import type {
  CreateCardSetupIntentResponse,
  SetDefaultCardResponse,
  DeleteSavedCardResponse,
} from "@/response-types/cardResponseTypes";

/**
 * Student only. Generates a Stripe SetupIntent and returns a clientSecret.
 * The frontend passes this clientSecret to Stripe.js to securely collect and
 * tokenize the card without raw card details touching our backend server.
 */
export async function createCardSetupIntentAction(): Promise<CreateCardSetupIntentResponse> {
  const res = await apiClient("/cards/setup-intent", {
    method: "POST",
  });

  const json: CreateCardSetupIntentResponse = await res.json();
  return json;
}

/**
 * Student only. Sets the specified card as the student's primary/default payment method.
 */
export async function setDefaultCardAction(
  id: string,
): Promise<SetDefaultCardResponse> {
  const res = await apiClient(`/cards/${id}/default`, {
    method: "PATCH",
  });

  const json: SetDefaultCardResponse = await res.json();

  if (json.status === "success") {
    updateTag(CARD_TAGS.cards);
  }

  return json;
}

/**
 * Student only. Removes/detaches the card from the student's Stripe customer account.
 * If this card was the student's default and other cards remain, the first remaining
 * card is automatically promoted to default.
 */
export async function deleteSavedCardAction(
  id: string,
): Promise<DeleteSavedCardResponse> {
  const res = await apiClient(`/cards/${id}`, {
    method: "DELETE",
  });

  const json: DeleteSavedCardResponse = await res.json();

  if (json.status === "success") {
    updateTag(CARD_TAGS.cards);
  }

  return json;
}

/**
 * Student only. Invalidates the saved cards cache tag after a card
 * has been successfully confirmed and attached via Stripe on the client.
 */
export async function revalidateSavedCardsAction(): Promise<{
  status: "success";
  message: string;
}> {
  updateTag(CARD_TAGS.cards);
  return {
    status: "success",
    message: "Payment card saved successfully",
  };
}

