import assert from "node:assert/strict";
import { mkdtemp, mkdir, rm, writeFile } from "node:fs/promises";
import { createServer, get, type IncomingHttpHeaders } from "node:http";
import type { AddressInfo } from "node:net";
import { tmpdir } from "node:os";
import path from "node:path";
import test from "node:test";
import { createApp } from "../server/index";

test("HTML fallback confines raw HTTP paths and preserves valid routes and redirects", async t => {
  const directory = await mkdtemp(path.join(tmpdir(), "wsc-static-server-"));
  t.after(() => rm(directory, { recursive: true, force: true }));
  const publicDirectory = path.join(directory, "public");
  await mkdir(path.join(publicDirectory, "tennis"), { recursive: true });
  await mkdir(path.join(publicDirectory, "assets"));
  await Promise.all([
    writeFile(path.join(publicDirectory, "index.html"), "Public homepage"),
    writeFile(
      path.join(publicDirectory, "tennis/adult.html"),
      "Public adult tennis"
    ),
    writeFile(path.join(publicDirectory, "404.html"), "Public not found"),
    writeFile(
      path.join(publicDirectory, "assets/example.js"),
      "console.log('public asset')"
    ),
    writeFile(
      path.join(directory, "outside.html"),
      "Harmless fixture outside the public root"
    ),
  ]);
  const server = createServer(createApp(publicDirectory));
  await new Promise<void>((resolve, reject) => {
    server.once("error", reject);
    server.listen(0, "127.0.0.1", resolve);
  });
  t.after(
    () =>
      new Promise<void>((resolve, reject) =>
        server.close(error => (error ? reject(error) : resolve()))
      )
  );
  const port = (server.address() as AddressInfo).port;
  const request = (requestPath: string) =>
    new Promise<{
      status: number | undefined;
      headers: IncomingHttpHeaders;
      body: string;
    }>((resolve, reject) => {
      // Pass path directly: fetch/new URL would normalize literal '..' before sending.
      get(
        { host: "127.0.0.1", port, path: requestPath, agent: false },
        response => {
          let body = "";
          response.setEncoding("utf8");
          response.on("data", chunk => {
            body += chunk;
          });
          response.on("end", () =>
            resolve({
              status: response.statusCode,
              headers: response.headers,
              body,
            })
          );
          response.on("error", reject);
        }
      ).on("error", reject);
    });

  for (const requestPath of [
    "/../outside",
    "/tennis/../../outside",
    "/%2e%2e/outside",
    "/..%2foutside",
    "/%2e%2e%2foutside",
    "/%252e%252e%252foutside",
    "/../outside.html",
    "/%2e%2e/outside.html",
  ]) {
    const response = await request(requestPath);
    assert.equal(response.status, 404, requestPath);
    assert.equal(response.body, "Public not found", requestPath);
  }
  for (const [requestPath, expected] of [
    ["/", "Public homepage"],
    ["/tennis/adult?utm_source=check", "Public adult tennis"],
    ["/tennis/adult.html", "Public adult tennis"],
  ]) {
    const response = await request(requestPath);
    assert.equal(response.status, 200, requestPath);
    assert.equal(response.body, expected, requestPath);
  }
  for (const requestPath of ["/404", "/missing"]) {
    const response = await request(requestPath);
    assert.equal(response.status, 404);
    assert.equal(response.body, "Public not found");
  }
  const redirect = await request("/driving-range?utm_source=check");
  assert.equal(redirect.status, 301);
  assert.equal(
    redirect.headers.location,
    "/golf/driving-range?utm_source=check"
  );
  const privacy = await request("/privacy?utm_source=check");
  assert.equal(privacy.status, 301);
  assert.equal(privacy.headers.location, "/policies?utm_source=check#privacy");
  const asset = await request("/assets/example.js");
  assert.equal(asset.status, 200);
  assert.equal(
    asset.headers["cache-control"],
    "public, max-age=31536000, immutable"
  );
  assert.equal(asset.headers["x-content-type-options"], "nosniff");
});
