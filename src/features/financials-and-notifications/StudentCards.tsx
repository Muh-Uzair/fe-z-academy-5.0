"use client";

import { useState } from "react";
import {
  CreditCard,
  Plus,
  Trash2,
  CheckCircle2,
  ShieldCheck,
  Lock,
  Sparkles,
  Wifi,
} from "lucide-react";

import PageFlexCol from "@/components/PageFlexCol";
import PageHeader from "@/components/PageHeader";
import AppButton from "@/components/AppButton";
import { Badge } from "@/components/ui/badge";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { cn } from "@/utils/cn";
import useClientAction from "@/hooks/useClientAction";
import type { SavedCard } from "@/response-types/cardResponseTypes";
import { setDefaultCardAction } from "@/services/cards/actions";
import AddCardDialog from "./AddCardDialog";
import RemoveCardDialog from "./RemoveCardDialog";

function getBrandTheme(brand: string) {
  const b = brand.toLowerCase();
  if (b.includes("visa")) {
    return {
      gradient:
        "from-slate-900 via-indigo-950 to-slate-900 border-indigo-500/30 text-white",
      brandName: "VISA",
    };
  }
  if (b.includes("mastercard")) {
    return {
      gradient:
        "from-slate-950 via-zinc-900 to-amber-950 border-amber-500/30 text-white",
      brandName: "MASTERCARD",
    };
  }
  if (b.includes("amex") || b.includes("american")) {
    return {
      gradient:
        "from-slate-900 via-emerald-950 to-slate-900 border-emerald-500/30 text-white",
      brandName: "AMEX",
    };
  }
  return {
    gradient:
      "from-zinc-950 via-slate-900 to-indigo-950 border-indigo-500/30 text-white",
    brandName: brand.toUpperCase() || "CARD",
  };
}

type StudentCardsProps = {
  cards: SavedCard[];
};

// CMP CMP CMP
const StudentCards = ({ cards }: StudentCardsProps) => {
  // VARS

  const [filter, setFilter] = useState<"all" | "default">("all");
  const [isAddOpen, setIsAddOpen] = useState(false);
  const [cardToDelete, setCardToDelete] = useState<SavedCard | null>(null);

  const { run: runSetDefaultAction, isLoading: isSettingDefault } =
    useClientAction();
  const [settingDefaultId, setSettingDefaultId] = useState<string | null>(null);

  // FUNCTIONS
  const handleSetDefault = async (id: string) => {
    setSettingDefaultId(id);
    await runSetDefaultAction(() => setDefaultCardAction(id));
    setSettingDefaultId(null);
  };

  const defaultCard = cards.find((c) => c.isDefault);
  const displayedCards = cards.filter((c) => {
    if (filter === "default") return c.isDefault;
    return true;
  });

  // JSX JSX JSX
  return (
    <PageFlexCol>
      {/* Header section with page title & primary action */}
      <PageHeader
        pageHeading="Saved Payment Cards"
        pageDescription="Manage your saved credit and debit cards for seamless 1-click course checkouts."
        pageHeaderRightSection={
          <AppButton
            iconLeft={Plus}
            onClick={() => setIsAddOpen(true)}
            className="shadow-sm"
          >
            Add New Card
          </AppButton>
        }
      />

      {/* Metrics & Security Strip */}
      <div className="grid gap-4 sm:grid-cols-3">
        <Card className="border-border/60 shadow-xs">
          <CardHeader className="pb-2">
            <CardDescription className="text-xs font-medium uppercase tracking-wider">
              Saved Cards
            </CardDescription>
            <CardTitle className="text-2xl font-bold flex items-center gap-2">
              <CreditCard className="h-5 w-5 text-primary" />
              {cards.length} {cards.length === 1 ? "Card" : "Cards"}
            </CardTitle>
          </CardHeader>
          <CardContent className="text-xs text-muted-foreground">
            {cards.length > 0
              ? "Ready for 1-click checkout"
              : "No cards linked yet"}
          </CardContent>
        </Card>

        <Card className="border-border/60 shadow-xs">
          <CardHeader className="pb-2">
            <CardDescription className="text-xs font-medium uppercase tracking-wider">
              Default Method
            </CardDescription>
            <CardTitle className="text-2xl font-bold capitalize flex items-center gap-2">
              <CheckCircle2 className="h-5 w-5 text-emerald-500" />
              {defaultCard
                ? `${defaultCard.brand} •••• ${defaultCard.last4}`
                : "None set"}
            </CardTitle>
          </CardHeader>
          <CardContent className="text-xs text-muted-foreground">
            {defaultCard
              ? `Expires ${defaultCard.expMonth.toString().padStart(2, "0")}/${defaultCard.expYear}`
              : "Add a card to set default"}
          </CardContent>
        </Card>

        <Card className="border-border/60 shadow-xs bg-muted/20">
          <CardHeader className="pb-2">
            <CardDescription className="text-xs font-medium uppercase tracking-wider">
              Security Guarantee
            </CardDescription>
            <CardTitle className="text-base font-semibold flex items-center gap-2 text-foreground">
              <ShieldCheck className="h-5 w-5 text-emerald-600 dark:text-emerald-400" />
              PCI-DSS Level 1
            </CardTitle>
          </CardHeader>
          <CardContent className="text-xs text-muted-foreground">
            Encrypted with 256-bit AES via Stripe
          </CardContent>
        </Card>
      </div>

      {/* Filter Tabs */}
      <div className="flex items-center justify-between border-b pb-3">
        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={() => setFilter("all")}
            className={cn(
              "px-3 py-1.5 text-xs font-medium rounded-md transition-colors",
              filter === "all"
                ? "bg-primary text-primary-foreground shadow-xs"
                : "text-muted-foreground hover:text-foreground hover:bg-muted",
            )}
          >
            All Cards ({cards.length})
          </button>
          <button
            type="button"
            onClick={() => setFilter("default")}
            className={cn(
              "px-3 py-1.5 text-xs font-medium rounded-md transition-colors",
              filter === "default"
                ? "bg-primary text-primary-foreground shadow-xs"
                : "text-muted-foreground hover:text-foreground hover:bg-muted",
            )}
          >
            Default Only ({cards.filter((c) => c.isDefault).length})
          </button>
        </div>

        <p className="text-xs text-muted-foreground hidden sm:block">
          Saved cards can be selected instantly during checkout.
        </p>
      </div>

      {/* Cards Display Grid */}
      {displayedCards.length === 0 ? (
        <Card className="p-12 text-center border-dashed">
          <div className="flex flex-col items-center justify-center max-w-sm mx-auto space-y-3">
            <div className="p-3 bg-muted rounded-full">
              <CreditCard className="h-8 w-8 text-muted-foreground" />
            </div>
            <h3 className="font-semibold text-lg">No payment cards found</h3>
            <p className="text-sm text-muted-foreground">
              {filter === "default"
                ? "You do not have a default card selected."
                : "You haven't saved any credit or debit cards yet. Add your first card for instant checkouts."}
            </p>
            <AppButton
              iconLeft={Plus}
              onClick={() => setIsAddOpen(true)}
              className="mt-2"
            >
              Add Card Now
            </AppButton>
          </div>
        </Card>
      ) : (
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {displayedCards.map((card) => {
            const { gradient, brandName } = getBrandTheme(card.brand);
            const isCardSettingDefault =
              isSettingDefault && settingDefaultId === card.id;

            return (
              <div
                key={card.id}
                className="flex flex-col rounded-2xl border bg-card shadow-sm hover:shadow-md transition-all duration-300 overflow-hidden"
              >
                {/* Visual Realistic Credit Card */}
                <div
                  className={cn(
                    "p-6 rounded-xl m-2 bg-gradient-to-br border relative flex flex-col justify-between h-48 select-none transition-transform duration-300 hover:scale-[1.01]",
                    gradient,
                  )}
                >
                  {/* Holographic shimmer */}
                  <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top_right,_var(--tw-gradient-stops))] from-white/10 via-transparent to-transparent pointer-events-none rounded-xl" />

                  {/* Top Row: Metallic Chip, Contactless, Brand */}
                  <div className="flex items-center justify-between z-10">
                    <div className="flex items-center gap-3">
                      {/* Metallic Gold Chip */}
                      <div className="w-10 h-7 rounded-sm bg-gradient-to-tr from-amber-400 via-amber-200 to-amber-500 border border-amber-600/40 relative shadow-inner overflow-hidden">
                        <div className="absolute inset-x-0 top-1/2 -translate-y-1/2 h-[1px] bg-amber-700/50" />
                        <div className="absolute inset-y-0 left-1/3 w-[1px] bg-amber-700/50" />
                        <div className="absolute inset-y-0 right-1/3 w-[1px] bg-amber-700/50" />
                      </div>
                      <Wifi className="h-5 w-5 text-white/70 rotate-90" />
                    </div>

                    <div className="flex items-center gap-2">
                      {card.isDefault && (
                        <Badge className="bg-emerald-500/90 hover:bg-emerald-500 text-white border-none text-[10px] font-semibold tracking-wider uppercase px-2 py-0.5 shadow-sm">
                          DEFAULT
                        </Badge>
                      )}
                      <span className="font-extrabold tracking-widest text-base uppercase text-white/90">
                        {brandName}
                      </span>
                    </div>
                  </div>

                  {/* Middle: Masked Card Number */}
                  <div className="z-10 tracking-[0.25em] font-mono text-lg font-semibold text-white/95 drop-shadow-xs">
                    •••• •••• •••• {card.last4}
                  </div>

                  {/* Bottom Row: Name and Expiry */}
                  <div className="flex items-end justify-between z-10 text-xs font-mono">
                    <div>
                      <span className="text-[9px] uppercase tracking-wider text-white/60 block">
                        Cardholder
                      </span>
                      <span className="font-medium tracking-wide text-white uppercase truncate max-w-[150px] block">
                        {card.cardholderName || "STUDENT"}
                      </span>
                    </div>
                    <div className="text-right">
                      <span className="text-[9px] uppercase tracking-wider text-white/60 block">
                        Expires
                      </span>
                      <span className="font-medium tracking-wider text-white">
                        {card.expMonth.toString().padStart(2, "0")}/
                        {card.expYear.toString().slice(-2)}
                      </span>
                    </div>
                  </div>
                </div>

                {/* Actions Bar */}
                <div className="px-4 py-3 flex items-center justify-between gap-2 border-t bg-muted/10 mt-auto">
                  {card.isDefault ? (
                    <span className="text-xs text-emerald-600 dark:text-emerald-400 font-medium flex items-center gap-1.5">
                      <CheckCircle2 className="h-4 w-4" /> Primary Card
                    </span>
                  ) : (
                    <AppButton
                      variant="ghost"
                      size="sm"
                      className="h-8 text-xs font-medium text-muted-foreground hover:text-foreground"
                      isLoading={isCardSettingDefault}
                      disabled={isSettingDefault}
                      onClick={() => handleSetDefault(card.id)}
                    >
                      Set as default
                    </AppButton>
                  )}

                  <AppButton
                    variant="ghost"
                    size="sm"
                    className="h-8 text-destructive hover:text-destructive hover:bg-destructive/10"
                    iconLeft={Trash2}
                    disabled={isSettingDefault}
                    onClick={() => setCardToDelete(card)}
                  >
                    Remove
                  </AppButton>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* Security & Tokenization Notice Banner */}
      <Card className="border-border/60 bg-muted/30">
        <CardContent className="p-4 sm:p-5 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <div className="flex items-start gap-3">
            <div className="p-2 bg-primary/10 rounded-lg text-primary shrink-0 mt-0.5 sm:mt-0">
              <Lock className="h-5 w-5" />
            </div>
            <div>
              <h4 className="font-semibold text-sm">
                Your Payment Information is Strictly Protected
              </h4>
              <p className="text-xs text-muted-foreground mt-0.5 max-w-2xl">
                Z-Academy never stores your raw card numbers or CVV codes on our
                servers. All card details are securely tokenized and stored with
                Stripe under PCI-DSS Level 1 compliance.
              </p>
            </div>
          </div>
          <div className="flex items-center gap-2 shrink-0">
            <Badge variant="outline" className="text-xs">
              <Sparkles className="h-3.5 w-3.5 mr-1 text-primary" />
              1-Click Checkout
            </Badge>
          </div>
        </CardContent>
      </Card>

      {/* Add Card Modal with Stripe Elements */}
      <AddCardDialog
        open={isAddOpen}
        onOpenChange={setIsAddOpen}
        isFirstCard={cards.length === 0}
      />

      {/* Remove Card Confirmation Modal */}
      <RemoveCardDialog
        card={cardToDelete}
        onClose={() => setCardToDelete(null)}
      />
    </PageFlexCol>
  );
};

export default StudentCards;
