import { useState, useMemo } from "react";
import {
  Card,
  CardHeader,
  CardBody,
  CardFooter,
  Text,
  Heading,
  Button,
  SimpleGrid,
  Link,
  Center,
  useDisclosure,
  Box,
  VStack,
  Spinner,
  Input,
  Image,
  Avatar,
} from "@chakra-ui/react";
import { Link as RouterLink } from "react-router-dom";
import { useGetCompaniesListQuery } from "@/features/api/companies";
import { AddIcon, DeleteIcon } from "@chakra-ui/icons";
import CreateCompanyForm from "./CreateCompanyForm";
import CompanyDelete from "./CompanyDelete";
import Icons from "./CompaniesIcons";

const CompaniesList = () => {
  const { data: companies, error, isLoading } = useGetCompaniesListQuery();
  const {
    isOpen: isOpAddMod,
    onOpen: onOpAddMod,
    onClose: closeAddMod,
  } = useDisclosure();
  const {
    isOpen: isOpDeleteMod,
    onOpen: onOpDeleteMod,
    onClose: closeDeleteMod,
  } = useDisclosure();
  const [deleteCompany, setDeleteCompany] = useState(null);
  const [deleteCompanyName, setDeleteCompanyName] = useState("");
  const [searchTerm, setSearchTerm] = useState("");

  const handleDeleteClick = (company) => {
    setDeleteCompany(company._id);
    setDeleteCompanyName(company.name);
    onOpDeleteMod();
  };

  const filteredCompanies = useMemo(() => {
    return companies?.filter(
      (company) =>
        company.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        company.industry.toLowerCase().includes(searchTerm.toLowerCase()),
    );
  }, [companies, searchTerm]);

  const getRandomIcon = () => {
    const iconKeys = Object.keys(Icons);
    const randomKey = iconKeys[Math.floor(Math.random() * iconKeys.length)];
    return Icons[randomKey];
  };

  if (isLoading) {
    return (
      <Center height="100vh" bgGradient="linear(to-br, gray.900, slate.800, gray.900)">
        <Spinner size="xl" />
      </Center>
    );
  }

  if (error) {
    return (
      <Center height="100vh" className="px-4" bgGradient="linear(to-br, gray.900, slate.800, gray.900)">
        <Text color="red.500">{error.message}</Text>
      </Center>
    );
  }

  return (
    <Box px={0} py={0} minH="100vh" bg="transparent">
      <Heading as="h1" size="xl" mb={6} color="gray.100">
        Companies
      </Heading>
      <Input
        placeholder="Search by name or industry"
        value={searchTerm}
        onChange={(e) => setSearchTerm(e.target.value)}
        mb={4}
        bg="gray.800"
        color="gray.100"
        borderColor="gray.700"
        _placeholder={{ color: "gray.400" }}
      />
      <SimpleGrid spacing={6} templateColumns="repeat(auto-fill, minmax(250px, 1fr))">
        {filteredCompanies.map((company) => {
          const IconComponent = getRandomIcon();
          return (
            <Card
              key={company._id}
              bg="gray.900"
              color="gray.100"
              boxShadow="lg"
              rounded="md"
              borderWidth={1}
              borderColor="gray.700">
              <CardBody>
                <Center>
                  <VStack>
                    {company.logo ? (
                      <Box borderRadius="50px" color="white" bg="none">
                        <Image as={Avatar} src={company.logo} />
                      </Box>
                    ) : (
                      <Box borderRadius="50px" p={2} color="white" bg="gray.700">
                        <IconComponent size={40} />
                      </Box>
                    )}
                    <Text color="gray.100">{company.name}</Text>
                  </VStack>
                </Center>
                <Text fontSize="lg" color="gray.400">
                  Industry: {company.industry}
                </Text>
                {company.ownership && (
                  <Text fontSize="lg" color="gray.400">
                    Owner: {company.ownership}
                  </Text>
                )}
                <Text mt={2} fontSize="md" color="blue.400">
                  <Link href={company.website} isExternal>
                    {company.website}
                  </Link>
                </Text>
              </CardBody>
              <CardFooter justify="space-between">
                <Button
                  bg="black"
                  color="white"
                  as={RouterLink}
                  to={`/companies/${company._id}`}>
                  View details
                </Button>
                <Button
                  onClick={() => handleDeleteClick(company)}
                  bg="gray.700"
                  color="red.400"
                  ml={2}
                  leftIcon={<DeleteIcon color="red.400" />}>
                  Delete
                </Button>
              </CardFooter>
            </Card>
          );
        })}
        <Card
          bg="gray.900"
          color="gray.100"
          boxShadow="lg"
          rounded="md"
          borderWidth={1}
          borderColor="gray.700"
          _hover={{ bg: "gray.800", boxShadow: "2xl" }}>
          <CardHeader bg="gray.900">
            <Heading size="md" color="gray.100">
              <Center>Add new company</Center>
            </Heading>
          </CardHeader>
          <CardBody as="button" onClick={onOpAddMod}>
            <Center height="100%">
              <Box
                alignContent="center"
                justifyContent="center"
                borderRadius="50%"
                w={40}
                h={40}
                borderWidth={3}
                borderColor="gray.500">
                <AddIcon color="gray.500" w={20} h={20} />
              </Box>
            </Center>
          </CardBody>
        </Card>
      </SimpleGrid>
      <CreateCompanyForm isOpen={isOpAddMod} onClose={closeAddMod} />
      <CompanyDelete
        companyName={deleteCompanyName}
        company={deleteCompany}
        isOpen={isOpDeleteMod}
        onClose={closeDeleteMod}
      />
    </Box>
  );
};

export default CompaniesList;
