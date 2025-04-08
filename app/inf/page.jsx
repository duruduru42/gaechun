import { createClient } from "@/utils/supabase/server";
import First from "@/components/First"
import Second from "@/components/Second"
import Third from "@/components/Third"
import Fourth from "@/components/Fourth"
import Sixth from "@/components/Sixth"
import Seventh from "@/components/Seventh"
import Footer from "@/components/Footer/index.js"


export default async function Index() {
  const canInitSupabaseClient = () => {
    try {
      createClient();
      return true;
    } catch (e) {
      return false;
    }
  };

  const isSupabaseConnected = canInitSupabaseClient();

  return (
    <>
    <First/>
    <Second/>
    <Third/>
    <Fourth/>
    <Sixth/>
    <Seventh/>
    <Footer/>
    </>
  
  );
}
