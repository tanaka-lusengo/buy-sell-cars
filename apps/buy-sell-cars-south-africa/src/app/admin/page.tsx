import { redirect } from "next/navigation";
import { ResponsiveContainer, H2, P } from "~bsc-shared/ui";
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
        <H2>Admin Dashboard</H2>
        <P>
          Welcome <b>{profile.first_name}</b> to the admin dashboard. Here you
          can manage users and perform administrative tasks.
        </P>
        <P>Please use the sidebar to navigate through the admin features.</P>
      </Flex>
    </ResponsiveContainer>
  );
};

export default Adminpage;
