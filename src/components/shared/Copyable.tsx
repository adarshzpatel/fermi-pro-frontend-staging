import React from "react";

import { TbCopy } from "react-icons/tb";
import { toast } from "sonner";

type Props = {
  textToCopy?: string;
  children: React.ReactNode;
};

type CopyIconProps = {
  className?: string;
};

export const copyToClipboard = async (textToCopy: string = "") => {
  return await navigator.clipboard.writeText(textToCopy);
};

const Copyable = ({ textToCopy, children }: Props) => {
  const handleCopy = async () => {
    await copyToClipboard(textToCopy).then(() =>
      toast.success("Copied to clipboard!")
    );
  };
  return <span className="cursor-pointer" onClick={handleCopy}>{children}</span>;
};

export default Copyable;

Copyable.Icon = function CopyIcon({ className }: CopyIconProps) {
  return <TbCopy className={className} />;
};

const CopyableText = ({
  textToCopy,
  className,
}: {
  textToCopy: string;
  className?: string;
}) => {
  return (
    <Copyable textToCopy={textToCopy}>
      <span className={`flex gap-1.5 ` + className}>
        {textToCopy}
        <Copyable.Icon />
      </span>
    </Copyable>
  );
};

export { CopyableText };
