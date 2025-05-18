import { useMemo } from 'react';
import { Container, Box, Grid, Flex } from '@/styled-system/jsx';
import { ResponsiveContainer, Typography } from '../../../ui';
import { StatusCode } from '@/src/utils';
import { Profile } from '@/src/types';
import { PostgrestError } from '@supabase/supabase-js';
import { Filter, DealerCard } from './components';

type AllDealersProps = {
  dealers: Profile[];
  error: string | PostgrestError | null;
  status: StatusCode;
};

export const AllDealers = ({ dealers, error, status }: AllDealersProps) => {
  const successStatus = status === StatusCode.SUCCESS;

  const dealerNames = useMemo(
    () => dealers.map((dealer) => dealer.dealership_name ?? '') || [],
    [dealers]
  );

  return (
    <>
      <ResponsiveContainer>
        <Box paddingY="md">
          <Typography variant="h2">Browse our range of Dealers</Typography>
        </Box>
      </ResponsiveContainer>

      <Container marginX="auto" height="100%" backgroundColor="greyLight">
        {!successStatus && Boolean(error) && (
          <ResponsiveContainer backgroundColor="greyLight">
            <Flex direction="column" paddingY="md" gap="sm">
              <Typography as="h2" variant="h3" color="error">
                Error fetching dealers
              </Typography>

              <Typography color="error">
                Please try again a later time
              </Typography>
              {error === typeof 'string' && (
                <Typography color="error">{error}</Typography>
              )}
            </Flex>
          </ResponsiveContainer>
        )}

        {successStatus && dealers?.length === 0 && (
          <ResponsiveContainer backgroundColor="greyLight">
            <Box paddingY="lg">
              <Typography variant="h4" align="center">
                No dealers found
              </Typography>
            </Box>
          </ResponsiveContainer>
        )}

        {successStatus && dealers && dealers.length > 0 && (
          <ResponsiveContainer backgroundColor="greyLight">
            <Box paddingY="lg">
              <Grid
                gridTemplateColumns={{ base: '1fr ', md: '40% 1fr' }}
                justifyItems="center"
                gap="lg"
              >
                <Filter dealers={dealerNames} />

                <Flex flexWrap="wrap" justifyContent="center" gap="md">
                  {dealers.map((dealer) => (
                    <DealerCard key={dealer.id} dealer={dealer} />
                  ))}
                </Flex>
              </Grid>
            </Box>
          </ResponsiveContainer>
        )}
      </Container>
    </>
  );
};
