import { Box, Text, Flex, useColorModeValue } from "@chakra-ui/react";
import LogoIcon from "@/assets/logo.png";


const Logo = () => {
  const textColor = useColorModeValue("gray.800", "gray.200");
  const shadowColor = useColorModeValue("rgba(0, 0, 0, 0.3)", "rgba(255, 255, 255, 0.3)");

  return (
    <Flex align="center" justify="center" position="fixed" mt={4} bg="white">
      <img src={LogoIcon} alt="logo" width={100} height={100} />
    </Flex>
  );
};

export default Logo;
