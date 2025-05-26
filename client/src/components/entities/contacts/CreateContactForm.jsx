import { useState } from "react";
import { useCreateContactMutation } from "@/features/api/contacts";
import {
  Button,
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalCloseButton,
  ModalBody,
  ModalFooter,
  FormLabel,
  FormControl,
  Input,
  VStack,
  Text,
  SimpleGrid,
  useToast,
  Select,
  Image,
  Avatar,
} from "@chakra-ui/react";
import { useUploadThing } from "@/lib/uploadthing";

import { Spinner } from "@/components/ui/spinner";

const CreateContactForm = ({ isOpen, onClose }) => {
  const [imageKey, setImageKey] = useState("");

  const [createContact, { isLoading }] = useCreateContactMutation();
  const [formContact, setFormContact] = useState({});
  const [errors, setErrors] = useState({});
  const toast = useToast();

  const { startUpload, isUploading } = useUploadThing("imageUploader", {
    skipPolling: true,
    onClientUploadComplete: (res) => {
      setFormContact((prev) => ({ ...prev, logo: res[0].url }));

      setTimeout(() => setImageKey(Date.now()), 1500);
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

  const handleChange = (e) => {
    const { name, value } = e.target;
    const keys = name.split(".");
    if (keys.length > 1) {
      setFormContact((prev) => ({
        ...prev,
        [keys[0]]: { ...prev[keys[0]], [keys[1]]: value },
      }));
    } else {
      setFormContact((prev) => ({ ...prev, [name]: value }));
    }
  };

  const validate = () => {
    const newErrors = {};
    if (!formContact.firstName) newErrors.firstName = "Contact firstName is required";
    if (!formContact.lastName) newErrors.lastName = "lastName is required";
    if (!formContact.birthday) newErrors.birthday = "birthday is required";

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const [selectedSalutation, setSelectedSalutation] = useState("Shut Down");

  const handleStatusChange = (event) => {
    setSelectedSalutation(event.target.value);
  };

  const statusOptions = ["Mr.", "Mrs.", "Ms.", "Dr.", "Prof."];

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validate()) return;

    try {
      const response = await createContact({
        ...formContact,
        salutation: selectedSalutation,
      }).unwrap();
      toast({
        title: "Contact created.",
        description: "The Contact has been successfully created.",
        status: "success",
        duration: 5000,
        isClosable: true,
      });
      console.log(response);
      setErrors({});
      setFormContact({});
      onClose();
    } catch (err) {
      toast({
        title: "An error occurred.",
        description: err.data.message,
        status: "error",
        duration: 5000,
        isClosable: true,
      });
      if (err.data && err.data.error) {
        if (!err.data.error.details) {
          return setErrors(err.data.message);
        }
        const validationError = err.data.error.details.reduce((acc, error) => {
          const fieldName = error.path.join(".");
          acc[fieldName] = error.message;
          return acc;
        }, {});
        setErrors(validationError);
      } else {
        console.log(err);
      }
    }
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose}>
      <ModalOverlay />
      <ModalContent maxW="80%" w="70%" bg="gray.900" color="gray.100" borderWidth={1} borderColor="gray.700">
        <ModalHeader bg="gray.900" color="gray.100">Create New Contact</ModalHeader>
        <ModalCloseButton color="gray.100" />
        <ModalBody>
          <form onSubmit={handleSubmit}>
            <FormControl>
              <FormLabel color="gray.100">Avatar</FormLabel>
              <Image as={Avatar} src={formContact.logo} key={imageKey} />
              <Button
                variant="outline"
                bg="gray.800"
                color="gray.100"
                borderColor="gray.700"
                _hover={{ bg: "gray.700" }}
                onClick={() => {
                  document.getElementById("logo").click();
                }}>
                {isUploading ? <Spinner /> : "Change logo"}
              </Button>
              <Input
                hidden
                name="logo"
                type="file"
                id="logo"
                onChange={(event) => {
                  startUpload([event.target.files[0]]);
                }}
              />
            </FormControl>
            <VStack spacing={4}>
              <SimpleGrid columns={2} spacing={4} w="full">
                <FormControl isInvalid={errors.firstName} isRequired>
                  <FormLabel color="gray.100">First Name</FormLabel>
                  <Input name="firstName" onChange={handleChange} bg="gray.800" color="gray.100" borderColor="gray.700" _placeholder={{ color: "gray.400" }} />
                  {errors.firstName && <Text color="red.500">{errors.firstName}</Text>}
                </FormControl>
                <FormControl isInvalid={errors.lastName} isRequired>
                  <FormLabel color="gray.100">Last Name</FormLabel>
                  <Input name="lastName" onChange={handleChange} bg="gray.800" color="gray.100" borderColor="gray.700" _placeholder={{ color: "gray.400" }} />
                  {errors.lastName && <Text color="red.500">{errors.lastName}</Text>}
                </FormControl>
                <FormControl>
                  <FormLabel color="gray.100">Email</FormLabel>
                  <Input name="email" onChange={handleChange} bg="gray.800" color="gray.100" borderColor="gray.700" _placeholder={{ color: "gray.400" }} />
                  {errors.email && <Text color="red.500">{errors.email}</Text>}
                </FormControl>
                <FormControl isInvalid={errors.phone} isRequired>
                  <FormLabel color="gray.100">Phone</FormLabel>
                  <Input name="phone" onChange={handleChange} bg="gray.800" color="gray.100" borderColor="gray.700" _placeholder={{ color: "gray.400" }} />
                  {errors.phone && <Text color="red.500">{errors.phone}</Text>}
                </FormControl>
                <FormControl>
                  <FormLabel color="gray.100">Description</FormLabel>
                  <Input name="description" onChange={handleChange} bg="gray.800" color="gray.100" borderColor="gray.700" _placeholder={{ color: "gray.400" }} />
                  {errors.description && (
                    <Text color="red.500">{errors.description}</Text>
                  )}
                </FormControl>
                <FormControl>
                  <FormLabel color="gray.100">Birthday</FormLabel>
                  <Input name="birthday" onChange={handleChange} bg="gray.800" color="gray.100" borderColor="gray.700" _placeholder={{ color: "gray.400" }} />
                  {errors.birthday && <Text color="red.500">{errors.birthday}</Text>}
                </FormControl>
                <FormControl>
                  <FormLabel color="gray.100">Salutation</FormLabel>
                  <Select
                    value={selectedSalutation}
                    onChange={handleStatusChange}
                    placeholder="Select Status"
                    bg="gray.800"
                    color="gray.100"
                    borderColor="gray.700"
                    _placeholder={{ color: "gray.400" }}
                  >
                    {statusOptions.map((option) => (
                      <option key={option} value={option} style={{ background: '#1a202c', color: '#f3f4f6' }}>
                        {option}
                      </option>
                    ))}
                  </Select>
                </FormControl>
                <FormControl>
                  <FormLabel color="gray.100">Socials</FormLabel>
                  <Input name="socials.X" placeholder="X link" onChange={handleChange} bg="gray.800" color="gray.100" borderColor="gray.700" _placeholder={{ color: "gray.400" }} />
                  <Input name="socials.LinkedIn" placeholder="LinkedIn link" onChange={handleChange} bg="gray.800" color="gray.100" borderColor="gray.700" _placeholder={{ color: "gray.400" }} />
                  <Input name="socials.Facebook" placeholder="Facebook link" onChange={handleChange} bg="gray.800" color="gray.100" borderColor="gray.700" _placeholder={{ color: "gray.400" }} />
                  {errors.socials && <Text color="red.500">{errors.socials}</Text>}
                </FormControl>
                <FormControl>
                  <FormLabel color="gray.100">Lead Source</FormLabel>
                  <Input type="text" name="leadSource" onChange={handleChange} bg="gray.800" color="gray.100" borderColor="gray.700" _placeholder={{ color: "gray.400" }} />
                  {errors.leadSource && <Text color="red.500">{errors.leadSource}</Text>}
                </FormControl>
              </SimpleGrid>
              <SimpleGrid columns={2} spacing={4} w="full">
                <FormControl>
                  <FormLabel color="gray.100">Address</FormLabel>
                  <Input
                    placeholder="Street"
                    name="address.Street"
                    onChange={handleChange}
                    bg="gray.800"
                    color="gray.100"
                    borderColor="gray.700"
                    _placeholder={{ color: "gray.400" }}
                  />
                  {errors["address.Street"] && (
                    <Text color="red.500">{errors["address.Street"]}</Text>
                  )}
                  <Input
                    placeholder="City"
                    name="address.City"
                    onChange={handleChange}
                    mt={2}
                    bg="gray.800"
                    color="gray.100"
                    borderColor="gray.700"
                    _placeholder={{ color: "gray.400" }}
                  />
                  {errors["address.City"] && (
                    <Text color="red.500">{errors["address.City"]}</Text>
                  )}
                  <Input
                    placeholder="State"
                    name="address.State"
                    onChange={handleChange}
                    mt={2}
                    bg="gray.800"
                    color="gray.100"
                    borderColor="gray.700"
                    _placeholder={{ color: "gray.400" }}
                  />
                  {errors["address.State"] && (
                    <Text color="red.500">{errors["address.State"]}</Text>
                  )}
                  <Input
                    placeholder="country"
                    name="address.country"
                    onChange={handleChange}
                    mt={2}
                    bg="gray.800"
                    color="gray.100"
                    borderColor="gray.700"
                    _placeholder={{ color: "gray.400" }}
                  />
                  {errors["address.BillingCode"] && (
                    <Text color="red.500">{errors["address.BillingCode"]}</Text>
                  )}
                  <Input
                    placeholder="zipCode"
                    name="address.zipCode"
                    onChange={handleChange}
                    mt={2}
                    bg="gray.800"
                    color="gray.100"
                    borderColor="gray.700"
                    _placeholder={{ color: "gray.400" }}
                  />
                  {errors["address.PostalCode"] && (
                    <Text color="red.500">{errors["address.PostalCode"]}</Text>
                  )}
                </FormControl>
                <FormControl>
                  <FormLabel color="gray.100">Shipping Address</FormLabel>
                  <Input
                    placeholder="Street"
                    name="shippingAddress.Street"
                    onChange={handleChange}
                    bg="gray.800"
                    color="gray.100"
                    borderColor="gray.700"
                    _placeholder={{ color: "gray.400" }}
                  />
                  {errors["shippingAddress.Street"] && (
                    <Text color="red.500">{errors["shippingAddress.Street"]}</Text>
                  )}
                  <Input
                    placeholder="City"
                    name="shippingAddress.City"
                    onChange={handleChange}
                    mt={2}
                    bg="gray.800"
                    color="gray.100"
                    borderColor="gray.700"
                    _placeholder={{ color: "gray.400" }}
                  />
                  {errors["shippingAddress.City"] && (
                    <Text color="red.500">{errors["shippingAddress.City"]}</Text>
                  )}
                  <Input
                    placeholder="Shipping Code"
                    name="shippingAddress.ShippingCode"
                    onChange={handleChange}
                    mt={2}
                    bg="gray.800"
                    color="gray.100"
                    borderColor="gray.700"
                    _placeholder={{ color: "gray.400" }}
                  />
                  {errors["shippingAddress.ShippingCode"] && (
                    <Text color="red.500">{errors["shippingAddress.ShippingCode"]}</Text>
                  )}
                  <Input
                    placeholder="Postal Code"
                    name="shippingAddress.PostalCode"
                    onChange={handleChange}
                    mt={2}
                    bg="gray.800"
                    color="gray.100"
                    borderColor="gray.700"
                    _placeholder={{ color: "gray.400" }}
                  />
                  {errors["shippingAddress.PostalCode"] && (
                    <Text color="red.500">{errors["shippingAddress.PostalCode"]}</Text>
                  )}
                </FormControl>
              </SimpleGrid>
              <SimpleGrid columns={2} spacing={4} w="full"></SimpleGrid>
            </VStack>
          </form>
        </ModalBody>
        <ModalFooter bg="gray.900" color="gray.100">
          <Button
            colorScheme="blue"
            mr={3}
            type="submit"
            disabled={isLoading}
            onClick={handleSubmit}
            bg="blue.700"
            color="gray.100"
            _hover={{ bg: "blue.800" }}>
            Save
          </Button>
          <Button variant="ghost" onClick={onClose} bg="gray.700" color="gray.100" _hover={{ bg: "gray.600" }}>
            Cancel
          </Button>
        </ModalFooter>
      </ModalContent>
    </Modal>
  );
};

export default CreateContactForm;
