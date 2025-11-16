// "use client"

// import React, { useState } from "react";
// import {
//     Container,
//     Title,
//     Tabs,
//     Card,
//     Group,
//     Text,
//     Badge,
//     Button,
//     Paper,
//     Grid,
//     ActionIcon,
//     Modal,
//     TextInput,
//     Textarea,
//     NumberInput,
//     MultiSelect,
//     Stack,
//     SimpleGrid,
//     ThemeIcon,
//     Alert,
// } from "@mantine/core";
// import { LineChart, BarChart } from "@mantine/charts";
// import {
//     IconEdit,
//     IconTrash,
//     IconEye,
//     IconChartBar,
//     IconBrandWhatsapp,
//     IconMapPin,
//     IconStar,
//     IconPhone,
//     IconTrendingUp,
//     IconUsers,
//     IconMessageCircle,
//     IconAlertCircle,
// } from "@tabler/icons-react";

// const mockBusinesses = [
//     {
//         id: "1",
//         title: "Premium Plumbing Services",
//         description:
//             "Expert plumbing solutions for residential and commercial properties",
//         categoryNames: ["Plumbing", "Emergency Repairs", "Installation"],
//         location: { name: "Hyderabad", state: "Telangana" },
//         radius: 25,
//         totalRating: 4.8,
//         totalReviews: 156,
//         thumbnail:
//             "https://images.unsplash.com/photo-1607472586893-edb57bdc0e39?w=400",
//         professional: {
//             phoneNumbers: "+91 98765 43210",
//         },
//         views: 2340,
//         leads: 89,
//         conversionRate: 38,
//     },
//     {
//         id: "2",
//         title: "Elite Electrical Works",
//         description:
//             "Licensed electricians providing safe and reliable electrical services",
//         categoryNames: ["Electrical", "Wiring", "Solar Installation"],
//         location: { name: "Secunderabad", state: "Telangana" },
//         radius: 30,
//         totalRating: 4.6,
//         totalReviews: 203,
//         thumbnail:
//             "https://images.unsplash.com/photo-1621905251189-08b45d6a269e?w=400",
//         professional: {
//             phoneNumbers: "+91 98765 43211",
//         },
//         views: 1890,
//         leads: 67,
//         conversionRate: 35,
//     },
// ];

// const analyticsData = {
//     weeklyViews: [
//         { day: "Mon", views: 320 },
//         { day: "Tue", views: 280 },
//         { day: "Wed", views: 450 },
//         { day: "Thu", views: 390 },
//         { day: "Fri", views: 520 },
//         { day: "Sat", views: 680 },
//         { day: "Sun", views: 600 },
//     ],
//     monthlyLeads: [
//         { month: "Jan", leads: 45 },
//         { month: "Feb", leads: 52 },
//         { month: "Mar", leads: 68 },
//         { month: "Apr", leads: 71 },
//         { month: "May", leads: 89 },
//         { month: "Jun", leads: 95 },
//     ],
// };

// export default function ProfessionalDashboard() {
//     const [businesses, setBusinesses] = useState(mockBusinesses);
//     const [deleteModalOpen, setDeleteModalOpen] = useState(false);
//     const [editModalOpen, setEditModalOpen] = useState(false);
//     const [selectedBusiness, setSelectedBusiness] = useState(null);
//     const [activeTab, setActiveTab] = useState("businesses");

//     const handleDelete = (id) => {
//         setBusinesses(businesses.filter((b) => b.id !== id));
//         setDeleteModalOpen(false);
//     };

//     const handleEdit = (business) => {
//         setSelectedBusiness(business);
//         setEditModalOpen(true);
//     };

//     const StatCard = ({ icon, title, value, change, color }) => (
//         <Paper p="md" withBorder>
//             <Group justify="apart">
//                 <div>
//                     <Text size="xs" c="dimmed" tt="uppercase" fw={700}>
//                         {title}
//                     </Text>
//                     <Text size="xl" fw={700} mt={4}>
//                         {value}
//                     </Text>
//                     {change && (
//                         <Group gap={4} mt={4}>
//                             <IconTrendingUp size={14} color="green" />
//                             <Text size="xs" c="green">
//                                 +{change}% vs last month
//                             </Text>
//                         </Group>
//                     )}
//                 </div>
//                 <ThemeIcon size="xl" radius="md" color={color} variant="light">
//                     {icon}
//                 </ThemeIcon>
//             </Group>
//         </Paper>
//     );

//     return (
//         <Container size="xl" py="xl">
//             <Title order={1} mb="xl">
//                 Professional Dashboard
//             </Title>

//             <Tabs value={activeTab} onChange={setActiveTab}>
//                 <Tabs.List mb="lg">
//                     <Tabs.Tab
//                         value="businesses"
//                         leftSection={<IconEye size={16} />}
//                     >
//                         My Businesses
//                     </Tabs.Tab>
//                     <Tabs.Tab
//                         value="analytics"
//                         leftSection={<IconChartBar size={16} />}
//                     >
//                         Analytics
//                     </Tabs.Tab>
//                 </Tabs.List>

//                 <Tabs.Panel value="businesses">
//                     <Stack gap="lg">
//                         {businesses.map((business) => (
//                             <Card
//                                 key={business.id}
//                                 padding={0}
//                                 radius="md"
//                                 withBorder
//                             >
//                                 <div className="flex sm:flex-row flex-col gap-4 p-4">
//                                     <Paper className="sm:flex-[.2] lg:flex-[.15]">
//                                         <img
//                                             src={business.thumbnail}
//                                             alt={business.title}
//                                             style={{
//                                                 width: "100%",
//                                                 height: "200px",
//                                                 objectFit: "cover",
//                                                 borderRadius: "8px",
//                                             }}
//                                         />
//                                     </Paper>

//                                     <div className="sm:flex-[.8] lg:flex-[.85] flex flex-col">
//                                         <Group justify="apart" mb="xs">
//                                             <div style={{ flex: 1 }}>
//                                                 <Text size="xl" fw={600}>
//                                                     {business.title}
//                                                 </Text>

//                                                 {business.totalRating && (
//                                                     <Group gap="xs" mt={4}>
//                                                         <Group gap={4}>
//                                                             <IconStar
//                                                                 size={16}
//                                                                 fill="gold"
//                                                                 color="gold"
//                                                             />
//                                                             <Text
//                                                                 size="sm"
//                                                                 fw={600}
//                                                             >
//                                                                 {business.totalRating.toFixed(
//                                                                     1
//                                                                 )}
//                                                             </Text>
//                                                         </Group>
//                                                         <Text
//                                                             size="sm"
//                                                             c="dimmed"
//                                                         >
//                                                             (
//                                                             {
//                                                                 business.totalReviews
//                                                             }{" "}
//                                                             Reviews)
//                                                         </Text>
//                                                     </Group>
//                                                 )}
//                                             </div>

//                                             <Group gap="xs">
//                                                 <ActionIcon
//                                                     variant="light"
//                                                     color="blue"
//                                                     size="lg"
//                                                     onClick={() =>
//                                                         handleEdit(business)
//                                                     }
//                                                 >
//                                                     <IconEdit size={18} />
//                                                 </ActionIcon>
//                                                 <ActionIcon
//                                                     variant="light"
//                                                     color="red"
//                                                     size="lg"
//                                                     onClick={() => {
//                                                         setSelectedBusiness(
//                                                             business
//                                                         );
//                                                         setDeleteModalOpen(
//                                                             true
//                                                         );
//                                                     }}
//                                                 >
//                                                     <IconTrash size={18} />
//                                                 </ActionIcon>
//                                             </Group>
//                                         </Group>

//                                         <Text
//                                             size="sm"
//                                             c="dimmed"
//                                             mb="sm"
//                                             lineClamp={2}
//                                         >
//                                             {business.description}
//                                         </Text>

//                                         <Group gap={4} c="dimmed" mb="sm">
//                                             <IconMapPin size={14} />
//                                             <Text size="sm">
//                                                 Based in{" "}
//                                                 {business.location.name},{" "}
//                                                 {business.location.state} •
//                                                 Service range: {business.radius}{" "}
//                                                 km
//                                             </Text>
//                                         </Group>

//                                         <Group gap={6} mb="md">
//                                             {business.categoryNames
//                                                 .slice(0, 3)
//                                                 .map((category, idx) => (
//                                                     <Badge
//                                                         key={idx}
//                                                         variant="light"
//                                                     >
//                                                         {category}
//                                                     </Badge>
//                                                 ))}
//                                         </Group>

//                                         <SimpleGrid
//                                             cols={{ base: 2, sm: 4 }}
//                                             spacing="xs"
//                                             mb="md"
//                                         >
//                                             <Paper p="xs" withBorder>
//                                                 <Text size="xs" c="dimmed">
//                                                     Views
//                                                 </Text>
//                                                 <Text size="lg" fw={600}>
//                                                     {business.views}
//                                                 </Text>
//                                             </Paper>
//                                             <Paper p="xs" withBorder>
//                                                 <Text size="xs" c="dimmed">
//                                                     Leads
//                                                 </Text>
//                                                 <Text size="lg" fw={600}>
//                                                     {business.leads}
//                                                 </Text>
//                                             </Paper>
//                                             <Paper p="xs" withBorder>
//                                                 <Text size="xs" c="dimmed">
//                                                     Conversion
//                                                 </Text>
//                                                 <Text size="lg" fw={600}>
//                                                     {business.conversionRate}%
//                                                 </Text>
//                                             </Paper>
//                                             <Paper p="xs" withBorder>
//                                                 <Text size="xs" c="dimmed">
//                                                     Rating
//                                                 </Text>
//                                                 <Text size="lg" fw={600}>
//                                                     {business.totalRating}/5
//                                                 </Text>
//                                             </Paper>
//                                         </SimpleGrid>

//                                         <Group gap="xs">
//                                             <Button
//                                                 leftSection={
//                                                     <IconPhone size={18} />
//                                                 }
//                                                 variant="filled"
//                                                 size="sm"
//                                             >
//                                                 {
//                                                     business.professional
//                                                         .phoneNumbers
//                                                 }
//                                             </Button>
//                                             <Button
//                                                 leftSection={
//                                                     <IconBrandWhatsapp
//                                                         size={18}
//                                                     />
//                                                 }
//                                                 color="teal"
//                                                 variant="filled"
//                                                 size="sm"
//                                             >
//                                                 WhatsApp
//                                             </Button>
//                                         </Group>
//                                     </div>
//                                 </div>
//                             </Card>
//                         ))}
//                     </Stack>
//                 </Tabs.Panel>

//                 <Tabs.Panel value="analytics">
//                     <Stack gap="lg">
//                         <SimpleGrid
//                             cols={{ base: 1, sm: 2, md: 4 }}
//                             spacing="lg"
//                         >
//                             <StatCard
//                                 icon={<IconEye size={24} />}
//                                 title="Total Views"
//                                 value="4,230"
//                                 change={12}
//                                 color="blue"
//                             />
//                             <StatCard
//                                 icon={<IconUsers size={24} />}
//                                 title="Total Leads"
//                                 value="156"
//                                 change={8}
//                                 color="green"
//                             />
//                             <StatCard
//                                 icon={<IconMessageCircle size={24} />}
//                                 title="Avg. Conversion"
//                                 value="36.5%"
//                                 change={5}
//                                 color="violet"
//                             />
//                             <StatCard
//                                 icon={<IconStar size={24} />}
//                                 title="Avg. Rating"
//                                 value="4.7"
//                                 color="yellow"
//                             />
//                         </SimpleGrid>

//                         <Grid>
//                             <Grid.Col span={{ base: 12, md: 6 }}>
//                                 <Paper p="md" withBorder>
//                                     <Text size="lg" fw={600} mb="md">
//                                         Weekly Views
//                                     </Text>
//                                     <LineChart
//                                         h={250}
//                                         data={analyticsData.weeklyViews}
//                                         dataKey="day"
//                                         series={[
//                                             {
//                                                 name: "views",
//                                                 color: "blue.6",
//                                                 label: "Views",
//                                             },
//                                         ]}
//                                         curveType="linear"
//                                         withLegend
//                                         withTooltip
//                                         withDots
//                                     />
//                                 </Paper>
//                             </Grid.Col>

//                             <Grid.Col span={{ base: 12, md: 6 }}>
//                                 <Paper p="md" withBorder>
//                                     <Text size="lg" fw={600} mb="md">
//                                         Monthly Leads
//                                     </Text>
//                                     <BarChart
//                                         h={250}
//                                         data={analyticsData.monthlyLeads}
//                                         dataKey="month"
//                                         series={[
//                                             {
//                                                 name: "leads",
//                                                 color: "green.6",
//                                                 label: "Leads",
//                                             },
//                                         ]}
//                                         withLegend
//                                         withTooltip
//                                     />
//                                 </Paper>
//                             </Grid.Col>
//                         </Grid>

//                         <Paper p="md" withBorder>
//                             <Text size="lg" fw={600} mb="md">
//                                 Business Performance
//                             </Text>
//                             <SimpleGrid cols={{ base: 1, sm: 2 }} spacing="lg">
//                                 {businesses.map((business) => (
//                                     <Paper key={business.id} p="md" withBorder>
//                                         <Group justify="apart" mb="md">
//                                             <Text fw={600}>
//                                                 {business.title}
//                                             </Text>
//                                             <Badge>
//                                                 {business.categoryNames[0]}
//                                             </Badge>
//                                         </Group>
//                                         <SimpleGrid cols={3} spacing="xs">
//                                             <div>
//                                                 <Text size="xs" c="dimmed">
//                                                     Views
//                                                 </Text>
//                                                 <Text size="lg" fw={600}>
//                                                     {business.views}
//                                                 </Text>
//                                             </div>
//                                             <div>
//                                                 <Text size="xs" c="dimmed">
//                                                     Leads
//                                                 </Text>
//                                                 <Text size="lg" fw={600}>
//                                                     {business.leads}
//                                                 </Text>
//                                             </div>
//                                             <div>
//                                                 <Text size="xs" c="dimmed">
//                                                     Conv. Rate
//                                                 </Text>
//                                                 <Text size="lg" fw={600}>
//                                                     {business.conversionRate}%
//                                                 </Text>
//                                             </div>
//                                         </SimpleGrid>
//                                     </Paper>
//                                 ))}
//                             </SimpleGrid>
//                         </Paper>
//                     </Stack>
//                 </Tabs.Panel>
//             </Tabs>

//             {/* Delete Confirmation Modal */}
//             <Modal
//                 opened={deleteModalOpen}
//                 onClose={() => setDeleteModalOpen(false)}
//                 title="Confirm Deletion"
//                 centered
//             >
//                 <Alert icon={<IconAlertCircle size={16} />} color="red" mb="md">
//                     This action cannot be undone. All data associated with this
//                     business will be permanently deleted.
//                 </Alert>
//                 <Text mb="lg">
//                     Are you sure you want to delete{" "}
//                     <strong>{selectedBusiness?.title}</strong>?
//                 </Text>
//                 <Group justify="flex-end">
//                     <Button
//                         variant="default"
//                         onClick={() => setDeleteModalOpen(false)}
//                     >
//                         Cancel
//                     </Button>
//                     <Button
//                         color="red"
//                         onClick={() => handleDelete(selectedBusiness?.id)}
//                     >
//                         Delete Business
//                     </Button>
//                 </Group>
//             </Modal>

//             {/* Edit Modal */}
//             <Modal
//                 opened={editModalOpen}
//                 onClose={() => setEditModalOpen(false)}
//                 title="Edit Business"
//                 size="lg"
//                 centered
//             >
//                 <Stack gap="md">
//                     <TextInput
//                         label="Business Title"
//                         placeholder="Enter business title"
//                         defaultValue={selectedBusiness?.title}
//                         required
//                     />
//                     <Textarea
//                         label="Description"
//                         placeholder="Describe your business"
//                         defaultValue={selectedBusiness?.description}
//                         minRows={3}
//                         required
//                     />
//                     <MultiSelect
//                         label="Categories"
//                         placeholder="Select categories"
//                         data={[
//                             "Plumbing",
//                             "Electrical",
//                             "Carpentry",
//                             "Painting",
//                             "HVAC",
//                         ]}
//                         defaultValue={selectedBusiness?.categoryNames}
//                         required
//                     />
//                     <Group grow>
//                         <TextInput
//                             label="City"
//                             placeholder="City"
//                             defaultValue={selectedBusiness?.location?.name}
//                             required
//                         />
//                         <TextInput
//                             label="State"
//                             placeholder="State"
//                             defaultValue={selectedBusiness?.location?.state}
//                             required
//                         />
//                     </Group>
//                     <NumberInput
//                         label="Service Radius (km)"
//                         placeholder="Enter service radius"
//                         defaultValue={selectedBusiness?.radius}
//                         min={1}
//                         max={100}
//                         required
//                     />
//                     <Group justify="flex-end" mt="md">
//                         <Button
//                             variant="default"
//                             onClick={() => setEditModalOpen(false)}
//                         >
//                             Cancel
//                         </Button>
//                         <Button onClick={() => setEditModalOpen(false)}>
//                             Save Changes
//                         </Button>
//                     </Group>
//                 </Stack>
//             </Modal>
//         </Container>
//     );
// }

import React from 'react'

const page = () => {
  return (
    <div>page</div>
  )
}

export default page