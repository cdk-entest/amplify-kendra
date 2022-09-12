import {
  Box,
  Center,
  chakra,
  Kbd,
  Flex,
  Modal,
  ModalBody,
  ModalContent,
  ModalOverlay,
  useDisclosure,
  useUpdateEffect,
  useEventListener,
  HStack,
  Text,
  VisuallyHidden,
  HTMLChakraProps,
} from "@chakra-ui/react";

import { SearchIcon } from "@chakra-ui/icons";
import Link from 'next/link'
import MultiRef from 'react-multi-ref'
import { useState } from "react";
import scrollIntoView from 'scroll-into-view-if-needed'
import * as React from 'react'
import { search } from "../services/kendra-search";

const ACTION_KEY_DEFAULT = ['Ctrl', 'Control']
const ACTION_KEY_APPLE = ['⌘', 'Command']

export const SearchButton = React.forwardRef(function SearchButton(
  props: HTMLChakraProps<'button'>,
  ref: React.Ref<HTMLButtonElement>,
) {
  const [actionKey, setActionKey] = React.useState<string[]>(ACTION_KEY_APPLE)
  React.useEffect(() => {
    if (typeof navigator === 'undefined') return
    const isMac = /(Mac|iPhone|iPod|iPad)/i.test(navigator.platform)
    if (!isMac) {
      setActionKey(ACTION_KEY_DEFAULT)
    }
  }, [])

  return (
    <chakra.button
      flex='1'
      type='button'
      mx='6'
      ref={ref}
      lineHeight='1.2'
      w='100%'
      bg='white'
      whiteSpace='nowrap'
      display={{ base: 'none', sm: 'flex' }}
      alignItems='center'
      color='gray.600'
      _dark={{ bg: 'gray.700', color: 'gray.400' }}
      py='3'
      px='4'
      outline='0'
      _focus={{ shadow: 'outline' }}
      shadow='base'
      rounded='md'
      {...props}
    >
      <SearchIcon />
      <HStack w='full' ml='3' spacing='4px'>
        <Text textAlign='left' flex='1'>
          Search the docs
        </Text>
        <HStack spacing='4px'>
          <VisuallyHidden>
            {('component.algolia-search.press')}{' '}
          </VisuallyHidden>
          <Kbd rounded='2px'>
            <chakra.div
              as='abbr'
              title={actionKey[1]}
              textDecoration='none !important'
            >
              {actionKey[0]}
            </chakra.div>
          </Kbd>
          <VisuallyHidden> {('component.algolia-search.and')} </VisuallyHidden>
          <Kbd rounded='2px'>K</Kbd>
          <VisuallyHidden>
            {' '}
            {('component.algolia-search.to-search')}
          </VisuallyHidden>
        </HStack>
      </HStack>
    </chakra.button>
  )
})


export const SearchUI = () => {
  const [query, setQuery] = React.useState('')
  const [results, setResults] = React.useState([])
  const modal = useDisclosure();
  const menu = useDisclosure();
  const [active, setActive] = useState(0)
  const eventRef = React.useRef<'mouse' | 'keyboard'>(null)
  const menuRef = React.useRef<HTMLDivElement>(null)
  const [menuNodes] = React.useState(() => new MultiRef<number, HTMLElement>())


  useEventListener('keydown', (event) => {
    const isMac = /(Mac|iPhone|iPod|iPad)/i.test(navigator?.platform)
    const hotkey = isMac ? 'metaKey' : 'ctrlKey'
    if (event?.key?.toLowerCase() === 'k' && event[hotkey]) {
      event.preventDefault()
      modal.isOpen ? modal.onClose() : modal.onOpen()
      setResults([])
    }
  })

  React.useEffect(() => {
    if (modal.isOpen && query.length > 0) {
      setQuery('')
    }
  }, [modal.isOpen])


  const onKeyDown = React.useCallback(
    (e: React.KeyboardEvent) => {
      eventRef.current = 'keyboard'
      switch (e.key) {
        case 'ArrowDown': {
          e.preventDefault()
          if (active + 1 < results.length) {
            setActive(active + 1)
          }
          break
        }
        case 'ArrowUp': {
          e.preventDefault()
          if (active - 1 >= 0) {
            setActive(active - 1)
          }
          break
        }
        case 'Control':
        case 'Alt':
        case 'Shift': {
          e.preventDefault()
          break
        }
        case 'Enter': {

          console.log("search for me ", query)

          onKeyDownSearch()

          if (results?.length <= 0) {
            break
          }

          // modal.onClose()
          break
        }
      }
    },
    [active, modal, results],
  )

  const onKeyDownSearch = async () => {
    const items = await search(query)
    setResults(items)
  }


  const onKeyUp = React.useCallback((e: React.KeyboardEvent) => {
    eventRef.current = 'keyboard'
    switch (e.key) {
      case 'Control':
      case 'Alt':
      case 'Shift': {
        e.preventDefault()
      }
    }
  }, [])


  useUpdateEffect(() => {
    if (!menuRef.current || eventRef.current === 'mouse') return
    const node = menuNodes.map.get(active)
    if (!node) return
    scrollIntoView(node, {
      scrollMode: 'if-needed',
      block: 'nearest',
      inline: 'nearest',
      boundary: menuRef.current,
    })
  }, [active])



  return (
    <Flex
      margin={'auto'}
      justify={'flex-end'}
      w={'100%'}
      align={'center'}
      color={'gray.400'}
      maxW={'1100px'}
    >
      <SearchButton onClick={modal.onOpen}></SearchButton>
      <Modal
        scrollBehavior="inside"
        isOpen={modal.isOpen}
        onClose={modal.onClose}
      >
        <ModalOverlay></ModalOverlay>
        <ModalContent
          role={"combobox"}
          aria-expanded="true"
          aria-haspopup="listbox"
          rounded={"lg"}
          overflow={"hidden"}
          top={"4vh"}
          bg={"transparent"}
          shadow={"lg"}
          maxW={"600px"}
        >
          <Flex pos={"relative"} align="stretch">
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
                bg: "white",
                ".chakra-ui-dark &": { bg: "gray.700" },
              }}
              placeholder="Search the docs"
              value={query}
              onChange={(e) => {
                setQuery(e.target.value)
                console.log(query)
                menu.onOpen()
              }}
              onKeyDown={onKeyDown}
              onKeyUp={onKeyUp}
            ></chakra.input>
            <Center pos={"absolute"} left={7} h={"68px"}>
              <SearchIcon color={"teal.500"} boxSize={"20px"}></SearchIcon>
            </Center>
          </Flex>
          <ModalBody maxH={'66vh'} p={0}>
            <Box
              sx={{
                px: 4,
                bg: "white",
                '.chakra-ui-dark': { bg: 'gray.700' }
              }}
            >
              <Box
                as="ul"
                role={'listbox'}
                borderTopWidth="1px"
                pt={2}
                pb={4}
              >
                {
                  results.map((item, idx) => {
                    const selected = idx === active
                    const isLvl1 = true

                    return (
                      <Link href={item['DocumentId']} key={idx} passHref >
                        <a target={"_blank"}>
                          <Box
                            id={`search-item-${idx}`}
                            as='li'
                            aria-selected={selected ? true : undefined}
                            onMouseEnter={() => {
                              setActive(idx)
                              eventRef.current = 'mouse'
                            }}
                            role={'option'}
                            sx={{
                              display: 'flex',
                              flexDirection: 'column',
                              minH: 16,
                              mt: 2,
                              px: 4,
                              py: 2,
                              rounded: 'lg',
                              bg: 'gray.100',
                              '.chakra-ui-dark &': { bg: 'gray.600' },
                              _selected: {
                                bg: 'teal.500',
                                color: 'white',
                                mark: {
                                  color: 'white',
                                  textDecoration: 'underline'
                                }
                              }
                            }}
                          >
                            <Text>{item['DocumentId']}</Text>
                          </Box>
                        </a>
                      </Link>
                    )
                  })
                }
              </Box>
            </Box>
          </ModalBody>
        </ModalContent>
      </Modal>
    </Flex>
  );
};
