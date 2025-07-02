import Link from "next/link";
import { ResponsiveContainer, Typography, FAQAccordion } from "~bsc-shared/ui";
import { SOCIAL_MEDIA_URLS } from "@/src/constants/urls";
import { HStack, Flex } from "@/styled-system/jsx";
import { FaqData } from "./FaqData";

export const BuySellCarsFAQs = () => {
  const { paymentRefundCancellationPolicy } = FaqData;

  return (
    <ResponsiveContainer>
      <Flex direction="column" gap="sm" marginY="lg">
        <Typography align="center" variant="h3" color="secondary">
          Frequently asked questions
        </Typography>

        {/* FAQ 1 */}
        <FAQAccordion
          title={paymentRefundCancellationPolicy.title}
          content={paymentRefundCancellationPolicy.content}
        />
      </Flex>

      <Flex direction="column" gap="sm" paddingBottom="xxl" alignItems="center">
        <Typography align="center" variant="h4">
          Can't find the answer you're looking for?
        </Typography>
        <Typography align="center">
          For account help, general enquiries, please feel free to reach out
        </Typography>

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
            <Typography variant="body2">{SOCIAL_MEDIA_URLS.phone}</Typography>
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
            <Typography variant="body2">
              {SOCIAL_MEDIA_URLS.email.replace("mailto:", "")}
            </Typography>
          </HStack>
        </Link>
      </Flex>
    </ResponsiveContainer>
  );
};
