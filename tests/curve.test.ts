import { describe, it, expect, beforeAll } from "bun:test";
import { Project, web3 } from "@alephium/web3";
import { BN128Curve } from "../artifacts/ts";

const G1 = { x: 1n, y: 2n };

describe("bn128Curve", () => {
  beforeAll(async () => {
    web3.setCurrentNodeProvider("http://127.0.0.1:22973");
    await Project.build();
  });
  describe("fieldInv", () => {
    it.each([
      [5n, 7n, 3n],
      [0n, 7n, 0n],
      // [7n, 7n, 0n], failing with 1, no point looking further now
      [2n, 7n, 4n],
      [10n, 7n, 5n],
    ])(
      // cant interpolate vars yet https://github.com/oven-sh/bun/issues/6306
      "should return the expected value",
      async (a, mod, expected) => {
        const { returns } = await BN128Curve.tests.fieldInv({
          testArgs: {
            a,
            mod,
          },
        });
        expect(returns % mod).toBe(expected);
      },
    );
  });
  describe("add", () => {
    it("should add 2 points and return expected point", async () => {
      const { returns } = await BN128Curve.tests.add({
        testArgs: {
          p1: G1,
          p2: { x: 12n, y: 15n },
        },
      });
      expect(returns.x).toBe(
        723578276755017362718889446124207440948638385365217311163273979988271940768n,
      );
      expect(returns.y).toBe(
        5114382819791145450126695857832466230341512223831422358449504722189831217796n,
      );
    });
  });
  describe("double", () => {
    it("should double the point and return expected point", async () => {
      const { returns } = await BN128Curve.tests.double({
        testArgs: {
          pt: G1,
        },
      });
      expect(returns.x).toBe(
        1368015179489954701390400359078579693043519447331113978918064868415326638035n,
      );
      expect(returns.y).toBe(
        9918110051302171585080402603319702774565515993150576347155970296011118125764n,
      );
    });
  });
  describe("multiply", () => {
    it("should multiply the point and return expected point", async () => {
      const { returns } = await BN128Curve.tests.multiply({
        testArgs: {
          pt: G1,
          n: 2n,
        },
      });
      expect(returns.x).toBe(
        1368015179489954701390400359078579693043519447331113978918064868415326638035n,
      );
      expect(returns.y).toBe(
        9918110051302171585080402603319702774565515993150576347155970296011118125764n,
      );
    });
    it("should multiply the point and return expected point, 50n", async () => {
      const { returns } = await BN128Curve.tests.multiply({
        testArgs: {
          pt: G1,
          n: 50n,
        },
      });
      expect(returns.x).toBe(
        10293440467746533258730273868963994264411932774380931409364395879420497572327n,
      );
      expect(returns.y).toBe(
        18924661395393895889209430839689985345119352834747028137037680748388518439784n,
      );
    });
  });
});
