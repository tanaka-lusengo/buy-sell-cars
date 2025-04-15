import { Typography } from './page.styled';
import { Stack } from '@/styled-system/jsx';

export default function Home() {
  return (
    <Stack
      direction="column"
      alignItems="center"
      justifyContent="center"
      padding={10}
    >
      <Typography>Zimbabwe&#39;s premier Vehicle Marketplace</Typography>
    </Stack>
  );
}
