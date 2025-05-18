import { useMemo } from 'react';
import { Container, Box, Flex } from '@/styled-system/jsx';
import { ResponsiveContainer, Typography } from '../../../ui';
import { StatusCode } from '@/src/utils';
import { VehicleWithImage } from '@/src/types';
import { PostgrestError } from '@supabase/supabase-js';
import { CarPreviewCard } from '@/src/components/shared';
import { Filter } from './components/Filter';

type AllCarsProps = {
  cars: VehicleWithImage[];
  error: string | PostgrestError | null;
  status: StatusCode;
  isRental: boolean;
};

export const AllCars = ({ cars, error, status, isRental }: AllCarsProps) => {
  const successStatus = status === StatusCode.SUCCESS;

  const carMakes = useMemo(() => {
    const makes = cars.map((car) => car.make);
    return [...new Set(makes)];
  }, [cars]);

  const carModels = useMemo(() => {
    const models = cars.map((car) => car.model);
    return [...new Set(models)];
  }, [cars]);

  const carFilterData = useMemo(() => {
    return {
      makes: carMakes,
      models: carModels,
    };
  }, [carMakes, carModels]);

  return (
    <>
      <ResponsiveContainer>
        <Box paddingY="md">
          <Typography variant="h2">
            Browse cars {isRental ? 'to rent' : 'for sale'}
          </Typography>
        </Box>
      </ResponsiveContainer>

      <Container marginX="auto" height="100%" backgroundColor="greyLight">
        {!successStatus && Boolean(error) && (
          <ResponsiveContainer backgroundColor="greyLight">
            <Flex direction="column" paddingY="md" gap="sm">
              <Typography as="h2" variant="h3" color="error">
                Error fetching cars
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

        {successStatus && cars?.length === 0 && (
          <ResponsiveContainer backgroundColor="greyLight">
            <Box paddingY="lg">
              <Typography variant="h4" align="center">
                No Cars found
              </Typography>
            </Box>
          </ResponsiveContainer>
        )}

        {successStatus && cars && cars.length > 0 && (
          <ResponsiveContainer backgroundColor="greyLight">
            <Box paddingY="lg">
              <Flex
                direction={{ base: 'column', lg: 'row' }}
                justifyItems={{ base: 'center' }}
                alignItems={{ base: 'center', lg: 'flex-start' }}
                gap="md"
              >
                <Filter carFilterData={carFilterData} />

                <Flex
                  flexWrap="wrap"
                  justifyContent={{ base: 'center', lg: 'start' }}
                  gap="md"
                  paddingX="md"
                >
                  {cars.map((car) => (
                    <CarPreviewCard
                      key={car.id}
                      car={car}
                      isRental={isRental}
                    />
                  ))}
                  {cars.map((car) => (
                    <CarPreviewCard
                      key={car.id}
                      car={car}
                      isRental={isRental}
                    />
                  ))}
                </Flex>
              </Flex>
            </Box>
          </ResponsiveContainer>
        )}
      </Container>
    </>
  );
};
