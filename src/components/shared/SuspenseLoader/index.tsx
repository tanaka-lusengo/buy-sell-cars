import { BeatLoader } from 'react-spinners';
import { tokens } from '@/src/styles/theme';
import { Flex } from '@/styled-system/jsx';

export const SuspenseLoader = () => (
  <Flex justifyContent="center" alignItems="center" height="100vh">
    <BeatLoader
      size={15}
      speedMultiplier={1.5}
      color={tokens.colors.primary.value}
    />
  </Flex>
);
