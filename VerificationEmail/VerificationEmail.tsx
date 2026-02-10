import * as React from "react";
import {
  Html,
  Body,
  Preview,
  Container,
  Text,
  Hr,
} from "@react-email/components";

export function Email({ firstName, verificationToken, email }: any) {
  return (
    <Html lang="en">
      <Body className="bg-white font-linear">
        <Preview>Hey, {firstName}, Your Verification code for Linear</Preview>
        <Container className="mx-auto my-0 max-w-[560px] px-0 pt-5 pb-12">
          <Text className="mb-[15px] mx-0 mt-0 leading-[1.4] text-[15px] text-[#3c4149]">
            This link and code will be valid for the next 1 hour.
          </Text>
          <code className="font-mono font-bold px-1 py-px bg-[#dfe1e4] text-[#3c4149] text-[21px] tracking-[-0.3px] rounded">
            {verificationToken}
          </code>
          <Hr className="border-[#dfe1e4] mt-[42px] mb-[26px]" />
        </Container>
      </Body>
    </Html>
  );
}

export default Email;
