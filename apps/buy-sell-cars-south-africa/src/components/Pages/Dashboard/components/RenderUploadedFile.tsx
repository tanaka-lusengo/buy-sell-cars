import Image from "next/image";
import { Typography } from "~bsc-shared/ui";
import { DEALER_LOGOS_TO_CONTAIN } from "@/src/constants/values";
import { Flex } from "@/styled-system/jsx";

type RenderUploadedFileProps = {
  filePath: string | null;
  fieleSrc: string;
  profileName?: string;
  alt: string;
};

export const RenderUploadedFile = ({
  filePath,
  fieleSrc,
  profileName,
  alt,
}: RenderUploadedFileProps) =>
  filePath ? (
    <Image
      width={150}
      height={150}
      src={fieleSrc}
      alt={alt}
      style={{
        width: "150px",
        height: "150px",
        borderRadius: "1.2rem",
        marginBottom: "1rem",
        objectFit: DEALER_LOGOS_TO_CONTAIN.includes(profileName || "")
          ? "contain"
          : "cover",
      }}
      quality={70}
    />
  ) : (
    <Flex
      width="150px"
      height="150px"
      justifyContent="center"
      alignItems="center"
      border="2px dashed grey"
      borderRadius="1.2rem"
      paddingX="xs"
      marginBottom="sm"
    >
      <Typography align="center">No File</Typography>
    </Flex>
  );
