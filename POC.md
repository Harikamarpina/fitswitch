# FitSwitch POC (Corrected + Clarified)

## Goal
Create a unified fitness platform where users can join a primary gym and use a digital card to access services at other gyms, while payments and balances are handled fairly and transparently.

## Core Entities
- Gym: registered by an owner, with services (facilities) and plans.
- Facility: Yoga, Zumba, CrossFit, etc.
- Gym Plan: membership plan with price, duration days, pass type.
- Facility Plan: facility access plans (including Pay Per Use).
- Wallet: central wallet for users and owners.
- Digital Card: identity + wallet + active memberships/subscriptions.

## Pricing Model
- Gym Plan: fixed price for duration (e.g., 1500/month).
- Facility Plan: fixed price for duration days (e.g., 1 day, 30 days).
- Pay Per Use:
  - If a facility has an explicit "Pay Per Use" plan, that plan price is the session fee.
  - Else, session fee is derived from the cheapest active facility plan by per-day cost:
    - `sessionFee = min(plan.price / plan.durationDays)`, rounded to 2 decimals.

## Attendance Tracking
- Attendance is recorded by check-in/check-out.
- A “day attended” is counted once per calendar date per membership.
- Only completed sessions count as attended days.

## Digital Fitness Card Rules
- Card access is allowed only if:
  - User is active, and
  - Wallet balance is sufficient.
- Pay-per-use access:
  - One paid access per facility per day.
  - Wallet is debited immediately.
  - Facility gym owner is credited immediately.

## Gym Switching Logic (Attendance-Based)
1. Calculate used amount from attendance:
   - `perDayCost = currentPlan.price / totalPlanDays`
   - `usedAmount = perDayCost * attendedDays`
   - `remainingAmount = currentPlan.price - usedAmount`
2. Apply remaining amount to new plan:
   - `creditToNewPlan = min(remainingAmount, newPlan.price)`
   - `additionalAmount = newPlan.price - creditToNewPlan`
   - If `remainingAmount > newPlan.price`, extra credit is returned to wallet.
3. Settlement:
   - Remaining amount is debited from old owner wallet.
   - Remaining amount is credited to user wallet.
   - New plan price is debited from user wallet.
   - New owner wallet is credited.

## Wallet & Ledger Rules
- Every wallet movement creates a transaction record.
- Owner earnings are recorded separately.
- Refund/owner-debit entries are explicitly logged.

## Email Notifications
- OTP verification
- Membership confirmation
- Refund notifications
- Switch confirmation (same as membership confirmation for new gym)

## Validation Rules (Highlights)
- Phone and contact numbers: 10 digits
- Pincode: 6 digits
- Times: HH:mm (24-hour)
- Prices and durations: positive
- IDs: positive
