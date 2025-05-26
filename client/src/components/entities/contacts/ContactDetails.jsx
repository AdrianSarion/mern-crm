import { useEffect, useState } from "react";
import {
  Box,
  Card,
  CardBody,
  CardHeader,
  Divider,
  HStack,
  Heading,
  Image,
  Avatar,
  Spinner,
  Stack,
  Text,
  Tabs,
  TabList,
  TabPanels,
  Tab,
  TabPanel,
  Center,
  VStack,
} from "@chakra-ui/react";
import { SocialIcon } from "react-social-icons";
import { useParams } from "react-router-dom";
import UpdateContactForm from "./UpdateContactForm";
import { useGetContactByIdQuery } from "@/features/api/contacts";
import { useGetUserByIdQuery } from "@/features/api/user";

const ContactDetails = () => {
  const { contactId } = useParams();
  const { data: contact, error, isLoading } = useGetContactByIdQuery(contactId);

  const [createdByUser, setCreatedByUser] = useState(null);
  const [modifiedByUser, setModifiedByUser] = useState(null);

  const { data: createdByData } = useGetUserByIdQuery(contact?.createdBy, {
    skip: !contact?.createdBy,
  });
  const { data: modifiedByData } = useGetUserByIdQuery(contact?.lastModifiedBy, {
    skip: !contact?.lastModifiedBy,
  });

  useEffect(() => {
    if (createdByData) {
      setCreatedByUser(createdByData);
    }
  }, [createdByData]);

  useEffect(() => {
    if (modifiedByData) {
      setModifiedByUser(modifiedByData);
    }
  }, [modifiedByData]);

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

  if (!contact) {
    return (
      <Box display="flex" justifyContent="center" alignItems="center" height="100vh">
        <Heading>No contact found for ID: {contactId}</Heading>
      </Box>
    );
  }

  return (
    <Box px={0} py={0} minH="100vh" bg="gray.900">
      <Heading mb={4} textAlign="center" color="gray.100">
        <Text>
          {contact.firstName} {contact.lastName}
        </Text>
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
                      {contact.logo ? (
                        <Box borderRadius="50px" color="white" bg="none">
                          <Image as={Avatar} src={contact.logo} boxSize="70px" />
                        </Box>
                      ) : (
                        <Box borderRadius="50px" p={2} color="white" bg="gray.700">
                          <Avatar name={`${contact.firstName} ${contact.lastName}`} size="xl" />
                        </Box>
                      )}
                      <Text color="gray.100" fontWeight="bold" fontSize="xl">
                        {contact.salutation} {contact.firstName} {contact.lastName}
                      </Text>
                    </VStack>
                  </Center>
                  <Text fontSize="md" color="gray.400" mt={2}>
                    Email: {contact.email}
                  </Text>
                  <Text fontSize="md" color="gray.400">
                    Description: {contact.description}
                  </Text>
                  {contact.socials && (
                    <Box mt={2}>
                      {contact.socials.LinkedIn && (
                        <HStack>
                          <SocialIcon url={contact.socials.LinkedIn} style={{ width: "20px", height: "20px" }} />
                          <Text color="blue.400">{contact.socials.LinkedIn}</Text>
                        </HStack>
                      )}
                      {contact.socials.Facebook && (
                        <HStack>
                          <SocialIcon url={contact.socials.Facebook} style={{ width: "20px", height: "20px" }} />
                          <Text color="blue.400">{contact.socials.Facebook}</Text>
                        </HStack>
                      )}
                      {contact.socials.X && (
                        <HStack>
                          <SocialIcon url={contact.socials.X} style={{ width: "20px", height: "20px" }} />
                          <Text color="blue.400">{contact.socials.X}</Text>
                        </HStack>
                      )}
                    </Box>
                  )}
                  <Divider my={3} borderColor="gray.700" />
                  <Text fontSize="md" color="gray.400">
                    <b>Phone:</b> {contact.phone}
                  </Text>
                  <Text fontSize="md" color="gray.400">
                    <b>Birthday:</b> {contact.birthday}
                  </Text>
                  <Divider my={3} borderColor="gray.700" />
                  <Heading fontSize="lg" color="gray.100" mb={2}>Address</Heading>
                  <Text color="gray.400">{contact.address?.street}</Text>
                  <Text color="gray.400">{contact.address?.city}, {contact.address?.state}</Text>
                  <Text color="gray.400">{contact.address?.country} {contact.address?.zipCode}</Text>
                  <Divider my={3} borderColor="gray.700" />
                  <HStack justify="space-between" mt={2}>
                    <Box fontSize="xs" fontWeight="medium" color="gray.400">
                      Created by:{" "}
                      {createdByUser ? (
                        <Text as="span" color="blue.300">
                          {createdByUser.firstName} {createdByUser.lastName}
                        </Text>
                      ) : (
                        "NA"
                      )}
                    </Box>
                    <Box fontSize="xs" fontWeight="medium" color="gray.400">
                      Last update by:{" "}
                      {modifiedByUser ? (
                        <Text as="span" color="blue.300">
                          {modifiedByUser.firstName} {modifiedByUser.lastName}
                        </Text>
                      ) : (
                        "NA"
                      )}
                    </Box>
                  </HStack>
                </CardBody>
              </Card>
            </Center>
          </TabPanel>
          <TabPanel>
            <UpdateContactForm contact={contact} />
          </TabPanel>
          <TabPanel>
            <Text color="gray.100">Future Needs Content Here</Text>
          </TabPanel>
        </TabPanels>
      </Tabs>
    </Box>
  );
};

export default ContactDetails;
