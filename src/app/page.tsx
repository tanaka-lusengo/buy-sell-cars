import { Typography } from '@/src/components/ui';
import { VStack } from '@/styled-system/jsx';

export default function Home() {
  return (
    <VStack>
      <Typography variant="h1" font="heading" weight="bold" color="primary">
        Zimbabwe&#39;s premier Vehicle Marketplace
      </Typography>
    </VStack>
  );
}
