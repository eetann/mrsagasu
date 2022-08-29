import { convertDescriptionXML, escapeRegExp, escapeXML } from "./util";
import { describe, expect, test } from "vitest";

describe("escape for XML", () => {
  type TestCase = {
    input: string;
    expected: string;
  };
  test.each<TestCase>([
    { input: "Kerry", expected: "Kerry" },
    { input: "Kerry's voice", expected: "Kerry&apos;s voice" },
    { input: "Kerry & V", expected: "Kerry &amp; V" },
    { input: 'Kerry said, "Hey"', expected: "Kerry said, &quot;Hey&quot;" },
    { input: "<Kerry></Kerry>", expected: "&lt;Kerry&gt;&lt;/Kerry&gt;" },
  ])("%s", ({ input, expected }) => {
    expect(escapeXML(input)).toBe(expected);
  });
});

describe("escape for escapeRegExp", () => {
  type TestCase = {
    input: string;
    expected: string;
  };
  test.each<TestCase>([
    { input: "Kerry.", expected: "Kerry\\." },
    { input: "Kerry * V", expected: "Kerry \\* V" },
    { input: "Kerry?", expected: "Kerry\\?" },
    { input: "Kerry ^^", expected: "Kerry \\^\\^" },
    { input: "Kerry = music artist", expected: "Kerry \\= music artist" },
    { input: "Kerry!", expected: "Kerry\\!" },
    { input: "Kerry: Hey.", expected: "Kerry\\: Hey\\." },
    { input: "$Kerry", expected: "\\$Kerry" },
    { input: "{Kerry}", expected: "\\{Kerry\\}" },
    { input: "(Kerry)", expected: "\\(Kerry\\)" },
    { input: "Kerry | V", expected: "Kerry \\| V" },
    { input: "[Kerry]", expected: "\\[Kerry\\]" },
    { input: "Kerry / \\", expected: "Kerry \\/ \\\\" },
    { input: "Kerry (* v *)/", expected: "Kerry \\(\\* v \\*\\)\\/" },
  ])("%s", ({ input, expected }) => {
    expect(escapeRegExp(input)).toBe(expected);
  });
});

describe("convert to XML for omnibox description", () => {
  type TestCase = {
    title: string;
    url: string;
    expected: string;
  };
  test.each<TestCase>([
    {
      title: "aaaaaa",
      url: "http://example.com/",
      expected: "<dim>aaaaaa</dim><url>http://example.com/</url>",
    },
  ])("%s", ({ title, url, expected }) => {
    expect(convertDescriptionXML(title, url)).toBe(expected);
  });
});
