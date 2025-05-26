import {
  Flex,
  Box,
  Input,
  IconButton,
  Avatar,
  Menu,
  MenuButton,
  MenuList,
  MenuItem,
  AvatarBadge,
} from "@chakra-ui/react";
import { Link as RouterLink } from "react-router-dom";
import {
  SearchIcon,
  BellIcon,
  EmailIcon,
  InfoOutlineIcon,
  AddIcon,
  ExternalLinkIcon,
  RepeatIcon,
  EditIcon,
} from "@chakra-ui/icons";
import { useSelector } from "react-redux";

const Navbar = () => {
  const { user } = useSelector((state) => state.auth);

  return (
    <Flex
      align="center"
      justify="space-between"
      wrap="wrap"
      px={6}
      py={3}
      bg="rgba(17,24,39,0.85)"
      style={{ backdropFilter: 'blur(8px)' }}
      borderBottom="1px solid"
      borderColor="gray.800"
      color="white"
      minH="64px"
      w="100%"
      ml={0}
      mt={0}
      position="sticky"
      top={0}
      zIndex={100}
    >
      {/* Search bar */}
      <Flex alignItems="center">
        <Box display={{ base: "none", md: "block" }} mr={4}>
          <IconButton
            aria-label="Search"
            icon={<SearchIcon color="gray.300" />}
            colorScheme="gray"
            borderRadius="50%"
            bg="transparent"
            _hover={{ bg: "gray.700" }}
          />
        </Box>
        <Input
          placeholder="Search..."
          bg="gray.800"
          color="gray.100"
          border="1px solid"
          borderColor="gray.700"
          borderRadius="md"
          width={{ base: "full", md: "250px" }}
          _hover={{ borderColor: "gray.500" }}
          _focus={{ borderColor: "blue.400" }}
          _placeholder={{ color: "gray.400" }}
        />
      </Flex>

      {/* Right side */}
      <Flex alignItems="center" mr={0}>
        {/* Notification icons */}
        <IconButton
          aria-label="Notifications"
          icon={<BellIcon color="gray.300" />}
          colorScheme="gray"
          borderRadius="50%"
          mr={2}
          bg="transparent"
          _hover={{ bg: "gray.700" }}
        />
        <IconButton
          aria-label="Messages"
          icon={<EmailIcon color="gray.300" />}
          colorScheme="gray"
          borderRadius="50%"
          mr={2}
          bg="transparent"
          _hover={{ bg: "gray.700" }}
        />
        <IconButton
          aria-label="Info"
          icon={<InfoOutlineIcon color="gray.300" />}
          colorScheme="gray"
          borderRadius="50%"
          mr={2}
          bg="transparent"
          _hover={{ bg: "gray.700" }}
        />

        <Box as="span" mr={4} fontWeight="bold" color="gray.100">
          Welcome back {user?.firstName ?? "User"}!
        </Box>

        {/* User profile */}
        <Menu>
          <MenuButton
            as={Avatar}
            bg="black"
            color="white"
            src={user?.avatar}
            name={`${user?.firstName ?? "Unknown"} ${user?.lastName ?? "User"}`}
            boxSize="40px"
            aria-label="Options"
            variant="outline"
          >
            <AvatarBadge boxSize="0.9em" bg="green.500" />
          </MenuButton>
          <MenuList bg="gray.900" color="gray.100" borderColor="gray.700">
            <MenuItem
              as={RouterLink}
              to="/profile"
              icon={<AddIcon color="gray.300" />}
              _hover={{ bg: "gray.700" }}>
              Profile
            </MenuItem>
            <MenuItem icon={<ExternalLinkIcon color="gray.300" />}>New Window</MenuItem>
            <MenuItem icon={<RepeatIcon color="gray.300" />}>Open Closed Tab</MenuItem>
            <MenuItem icon={<EditIcon color="gray.300" />}>Open File...</MenuItem>
          </MenuList>
        </Menu>
      </Flex>
    </Flex>
  );
};

export default Navbar;
