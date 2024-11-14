const NumberNotation = ({
  label,
  isMainBoxColor,
}: {
  label: string;
  isMainBoxColor: boolean;
}) => {
  return (
    <div
      className={`font-bold ${isMainBoxColor ? 'text-[#739552]' : 'text-[#e2e791]'} left-0.5 p-2`}
    >
      {label}
    </div>
  );
};

export default NumberNotation;
