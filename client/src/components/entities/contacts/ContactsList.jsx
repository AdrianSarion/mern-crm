import { useState, useMemo } from "react";
import { SocialIcon } from "react-social-icons";
import { Link as RouterLink } from "react-router-dom";
import {
  Card,
  CardBody,
  CardFooter,
  Text,
  Heading,
  Button,
  SimpleGrid,
  Center,
  useDisclosure,
  Box,
  HStack,
  Tooltip,
  Spinner,
  Input,
  Avatar,
  VStack,
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalCloseButton,
  ModalBody,
  ModalFooter,
  useToast,
} from "@chakra-ui/react";
import { useGetContactsListQuery } from "@/features/api/contacts";
import { AddIcon, DeleteIcon, EditIcon, EmailIcon, PhoneIcon } from "@chakra-ui/icons";
import CreateContactForm from "./CreateContactForm";
import ContactDelete from "./ContactDelete";
import Icons from "../companies/CompaniesIcons";
import Papa from "papaparse";

const ContactsList = () => {
  const { data: contacts, error, isLoading } = useGetContactsListQuery();
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
  const [deleteContact, setDeleteContact] = useState(null);
  const [deleteContactName, setDeleteContactName] = useState("");
  const [searchTerm, setSearchTerm] = useState("");
  const [isImportOpen, setIsImportOpen] = useState(false);
  const [csvFile, setCsvFile] = useState(null);
  const [csvPreview, setCsvPreview] = useState([]);
  const toast = useToast();

  const handleDeleteClick = (contact) => {
    setDeleteContact(contact._id);
    setDeleteContactName(contact.firstName + " " + contact.lastName);
    onOpDeleteMod();
  };

  const filteredContacts = useMemo(() => {
    return contacts?.filter(
      (contact) =>
        contact.firstName.toLowerCase().includes(searchTerm.toLowerCase()) ||
        contact.lastName.toLowerCase().includes(searchTerm.toLowerCase()),
    );
  }, [contacts, searchTerm]);

  const getRandomIcon = () => {
    const iconKeys = Object.keys(Icons);
    const randomKey = iconKeys[Math.floor(Math.random() * iconKeys.length)];
    return Icons[randomKey];
  };

  if (isLoading) {
    return (
      <Center height="100vh">
        <Spinner size="xl" />
      </Center>
    );
  }

  if (error) {
    return (
      <Center height="100vh" className="px-4">
        <Text color="red.500">{error.message}</Text>
      </Center>
    );
  }

  return (
    <Box px={0} py={0} minH="100vh" bg="transparent">
      <Heading as="h1" size="xl" mb={6} color="gray.100">
        <HStack justify="space-between">
          <Text color="gray.100">Contacts</Text>
          <HStack>
            <Button leftIcon={<AddIcon />} onClick={onOpAddMod} bg="gray.800" color="gray.100" _hover={{ bg: "gray.700" }}>
              Add contact
            </Button>
            <Button onClick={() => setIsImportOpen(true)} bg="blue.700" color="gray.100" _hover={{ bg: "blue.800" }}>
              Import CSV
            </Button>
          </HStack>
        </HStack>
        <CreateContactForm isOpen={isOpAddMod} onClose={closeAddMod} />
        <Modal isOpen={isImportOpen} onClose={() => setIsImportOpen(false)}>
          <ModalOverlay />
          <ModalContent bg="gray.900" color="gray.100">
            <ModalHeader>Import Contacts from CSV</ModalHeader>
            <ModalCloseButton />
            <ModalBody>
              <Input type="file" accept=".csv" onChange={e => {
                setCsvFile(e.target.files[0]);
                if (e.target.files[0]) {
                  Papa.parse(e.target.files[0], {
                    header: true,
                    complete: (results) => setCsvPreview(results.data),
                  });
                }
              }} mb={4} />
              {csvPreview.length > 0 && (
                <Box maxH="200px" overflowY="auto" bg="gray.800" p={2} borderRadius="md" border="1px solid" borderColor="gray.700">
                  <Text fontWeight="bold" mb={2}>Preview:</Text>
                  {csvPreview.slice(0, 5).map((row, idx) => (
                    <Text key={idx} fontSize="sm" color="gray.300">{JSON.stringify(row)}</Text>
                  ))}
                  {csvPreview.length > 5 && <Text fontSize="xs" color="gray.500">...and {csvPreview.length - 5} more</Text>}
                </Box>
              )}
            </ModalBody>
            <ModalFooter>
              <Button
                colorScheme="blue"
                mr={3}
                isDisabled={!csvPreview.length}
                onClick={async () => {
                  try {
                    const res = await fetch("/api/contacts/import-csv", {
                      method: "POST",
                      headers: { "Content-Type": "application/json" },
                      body: JSON.stringify({ contacts: csvPreview }),
                    });
                    if (res.ok) {
                      toast({ title: "Contacts imported!", status: "success", duration: 4000, isClosable: true });
                      setIsImportOpen(false);
                    } else {
                      const err = await res.json();
                      toast({ title: "Import failed", description: err.message, status: "error", duration: 4000, isClosable: true });
                    }
                  } catch (e) {
                    toast({ title: "Import failed", description: e.message, status: "error", duration: 4000, isClosable: true });
                  }
                }}
              >
                Import
              </Button>
              <Button variant="ghost" onClick={() => setIsImportOpen(false)}>
                Cancel
              </Button>
            </ModalFooter>
          </ModalContent>
        </Modal>
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
        {filteredContacts.map((contact) => {
          const IconComponent = getRandomIcon();
          return (
            <Card
              key={contact._id}
              bg="gray.900"
              color="gray.100"
              boxShadow="lg"
              rounded="md"
              borderWidth={1}
              borderColor="gray.700"
              _hover={{ bg: "gray.800", boxShadow: "2xl" }}
              p={2}>
              <CardBody p={2}>
                <VStack>
                  <Center>
                    {contact.logo ? (
                      <Avatar src={contact.logo} size="sm" />
                    ) : (
                      <Box
                        borderRadius="50px"
                        p={2}
                        size="sm"
                        color="white"
                        bg="gray.700">
                        <IconComponent />
                      </Box>
                    )}
                  </Center>
                  <Center>
                    <Text p={4} fontSize="md" fontWeight="medium" color="gray.100">
                      {contact.firstName} {contact.lastName}
                    </Text>
                  </Center>
                </VStack>
                <Center>
                  <HStack spacing={2} h={10} mt={2} p={4}>
                    {contact.socials && (
                      <Box>
                        <SocialIcon
                          url={contact.socials.LinkedIn}
                          style={{ width: "20px", height: "20px" }}
                        />
                        <SocialIcon
                          url="https://facebook.com"
                          style={{ width: "20px", height: "20px" }}
                        />
                        <SocialIcon
                          url="https://x.com"
                          style={{ width: "20px", height: "20px" }}
                        />
                      </Box>
                    )}
                  </HStack>
                </Center>
              </CardBody>
              <CardFooter h={30} justifyContent="flex-end" flexWrap="wrap">
                <HStack spacing={1}>
                  <Tooltip label={contact.email} aria-label="Email">
                    <Button variant="ghost" color="gray.100" _hover={{ bg: "gray.700" }} size="sm">
                      <EmailIcon />
                    </Button>
                  </Tooltip>
                  {contact.phone && (
                    <Tooltip label={contact.phone} aria-label="Phone">
                      <Button variant="ghost" color="gray.100" _hover={{ bg: "gray.700" }} size="sm">
                        <PhoneIcon />
                      </Button>
                    </Tooltip>
                  )}
                  <Button
                    color="green.400"
                    variant="ghost"
                    as={RouterLink}
                    to={`/contacts/${contact._id}`}
                    size="sm"
                    leftIcon={<EditIcon color="green.400" />}
                    _hover={{ bg: "gray.700" }}
                  />
                  <Button
                    variant="ghost"
                    onClick={() => handleDeleteClick(contact)}
                    color="red.400"
                    size="sm"
                    leftIcon={<DeleteIcon color="red.400" />}
                    _hover={{ bg: "gray.700" }}
                  />
                </HStack>
              </CardFooter>
            </Card>
          );
        })}
      </SimpleGrid>
      <ContactDelete
        contactName={deleteContactName}
        contact={deleteContact}
        isOpen={isOpDeleteMod}
        onClose={closeDeleteMod}
      />
    </Box>
  );
};

export default ContactsList;
