"use client";

import {
  fetchPokemon,
  fetchPokemonSpecies,
  fetchPokemonAbility,
} from "@/app/actions/test";
import { useState } from "react";

export default function FetchParallelTest() {
  const [serialResult, setSerialResult] = useState<any>(null);
  const [parallelResult, setParallelResult] = useState<any>(null);
  const [apiResult, setApiResult] = useState<any>(null);
  const [loading, setLoading] = useState<string | null>(null);
  const [pokemonId, setPokemonId] = useState(1);
  const [articleId, setArticleId] = useState("cmijmpvfx0007j2wjcehbqo48");

  // 직렬 실행 테스트 (워터폴 발생)
  const testSerial = async () => {
    setLoading("serial");
    setSerialResult(null);

    const start = Date.now();
    console.log("[Test] Serial fetch test started");

    try {
      const pokemon = await fetchPokemon(pokemonId);
      const species = await fetchPokemonSpecies(pokemonId);
      const ability = await fetchPokemonAbility(pokemonId);

      const end = Date.now();
      const totalTime = end - start;

      console.log(`[Test] Serial fetch test completed in ${totalTime}ms`);

      setSerialResult({
        totalTime,
        pokemon,
        species,
        ability,
      });
    } catch (error) {
      console.error("Serial test error:", error);
      setSerialResult({ error: String(error) });
    } finally {
      setLoading(null);
    }
  };

  // 병렬 실행 테스트 (Promise.all 사용)
  const testParallel = async () => {
    setLoading("parallel");
    setParallelResult(null);

    const start = Date.now();
    console.log("[Test] Parallel fetch test started");

    try {
      const [pokemon, species, ability] = await Promise.all([
        fetchPokemon(pokemonId),
        fetchPokemonSpecies(pokemonId),
        fetchPokemonAbility(pokemonId),
      ]);

      const end = Date.now();
      const totalTime = end - start;

      console.log(`[Test] Parallel fetch test completed in ${totalTime}ms`);

      setParallelResult({
        totalTime,
        pokemon,
        species,
        ability,
      });
    } catch (error) {
      console.error("Parallel test error:", error);
      setParallelResult({ error: String(error) });
    } finally {
      setLoading(null);
    }
  };

  // API Routes 직렬 실행 테스트
  const testApiSerial = async () => {
    setLoading("api-serial");
    setApiResult(null);

    const start = Date.now();
    console.log("[Test] API Routes serial fetch test started");

    try {
      const articleRes = await fetch(`/api/article/${articleId}`);
      const article = await articleRes.json();

      const commentsRes = await fetch(`/api/comments/${articleId}`);
      const comments = await commentsRes.json();

      const end = Date.now();
      const totalTime = end - start;

      console.log(
        `[Test] API Routes serial fetch test completed in ${totalTime}ms`
      );

      setApiResult({
        type: "serial",
        totalTime,
        article,
        comments,
      });
    } catch (error) {
      console.error("API serial test error:", error);
      setApiResult({ error: String(error) });
    } finally {
      setLoading(null);
    }
  };

  // API Routes 병렬 실행 테스트
  const testApiParallel = async () => {
    setLoading("api-parallel");
    setApiResult(null);

    const start = Date.now();
    console.log("[Test] API Routes parallel fetch test started");

    try {
      const [articleRes, commentsRes] = await Promise.all([
        fetch(`/api/article/${articleId}`),
        fetch(`/api/comments/${articleId}`),
      ]);

      const [article, comments] = await Promise.all([
        articleRes.json(),
        commentsRes.json(),
      ]);

      const end = Date.now();
      const totalTime = end - start;

      console.log(
        `[Test] API Routes parallel fetch test completed in ${totalTime}ms`
      );

      setApiResult({
        type: "parallel",
        totalTime,
        article,
        comments,
      });
    } catch (error) {
      console.error("API parallel test error:", error);
      setApiResult({ error: String(error) });
    } finally {
      setLoading(null);
    }
  };

  return (
    <div style={{ padding: "2rem", fontFamily: "monospace" }}>
      <h1>Server Action vs API Routes 병렬성 비교</h1>

      {/* Server Actions Section */}
      <section
        style={{
          marginBottom: "3rem",
          padding: "1.5rem",
          backgroundColor: "#fff3cd",
          borderRadius: "8px",
        }}
      >
        <h2>🔸 Server Actions (PokeAPI)</h2>
        <p>
          <strong>Server Action은</strong> "use server" 디렉티브를 사용하며,
          클라이언트에서 호출 시 직렬화됩니다.
        </p>

        <div style={{ marginTop: "1rem" }}>
          <label>
            Pokemon ID:{" "}
            <input
              type="number"
              value={pokemonId}
              onChange={(e) => setPokemonId(Number(e.target.value))}
              min="1"
              max="150"
              style={{ padding: "0.5rem", fontSize: "1rem", width: "100px" }}
            />
          </label>
        </div>

        <div style={{ display: "flex", gap: "1rem", marginTop: "1rem" }}>
          <button
            onClick={testSerial}
            disabled={loading !== null}
            style={{
              padding: "1rem 2rem",
              fontSize: "1rem",
              cursor: loading ? "not-allowed" : "pointer",
              backgroundColor: loading === "serial" ? "#ccc" : "#f0f0f0",
            }}
          >
            {loading === "serial" ? "실행 중..." : "직렬 실행"}
          </button>

          <button
            onClick={testParallel}
            disabled={loading !== null}
            style={{
              padding: "1rem 2rem",
              fontSize: "1rem",
              cursor: loading ? "not-allowed" : "pointer",
              backgroundColor: loading === "parallel" ? "#ccc" : "#f0f0f0",
            }}
          >
            {loading === "parallel" ? "실행 중..." : "병렬 실행 (Promise.all)"}
          </button>
        </div>
      </section>

      {/* API Routes Section */}
      <section
        style={{
          marginBottom: "3rem",
          padding: "1.5rem",
          backgroundColor: "#d1ecf1",
          borderRadius: "8px",
        }}
      >
        <h2>🔹 API Routes (Prisma)</h2>
        <p>
          <strong>API Routes는</strong> 표준 HTTP 엔드포인트로, 진정한 병렬
          실행을 지원합니다.
        </p>

        <div style={{ marginTop: "1rem" }}>
          <label>
            Article ID:{" "}
            <input
              type="text"
              value={articleId}
              onChange={(e) => setArticleId(e.target.value)}
              style={{ padding: "0.5rem", fontSize: "1rem", width: "300px" }}
            />
          </label>
        </div>

        <div style={{ display: "flex", gap: "1rem", marginTop: "1rem" }}>
          <button
            onClick={testApiSerial}
            disabled={loading !== null}
            style={{
              padding: "1rem 2rem",
              fontSize: "1rem",
              cursor: loading ? "not-allowed" : "pointer",
              backgroundColor: loading === "api-serial" ? "#ccc" : "#f0f0f0",
            }}
          >
            {loading === "api-serial" ? "실행 중..." : "직렬 실행"}
          </button>

          <button
            onClick={testApiParallel}
            disabled={loading !== null}
            style={{
              padding: "1rem 2rem",
              fontSize: "1rem",
              cursor: loading ? "not-allowed" : "pointer",
              backgroundColor: loading === "api-parallel" ? "#ccc" : "#f0f0f0",
            }}
          >
            {loading === "api-parallel"
              ? "실행 중..."
              : "병렬 실행 (Promise.all)"}
          </button>
        </div>
      </section>

      <h2>📊 테스트 결과</h2>

      {/* 직렬 실행 결과 */}
      {serialResult && (
        <div
          style={{
            marginTop: "2rem",
            padding: "1rem",
            backgroundColor: serialResult.error ? "#f8d7da" : "#fff3cd",
            borderRadius: "8px",
          }}
        >
          <h2>직렬 실행 결과 (워터폴 발생)</h2>
          {serialResult.error ? (
            <p style={{ color: "red" }}>Error: {serialResult.error}</p>
          ) : (
            <>
              <p>
                <strong>총 소요 시간:</strong> {serialResult.totalTime}ms
              </p>
              {serialResult.pokemon && (
                <div style={{ marginTop: "1rem" }}>
                  <img
                    src={serialResult.pokemon.sprites}
                    alt={serialResult.pokemon.name}
                  />
                  <p>
                    <strong>Pokemon:</strong> {serialResult.pokemon.name} (
                    {serialResult.pokemon.duration}ms)
                  </p>
                  <p>
                    <strong>Species:</strong> {serialResult.species.name},{" "}
                    {serialResult.species.color} (
                    {serialResult.species.duration}
                    ms)
                  </p>
                  <p>
                    <strong>Ability:</strong> {serialResult.ability.name} (
                    {serialResult.ability.duration}ms)
                  </p>
                </div>
              )}
              <details style={{ marginTop: "1rem" }}>
                <summary>상세 데이터</summary>
                <pre style={{ fontSize: "0.8rem" }}>
                  {JSON.stringify(serialResult, null, 2)}
                </pre>
              </details>
            </>
          )}
        </div>
      )}

      {/* 병렬 실행 결과 */}
      {parallelResult && (
        <div
          style={{
            marginTop: "2rem",
            padding: "1rem",
            backgroundColor: parallelResult.error ? "#f8d7da" : "#d1ecf1",
            borderRadius: "8px",
          }}
        >
          <h2>병렬 실행 결과 (Promise.all)</h2>
          {parallelResult.error ? (
            <p style={{ color: "red" }}>Error: {parallelResult.error}</p>
          ) : (
            <>
              <p>
                <strong>총 소요 시간:</strong> {parallelResult.totalTime}ms
              </p>
              {parallelResult.pokemon && (
                <div style={{ marginTop: "1rem" }}>
                  <img
                    src={parallelResult.pokemon.sprites}
                    alt={parallelResult.pokemon.name}
                  />
                  <p>
                    <strong>Pokemon:</strong> {parallelResult.pokemon.name} (
                    {parallelResult.pokemon.duration}ms)
                  </p>
                  <p>
                    <strong>Species:</strong> {parallelResult.species.name},{" "}
                    {parallelResult.species.color} (
                    {parallelResult.species.duration}ms)
                  </p>
                  <p>
                    <strong>Ability:</strong> {parallelResult.ability.name} (
                    {parallelResult.ability.duration}ms)
                  </p>
                </div>
              )}
              <details style={{ marginTop: "1rem" }}>
                <summary>상세 데이터</summary>
                <pre style={{ fontSize: "0.8rem" }}>
                  {JSON.stringify(parallelResult, null, 2)}
                </pre>
              </details>
            </>
          )}
        </div>
      )}

      {/* API Routes 결과 */}
      {apiResult && (
        <div
          style={{
            marginTop: "2rem",
            padding: "1rem",
            backgroundColor: apiResult.error ? "#f8d7da" : "#d4edda",
            borderRadius: "8px",
          }}
        >
          <h2>
            API Routes {apiResult.type === "serial" ? "직렬" : "병렬"} 실행 결과
          </h2>
          {apiResult.error ? (
            <p style={{ color: "red" }}>Error: {apiResult.error}</p>
          ) : (
            <>
              <p>
                <strong>총 소요 시간:</strong> {apiResult.totalTime}ms
              </p>
              {apiResult.article && (
                <div style={{ marginTop: "1rem" }}>
                  <p>
                    <strong>Article:</strong> {apiResult.article.article?.title}{" "}
                    ({apiResult.article.duration}ms, fetched at{" "}
                    {new Date(apiResult.article.timestamp).toLocaleTimeString()}
                    )
                  </p>
                  <p>
                    <strong>Comments:</strong> {apiResult.comments.count}{" "}
                    comments ({apiResult.comments.duration}ms, fetched at{" "}
                    {new Date(
                      apiResult.comments.timestamp
                    ).toLocaleTimeString()}
                    )
                  </p>
                  <p style={{ marginTop: "0.5rem", color: "#006400" }}>
                    <strong>타임스탬프 차이:</strong>{" "}
                    {Math.abs(
                      new Date(apiResult.article.timestamp).getTime() -
                        new Date(apiResult.comments.timestamp).getTime()
                    )}
                    ms (작을수록 병렬 실행됨)
                  </p>
                </div>
              )}
              <details style={{ marginTop: "1rem" }}>
                <summary>상세 데이터</summary>
                <pre style={{ fontSize: "0.8rem" }}>
                  {JSON.stringify(apiResult, null, 2)}
                </pre>
              </details>
            </>
          )}
        </div>
      )}

      <div
        style={{
          marginTop: "3rem",
          padding: "1rem",
          backgroundColor: "#e7f3ff",
          borderRadius: "8px",
        }}
      >
        <h3>📊 확인 방법</h3>
        <ol>
          <li>
            <strong>네트워크 탭:</strong> Server Action은 Next.js 서버로, API
            Routes는 /api/* 엔드포인트로 요청
          </li>
          <li>
            <strong>서버 터미널:</strong> pnpm dev 실행 중인 터미널에서
            타임스탬프 로그 확인
          </li>
          <li>
            <strong>Server Actions:</strong> Promise.all()을 써도 직렬화됨
            (타임스탬프가 순차적)
          </li>
          <li>
            <strong>API Routes:</strong> Promise.all()로 진정한 병렬 실행 가능
            (타임스탬프가 동시)
          </li>
        </ol>
        <p style={{ marginTop: "1rem", color: "#cc0000" }}>
          <strong>핵심 결론:</strong> 대시보드처럼 독립적인 여러 데이터를 병렬로
          fetch해야 한다면, Server Actions보다 API Routes를 사용해야 합니다!
        </p>
      </div>
    </div>
  );
}
