---
title: Kendra Search
description: build a search with amplify rest api and kendra search
author: haimtran
publishedDate: 13/09/2022
date: 2022-09-13
---

## Introduction

[GitHub](https://github.com/entest-hai/amplify-kendra) shows how to use Amplify and Kendra to build a search

- amplify add rest api lambda
- setup kendra search index
- expose kendra search via lambda rest api

<LinkedImage
  href="https://youtu.be/0z_hqB4wh_Y"
  height={400}
  alt="Kendra Search"
  src="/thumbnail/kendra-search.png"
/>

## NextJS Setup

create a new project

```bash
npx create-next-app@latest --typescript
```

install dependencies

```bash
npm i @chakra-ui/react @emotion/react @emotion/styled framer-motion react-icons @chakra-ui/icons aws-amplify
```

## Amplify Setup

This will setup a new amplify project with a rest api which will query the kendra service.

init a project

```bash
amplify init
```

add auth

```bash
amplify add auth
```

add api and select rest (lambda backed), then select running time python 3.8 required. We can select both authenticated and guest users can use this api.

```
amplify add api
```

## Kendra Setup

This step will take about 30 minutes for the Kendra to indexing data sources.

- create a index
- provide the source for example a web crawler
- provide the web url for the crawler
- tune some parameters such as depth

then we can call the api which send a query to kendra as below

```tsx
import axios from "axios";
import config from "./../../config";

export const search = async (query: string) => {
  const { data, status } = await axios.get<any>(
    `${config.kendra_url}/query?query=${query}`
  );

  if (status === 200) {
    console.log(data["ResultItems"]);
    return data["ResultItems"];
  } else {
    console.log("error", status);
    return [];
  }
};
```

## FrontEnd

when the enter pressed we need to capture input query and perform a search. This is done by using onKeyDown function. It is nicer to use modal popup for search.

```tsx
<chakra.input
  aria-autocomplete="list"
  autoComplete="off"
  autoCorrect="off"
  spellCheck="false"
  maxLength={64}
  sx={{
    w: "100%",
    h: "68px",
    pl: "68px",
    fontWeight: "medium",
    outline: 0,
    bg: "gray.200",
    _focus: { shadow: "outline" },
    rounded: "7px",
    ".chakra-ui-dark &": { bg: "gray.700" },
  }}
  placeholder="Search the docs"
  value={query}
  onChange={(e) => {
    setQuery(e.target.value);
  }}
  onKeyDown={(e: React.KeyboardEvent) => {
    if (e.key === "Enter") {
      console.log("search for ", query);
      callSearch(query);
    }
  }}
```
