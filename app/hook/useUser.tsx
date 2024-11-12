"use client";

import { createClient } from "@/utils/supabase/client";
import { useQuery } from "@tanstack/react-query";

const initUser = {
  created_at: "",
  display_name: "",
  email: "",
  id: "",
};

export default function useUser() {
  return useQuery({
    queryKey: ["user"],
    queryFn: async () => {
      const supabase = createClient();
      const { data } = await supabase.auth.getSession();
      if (data.session?.user) {
        const { data: user } = await supabase
          .from("profile")
          .select("*")
          .eq("id", data.session.user.id)
          .single();

        return user;
      }
      return initUser;
    },
  });
}
