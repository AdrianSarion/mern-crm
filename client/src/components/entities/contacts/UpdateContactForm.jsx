import { useEditContactMutation } from "@/features/api/contacts";
import { useUploadThing } from "@/lib/uploadthing";

import {
  Avatar,
  Button,
  FormLabel,
  FormControl,
  Input,
  Text,
  useToast,
  VStack,
  SimpleGrid,
  Image,
  Spinner,
  Box,
} from "@chakra-ui/react";
import { useState, useEffect, useRef } from "react";

const UpdateContactForm = ({ contact }) => {
  const [imageKey, setImageKey] = useState("");

  const [formContact, setFormContact] = useState(
    contact || {
      address: {},
      socials: {},
    },
  );
  const [editContact, { isLoading }] = useEditContactMutation();
  const [errors, setErrors] = useState({});
  const toast = useToast();
  const fileInputRef = useRef(null);

  const { startUpload, isUploading } = useUploadThing("imageUploader", {
    skipPolling: true,
    onClientUploadComplete: (res) => {
      setFormContact((prev) => ({ ...prev, logo: res[0].url }));
      setTimeout(() => setImageKey(Date.now()), 2000);
    },
    onUploadError: (error) => {
      console.error(error);
      toast({
        title: "Error occurred while uploading",
        status: "error",
        duration: 5000,
        isClosable: true,
      });
    },
  });

  useEffect(() => {
    setFormContact(contact);
  }, [contact]);

  const handleChange = (e) => {
    const { name, value } = e.target;

    if (name.startsWith("address.")) {
      const addressField = name.split(".")[1];
      setFormContact((prev) => ({
        ...prev,
        address: {
          ...prev.address,
          [addressField]: value,
        },
      }));
    } else if (name.startsWith("socials.")) {
      const socialsField = name.split(".")[1];
      setFormContact((prev) => ({
        ...prev,
        socials: {
          ...prev.socials,
          [socialsField]: value,
        },
      }));
    } else {
      setFormContact((prev) => ({ ...prev, [name]: value }));
    }
  };

  const validate = () => {
    const newErrors = {};
    if (!formContact.firstName) newErrors.firstName = "Contact firstname is required";
    if (!formContact.description) newErrors.description = "Description is required";
    if (!formContact.lastName) newErrors.lastName = "lastname is required";
    if (!formContact.email) newErrors.email = "email is required";
    if (!formContact.phone) newErrors.phone = "phone is required";

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validate()) return;

    try {
      await editContact({
        id: contact._id,
        contact: formContact,
      }).unwrap();

      toast({
        title: "Contact updated.",
        status: "success",
        duration: 5000,
        isClosable: true,
      });
    } catch (err) {
      console.log(err);
      toast({
        title: "Contact updating failed.",
        status: "error",
        duration: 5000,
        isClosable: true,
      });
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      <VStack spacing={8} align="stretch" p={6} bg="gray.900" borderRadius="lg" boxShadow="lg">
        <Box bg="gray.800" border="1px solid" borderColor="gray.700" rounded="md" p={4} mb={2}>
          <FormControl>
            <FormLabel color="gray.100" fontWeight="bold" fontSize="md" mb={2}>Avatar</FormLabel>
            <Image as={Avatar} src={formContact.logo} key={imageKey} boxSize="70px" mb={2} />
            <Button
              variant="outline"
              color="gray.100"
              borderColor="gray.700"
              _hover={{ bg: "gray.700" }}
              onClick={() => {
                fileInputRef.current.click();
              }}>
              {isUploading ? <Spinner /> : "Change logo"}
            </Button>
            <Input
              hidden
              name="logo"
              type="file"
              id="logo"
              ref={fileInputRef}
              onChange={(event) => {
                startUpload([event.target.files[0]]);
              }}
            />
          </FormControl>
        </Box>

        <SimpleGrid columns={{ base: 1, md: 2 }} spacing={6} w="full">
          <Box bg="gray.800" border="1px solid" borderColor="gray.700" rounded="md" p={4} mb={2}>
            <FormControl isRequired isInvalid={errors.firstName}>
              <FormLabel color="gray.100" fontWeight="bold" fontSize="md" mb={2}>Contact First Name</FormLabel>
              <Input
                name="firstName"
                value={formContact.firstName}
                onChange={handleChange}
                bg="gray.900" color="gray.100" borderColor="gray.700"
                _placeholder={{ color: "gray.400" }}
              />
              {errors.firstName && <Text color="red.400" mt={1}>{errors.firstName}</Text>}
            </FormControl>
          </Box>
          <Box bg="gray.800" border="1px solid" borderColor="gray.700" rounded="md" p={4} mb={2}>
            <FormControl isRequired isInvalid={errors.description}>
              <FormLabel color="gray.100" fontWeight="bold" fontSize="md" mb={2}>Description</FormLabel>
              <Input
                name="description"
                value={formContact.description}
                onChange={handleChange}
                bg="gray.900" color="gray.100" borderColor="gray.700"
                _placeholder={{ color: "gray.400" }}
              />
              {errors.description && <Text color="red.400" mt={1}>{errors.description}</Text>}
            </FormControl>
          </Box>
          <Box bg="gray.800" border="1px solid" borderColor="gray.700" rounded="md" p={4} mb={2}>
            <FormControl isRequired isInvalid={errors.lastName}>
              <FormLabel color="gray.100" fontWeight="bold" fontSize="md" mb={2}>Contact Last Name</FormLabel>
              <Input name="lastName" value={formContact.lastName} onChange={handleChange}
                bg="gray.900" color="gray.100" borderColor="gray.700"
                _placeholder={{ color: "gray.400" }}
              />
              {errors.lastName && <Text color="red.400" mt={1}>{errors.lastName}</Text>}
            </FormControl>
          </Box>
          <Box bg="gray.800" border="1px solid" borderColor="gray.700" rounded="md" p={4} mb={2}>
            <FormControl isRequired isInvalid={errors.email}>
              <FormLabel color="gray.100" fontWeight="bold" fontSize="md" mb={2}>Email</FormLabel>
              <Input name="email" value={formContact.email} onChange={handleChange}
                bg="gray.900" color="gray.100" borderColor="gray.700"
                _placeholder={{ color: "gray.400" }}
              />
              {errors.email && <Text color="red.400" mt={1}>{errors.email}</Text>}
            </FormControl>
          </Box>
          <Box bg="gray.800" border="1px solid" borderColor="gray.700" rounded="md" p={4} mb={2}>
            <FormControl isRequired isInvalid={errors.phone}>
              <FormLabel color="gray.100" fontWeight="bold" fontSize="md" mb={2}>Phone</FormLabel>
              <Input name="phone" value={formContact.phone} onChange={handleChange}
                bg="gray.900" color="gray.100" borderColor="gray.700"
                _placeholder={{ color: "gray.400" }}
              />
              {errors.phone && <Text color="red.400" mt={1}>{errors.phone}</Text>}
            </FormControl>
          </Box>
          <Box bg="gray.800" border="1px solid" borderColor="gray.700" rounded="md" p={4} mb={2}>
            <FormControl>
              <FormLabel color="gray.100" fontWeight="bold" fontSize="md" mb={2}>Socials</FormLabel>
              <Input
                name="socials.X"
                value={formContact.socials?.X}
                placeholder="X link"
                onChange={handleChange}
                bg="gray.900" color="gray.100" borderColor="gray.700"
                _placeholder={{ color: "gray.400" }}
                mb={2}
              />
              <Input
                value={formContact.socials?.LinkedIn}
                name="socials.LinkedIn"
                placeholder="LinkedIn link"
                onChange={handleChange}
                bg="gray.900" color="gray.100" borderColor="gray.700"
                _placeholder={{ color: "gray.400" }}
                mb={2}
              />
              <Input
                name="socials.Facebook"
                value={formContact.socials?.Facebook}
                placeholder="Facebook link"
                onChange={handleChange}
                bg="gray.900" color="gray.100" borderColor="gray.700"
                _placeholder={{ color: "gray.400" }}
              />
            </FormControl>
          </Box>
          <Box bg="gray.800" border="1px solid" borderColor="gray.700" rounded="md" p={4} mb={2}>
            <FormControl>
              <FormLabel color="gray.100" fontWeight="bold" fontSize="md" mb={2}>Address</FormLabel>
              <Input
                placeholder="Street"
                value={formContact.address ? formContact.address.street : ""}
                name="address.street"
                onChange={handleChange}
                bg="gray.900" color="gray.100" borderColor="gray.700"
                _placeholder={{ color: "gray.400" }}
                mb={2}
              />
              <Input
                placeholder="City"
                value={formContact.address ? formContact.address.city : ""}
                name="address.city"
                onChange={handleChange}
                bg="gray.900" color="gray.100" borderColor="gray.700"
                _placeholder={{ color: "gray.400" }}
                mb={2}
              />
              <Input
                placeholder="State"
                value={formContact.address ? formContact.address.state : ""}
                name="address.state"
                onChange={handleChange}
                bg="gray.900" color="gray.100" borderColor="gray.700"
                _placeholder={{ color: "gray.400" }}
                mb={2}
              />
              <Input
                placeholder="Country"
                value={formContact.address ? formContact.address.country : ""}
                name="address.country"
                onChange={handleChange}
                bg="gray.900" color="gray.100" borderColor="gray.700"
                _placeholder={{ color: "gray.400" }}
                mb={2}
              />
              <Input
                placeholder="Postal Code"
                value={formContact.address ? formContact.address.zipCode : ""}
                name="address.zipCode"
                onChange={handleChange}
                bg="gray.900" color="gray.100" borderColor="gray.700"
                _placeholder={{ color: "gray.400" }}
              />
            </FormControl>
          </Box>
        </SimpleGrid>
        <Button
          bg="black"
          color="white"
          type="submit"
          isLoading={isLoading}
          w={{ base: "100%", md: "40%" }}
          alignSelf="center"
          mt={6}
          rounded="md"
          boxShadow="lg"
          fontWeight="bold"
          _hover={{ bg: "gray.800", color: "blue.400" }}
        >
          Save
        </Button>
      </VStack>
    </form>
  );
};

export default UpdateContactForm;
