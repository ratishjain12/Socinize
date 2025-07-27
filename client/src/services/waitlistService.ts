import { supabase } from "../supabase/client";

export interface WaitlistEntry {
  id?: string;
  email: string;
  created_at?: string;
}

export interface WaitlistResponse {
  success: boolean;
  error?: string;
}

export const waitlistService = {
  async addToWaitlist(email: string): Promise<WaitlistResponse> {
    try {
      const { error } = await supabase.from("waitlist").insert([{ email }]);

      if (error) {
        if (error.code === "23505") {
          // Unique constraint violation
          return {
            success: false,
            error: "This email is already on the waitlist!",
          };
        }
        return { success: false, error: error.message };
      }

      return { success: true };
    } catch (error: unknown) {
      console.error("Error adding to waitlist:", error);
      return {
        success: false,
        error: "Failed to add to waitlist. Please try again.",
      };
    }
  },

  async getWaitlistCount(): Promise<number> {
    try {
      const { error, count } = await supabase
        .from("waitlist")
        .select("*", { count: "exact", head: true });

      if (error) {
        console.error("Error getting waitlist count:", error);
        return 0;
      }

      return count || 0;
    } catch (err) {
      console.error("Error getting waitlist count:", err);
      return 0;
    }
  },
};
