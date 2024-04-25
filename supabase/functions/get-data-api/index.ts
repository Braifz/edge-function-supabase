import axiod from "https://deno.land/x/axiod@0.26.2/mod.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.42.0";

Deno.serve(async () => {
  const supabaseClient = createClient(
    Deno.env.get("SUPABASE_URL") ?? "",
    Deno.env.get("SUPABASE_SERVICE_ROLE_KEY") ?? "",
  );
  try {
    const data = await axiod.get("https://rickandmortyapi.com/api/character");
    const characters = data.data.results;

    if (characters) {
      // deno-lint-ignore no-explicit-any
      characters.map(async (character: any) => {
        await supabaseClient.from("characters").upsert({
          id: character.id,
          name: character.name,
          status: character.status,
          species: character.species,
          type: character.type,
          gender: character.gender,
        });
      });
    }
    return new Response("Characters saved correctly!", {
      headers: { "Content-Type": "application/json" },
      status: 200,
    });
  } catch (error) {
    return new Response(String(error?.message ?? error), { status: 500 });
  }
});
