import { ReactNode, forwardRef } from "react";

export const Table = ({
  children,
  className,
}: {
  children: React.ReactNode;
  className?: string;
}) => {
  return <table className={` ${className} `}>{children}</table>;
};

export const TrHead = ({
  children,
  className,
}: {
  children: React.ReactNode;
  className?: string;
}) => {
  return <tr className={` ${className}`}>{children}</tr>;
};

export const Th = ({
  className,
  id,
  children,
}: {
  children?: React.ReactNode;
  className?: string;
  id?: string;
}) => {
  return (
    <th className={` ${className}`} id={id} scope="col">
      {children}
    </th>
  );
};


interface TrBodyProps {
  children?:ReactNode,
  className?:string 
  onClick?:() => void 
  onMouseEnter?:(x:any) => void 
  onMouseLeave?:() => void
}

export const TrBody = forwardRef<HTMLTableRowElement, TrBodyProps>(
  (props, ref) => {
    const { children, className, onClick, onMouseEnter, onMouseLeave } = props
    return (
      <tr
        className={`border-y ${className}`}
        onClick={onClick}
        onMouseEnter={onMouseEnter}
        onMouseLeave={onMouseLeave}
        ref={ref}
      >
        {children}
      </tr>
    )
  },
)

TrBody.displayName = "TrBody"