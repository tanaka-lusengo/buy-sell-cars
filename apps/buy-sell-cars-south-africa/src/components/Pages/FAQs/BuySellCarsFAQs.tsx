import Link from "next/link";
import {
  ResponsiveContainer,
  H3,
  H4,
  P,
  PSmall,
  FAQAccordion,
} from "~bsc-shared/ui";
import { SOCIAL_MEDIA_URLS } from "@/src/constants/urls";
import { HStack, Flex } from "@/styled-system/jsx";
import { FaqData } from "./FaqData";

export const BuySellCarsFAQs = () => {
  const { paymentRefundCancellationPolicy } = FaqData;

  return (
    <ResponsiveContainer>
      <Flex direction="column" gap="sm" marginY="lg">
        <H3 align="center" color="secondary">
          Frequently asked questions
        </H3>

        {/* FAQ 1 */}
        <FAQAccordion
          title={paymentRefundCancellationPolicy.title}
          content={paymentRefundCancellationPolicy.content}
        />
      </Flex>

      <Flex direction="column" gap="sm" paddingBottom="xxl" alignItems="center">
        <H4 align="center">
          Can&lsquo;t find the answer you&lsquo;re looking for?
        </H4>
        <P align="center">
          For account help, general enquiries, please feel free to reach out
        </P>

        <Link
          href={SOCIAL_MEDIA_URLS.phone_tel}
          target="_blank"
          rel="noopener noreferrer"
        >
          <HStack
            _hover={{
              color: "primary",
              transition: "0.3s ease-in-out",
            }}
          >
            <i
              className="fa-solid fa-phone"
              aria-hidden="true"
              title="phone"
              style={{ width: "2rem" }}
            ></i>
            <PSmall>{SOCIAL_MEDIA_URLS.phone}</PSmall>
          </HStack>
        </Link>

        <Link
          href={`${SOCIAL_MEDIA_URLS.email}?subject=General%20Enquiry`}
          target="_blank"
          rel="noopener noreferrer"
        >
          <HStack
            _hover={{
              color: "primary",
              transition: "0.3s ease-in-out",
            }}
          >
            <i
              className="fa-solid fa-envelope"
              aria-hidden="true"
              title="email"
              style={{ width: "2rem" }}
            ></i>
            <PSmall>{SOCIAL_MEDIA_URLS.email.replace("mailto:", "")}</PSmall>
          </HStack>
        </Link>
      </Flex>
    </ResponsiveContainer>
  );
};
