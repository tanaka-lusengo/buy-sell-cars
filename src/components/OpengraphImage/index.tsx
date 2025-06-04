import { ImageResponse } from "next/og";
import { Flex } from "@/styled-system/jsx";
import { BASE_URL } from "@/src/constants/environments";
import { Typography } from "../ui";

export type Props = {
  title?: string;
};

export default async function OpengraphImage(
  props?: Props
): Promise<ImageResponse> {
  const { title } = {
    ...{
      title: "Buy Sell Cars - Zimbabwe",
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
        gap="md"
      >
        <Flex
          justifyContent="center"
          alignItems="center"
          width="16rem"
          height="16rem"
          border="1.5px solid"
          borderColor="primaryDark"
          borderRadius="24px"
        >
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            width="94"
            height="88"
            src={`${BASE_URL || "https://buysellcars.co.zw"}/logo/buy-sell-cars-logo.png`}
            alt="Buy Sell Cars Logo"
            style={{ display: "block" }}
          />
        </Flex>
        <Typography weight="bold" variant="h4">
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
