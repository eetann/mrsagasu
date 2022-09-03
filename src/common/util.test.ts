import {
  convertDescriptionXML,
  escapeRegExp,
  escapeXML,
  searchBookmarksFromRegExp,
} from "./util";
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
    startIndex: number;
    lastIndex: number;
    expected: string;
  };
  test.each<TestCase>([
    {
      title: "example",
      url: "http://example.com/",
      startIndex: 1,
      lastIndex: 4,
      expected:
        "<dim>e</dim><match>xamp</match><dim>le</dim><url>http://example.com/</url>",
    },
    {
      title: "example",
      url: "http://example.com/",
      startIndex: 3,
      lastIndex: 6,
      expected:
        "<dim>exa</dim><match>mple</match><dim></dim><url>http://example.com/</url>",
    },
  ])("%s", ({ title, url, startIndex, lastIndex, expected }) => {
    expect(convertDescriptionXML(title, url, startIndex, lastIndex)).toBe(
      expected
    );
  });
});

describe("convert to XML for omnibox description", () => {
  const allBookmarks: chrome.bookmarks.BookmarkTreeNode[] = [
    {
      id: "1",
      title: "example",
      url: "http://example.com/",
    },
    {
      id: "2",
      title: "eetann",
      url: "https://github.com/eetann",
    },
    {
      id: "3",
      title: "developer dashboard",
      url: "http://example.com/",
    },
    {
      id: "4",
      title: "hoge ? hoge foo bar",
      url: "http://example.com/",
    },
    {
      id: "5",
      title: "",
      url: "http://example.com/",
    },
    {
      id: "6",
      title: "hoge hoge foo bar",
      url: "http://example.com/",
    },
  ];
  type TestCase = {
    text: string;
    expected: chrome.omnibox.SuggestResult[];
  };
  test.each<TestCase>([
    {
      text: "eetann",
      expected: [
        {
          content: "https://github.com/eetann",
          description:
            "<dim></dim><match>eetann</match><dim></dim><url>https://github.com/eetann</url>",
        },
      ],
    },
    {
      text: "ee",
      expected: [
        {
          content: "https://github.com/eetann",
          description:
            "<dim></dim><match>ee</match><dim>tann</dim><url>https://github.com/eetann</url>",
        },
        {
          content: "http://example.com/",
          description:
            "<dim>d</dim><match>eve</match><dim>loper dashboard</dim><url>http://example.com/</url>",
        },
        {
          content: "http://example.com/",
          description:
            "<dim>hog</dim><match>e hoge</match><dim> foo bar</dim><url>http://example.com/</url>",
        },
        {
          content: "http://example.com/",
          description:
            "<dim></dim><match>example</match><dim></dim><url>http://example.com/</url>",
        },
        {
          content: "http://example.com/",
          description:
            "<dim>hog</dim><match>e ? hoge</match><dim> foo bar</dim><url>http://example.com/</url>",
        },
      ],
    },
  ])("%s", ({ text, expected }) => {
    expect(searchBookmarksFromRegExp(text, allBookmarks)).toStrictEqual(
      expected
    );
  });
});
