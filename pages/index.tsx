import type { NextPage } from "next";
import { useState } from "react";
import { Flex, Text, chakra, Center } from "@chakra-ui/react";
import * as React from "react";
import Link from "next/link";
import { SearchIcon } from "@chakra-ui/icons";
import { search } from "../src/services/kendra-search";

const ListItem = ({ items }: { items: [] }) => {
  return (
    <div>
      {items.map((item, idx) => (
        <Flex
          direction={"column"}
          key={idx}
          backgroundColor={"green.100"}
          margin={"auto"}
          marginTop={"10px"}
          padding={"10px"}
        >
          <Text>{item["DocumentId"]}</Text>
          <Text>{item["DocumentTitle"]["Text"]}</Text>
          <Text>{item["DocumentURI"]}</Text>
          <Text>{item["DocumentExcerpt"]["Text"]}</Text>
        </Flex>
      ))}
    </div>
  );
};

const ACTION_KEY_DEFAULT = ["Ctrl", "Control"];
const ACTION_KEY_APPLE = ["⌘", "Command"];

const Home: NextPage = () => {
  const [items, setItems] = useState<any>([]);
  const [query, setQuery] = useState("xxx");
  const eventRef = React.useRef<"mouse" | "keyboard">(null);

  const callSearch = async (query: string) => {
    if (query) {
      const result = await search(query);
      setItems(result);
    }
  };

  return (
    <Flex direction={"column"} maxW={"1100px"} margin="auto">
      <Flex pos={"relative"} align="stretch" marginTop={"10px"}>
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
        ></chakra.input>
        <Center pos={"absolute"} left={7} h={"68px"}>
          <SearchIcon color={"teal.500"} boxSize={"20px"}></SearchIcon>
        </Center>
      </Flex>
      {items.length > 0 && <ListItem items={items}></ListItem>}
    </Flex>
  );
};

export default Home;
