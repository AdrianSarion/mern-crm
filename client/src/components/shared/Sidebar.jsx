import React, { useState } from "react";
import { Link as RouterLink } from "react-router-dom";
import {
  LayoutDashboard,
  Building2,
  BarChart2,
  Users2,
  Handshake,
  ListTodo,
  LayoutGrid,
  Mail,
  MessageSquare,
  Calendar,
  Settings2,
  ChevronDown,
  ChevronRight,
} from "lucide-react";
import {
  VStack,
  Divider,
  Box,
  Link,
  Button,
  Text,
  Accordion,
  AccordionItem,
  AccordionButton,
  AccordionPanel,
  AccordionIcon,
  Tooltip,
  Avatar,
  Center,
} from "@chakra-ui/react";
import { useGetCompaniesListQuery } from "@/features/api/companies";

const Sidebar = ({ isSidebarOpen, toggleSidebar }) => {
  const [isExpanded, setIsExpanded] = useState(false);
  const { data: companies = [], error, isLoading } = useGetCompaniesListQuery();

  const toggleExpansion = () => {
    setIsExpanded(!isExpanded);
  };

  return (
    <VStack
      className="custom-scrollbar bg-gradient-to-br from-gray-900 via-slate-800 to-gray-900"
      spacing={0}
      align="stretch"
      fontSize="14px"
      overflowY="auto"
      fontWeight="normal"
      w={isSidebarOpen ? { base: "200px", md: "250px" } : { base: "70px", md: "70px" }}
      transition="width 0.3s ease"
      minH="100vh"
      maxH="100vh"
      m={0}
      p={0}
      borderRight="1px solid #0000001A"
      position="fixed"
      top={0}
      left={0}
      zIndex={100}
      display="flex"
      flexDirection="column"
      alignItems={isSidebarOpen ? "stretch" : "center"}
    >
      <Divider mb={2} mt={0} borderColor="#0000001A" />
      <NavItem
        icon={LayoutDashboard}
        label="Dashboard"
        to="/dashboard"
        isSidebarOpen={isSidebarOpen}
      />
      <NavItem
        icon={Building2}
        label="Companies"
        to="/companies"
        isSidebarOpen={isSidebarOpen}
      />
      <Accordion allowMultiple w="100%" borderColor="transparent">
        <AccordionItem border="none">
          <h2>
            <AccordionButton
              _expanded={{ bg: "#334155", color: "#fff" }}
              onClick={toggleExpansion}
              px={isSidebarOpen ? 4 : 2}
              py={2}
              borderRadius={0}
              _focus={{ boxShadow: "none" }}
              bg="none"
              color="#F3F4F6"
            >
              <Box as="span" flex="1" textAlign="left" color="inherit" fontWeight="normal">
                {isSidebarOpen ? (isExpanded ? "Less" : "More") : <ChevronDown size={18} color="#F3F4F6" />}
              </Box>
              <AccordionIcon />
            </AccordionButton>
          </h2>
          <AccordionPanel p={0} bg="none">
            <NavItem
              icon={BarChart2}
              label="Stats"
              to="/stats"
              isSidebarOpen={isSidebarOpen}
            />
            <NavItem
              icon={Users2}
              label="Contacts"
              to="/contacts"
              isSidebarOpen={isSidebarOpen}
            />
            <NavItem
              icon={Handshake}
              label="Deals"
              to="/deals"
              isSidebarOpen={isSidebarOpen}
            />
            <NavItem
              icon={ListTodo}
              label="Tasks"
              to="/tasks"
              isSidebarOpen={isSidebarOpen}
            />
            <NavItem
              icon={LayoutGrid}
              label="Kanban"
              to="/kanban"
              isSidebarOpen={isSidebarOpen}
            />
          </AccordionPanel>
        </AccordionItem>
      </Accordion>
      <Divider m={2} borderColor="#0000001A" />
      <NavItem icon={Mail} label="Emails" to="/emails" isSidebarOpen={isSidebarOpen} />
      <NavItem icon={MessageSquare} label="Chat" to="/chat" isSidebarOpen={isSidebarOpen} />
      <NavItem icon={Calendar} label="Calendar" to="/calendar" isSidebarOpen={isSidebarOpen} />
      <Box
        as={RouterLink}
        to="/settings"
        py={2}
        px={isSidebarOpen ? 4 : 2}
        mt="auto"
        _hover={{ textDecoration: "none", bg: "#334155", color: "#fff" }}
        display="flex"
        alignItems="center"
        color="#F3F4F6"
        fontWeight="normal"
        fontSize="14px"
      >
        <Settings2 size={18} style={{ marginRight: isSidebarOpen ? 16 : 0, color: '#F3F4F6' }} />
        {isSidebarOpen && "Settings"}
      </Box>
    </VStack>
  );
};

const NavItem = ({ icon: Icon, label, to, isSidebarOpen }) => (
  <Tooltip label={label} placement="right" isDisabled={isSidebarOpen} hasArrow>
    <Link
      as={RouterLink}
      to={to}
      py={2}
      px={isSidebarOpen ? 4 : 2}
      _hover={{ textDecoration: "none", bg: "#334155", color: "#fff" }}
      display="flex"
      alignItems="center"
      color="#F3F4F6"
      fontWeight="normal"
      fontSize="14px"
    >
      {Icon && <Icon size={18} style={{ minWidth: 18, minHeight: 18, color: '#F3F4F6' }} className="group-hover:text-white" />}
      {isSidebarOpen && <Box ml={4}>{label}</Box>}
    </Link>
  </Tooltip>
);

export default Sidebar;
