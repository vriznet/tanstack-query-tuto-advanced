"use server";

// 테스트용 Server Actions - PokeAPI 호출

export async function fetchPokemon(id: number) {
  const start = Date.now();
  console.log(`[Server Action] Fetching Pokemon #${id} started`);

  const response = await fetch(`https://pokeapi.co/api/v2/pokemon/${id}`);
  const data = await response.json();

  const end = Date.now();
  console.log(`[Server Action] Pokemon #${id} fetched in ${end - start}ms`);

  return {
    id: data.id,
    name: data.name,
    sprites: data.sprites.front_default,
    duration: end - start,
    timestamp: new Date().toISOString(),
  };
}

export async function fetchPokemonSpecies(id: number) {
  const start = Date.now();
  console.log(`[Server Action] Fetching Pokemon Species #${id} started`);

  const response = await fetch(
    `https://pokeapi.co/api/v2/pokemon-species/${id}`
  );
  const data = await response.json();

  const end = Date.now();
  console.log(
    `[Server Action] Pokemon Species #${id} fetched in ${end - start}ms`
  );

  return {
    id: data.id,
    name: data.name,
    color: data.color.name,
    habitat: data.habitat?.name || "unknown",
    duration: end - start,
    timestamp: new Date().toISOString(),
  };
}

export async function fetchPokemonAbility(id: number) {
  const start = Date.now();
  console.log(`[Server Action] Fetching Ability #${id} started`);

  const response = await fetch(`https://pokeapi.co/api/v2/ability/${id}`);
  const data = await response.json();

  const end = Date.now();
  console.log(`[Server Action] Ability #${id} fetched in ${end - start}ms`);

  return {
    id: data.id,
    name: data.name,
    effect: data.effect_entries[0]?.short_effect || "No effect",
    duration: end - start,
    timestamp: new Date().toISOString(),
  };
}
