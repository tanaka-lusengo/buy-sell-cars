import Image from "next/image";
import { Flex } from "@/styled-system/jsx";
import { Typography } from "@/src/components/ui";

type RenderUploadedFileProps = {
  filePath: string | null;
  fieleSrc: string;
  alt: string;
};

export const RenderUploadedFile = ({
  filePath,
  fieleSrc,
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
        objectFit: "cover",
        borderRadius: "1.2rem",
        marginBottom: "1rem",
      }}
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
