import {
  Box,
  Card,
  CardBody,
  Divider,
  Grid,
  GridItem,
  HStack,
  Heading,
  Spinner,
  Stack,
  Text,
  Tabs,
  TabList,
  TabPanels,
  Tab,
  TabPanel,
  Image,
  Avatar,
  Center,
  VStack,
} from "@chakra-ui/react";
import { FaRegBuilding, FaDollarSign } from "react-icons/fa";
import { LiaUsersSolid } from "react-icons/lia";
import { IoStarSharp } from "react-icons/io5";
import { useParams } from "react-router-dom";
import CompanyForm from "./CompanyForm";
import { useGetCompanyByIdQuery } from "@/features/api/companies";

const CompanyDetails = () => {
  const { companyId } = useParams();
  const { data: company, error, isLoading } = useGetCompanyByIdQuery(companyId);

  if (isLoading) {
    return (
      <Box display="flex" justifyContent="center" alignItems="center" height="100vh">
        <Spinner size="xl" />
      </Box>
    );
  }

  if (error) {
    return (
      <Box display="flex" justifyContent="center" alignItems="center" height="100vh">
        <Text>Error: {error.message}</Text>
      </Box>
    );
  }

  if (!company) {
    return (
      <Box display="flex" justifyContent="center" alignItems="center" height="100vh">
        <Heading>No company found for ID: {companyId}</Heading>
      </Box>
    );
  }
  return (
    <Box px={0} py={0} minH="100vh" bg="gray.900">
      <Heading mb={4} textAlign="center" color="gray.100">
        {company.name}
      </Heading>

      <Tabs variant="soft-rounded" colorScheme="blue">
        <TabList>
          <Tab>General</Tab>
          <Tab>Edit</Tab>
          <Tab>Future Needs</Tab>
        </TabList>

        <TabPanels>
          <TabPanel>
            <Center>
              <Card
                maxW="lg"
                w="100%"
                bg="gray.900"
                color="gray.100"
                boxShadow="lg"
                rounded="md"
                borderWidth={1}
                borderColor="gray.700"
              >
                <CardBody>
                  <Center>
                    <VStack>
                      {company.logo ? (
                        <Box borderRadius="50px" color="white" bg="none">
                          <Image as={Avatar} src={company.logo} boxSize="70px" />
                        </Box>
                      ) : (
                        <Box borderRadius="50px" p={2} color="white" bg="gray.700">
                          <FaRegBuilding color="rgba(54, 162, 235, 0.54)" size="70px" />
                        </Box>
                      )}
                      <Text color="gray.100" fontWeight="bold" fontSize="xl">
                        {company.name}
                      </Text>
                    </VStack>
                  </Center>
                  <Text fontSize="md" color="gray.400" mt={2}>
                    Industry: {company.industry}
                  </Text>
                  <Text fontSize="md" color="gray.400">
                    Type: {company.companyType}
                  </Text>
                  <Text fontSize="md" color="blue.400">
                    Website: {company.website}
                  </Text>
                  <Divider my={3} borderColor="gray.700" />
                  <Text color="gray.400">{company.description}</Text>
                </CardBody>
              </Card>
            </Center>
            <Grid
              templateRows={{ base: "repeat(3, 1fr)", md: "repeat(1, 1fr)" }}
              templateColumns={{ base: "1fr", md: "repeat(3, 1fr)" }}
              gap={4}
              mt={4}>
              <GridItem>
                <Card mx="auto" bg="gray.900" color="gray.100" boxShadow="lg" rounded="md" borderWidth={1} borderColor="gray.700">
                  <CardBody>
                    <Stack>
                      <HStack>
                        <Box m={2} bg="blue.400" borderRadius="50px" p={2}>
                          <FaDollarSign color="white" size={40} />
                        </Box>
                        <Heading fontSize="lg">Annual Revenue</Heading>
                      </HStack>
                      <Divider borderColor="gray.700" />
                      <Text textAlign="center">{company.annualRevenue}</Text>
                    </Stack>
                  </CardBody>
                </Card>
              </GridItem>
              <GridItem>
                <Card mx="auto" bg="gray.900" color="gray.100" boxShadow="lg" rounded="md" borderWidth={1} borderColor="gray.700">
                  <CardBody>
                    <Stack>
                      <HStack>
                        <Box m={2} bg="red.400" borderRadius="50px" p={2}>
                          <LiaUsersSolid color="white" size={40} />
                        </Box>
                        <Heading fontSize="lg">Employees</Heading>
                      </HStack>
                      <Divider borderColor="gray.700" />
                      <Text textAlign="center">{company.employees}</Text>
                    </Stack>
                  </CardBody>
                </Card>
              </GridItem>
              <GridItem>
                <Card mx="auto" bg="gray.900" color="gray.100" boxShadow="lg" rounded="md" borderWidth={1} borderColor="gray.700">
                  <CardBody>
                    <Stack>
                      <HStack>
                        <Box m={2} bg="yellow.400" borderRadius="50px" p={2}>
                          <IoStarSharp color="white" size={40} />
                        </Box>
                        <Heading fontSize="lg">Rating</Heading>
                      </HStack>
                      <Divider borderColor="gray.700" />
                      <Text textAlign="center">{company.rating}</Text>
                    </Stack>
                  </CardBody>
                </Card>
              </GridItem>
            </Grid>
          </TabPanel>
          <TabPanel>
            <CompanyForm company={company} />
          </TabPanel>
          <TabPanel>
            <Text color="gray.100">Future Needs Content Here</Text>
          </TabPanel>
        </TabPanels>
      </Tabs>
    </Box>
  );
};

export default CompanyDetails;
