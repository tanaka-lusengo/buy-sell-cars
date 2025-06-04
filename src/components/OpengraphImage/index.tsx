import { ImageResponse } from "next/og";
import { Flex } from "@/styled-system/jsx";
import { Typography } from "../ui";

export type Props = {
  title?: string;
};

export default async function OpengraphImage(
  props?: Props
): Promise<ImageResponse> {
  const { title } = {
    ...{
      title: "BuySellCars Zimbabwe",
    },
    ...props,
  };

  return new ImageResponse(
    (
      <Flex
        direction="column"
        alignItems="center"
        justifyContent="center"
        width="100%"
        height="100%"
        backgroundColor="black"
        gap="md"
      >
        <Flex
          justifyContent="center"
          alignItems="center"
          width="16rem"
          height="16rem"
          border="1px solid"
          borderColor="primaryDark"
          borderRadius="24px"
        >
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            width="64"
            height="58"
            src="/logo/buy-sell-cars-logo.png"
            alt="Buy Sell Cars Logo"
            style={{ display: "block" }} // Ensures proper rendering
          />
        </Flex>
        <Typography weight="bold" variant="h4" color="white">
          {title}
        </Typography>
      </Flex>
    ),
    {
      width: 1200,
      height: 630,
    }
  );
}
