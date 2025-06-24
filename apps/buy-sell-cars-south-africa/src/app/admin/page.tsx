import { redirect } from "next/navigation";
import { ResponsiveContainer, Typography } from "~bsc-shared/ui";
import { fetchUserAndProfile } from "@/src/server/actions/auth";
import { Flex } from "@/styled-system/jsx";

const Adminpage = async () => {
  const { profile } = await fetchUserAndProfile();

  if (!profile) {
    redirect("/sign-in");
  }

  return (
    <ResponsiveContainer>
      <Flex direction="column" padding="lg" maxWidth="600px" gap="md">
        <Typography variant="h2">Admin Dashboard</Typography>
        <Typography>
          Welcome <b>{profile.first_name}</b> to the admin dashboard. Here you
          can manage users and perform administrative tasks.
        </Typography>
        <Typography>
          Please use the sidebar to navigate through the admin features.
        </Typography>
      </Flex>
    </ResponsiveContainer>
  );
};

export default Adminpage;
