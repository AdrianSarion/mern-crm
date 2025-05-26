import { useEditCompanyMutation } from "@/features/api/companies";
import { useUploadThing } from "@/lib/uploadthing";
import {
  Avatar,
  Button,
  FormLabel,
  FormControl,
  Input,
  Text,
  Divider,
  useToast,
  VStack,
  SimpleGrid,
  Image,
  Spinner,
  Box,
} from "@chakra-ui/react";
import { useState, useEffect, useRef } from "react";

const CompanyForm = ({ company }) => {
  const [imageKey, setImageKey] = useState("");

  const [formCompany, setFormCompany] = useState(
    company || {
      billingAddress: {
        Street: "",
        City: "",
        State: "",
        BillingCode: "",
        PostalCode: "",
      },
      shippingAddress: {
        Street: "",
        City: "",
        ShippingCode: "",
        PostalCode: "",
      },
    },
  );
  const [editCompany, { isLoading }] = useEditCompanyMutation();
  const [errors, setErrors] = useState({});
  const toast = useToast();

  const fileInputRef = useRef(null);

  const { startUpload, isUploading } = useUploadThing("imageUploader", {
    skipPolling: true,
    onClientUploadComplete: (res) => {
      setFormCompany((prev) => ({ ...prev, logo: res[0].url }));
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

  // Synchroniser l'état local avec les props entrantes
  useEffect(() => {
    setFormCompany(
      company || {
        billingAddress: {
          Street: "",
          City: "",
          State: "",
          BillingCode: "",
          PostalCode: "",
        },
        shippingAddress: {
          Street: "",
          City: "",
          ShippingCode: "",
          PostalCode: "",
        },
      },
    );
  }, [company]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    if (name.startsWith("billingAddress.")) {
      // Divise le nom du champ pour obtenir le champ spécifique de l'adresse
      const addressField = name.split(".")[1];
      // Met à jour l'adresse avec la nouvelle valeur pour le champ spécifique
      setFormCompany((prev) => ({
        ...prev,
        billingAddress: {
          ...prev.billingAddress,
          [addressField]: value,
        },
      }));
    } else if (name.startsWith("shippingAddress.")) {
      const addressField = name.split(".")[1];
      setFormCompany((prev) => ({
        ...prev,
        shippingAddress: {
          ...prev.shippingAddress,
          [addressField]: value,
        },
      }));
    } else {
      setFormCompany((prev) => ({ ...prev, [name]: value }));
    }

    if (name === "website" && !value.includes("https://")) {
      setFormCompany((prev) => ({
        ...prev,
        website: `https://${value}`,
      }));
    }
  };

  const validate = () => {
    const newErrors = {};
    if (!formCompany.name) newErrors.name = "Company Name is required";
    if (!formCompany.description) newErrors.description = "Description is required";
    if (!formCompany.website) newErrors.website = "Website is required";
    if (!formCompany.companyType) newErrors.companyType = "Type is required";
    if (!formCompany.industry) newErrors.industry = "Industry is required";
    if (!formCompany.employees || formCompany.employees < 1)
      newErrors.employees = "Number of employees must be at least 1";
    if (!formCompany.annualRevenue || formCompany.annualRevenue < 1000)
      newErrors.annualRevenue = "Annual revenue must be at least 1000";

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validate()) return;

    try {
      await editCompany({
        id: company._id,
        company: formCompany,
      }).unwrap();
      toast({
        title: "Company updated.",
        status: "success",
        duration: 5000,
        isClosable: true,
      });
    } catch (err) {
      console.error(err);
      toast({
        title: "Company updating failed.",
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
            <Image as={Avatar} src={formCompany.logo} key={imageKey} boxSize="70px" mb={2} />
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
            <FormControl isRequired isInvalid={errors.name}>
              <FormLabel color="gray.100" fontWeight="bold" fontSize="md" mb={2}>Company Name</FormLabel>
              <Input name="name" value={formCompany.name} onChange={handleChange}
                bg="gray.900" color="gray.100" borderColor="gray.700"
                _placeholder={{ color: "gray.400" }}
              />
              {errors.name && <Text color="red.400" mt={1}>{errors.name}</Text>}
            </FormControl>
          </Box>
          <Box bg="gray.800" border="1px solid" borderColor="gray.700" rounded="md" p={4} mb={2}>
            <FormControl isRequired isInvalid={errors.description}>
              <FormLabel color="gray.100" fontWeight="bold" fontSize="md" mb={2}>Description</FormLabel>
              <Input
                name="description"
                value={formCompany.description}
                onChange={handleChange}
                bg="gray.900" color="gray.100" borderColor="gray.700"
                _placeholder={{ color: "gray.400" }}
              />
              {errors.description && <Text color="red.400" mt={1}>{errors.description}</Text>}
            </FormControl>
          </Box>
          <Box bg="gray.800" border="1px solid" borderColor="gray.700" rounded="md" p={4} mb={2}>
            <FormControl isRequired isInvalid={errors.website}>
              <FormLabel color="gray.100" fontWeight="bold" fontSize="md" mb={2}>Website</FormLabel>
              <Input name="website" value={formCompany.website} onChange={handleChange}
                bg="gray.900" color="gray.100" borderColor="gray.700"
                _placeholder={{ color: "gray.400" }}
              />
              {errors.website && <Text color="red.400" mt={1}>{errors.website}</Text>}
            </FormControl>
          </Box>
          <Box bg="gray.800" border="1px solid" borderColor="gray.700" rounded="md" p={4} mb={2}>
            <FormControl isRequired isInvalid={errors.companyType}>
              <FormLabel color="gray.100" fontWeight="bold" fontSize="md" mb={2}>Type</FormLabel>
              <Input
                name="companyType"
                value={formCompany.companyType}
                onChange={handleChange}
                bg="gray.900" color="gray.100" borderColor="gray.700"
                _placeholder={{ color: "gray.400" }}
              />
              {errors.companyType && <Text color="red.400" mt={1}>{errors.companyType}</Text>}
            </FormControl>
          </Box>
          <Box bg="gray.800" border="1px solid" borderColor="gray.700" rounded="md" p={4} mb={2}>
            <FormControl isRequired isInvalid={errors.industry}>
              <FormLabel color="gray.100" fontWeight="bold" fontSize="md" mb={2}>Industry</FormLabel>
              <Input name="industry" value={formCompany.industry} onChange={handleChange}
                bg="gray.900" color="gray.100" borderColor="gray.700"
                _placeholder={{ color: "gray.400" }}
              />
              {errors.industry && <Text color="red.400" mt={1}>{errors.industry}</Text>}
            </FormControl>
          </Box>
          <Box bg="gray.800" border="1px solid" borderColor="gray.700" rounded="md" p={4} mb={2}>
            <FormControl isRequired isInvalid={errors.employees}>
              <FormLabel color="gray.100" fontWeight="bold" fontSize="md" mb={2}>Number of Employees</FormLabel>
              <Input
                type="number"
                name="employees"
                value={formCompany.employees}
                onChange={handleChange}
                bg="gray.900" color="gray.100" borderColor="gray.700"
                _placeholder={{ color: "gray.400" }}
              />
              {errors.employees && <Text color="red.400" mt={1}>{errors.employees}</Text>}
            </FormControl>
          </Box>
          <Box bg="gray.800" border="1px solid" borderColor="gray.700" rounded="md" p={4} mb={2}>
            <FormControl isRequired isInvalid={errors.annualRevenue}>
              <FormLabel color="gray.100" fontWeight="bold" fontSize="md" mb={2}>Annual Revenue</FormLabel>
              <Input
                type="number"
                name="annualRevenue"
                value={formCompany.annualRevenue}
                onChange={handleChange}
                bg="gray.900" color="gray.100" borderColor="gray.700"
                _placeholder={{ color: "gray.400" }}
              />
              {errors.annualRevenue && <Text color="red.400" mt={1}>{errors.annualRevenue}</Text>}
            </FormControl>
          </Box>
        </SimpleGrid>

        <Divider orientation="horizontal" my={4} borderColor="gray.700" />

        <SimpleGrid columns={{ base: 1, md: 2 }} spacing={6} w="full">
          <Box bg="gray.800" border="1px solid" borderColor="gray.700" rounded="md" p={4} mb={2}>
            <FormControl>
              <FormLabel color="gray.100" fontWeight="bold" fontSize="md" mb={2}>Billing Address</FormLabel>
              <Input
                placeholder="Street"
                value={formCompany.billingAddress?.Street}
                name="billingAddress.Street"
                onChange={handleChange}
                bg="gray.900" color="gray.100" borderColor="gray.700"
                _placeholder={{ color: "gray.400" }}
                mb={2}
              />
              <Input
                placeholder="City"
                value={formCompany.billingAddress?.City}
                name="billingAddress.City"
                onChange={handleChange}
                bg="gray.900" color="gray.100" borderColor="gray.700"
                _placeholder={{ color: "gray.400" }}
                mb={2}
              />
              <Input
                placeholder="State"
                value={formCompany.billingAddress?.State}
                name="billingAddress.State"
                onChange={handleChange}
                bg="gray.900" color="gray.100" borderColor="gray.700"
                _placeholder={{ color: "gray.400" }}
                mb={2}
              />
              <Input
                placeholder="Billing Code"
                value={formCompany.billingAddress?.BillingCode}
                name="billingAddress.BillingCode"
                onChange={handleChange}
                bg="gray.900" color="gray.100" borderColor="gray.700"
                _placeholder={{ color: "gray.400" }}
                mb={2}
              />
              <Input
                placeholder="Postal Code"
                value={formCompany.billingAddress?.PostalCode}
                name="billingAddress.PostalCode"
                onChange={handleChange}
                bg="gray.900" color="gray.100" borderColor="gray.700"
                _placeholder={{ color: "gray.400" }}
              />
            </FormControl>
          </Box>
          <Box bg="gray.800" border="1px solid" borderColor="gray.700" rounded="md" p={4} mb={2}>
            <FormControl>
              <FormLabel color="gray.100" fontWeight="bold" fontSize="md" mb={2}>Shipping Address</FormLabel>
              <Input
                placeholder="Street"
                value={formCompany.shippingAddress?.Street}
                name="shippingAddress.Street"
                onChange={handleChange}
                bg="gray.900" color="gray.100" borderColor="gray.700"
                _placeholder={{ color: "gray.400" }}
                mb={2}
              />
              <Input
                placeholder="City"
                value={formCompany.shippingAddress?.City}
                name="shippingAddress.City"
                onChange={handleChange}
                bg="gray.900" color="gray.100" borderColor="gray.700"
                _placeholder={{ color: "gray.400" }}
                mb={2}
              />
              <Input
                placeholder="Shipping Code"
                value={formCompany.shippingAddress?.ShippingCode}
                name="shippingAddress.ShippingCode"
                onChange={handleChange}
                bg="gray.900" color="gray.100" borderColor="gray.700"
                _placeholder={{ color: "gray.400" }}
                mb={2}
              />
              <Input
                placeholder="Postal Code"
                value={formCompany.shippingAddress?.PostalCode}
                name="shippingAddress.PostalCode"
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

export default CompanyForm;
